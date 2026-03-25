/**
 * JellyWrapper — GPU-accelerated spring-physics jelly behavior for any element.
 *
 * Key behaviors (FULL PATH — desktop with fine pointer):
 *   1. REACTIVE RE-TRIGGER: Every tap/click re-fires the wobble, even mid-wobble.
 *   2. PRESS-DURATION INTENSITY: Longer hold = bigger squash.
 *   3. CONTINUOUS REACTION: Sliding finger/mouse across boxes triggers wobble on each.
 *      Uses onPointerEnter (not just onPointerDown) to detect sliding across elements.
 *   4. Spring physics with overshoot — like real gelatin.
 *   5. GPU-composited: willChange + translateZ(0) + backfaceVisibility hidden.
 *   6. Hover glow pulse via CSS class injection.
 *
 * LIGHTER PATH (touch / coarse-pointer devices — iPhone, Android, iPad):
 *   - No continuous RAF spring loop (eliminates scroll lag)
 *   - Entrance animations preserved (whileInView bounce-in)
 *   - Simple whileTap scale for tap feedback
 *   - No drag-across impulse, no hover wobble
 *
 * GPU Overhaul: Enhanced spring configs, stronger wobble impulses,
 * rotation on hover, and GPU layer promotion for buttery 60fps.
 */
import { useRef, useEffect, useCallback, type ReactNode, type CSSProperties } from 'react';
import { motion, type Variants } from 'framer-motion';
import { useJellyMode } from '@/contexts/JellyModeContext';
import { useFineHover } from '@/hooks/useFineHover';

/* ─── Spring simulation ─── */
class Spring {
  value = 0;
  target = 0;
  velocity = 0;
  constructor(public stiffness: number, public damping: number, public mass: number) {}
  update(dt: number) {
    const F = -this.stiffness * (this.value - this.target) - this.damping * this.velocity;
    this.velocity += (F / this.mass) * dt;
    this.value += this.velocity * dt;
  }
  atRest() {
    return Math.abs(this.value - this.target) < 0.001 && Math.abs(this.velocity) < 0.01;
  }
}

type JellyIntensity = 'soft' | 'medium' | 'bouncy';

interface JellyWrapperProps {
  children: ReactNode;
  intensity?: JellyIntensity;
  className?: string;
  style?: CSSProperties;
  as?: 'div' | 'span' | 'li' | 'section' | 'article';
  noEntrance?: boolean;
  hoverScale?: number;
  tapSquash?: number;
}

/* Enhanced spring configs — bouncier with more overshoot for real gelatin feel */
const SPRING_CONFIGS: Record<JellyIntensity, { stiffness: number; damping: number; mass: number }> = {
  soft:   { stiffness: 350, damping: 12, mass: 0.45 },
  medium: { stiffness: 550, damping: 9,  mass: 0.35 },
  bouncy: { stiffness: 850, damping: 6,  mass: 0.25 },
};

const ENTRANCE_SPRING = { stiffness: 350, damping: 14, mass: 0.55 };

/* GPU compositing style — promotes element to its own compositor layer */
const GPU_STYLE: CSSProperties = {
  willChange: 'transform',
  backfaceVisibility: 'hidden',
  WebkitBackfaceVisibility: 'hidden',
  transform: 'translateZ(0)',
} as CSSProperties;

export function JellyWrapper({
  children,
  intensity = 'medium',
  className = '',
  style,
  as = 'div',
  noEntrance = false,
  hoverScale = 1.04,
  tapSquash = 0.18,
}: JellyWrapperProps) {
  const { jellyMode } = useJellyMode();
  const fineHover = useFineHover();
  const elRef = useRef<HTMLDivElement>(null);
  const springCfg = SPRING_CONFIGS[intensity];

  const sxRef = useRef(new Spring(springCfg.stiffness, springCfg.damping, springCfg.mass));
  const syRef = useRef(new Spring(springCfg.stiffness, springCfg.damping, springCfg.mass));
  const rotRef = useRef(new Spring(springCfg.stiffness * 0.7, springCfg.damping * 1.3, springCfg.mass));
  const rafRef = useRef(0);
  const lastTRef = useRef(0);
  const pressStartRef = useRef(0);
  const isHoveredRef = useRef(false);
  const isPressedRef = useRef(false);

  useEffect(() => {
    const cfg = SPRING_CONFIGS[intensity];
    for (const s of [sxRef.current, syRef.current]) {
      s.stiffness = cfg.stiffness;
      s.damping = cfg.damping;
      s.mass = cfg.mass;
    }
    rotRef.current.stiffness = cfg.stiffness * 0.7;
    rotRef.current.damping = cfg.damping * 1.3;
    rotRef.current.mass = cfg.mass;
  }, [intensity]);

  /* ── Animation loop (FULL PATH only) — GPU-composited transforms ── */
  const tick = useCallback(() => {
    const now = performance.now();
    const dt = Math.min((now - lastTRef.current) * 0.001, 0.05);
    lastTRef.current = now;

    const sx = sxRef.current;
    const sy = syRef.current;
    const rot = rotRef.current;

    if (isPressedRef.current) {
      const holdTime = (now - pressStartRef.current) * 0.001;
      const holdFactor = Math.min(holdTime / 1.2, 1);
      const squashAmount = tapSquash * (0.5 + holdFactor * 1.8);
      sx.target = squashAmount;
      sy.target = -squashAmount * 0.85;
    }

    sx.update(dt);
    sy.update(dt);
    rot.update(dt);

    const el = elRef.current;
    if (el) {
      const baseScale = isHoveredRef.current && !isPressedRef.current ? hoverScale : 1;
      // GPU-composited transform with translateZ(0) for layer promotion
      el.style.transform = `translateZ(0) scale(${baseScale + sx.value}, ${baseScale + sy.value}) rotate(${rot.value}deg)`;
    }

    if (!sx.atRest() || !sy.atRest() || !rot.atRest() || isPressedRef.current) {
      rafRef.current = requestAnimationFrame(tick);
    } else {
      rafRef.current = 0;
      if (el) el.style.transform = 'translateZ(0)';
    }
  }, [hoverScale, tapSquash]);

  const startLoop = useCallback(() => {
    if (rafRef.current === 0) {
      lastTRef.current = performance.now();
      rafRef.current = requestAnimationFrame(tick);
    }
  }, [tick]);

  /* ── Event handlers (FULL PATH only) — enhanced impulses ── */
  const handlePointerDown = useCallback(() => {
    isPressedRef.current = true;
    pressStartRef.current = performance.now();

    const sx = sxRef.current;
    const sy = syRef.current;
    const rot = rotRef.current;

    // Stronger velocity impulse for more dramatic wobble
    sx.velocity += (Math.random() - 0.3) * 5;
    sy.velocity += (Math.random() - 0.7) * 5;
    rot.velocity += (Math.random() - 0.5) * 22;

    sx.target = tapSquash * 0.5;
    sy.target = -tapSquash * 0.4;

    startLoop();
  }, [tapSquash, startLoop]);

  const handlePointerUp = useCallback(() => {
    if (!isPressedRef.current) return;
    isPressedRef.current = false;

    const holdTime = (performance.now() - pressStartRef.current) * 0.001;
    const holdFactor = Math.min(holdTime / 1.2, 1);
    const releaseForce = 3 + holdFactor * 10;

    const sx = sxRef.current;
    const sy = syRef.current;
    const rot = rotRef.current;

    sx.target = 0;
    sy.target = 0;
    rot.target = 0;

    // Stronger release bounce
    sx.velocity -= releaseForce * (0.6 + Math.random() * 0.5);
    sy.velocity += releaseForce * (0.5 + Math.random() * 0.4);
    rot.velocity += (Math.random() - 0.5) * releaseForce * 4;

    startLoop();
  }, [startLoop]);

  /**
   * CONTINUOUS REACTION: When pointer enters while a button is pressed
   * (i.e., user is sliding/dragging across multiple boxes), trigger a wobble.
   */
  const handlePointerEnter = useCallback((e: React.PointerEvent) => {
    isHoveredRef.current = true;

    const isDragging = e.buttons > 0;

    if (isDragging) {
      // Sliding across — strong impulse like a tap
      sxRef.current.velocity += (Math.random() - 0.3) * 6;
      syRef.current.velocity += (Math.random() - 0.7) * 6;
      rotRef.current.velocity += (Math.random() - 0.5) * 24;
      sxRef.current.target = tapSquash * 0.35;
      syRef.current.target = -tapSquash * 0.3;
      setTimeout(() => {
        sxRef.current.target = 0;
        syRef.current.target = 0;
        rotRef.current.target = 0;
      }, 80);
    } else {
      // Normal hover entry — enhanced wobble with rotation
      sxRef.current.velocity += 2.2;
      syRef.current.velocity -= 1.6;
      rotRef.current.velocity += (Math.random() - 0.5) * 10;
    }
    startLoop();
  }, [startLoop, tapSquash]);

  const handlePointerLeave = useCallback(() => {
    isHoveredRef.current = false;
    isPressedRef.current = false;
    sxRef.current.target = 0;
    syRef.current.target = 0;
    rotRef.current.target = 0;
    // Add a small exit wobble for satisfying feel
    sxRef.current.velocity -= 0.8;
    syRef.current.velocity += 0.5;
    startLoop();
  }, [startLoop]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (e.buttons > 0 && !isPressedRef.current) {
      isPressedRef.current = true;
      pressStartRef.current = performance.now();
      sxRef.current.velocity += 3.5;
      syRef.current.velocity -= 3.5;
      rotRef.current.velocity += (Math.random() - 0.5) * 14;
      startLoop();
    }
  }, [startLoop]);

  useEffect(() => {
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, []);

  /* ── Jelly OFF: plain element ── */
  if (!jellyMode) {
    const Tag = as;
    return <Tag className={className} style={style}>{children}</Tag>;
  }

  const MotionTag = motion[as] as any;

  const entranceVariants: Variants = noEntrance
    ? {}
    : {
        hidden: { opacity: 0, scale: 0.82, y: 24, rotate: -1.5 },
        visible: {
          opacity: 1, scale: 1, y: 0, rotate: 0,
          transition: {
            type: 'spring',
            stiffness: ENTRANCE_SPRING.stiffness,
            damping: ENTRANCE_SPRING.damping,
            mass: ENTRANCE_SPRING.mass,
            opacity: { duration: 0.3 },
          },
        },
      };

  /* ── LIGHTER PATH: touch / coarse-pointer devices ── */
  if (!fineHover) {
    return (
      <MotionTag
        className={className}
        style={{ ...style, touchAction: 'manipulation' }}
        variants={noEntrance ? undefined : entranceVariants}
        initial={noEntrance ? undefined : 'hidden'}
        whileInView={noEntrance ? undefined : 'visible'}
        viewport={noEntrance ? undefined : { once: true, margin: '-50px' }}
        whileTap={{ scale: 0.96 }}
        transition={{ type: 'spring', stiffness: 400, damping: 18 }}
      >
        {children}
      </MotionTag>
    );
  }

  /* ── FULL PATH: desktop with fine pointer — GPU-composited ── */
  return (
    <MotionTag
      ref={elRef}
      className={className}
      style={{ ...style, ...GPU_STYLE, touchAction: 'manipulation' }}
      variants={noEntrance ? undefined : entranceVariants}
      initial={noEntrance ? undefined : 'hidden'}
      whileInView={noEntrance ? undefined : 'visible'}
      viewport={noEntrance ? undefined : { once: true, margin: '-50px' }}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onPointerMove={handlePointerMove}
    >
      {children}
    </MotionTag>
  );
}

/**
 * JellyText — Makes text elements wobble like jelly on hover.
 *
 * FULL PATH: whileHover multi-axis scale wobble.
 * LIGHTER PATH: no hover effect (prevents sticky wobble on touch).
 */
interface JellyTextProps {
  children: string;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
}

export function JellyText({ children, className = '', as = 'span' }: JellyTextProps) {
  const { jellyMode } = useJellyMode();
  const fineHover = useFineHover();

  if (!jellyMode) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }

  const MotionTag = motion[as] as any;

  return (
    <MotionTag
      className={className}
      style={GPU_STYLE}
      whileHover={fineHover ? {
        scaleX: [1, 1.03, 0.97, 1.015, 1],
        scaleY: [1, 0.97, 1.03, 0.985, 1],
        rotate: [0, -0.5, 0.5, -0.2, 0],
        transition: { duration: 0.5, ease: 'easeInOut' },
      } : undefined}
    >
      {children}
    </MotionTag>
  );
}

/**
 * JellyButton — A button with full jelly physics.
 *
 * FULL PATH: Continuous RAF spring loop, hold-duration squash, release force wobble.
 * LIGHTER PATH: Simple whileTap scale, no continuous spring simulation.
 * GPU-composited for buttery 60fps.
 */
interface JellyButtonProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  onClick?: (e?: any) => void;
  href?: string;
  target?: string;
  rel?: string;
  disabled?: boolean;
}

export function JellyButton({
  children,
  className = '',
  style,
  onClick,
  href,
  target,
  rel,
  disabled,
}: JellyButtonProps) {
  const { jellyMode } = useJellyMode();
  const fineHover = useFineHover();
  const elRef = useRef<HTMLElement>(null);
  const sxRef = useRef(new Spring(750, 7, 0.28));
  const syRef = useRef(new Spring(750, 7, 0.28));
  const rotRef = useRef(new Spring(550, 9, 0.28));
  const rafRef = useRef(0);
  const lastTRef = useRef(0);
  const pressStartRef = useRef(0);
  const isPressedRef = useRef(false);
  const isHoveredRef = useRef(false);

  const tick = useCallback(() => {
    const now = performance.now();
    const dt = Math.min((now - lastTRef.current) * 0.001, 0.05);
    lastTRef.current = now;

    const sx = sxRef.current;
    const sy = syRef.current;
    const rot = rotRef.current;

    if (isPressedRef.current) {
      const holdTime = (now - pressStartRef.current) * 0.001;
      const holdFactor = Math.min(holdTime / 0.8, 1);
      sx.target = 0.10 + holdFactor * 0.18;
      sy.target = -(0.08 + holdFactor * 0.14);
    }

    sx.update(dt);
    sy.update(dt);
    rot.update(dt);

    const el = elRef.current;
    if (el) {
      const baseScale = isHoveredRef.current && !isPressedRef.current ? 1.06 : 1;
      el.style.transform = `translateZ(0) scale(${baseScale + sx.value}, ${baseScale + sy.value}) rotate(${rot.value}deg)`;
    }

    if (!sx.atRest() || !sy.atRest() || !rot.atRest() || isPressedRef.current) {
      rafRef.current = requestAnimationFrame(tick);
    } else {
      rafRef.current = 0;
      if (el) el.style.transform = 'translateZ(0)';
    }
  }, []);

  const startLoop = useCallback(() => {
    if (rafRef.current === 0) {
      lastTRef.current = performance.now();
      rafRef.current = requestAnimationFrame(tick);
    }
  }, [tick]);

  const handlePointerDown = useCallback(() => {
    isPressedRef.current = true;
    pressStartRef.current = performance.now();
    sxRef.current.velocity += 2.5;
    syRef.current.velocity -= 2.5;
    rotRef.current.velocity += (Math.random() - 0.5) * 14;
    startLoop();
  }, [startLoop]);

  const handlePointerUp = useCallback(() => {
    if (!isPressedRef.current) return;
    isPressedRef.current = false;
    const holdTime = (performance.now() - pressStartRef.current) * 0.001;
    const force = 4 + Math.min(holdTime / 0.8, 1) * 8;
    sxRef.current.target = 0;
    syRef.current.target = 0;
    rotRef.current.target = 0;
    sxRef.current.velocity -= force;
    syRef.current.velocity += force * 0.8;
    rotRef.current.velocity += (Math.random() - 0.5) * force * 3.5;
    startLoop();
  }, [startLoop]);

  const handlePointerEnter = useCallback(() => {
    isHoveredRef.current = true;
    // Hover entry wobble
    sxRef.current.velocity += 1.8;
    syRef.current.velocity -= 1.2;
    rotRef.current.velocity += (Math.random() - 0.5) * 8;
    startLoop();
  }, [startLoop]);

  const handlePointerLeave = useCallback(() => {
    isHoveredRef.current = false;
    isPressedRef.current = false;
    sxRef.current.target = 0;
    syRef.current.target = 0;
    rotRef.current.target = 0;
    // Exit wobble
    sxRef.current.velocity -= 0.6;
    syRef.current.velocity += 0.4;
    startLoop();
  }, [startLoop]);

  useEffect(() => {
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, []);

  /* ── Jelly OFF: plain element ── */
  if (!jellyMode) {
    if (href) {
      return (
        <a href={href} target={target} rel={rel} className={className} style={style}>
          {children}
        </a>
      );
    }
    return (
      <button onClick={onClick} disabled={disabled} className={className} style={style}>
        {children}
      </button>
    );
  }

  const Tag = href ? motion.a : motion.button;
  const props = href
    ? { href, target, rel }
    : { onClick, disabled };

  /* ── LIGHTER PATH: touch / coarse-pointer devices ── */
  if (!fineHover) {
    return (
      <Tag
        {...props}
        className={className}
        style={style}
        whileTap={{ scale: 0.94 }}
        transition={{ type: 'spring', stiffness: 400, damping: 18 }}
      >
        {children}
      </Tag>
    );
  }

  /* ── FULL PATH: desktop with fine pointer — GPU-composited ── */
  return (
    <Tag
      {...props}
      ref={elRef as any}
      className={className}
      style={{ ...style, ...GPU_STYLE }}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
    >
      {children}
    </Tag>
  );
}
