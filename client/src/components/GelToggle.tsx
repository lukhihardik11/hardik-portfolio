/**
 * GelToggle — Unified premium gel capsule toggle component.
 *
 * DUAL-PATH ARCHITECTURE (matching JellyWrapper pattern):
 *
 * FULL PATH (desktop with fine pointer — useFineHover === true):
 *   - Full RAF spring physics for knob position + squash
 *   - onPointerDown for press feedback
 *   - Smooth, bouncy, elastic feel
 *
 * LIGHTER PATH (touch / coarse-pointer — useFineHover === false):
 *   - Pure CSS transitions for knob position (GPU-accelerated)
 *   - No RAF loops, no continuous DOM writes
 *   - Simple onClick only (no onTouchStart/onMouseDown)
 *   - touch-action: manipulation (no 300ms delay)
 *   - No preventDefault/stopPropagation
 *   - Spring-like feel via cubic-bezier easing
 *
 * This eliminates the Android/iOS jelly toggle artifacts caused by
 * RAF loops conflicting with jelly-mode class style recalculations.
 */
import { useRef, useCallback, useEffect, type ReactNode } from 'react';
import { useFineHover } from '@/hooks/useFineHover';

/* ───────── Spring Physics (FULL PATH only) ───────── */
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
  trackOff: string;
  trackOn: string;
  trackShadow: string;
  trackRimLight: string;
  knobOff: string;
  knobOn: string;
  knobShadowOff: string;
  knobShadowOn: string;
  glowOff: string;
  glowOn: string;
  borderOff: string;
  borderOn: string;
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
  const fineHover = useFineHover();

  /* ── Sizing — improved proportions for better silhouette ── */
  const trackW = Math.round(size * 1.82);
  const trackH = Math.round(size * 0.82);
  const knobD = Math.round(trackH * 1.35);
  const knobOverflow = (knobD - trackH) / 2;
  const pad = Math.round(trackH * 0.08);
  const travel = trackW - knobD - pad * 2;
  const totalH = knobD;

  /* ══════════════════════════════════════════════════════════
   * LIGHTER PATH — Touch / coarse-pointer devices
   * Pure CSS transitions, no RAF, no continuous DOM writes
   * ══════════════════════════════════════════════════════════ */
  if (!fineHover) {
    const knobX = checked ? pad + travel : pad;
    const glowW = knobD * 1.6;
    const glowX = knobX + (knobD - glowW) / 2;
    const glowOpacity = checked ? 0.8 : 0.1;

    /* Spring-like CSS easing: overshoot via cubic-bezier */
    const springEasing = jellyMode
      ? 'cubic-bezier(0.34, 1.56, 0.64, 1)' /* bouncier */
      : 'cubic-bezier(0.25, 1.2, 0.5, 1)';  /* subtle overshoot */
    const duration = jellyMode ? '0.45s' : '0.35s';

    const handleClick = () => {
      onChange(!checked);
    };

    return (
      <button
        onClick={handleClick}
        className="no-jelly cursor-pointer bg-transparent border-none outline-none focus-visible:ring-2 focus-visible:ring-ring"
        style={{
          width: trackW,
          height: totalH,
          borderRadius: trackH / 2,
          position: 'relative',
          zIndex: 101,
          padding: 0,
          overflow: 'visible',
          touchAction: 'manipulation',
          WebkitTapHighlightColor: 'transparent',
        }}
        aria-label={ariaLabel}
        title={title}
        role="switch"
        aria-checked={checked}
      >
        {/* ── Recessed capsule track ── */}
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
            transition: `background ${duration} ${springEasing}, border ${duration} ${springEasing}`,
          }}
        />

        {/* ── Track rim highlight ── */}
        <div
          style={{
            position: 'absolute',
            top: knobOverflow + trackH - 1,
            left: 4,
            right: 4,
            height: 1,
            borderRadius: 1,
            pointerEvents: 'none',
            background: colors.trackRimLight,
            transition: `background ${duration}`,
          }}
        />

        {/* ── Track inner fill tint (ON state only) ── */}
        <div
          style={{
            position: 'absolute',
            top: knobOverflow + 2,
            left: 2,
            right: 2,
            height: trackH - 4,
            borderRadius: (trackH - 4) / 2,
            pointerEvents: 'none',
            opacity: checked ? 1 : 0,
            background: isDark
              ? 'linear-gradient(90deg, oklch(1 0 0 / 4%) 0%, oklch(1 0 0 / 7%) 100%)'
              : 'linear-gradient(90deg, oklch(0 0 0 / 3%) 0%, oklch(0 0 0 / 6%) 100%)',
            transition: `opacity ${duration}`,
          }}
        />

        {/* ── Colored glow spill beneath knob ── */}
        <div
          style={{
            position: 'absolute',
            top: knobOverflow + trackH - 2,
            left: 0,
            width: glowW,
            height: jellyMode ? 16 : 10,
            borderRadius: '50%',
            pointerEvents: 'none',
            background: checked ? colors.glowOn : colors.glowOff,
            filter: `blur(${jellyMode ? 6 : 3}px)`,
            opacity: glowOpacity,
            transform: `translateX(${glowX}px)`,
            transition: `transform ${duration} ${springEasing}, opacity ${duration}, background ${duration}, filter ${duration}`,
          }}
        />

        {/* ── Gel knob — CSS transition instead of RAF ── */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: knobD,
            height: knobD,
            borderRadius: '50%',
            transformOrigin: 'center center',
            pointerEvents: 'none',
            willChange: 'transform',
            transform: `translateX(${knobX}px)`,
            background: checked ? colors.knobOn : colors.knobOff,
            boxShadow: checked ? colors.knobShadowOn : colors.knobShadowOff,
            border: checked
              ? `1.5px solid ${isDark ? 'oklch(1 0 0 / 18%)' : 'oklch(1 0 0 / 35%)'}`
              : `1.5px solid ${isDark ? 'oklch(1 0 0 / 12%)' : 'oklch(1 0 0 / 12%)'}`,
            transition: `transform ${duration} ${springEasing}, background ${duration}, box-shadow ${duration}, border-color ${duration}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          {/* ── Primary caustic highlight ── */}
          <div
            style={{
              position: 'absolute',
              top: '4%',
              left: '10%',
              right: '10%',
              height: '42%',
              borderRadius: '50%',
              background: `linear-gradient(180deg, oklch(1 0 0 / ${checked ? 55 * colors.causticIntensity : 40 * colors.causticIntensity}%) 0%, oklch(1 0 0 / ${checked ? 22 * colors.causticIntensity : 15 * colors.causticIntensity}%) 50%, oklch(1 0 0 / 0%) 100%)`,
              pointerEvents: 'none',
            }}
          />

          {/* ── Secondary caustic ── */}
          <div
            style={{
              position: 'absolute',
              top: '8%',
              left: '15%',
              width: '32%',
              height: '26%',
              borderRadius: '50%',
              background: `radial-gradient(ellipse, oklch(1 0 0 / ${checked ? 42 * colors.causticIntensity : 28 * colors.causticIntensity}%) 0%, transparent 70%)`,
              pointerEvents: 'none',
            }}
          />

          {/* ── Rim light ── */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '50%',
              pointerEvents: 'none',
              background: `linear-gradient(135deg, oklch(1 0 0 / ${isDark ? 12 : 18}%) 0%, transparent 40%, transparent 60%, oklch(0 0 0 / ${isDark ? 12 : 6}%) 100%)`,
            }}
          />

          {/* ── Bottom shadow ── */}
          <div
            style={{
              position: 'absolute',
              bottom: '0%',
              left: '8%',
              right: '8%',
              height: '35%',
              borderRadius: '50%',
              background: `linear-gradient(0deg, oklch(0 0 0 / ${isDark ? 20 : 12}%) 0%, transparent 100%)`,
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
                filter: `drop-shadow(0 1px 2px oklch(0 0 0 / 30%))`,
                transition: 'opacity 0.3s',
              }}
            >
              {icon}
            </div>
          )}
        </div>

        {/* ── Caustic overlay on knob ── */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: knobD,
            height: knobD,
            borderRadius: '50%',
            pointerEvents: 'none',
            transformOrigin: 'center center',
            transform: `translateX(${knobX}px)`,
            background: checked
              ? `radial-gradient(ellipse at 35% 30%, oklch(1 0 0 / ${jellyMode ? 15 : 8}%) 0%, transparent 50%)`
              : 'none',
            transition: `transform ${duration} ${springEasing}, background ${duration}`,
          }}
        />
      </button>
    );
  }

  /* ══════════════════════════════════════════════════════════
   * FULL PATH — Desktop with fine pointer
   * Full RAF spring physics (unchanged from original)
   * ══════════════════════════════════════════════════════════ */
  return (
    <DesktopGelToggle
      checked={checked}
      onChange={onChange}
      colors={colors}
      isDark={isDark}
      icon={icon}
      jellyMode={jellyMode}
      trackW={trackW}
      trackH={trackH}
      knobD={knobD}
      knobOverflow={knobOverflow}
      pad={pad}
      travel={travel}
      totalH={totalH}
      ariaLabel={ariaLabel}
      title={title}
    />
  );
}

/* ── Desktop-only component with full spring physics ── */
function DesktopGelToggle({
  checked,
  onChange,
  colors,
  isDark,
  icon,
  jellyMode = false,
  trackW,
  trackH,
  knobD,
  knobOverflow,
  pad,
  travel,
  totalH,
  ariaLabel,
  title,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  colors: GelToggleColors;
  isDark: boolean;
  icon?: ReactNode;
  jellyMode?: boolean;
  trackW: number;
  trackH: number;
  knobD: number;
  knobOverflow: number;
  pad: number;
  travel: number;
  totalH: number;
  ariaLabel: string;
  title?: string;
}) {
  const posSpring = useRef(
    Object.assign(
      new Spring(
        jellyMode ? 0.5 : 0.4,
        jellyMode ? 220 : 380,
        jellyMode ? 12 : 22,
      ),
      { value: checked ? 1 : 0, target: checked ? 1 : 0 },
    ),
  );
  const squashSpring = useRef(
    new Spring(
      jellyMode ? 0.25 : 0.2,
      jellyMode ? 500 : 900,
      jellyMode ? 7 : 16,
    ),
  );
  const lastT = useRef(0);
  const rafRef = useRef(0);
  const knobRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const causticRef = useRef<HTMLDivElement>(null);

  const squashScaleX = jellyMode ? 0.28 : 0.10;
  const squashScaleY = jellyMode ? 0.20 : 0.06;

  /* Update spring configs when jellyMode changes.
     CRITICAL: Reset squash spring value & velocity to prevent the new config
     from amplifying stale velocity into a massive overshoot that scales the
     knob to cover the entire viewport (root cause of the "teal wash" bug). */
  useEffect(() => {
    const sp = posSpring.current;
    const sq = squashSpring.current;
    // Reset squash to rest — prevents config-change overshoot
    sq.value = 0;
    sq.velocity = 0;
    if (jellyMode) {
      sp.mass = 0.5; sp.stiffness = 220; sp.damping = 12;
      sq.mass = 0.25; sq.stiffness = 500; sq.damping = 7;
    } else {
      sp.mass = 0.4; sp.stiffness = 380; sp.damping = 22;
      sq.mass = 0.2; sq.stiffness = 900; sq.damping = 16;
    }
  }, [jellyMode]);

  /* Update spring target */
  useEffect(() => {
    posSpring.current.target = checked ? 1 : 0;
  }, [checked]);

  /* Animation loop */
  useEffect(() => {
    lastT.current = performance.now();
    function frame(ts: number) {
      const dt = Math.min((ts - lastT.current) * 0.001, 0.1);
      lastT.current = ts;
      const sp = posSpring.current;
      const sq = squashSpring.current;
      sp.update(dt);
      sq.update(dt);

      const t = Math.max(0, Math.min(1, sp.value));
      const x = pad + t * travel;
      // Clamp squash to safe range to prevent extreme scaling
      const squash = Math.max(-3, Math.min(3, sq.value));

      if (knobRef.current) {
        knobRef.current.style.transform = `translateX(${x}px) scaleX(${1 + squash * squashScaleX}) scaleY(${1 - squash * squashScaleY})`;
      }
      if (glowRef.current) {
        const glowW = knobD * 1.6;
        glowRef.current.style.transform = `translateX(${x + (knobD - glowW) / 2}px)`;
        glowRef.current.style.opacity = String(0.1 + t * 0.7);
      }
      if (causticRef.current) {
        causticRef.current.style.transform = `translateX(${x}px) scaleX(${1 + squash * squashScaleX}) scaleY(${1 - squash * squashScaleY})`;
      }

      if (!sp.atRest() || !sq.atRest()) {
        rafRef.current = requestAnimationFrame(frame);
      }
    }
    rafRef.current = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(rafRef.current);
  }, [pad, travel, knobD, squashScaleX, squashScaleY]);

  /* Click handler — desktop uses pointer events */
  const handleClick = useCallback(
    () => {
      const sp = posSpring.current;
      const sq = squashSpring.current;
      const velMult = jellyMode ? 2.0 : 0.8;
      const sqMult = jellyMode ? 2.0 : 0.6;
      sp.velocity = (checked ? -4 : 4) * velMult;
      sq.velocity = (checked ? 5 : -5) * sqMult;
      onChange(!checked);
      lastT.current = performance.now();
      cancelAnimationFrame(rafRef.current);
      const loop = (ts: number) => {
        const dt = Math.min((ts - lastT.current) * 0.001, 0.1);
        lastT.current = ts;
        sp.update(dt);
        sq.update(dt);
        const t = Math.max(0, Math.min(1, sp.value));
        const x = pad + t * travel;
        const squash = Math.max(-3, Math.min(3, sq.value));
        if (knobRef.current) {
          knobRef.current.style.transform = `translateX(${x}px) scaleX(${1 + squash * squashScaleX}) scaleY(${1 - squash * squashScaleY})`;
        }
        if (glowRef.current) {
          const glowW = knobD * 1.6;
          glowRef.current.style.transform = `translateX(${x + (knobD - glowW) / 2}px)`;
          glowRef.current.style.opacity = String(
            0.1 + Math.max(0, Math.min(1, sp.value)) * 0.7,
          );
        }
        if (causticRef.current) {
          causticRef.current.style.transform = `translateX(${x}px) scaleX(${1 + squash * squashScaleX}) scaleY(${1 - squash * squashScaleY})`;
        }
        if (!sp.atRest() || !sq.atRest()) {
          rafRef.current = requestAnimationFrame(loop);
        }
      };
      rafRef.current = requestAnimationFrame(loop);
    },
    [checked, onChange, jellyMode, pad, travel, knobD, squashScaleX, squashScaleY],
  );

  const handleDown = useCallback(() => {
    const mult = jellyMode ? 1.8 : 0.5;
    squashSpring.current.velocity = -3.5 * mult;
    lastT.current = performance.now();
    cancelAnimationFrame(rafRef.current);
    const loop = (ts: number) => {
      const dt = Math.min((ts - lastT.current) * 0.001, 0.1);
      lastT.current = ts;
      posSpring.current.update(dt);
      squashSpring.current.update(dt);
      const t = Math.max(0, Math.min(1, posSpring.current.value));
      const x = pad + t * travel;
      const squash = Math.max(-3, Math.min(3, squashSpring.current.value));
      if (knobRef.current) {
        knobRef.current.style.transform = `translateX(${x}px) scaleX(${1 + squash * squashScaleX}) scaleY(${1 - squash * squashScaleY})`;
      }
      if (glowRef.current) {
        const glowW = knobD * 1.6;
        glowRef.current.style.transform = `translateX(${x + (knobD - glowW) / 2}px)`;
        glowRef.current.style.opacity = String(
          0.1 +
            Math.max(0, Math.min(1, posSpring.current.value)) * 0.7,
        );
      }
      if (causticRef.current) {
        causticRef.current.style.transform = `translateX(${x}px) scaleX(${1 + squash * squashScaleX}) scaleY(${1 - squash * squashScaleY})`;
      }
      if (!posSpring.current.atRest() || !squashSpring.current.atRest()) {
        rafRef.current = requestAnimationFrame(loop);
      }
    };
    rafRef.current = requestAnimationFrame(loop);
  }, [jellyMode, pad, travel, knobD, squashScaleX, squashScaleY]);

  return (
    <button
      onClick={handleClick}
      onPointerDown={handleDown}
      className="no-jelly cursor-pointer bg-transparent border-none outline-none focus-visible:ring-2 focus-visible:ring-ring"
      style={{
        width: trackW,
        height: totalH,
        borderRadius: trackH / 2,
        position: 'relative',
        zIndex: 101,
        padding: 0,
        overflow: 'visible',
      }}
      aria-label={ariaLabel}
      title={title}
      role="switch"
      aria-checked={checked}
    >
      {/* ── Recessed capsule track ── */}
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
          transition: 'background 0.4s, border 0.4s',
        }}
      />

      {/* ── Track rim highlight ── */}
      <div
        style={{
          position: 'absolute',
          top: knobOverflow + trackH - 1,
          left: 4,
          right: 4,
          height: 1,
          borderRadius: 1,
          pointerEvents: 'none',
          background: colors.trackRimLight,
          transition: 'background 0.4s',
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
              ? 'linear-gradient(90deg, oklch(1 0 0 / 4%) 0%, oklch(1 0 0 / 7%) 100%)'
              : 'linear-gradient(90deg, oklch(0 0 0 / 3%) 0%, oklch(0 0 0 / 6%) 100%)',
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
          width: knobD * 1.6,
          height: jellyMode ? 16 : 10,
          borderRadius: '50%',
          pointerEvents: 'none',
          background: checked ? colors.glowOn : colors.glowOff,
          filter: `blur(${jellyMode ? 6 : 3}px)`,
          transition: 'background 0.4s, filter 0.4s',
        }}
      />

      {/* ── Gel knob ── */}
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
            ? `1.5px solid ${isDark ? 'oklch(1 0 0 / 18%)' : 'oklch(1 0 0 / 35%)'}`
            : `1.5px solid ${isDark ? 'oklch(1 0 0 / 12%)' : 'oklch(1 0 0 / 12%)'}`,
          transition:
            'background 0.4s, box-shadow 0.4s, border-color 0.4s',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        {/* ── Primary caustic highlight ── */}
        <div
          style={{
            position: 'absolute',
            top: '4%',
            left: '10%',
            right: '10%',
            height: '42%',
            borderRadius: '50%',
            background: `linear-gradient(180deg, oklch(1 0 0 / ${checked ? 55 * colors.causticIntensity : 40 * colors.causticIntensity}%) 0%, oklch(1 0 0 / ${checked ? 22 * colors.causticIntensity : 15 * colors.causticIntensity}%) 50%, oklch(1 0 0 / 0%) 100%)`,
            pointerEvents: 'none',
          }}
        />

        {/* ── Secondary caustic ── */}
        <div
          style={{
            position: 'absolute',
            top: '8%',
            left: '15%',
            width: '32%',
            height: '26%',
            borderRadius: '50%',
            background: `radial-gradient(ellipse, oklch(1 0 0 / ${checked ? 42 * colors.causticIntensity : 28 * colors.causticIntensity}%) 0%, transparent 70%)`,
            pointerEvents: 'none',
          }}
        />

        {/* ── Rim light ── */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            pointerEvents: 'none',
            background: `linear-gradient(135deg, oklch(1 0 0 / ${isDark ? 12 : 18}%) 0%, transparent 40%, transparent 60%, oklch(0 0 0 / ${isDark ? 12 : 6}%) 100%)`,
          }}
        />

        {/* ── Bottom shadow ── */}
        <div
          style={{
            position: 'absolute',
            bottom: '0%',
            left: '8%',
            right: '8%',
            height: '35%',
            borderRadius: '50%',
            background: `linear-gradient(0deg, oklch(0 0 0 / ${isDark ? 20 : 12}%) 0%, transparent 100%)`,
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
              filter: `drop-shadow(0 1px 2px oklch(0 0 0 / 30%))`,
              transition: 'opacity 0.3s',
            }}
          >
            {icon}
          </div>
        )}
      </div>

      {/* ── Caustic overlay on knob ── */}
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
            ? `radial-gradient(ellipse at 35% 30%, oklch(1 0 0 / ${jellyMode ? 15 : 8}%) 0%, transparent 50%)`
            : 'none',
          transition: 'background 0.4s',
        }}
      />
    </button>
  );
}
