/**
 * GelToggle — Unified premium gel capsule toggle component.
 *
 * Inspired by TypeGPU jelly switch reference:
 * - Deeply recessed metallic track (sunken groove)
 * - Oversized translucent gel knob that overflows track vertically
 * - Internal caustic highlights (white streak across top)
 * - Colored glow spill beneath knob
 * - Spring physics for squash/stretch animation
 * - Consistent visual language across all toggle instances
 *
 * Both dark/light toggle and jelly mode toggle use this same component
 * with different color configurations and icons.
 */
import { useRef, useCallback, useEffect, type ReactNode } from 'react';

/* ───────── Spring Physics ───────── */
class Spring {
  value = 0;
  target = 0;
  velocity = 0;
  constructor(
    public mass: number,
    public stiffness: number,
    public damping: number,
  ) {}
  update(dt: number) {
    const F =
      -this.stiffness * (this.value - this.target) -
      this.damping * this.velocity;
    this.velocity += (F / this.mass) * dt;
    this.value += this.velocity * dt;
  }
  atRest() {
    return (
      Math.abs(this.value - this.target) < 0.0005 &&
      Math.abs(this.velocity) < 0.005
    );
  }
}

/* ───────── Color Configuration ───────── */
export interface GelToggleColors {
  /** Track gradient when OFF */
  trackOff: string;
  /** Track gradient when ON */
  trackOn: string;
  /** Track inset shadow (dark recess) */
  trackShadow: string;
  /** Knob radial gradient when OFF */
  knobOff: string;
  /** Knob radial gradient when ON */
  knobOn: string;
  /** Knob box-shadow when OFF */
  knobShadowOff: string;
  /** Knob box-shadow when ON */
  knobShadowOn: string;
  /** Glow color when OFF */
  glowOff: string;
  /** Glow color when ON */
  glowOn: string;
  /** Border color when OFF */
  borderOff: string;
  /** Border color when ON */
  borderOn: string;
  /** Caustic highlight opacity multiplier (0-1) */
  causticIntensity: number;
}

interface Props {
  checked: boolean;
  onChange: (v: boolean) => void;
  colors: GelToggleColors;
  darkColors: GelToggleColors;
  isDark: boolean;
  icon?: ReactNode;
  size?: number;
  ariaLabel: string;
  title?: string;
  jellyMode?: boolean;
}

export function GelToggle({
  checked,
  onChange,
  colors: lightColors,
  darkColors,
  isDark,
  icon,
  size = 38,
  ariaLabel,
  title,
  jellyMode = false,
}: Props) {
  const colors = isDark ? darkColors : lightColors;

  /* ── Sizing — TypeGPU-inspired proportions ── */
  // Track is the recessed channel
  const trackW = Math.round(size * 1.82);
  const trackH = Math.round(size * 0.82);
  // Knob OVERFLOWS track vertically (TypeGPU key feature)
  const knobD = Math.round(trackH * 1.15);
  const knobOverflow = (knobD - trackH) / 2;
  const pad = Math.round(trackH * 0.1);
  const travel = trackW - knobD - pad * 2;

  /* Springs */
  const springRef = useRef(
    Object.assign(new Spring(0.6, 280, 16), {
      value: checked ? 1 : 0,
      target: checked ? 1 : 0,
    }),
  );
  const squashRef = useRef(new Spring(0.3, 700, 10));
  const lastT = useRef(0);
  const rafRef = useRef(0);
  const knobRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const causticRef = useRef<HTMLDivElement>(null);

  /* Update spring target */
  useEffect(() => {
    springRef.current.target = checked ? 1 : 0;
  }, [checked]);

  /* Animation loop */
  useEffect(() => {
    lastT.current = performance.now();
    function frame(ts: number) {
      const dt = Math.min((ts - lastT.current) * 0.001, 0.1);
      lastT.current = ts;
      const sp = springRef.current;
      const sq = squashRef.current;
      sp.update(dt);
      sq.update(dt);

      const t = Math.max(0, Math.min(1, sp.value));
      const x = pad + t * travel;
      const squash = sq.value;

      if (knobRef.current) {
        knobRef.current.style.transform = `translateX(${x}px) scaleX(${1 + squash * 0.18}) scaleY(${1 - squash * 0.12})`;
      }
      if (glowRef.current) {
        const glowW = knobD * 1.5;
        glowRef.current.style.transform = `translateX(${x + (knobD - glowW) / 2}px)`;
        glowRef.current.style.opacity = String(0.15 + t * 0.65);
      }
      if (causticRef.current) {
        causticRef.current.style.transform = `translateX(${x}px) scaleX(${1 + squash * 0.18}) scaleY(${1 - squash * 0.12})`;
      }

      if (!sp.atRest() || !sq.atRest()) {
        rafRef.current = requestAnimationFrame(frame);
      }
    }
    rafRef.current = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(rafRef.current);
  }, [pad, travel, knobD]);

  /* Click handler */
  const handleClick = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const sp = springRef.current;
      const sq = squashRef.current;
      const mult = jellyMode ? 1.5 : 1;
      sp.velocity = (checked ? -4 : 4) * mult;
      sq.velocity = (checked ? 5 : -5) * mult;
      onChange(!checked);
      // Restart animation
      lastT.current = performance.now();
      cancelAnimationFrame(rafRef.current);
      const loop = (ts: number) => {
        const dt = Math.min((ts - lastT.current) * 0.001, 0.1);
        lastT.current = ts;
        sp.update(dt);
        sq.update(dt);
        const t = Math.max(0, Math.min(1, sp.value));
        const x = pad + t * travel;
        const squash = sq.value;
        if (knobRef.current) {
          knobRef.current.style.transform = `translateX(${x}px) scaleX(${1 + squash * 0.18}) scaleY(${1 - squash * 0.12})`;
        }
        if (glowRef.current) {
          const glowW = knobD * 1.5;
          glowRef.current.style.transform = `translateX(${x + (knobD - glowW) / 2}px)`;
          glowRef.current.style.opacity = String(
            0.15 + Math.max(0, Math.min(1, sp.value)) * 0.65,
          );
        }
        if (causticRef.current) {
          causticRef.current.style.transform = `translateX(${x}px) scaleX(${1 + squash * 0.18}) scaleY(${1 - squash * 0.12})`;
        }
        if (!sp.atRest() || !sq.atRest()) {
          rafRef.current = requestAnimationFrame(loop);
        }
      };
      rafRef.current = requestAnimationFrame(loop);
    },
    [checked, onChange, jellyMode, pad, travel, knobD],
  );

  const handleDown = useCallback(() => {
    const mult = jellyMode ? 1.3 : 1;
    squashRef.current.velocity = -3.5 * mult;
    lastT.current = performance.now();
    cancelAnimationFrame(rafRef.current);
    const loop = (ts: number) => {
      const dt = Math.min((ts - lastT.current) * 0.001, 0.1);
      lastT.current = ts;
      springRef.current.update(dt);
      squashRef.current.update(dt);
      const t = Math.max(0, Math.min(1, springRef.current.value));
      const x = pad + t * travel;
      const squash = squashRef.current.value;
      if (knobRef.current) {
        knobRef.current.style.transform = `translateX(${x}px) scaleX(${1 + squash * 0.18}) scaleY(${1 - squash * 0.12})`;
      }
      if (glowRef.current) {
        const glowW = knobD * 1.5;
        glowRef.current.style.transform = `translateX(${x + (knobD - glowW) / 2}px)`;
        glowRef.current.style.opacity = String(
          0.15 +
            Math.max(0, Math.min(1, springRef.current.value)) * 0.65,
        );
      }
      if (causticRef.current) {
        causticRef.current.style.transform = `translateX(${x}px) scaleX(${1 + squash * 0.18}) scaleY(${1 - squash * 0.12})`;
      }
      if (!springRef.current.atRest() || !squashRef.current.atRest()) {
        rafRef.current = requestAnimationFrame(loop);
      }
    };
    rafRef.current = requestAnimationFrame(loop);
  }, [jellyMode, pad, travel, knobD]);

  /* Total component height includes knob overflow + glow space */
  const totalH = trackH + knobOverflow * 2 + 10;

  return (
    <button
      onClick={handleClick}
      onMouseDown={handleDown}
      onTouchStart={handleDown}
      className="no-jelly cursor-pointer bg-transparent border-none outline-none focus-visible:ring-2 focus-visible:ring-ring"
      style={{
        width: trackW,
        height: totalH,
        borderRadius: trackH / 2,
        position: 'relative',
        zIndex: 101,
        padding: 0,
      }}
      aria-label={ariaLabel}
      title={title}
      role="switch"
      aria-checked={checked}
    >
      {/* ── Recessed capsule track — deeply sunken metallic groove ── */}
      <div
        style={{
          position: 'absolute',
          top: knobOverflow,
          left: 0,
          right: 0,
          height: trackH,
          borderRadius: trackH / 2,
          pointerEvents: 'none',
          background: checked ? colors.trackOn : colors.trackOff,
          boxShadow: colors.trackShadow,
          border: checked ? colors.borderOn : colors.borderOff,
          transition: 'background 0.4s, box-shadow 0.4s, border-color 0.4s',
        }}
      />

      {/* ── Track inner fill tint (ON state only) ── */}
      {checked && (
        <div
          style={{
            position: 'absolute',
            top: knobOverflow + 2,
            left: 2,
            right: 2,
            height: trackH - 4,
            borderRadius: (trackH - 4) / 2,
            pointerEvents: 'none',
            background: isDark
              ? 'linear-gradient(90deg, oklch(1 0 0 / 3%) 0%, oklch(1 0 0 / 5%) 100%)'
              : 'linear-gradient(90deg, oklch(0 0 0 / 3%) 0%, oklch(0 0 0 / 5%) 100%)',
            transition: 'opacity 0.4s',
          }}
        />
      )}

      {/* ── Colored glow spill beneath knob ── */}
      <div
        ref={glowRef}
        style={{
          position: 'absolute',
          top: knobOverflow + trackH - 2,
          left: 0,
          width: knobD * 1.5,
          height: 12,
          borderRadius: '50%',
          pointerEvents: 'none',
          background: checked ? colors.glowOn : colors.glowOff,
          filter: 'blur(4px)',
          transition: 'background 0.4s',
        }}
      />

      {/* ── Gel knob — translucent with material depth, OVERFLOWS track ── */}
      <div
        ref={knobRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: knobD,
          height: knobD,
          borderRadius: '50%',
          transformOrigin: 'center center',
          pointerEvents: 'none',
          background: checked ? colors.knobOn : colors.knobOff,
          boxShadow: checked ? colors.knobShadowOn : colors.knobShadowOff,
          border: checked
            ? `1px solid ${isDark ? 'oklch(1 0 0 / 12%)' : 'oklch(1 0 0 / 25%)'}`
            : `1px solid ${isDark ? 'oklch(1 0 0 / 8%)' : 'oklch(0 0 0 / 6%)'}`,
          transition:
            'background 0.4s, box-shadow 0.4s, border-color 0.4s',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        {/* ── Primary caustic highlight — white arc across top ── */}
        <div
          style={{
            position: 'absolute',
            top: '6%',
            left: '12%',
            right: '12%',
            height: '38%',
            borderRadius: '50%',
            background: `linear-gradient(180deg, oklch(1 0 0 / ${checked ? 50 * colors.causticIntensity : 35 * colors.causticIntensity}%) 0%, oklch(1 0 0 / ${checked ? 18 * colors.causticIntensity : 12 * colors.causticIntensity}%) 45%, oklch(1 0 0 / 0%) 100%)`,
            pointerEvents: 'none',
          }}
        />

        {/* ── Secondary caustic — smaller, offset left ── */}
        <div
          style={{
            position: 'absolute',
            top: '10%',
            left: '18%',
            width: '28%',
            height: '22%',
            borderRadius: '50%',
            background: `radial-gradient(ellipse, oklch(1 0 0 / ${checked ? 38 * colors.causticIntensity : 22 * colors.causticIntensity}%) 0%, transparent 70%)`,
            pointerEvents: 'none',
          }}
        />

        {/* ── Bottom shadow inside knob for volume ── */}
        <div
          style={{
            position: 'absolute',
            bottom: '0%',
            left: '10%',
            right: '10%',
            height: '30%',
            borderRadius: '50%',
            background: `linear-gradient(0deg, oklch(0 0 0 / ${isDark ? 15 : 8}%) 0%, transparent 100%)`,
            pointerEvents: 'none',
          }}
        />

        {/* ── Icon ── */}
        {icon && (
          <div
            style={{
              position: 'relative',
              zIndex: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              filter: `drop-shadow(0 1px 2px oklch(0 0 0 / 25%))`,
              transition: 'opacity 0.3s',
            }}
          >
            {icon}
          </div>
        )}
      </div>

      {/* ── Caustic overlay on knob — moves with spring ── */}
      <div
        ref={causticRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: knobD,
          height: knobD,
          borderRadius: '50%',
          pointerEvents: 'none',
          transformOrigin: 'center center',
          background: checked
            ? 'radial-gradient(ellipse at 35% 30%, oklch(1 0 0 / 10%) 0%, transparent 50%)'
            : 'none',
          transition: 'background 0.4s',
        }}
      />
    </button>
  );
}
