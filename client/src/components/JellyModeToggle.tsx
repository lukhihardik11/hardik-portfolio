/**
 * JellyModeToggle — Premium gel capsule toggle for enabling/disabling jelly mode.
 *
 * Batch 2 REDO: Dramatically stronger visual treatment inspired by TypeGPU jelly switch.
 *
 * Key visual properties:
 * - Deeply recessed track with visible metallic depth
 * - Large translucent gel knob (85-90% of track height)
 * - Internal caustic highlight (white streak across top)
 * - Rim light on top-left edge
 * - Colored glow spill beneath knob
 * - Multiple layered shadows for volume
 * - OFF: Muted neutral gel with subtle depth
 * - ON: Translucent teal gel with internal glow, caustic highlights, color spill
 */
import { useRef, useCallback, useEffect } from 'react';
import { useJellyMode } from '@/contexts/JellyModeContext';
import { useTheme } from '@/contexts/ThemeContext';

/* ───────── Spring Physics ───────── */
class Spring {
  value = 0;
  target = 0;
  velocity = 0;
  constructor(public mass: number, public stiffness: number, public damping: number) {}
  update(dt: number) {
    const F = -this.stiffness * (this.value - this.target) - this.damping * this.velocity;
    this.velocity += (F / this.mass) * dt;
    this.value += this.velocity * dt;
  }
  atRest() {
    return Math.abs(this.value - this.target) < 0.0005 && Math.abs(this.velocity) < 0.005;
  }
}

interface Props {
  size?: number;
}

export function JellyModeToggle({ size = 40 }: Props) {
  const { jellyMode, toggleJellyMode } = useJellyMode();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  /* ── Sizing — generous proportions for visual weight ── */
  const trackW = Math.round(size * 1.8);   // ~72px
  const trackH = Math.round(size * 0.95);  // ~38px
  const pad = Math.round(trackH * 0.08);   // ~3px — tight padding for large knob
  const knobD = trackH - pad * 2;          // ~32px — 84% of track height
  const travel = trackW - knobD - pad * 2; // ~34px

  /* Springs */
  const springRef = useRef(
    Object.assign(new Spring(0.6, 280, 16), {
      value: jellyMode ? 1 : 0,
      target: jellyMode ? 1 : 0,
    })
  );
  const squashRef = useRef(new Spring(0.3, 700, 10));
  const lastT = useRef(0);
  const rafRef = useRef(0);
  const knobRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const causticRef = useRef<HTMLDivElement>(null);

  /* Update spring target */
  useEffect(() => {
    springRef.current.target = jellyMode ? 1 : 0;
  }, [jellyMode]);

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
        knobRef.current.style.transform =
          `translateX(${x}px) scaleX(${1 + squash * 0.18}) scaleY(${1 - squash * 0.12})`;
      }
      if (glowRef.current) {
        const glowW = knobD * 1.6;
        glowRef.current.style.transform = `translateX(${x + (knobD - glowW) / 2}px)`;
        glowRef.current.style.opacity = String(0.1 + t * 0.7);
      }
      if (causticRef.current) {
        causticRef.current.style.transform =
          `translateX(${x}px) scaleX(${1 + squash * 0.18}) scaleY(${1 - squash * 0.12})`;
      }

      if (!sp.atRest() || !sq.atRest()) {
        rafRef.current = requestAnimationFrame(frame);
      }
    }
    rafRef.current = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(rafRef.current);
  }, [pad, travel, knobD]);

  /* Click handler */
  const handleClick = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const sp = springRef.current;
    const sq = squashRef.current;
    sp.velocity = jellyMode ? -4 : 4;
    sq.velocity = jellyMode ? 5 : -5;
    toggleJellyMode();
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
        knobRef.current.style.transform =
          `translateX(${x}px) scaleX(${1 + squash * 0.18}) scaleY(${1 - squash * 0.12})`;
      }
      if (glowRef.current) {
        const glowW = knobD * 1.6;
        glowRef.current.style.transform = `translateX(${x + (knobD - glowW) / 2}px)`;
        glowRef.current.style.opacity = String(0.1 + Math.max(0, Math.min(1, sp.value)) * 0.7);
      }
      if (causticRef.current) {
        causticRef.current.style.transform =
          `translateX(${x}px) scaleX(${1 + squash * 0.18}) scaleY(${1 - squash * 0.12})`;
      }
      if (!sp.atRest() || !sq.atRest()) {
        rafRef.current = requestAnimationFrame(loop);
      }
    };
    rafRef.current = requestAnimationFrame(loop);
  }, [jellyMode, toggleJellyMode, pad, travel, knobD]);

  const handleDown = useCallback(() => {
    squashRef.current.velocity = -4;
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
        knobRef.current.style.transform =
          `translateX(${x}px) scaleX(${1 + squash * 0.18}) scaleY(${1 - squash * 0.12})`;
      }
      if (glowRef.current) {
        const glowW = knobD * 1.6;
        glowRef.current.style.transform = `translateX(${x + (knobD - glowW) / 2}px)`;
        glowRef.current.style.opacity = String(0.1 + Math.max(0, Math.min(1, springRef.current.value)) * 0.7);
      }
      if (causticRef.current) {
        causticRef.current.style.transform =
          `translateX(${x}px) scaleX(${1 + squash * 0.18}) scaleY(${1 - squash * 0.12})`;
      }
      if (!springRef.current.atRest() || !squashRef.current.atRest()) {
        rafRef.current = requestAnimationFrame(loop);
      }
    };
    rafRef.current = requestAnimationFrame(loop);
  }, [pad, travel, knobD]);

  /* ── TRACK STYLES — deeply recessed metallic channel ── */
  const trackBg = isDark
    ? jellyMode
      // Dark + ON: very dark teal track so bright knob stands out
      ? 'linear-gradient(180deg, oklch(0.08 0.04 175) 0%, oklch(0.12 0.05 175) 40%, oklch(0.09 0.04 175) 100%)'
      : 'linear-gradient(180deg, oklch(0.08 0.01 230) 0%, oklch(0.13 0.015 230) 40%, oklch(0.10 0.01 230) 100%)'
    : jellyMode
      // Light + ON: medium teal track — darker than neutral so knob pops
      ? 'linear-gradient(180deg, oklch(0.72 0.06 175) 0%, oklch(0.76 0.05 175) 40%, oklch(0.73 0.06 175) 100%)'
      : 'linear-gradient(180deg, oklch(0.82 0.005 80) 0%, oklch(0.87 0.003 80) 40%, oklch(0.84 0.005 80) 100%)';

  const trackShadow = isDark
    ? [
        // Deep recess — strong top shadow
        'inset 0 3px 6px oklch(0 0 0 / 65%)',
        'inset 0 1px 2px oklch(0 0 0 / 40%)',
        // Bottom rim highlight — light catching the lower lip
        'inset 0 -1.5px 1px oklch(1 0 0 / 10%)',
        // Outer contact shadow
        '0 2px 8px oklch(0 0 0 / 35%)',
        '0 1px 3px oklch(0 0 0 / 25%)',
        // Jelly mode: teal ambient glow
        ...(jellyMode ? ['0 0 16px oklch(0.60 0.18 175 / 25%)', '0 0 4px oklch(0.65 0.16 175 / 15%)'] : []),
      ].join(', ')
    : [
        // Deep recess
        'inset 0 3px 6px oklch(0 0 0 / 22%)',
        'inset 0 1px 2px oklch(0 0 0 / 12%)',
        // Bottom rim highlight
        'inset 0 -1.5px 1px oklch(1 0 0 / 70%)',
        // Top inner rim
        'inset 0 1px 0 oklch(1 0 0 / 35%)',
        // Outer contact shadow
        '0 2px 6px oklch(0 0 0 / 12%)',
        '0 1px 2px oklch(0 0 0 / 8%)',
        // Jelly mode: teal ambient glow
        ...(jellyMode ? ['0 0 14px oklch(0.60 0.18 175 / 18%)', '0 0 3px oklch(0.65 0.16 175 / 10%)'] : []),
      ].join(', ');

  const trackBorder = isDark
    ? `1.5px solid ${jellyMode ? 'oklch(0.45 0.12 175 / 25%)' : 'oklch(1 0 0 / 6%)'}`
    : `1.5px solid ${jellyMode ? 'oklch(0.55 0.12 175 / 20%)' : 'oklch(0 0 0 / 10%)'}`;

  /* ── KNOB STYLES — translucent gel droplet with material depth ── */
  const knobBg = jellyMode
    ? isDark
      // ON + Dark: BRIGHT translucent teal gel — must contrast against dark track
      ? `radial-gradient(ellipse at 30% 25%, oklch(0.90 0.08 175 / 96%) 0%, oklch(0.72 0.18 175 / 92%) 45%, oklch(0.58 0.22 175 / 88%) 100%)`
      // ON + Light: bright white-teal gel — must contrast against medium teal track
      : `radial-gradient(ellipse at 30% 25%, oklch(0.97 0.04 175 / 97%) 0%, oklch(0.88 0.10 175 / 94%) 45%, oklch(0.78 0.15 175 / 90%) 100%)`
    : isDark
      // OFF + Dark: muted neutral gel with subtle depth
      ? `radial-gradient(ellipse at 30% 25%, oklch(0.55 0.02 230 / 92%) 0%, oklch(0.38 0.03 230 / 88%) 50%, oklch(0.30 0.03 230 / 85%) 100%)`
      // OFF + Light: warm neutral gel
      : `radial-gradient(ellipse at 30% 25%, oklch(0.96 0.01 80 / 96%) 0%, oklch(0.88 0.02 80 / 92%) 50%, oklch(0.82 0.02 80 / 90%) 100%)`;

  const knobShadow = jellyMode
    ? isDark
      ? [
          // Outer colored glow — light spilling from translucent gel
          '0 0 14px oklch(0.55 0.22 175 / 50%)',
          '0 0 6px oklch(0.60 0.20 175 / 35%)',
          // Contact shadow
          '0 4px 12px oklch(0 0 0 / 35%)',
          '0 2px 4px oklch(0 0 0 / 25%)',
          // Inner top highlight — caustic refraction
          'inset 0 3px 5px oklch(0.90 0.08 175 / 50%)',
          // Inner bottom shadow — volume
          'inset 0 -2px 4px oklch(0.30 0.15 175 / 35%)',
          // Rim light — left edge catch
          'inset 2px 1px 3px oklch(1 0 0 / 20%)',
        ].join(', ')
      : [
          // Outer colored glow
          '0 0 12px oklch(0.60 0.20 175 / 40%)',
          '0 0 5px oklch(0.65 0.18 175 / 28%)',
          // Contact shadow
          '0 4px 12px oklch(0 0 0 / 18%)',
          '0 2px 4px oklch(0 0 0 / 12%)',
          // Inner top highlight
          'inset 0 3px 5px oklch(1 0 0 / 55%)',
          // Inner bottom shadow
          'inset 0 -2px 4px oklch(0.50 0.12 175 / 25%)',
          // Rim light
          'inset 2px 1px 3px oklch(1 0 0 / 30%)',
        ].join(', ')
    : isDark
      ? [
          // Subtle outer glow
          '0 0 4px oklch(0.40 0.03 230 / 20%)',
          // Contact shadow
          '0 3px 8px oklch(0 0 0 / 40%)',
          '0 1px 3px oklch(0 0 0 / 25%)',
          // Inner top highlight
          'inset 0 2px 4px oklch(1 0 0 / 18%)',
          // Inner bottom shadow
          'inset 0 -2px 3px oklch(0 0 0 / 25%)',
          // Rim light
          'inset 1px 1px 2px oklch(1 0 0 / 12%)',
        ].join(', ')
      : [
          // Subtle outer glow
          '0 0 3px oklch(0.85 0.01 80 / 15%)',
          // Contact shadow
          '0 3px 8px oklch(0 0 0 / 15%)',
          '0 1px 3px oklch(0 0 0 / 10%)',
          // Inner top highlight
          'inset 0 2px 4px oklch(1 0 0 / 60%)',
          // Inner bottom shadow
          'inset 0 -2px 3px oklch(0 0 0 / 10%)',
          // Rim light
          'inset 1px 1px 2px oklch(1 0 0 / 40%)',
        ].join(', ');

  return (
    <button
      onClick={handleClick}
      onMouseDown={handleDown}
      onTouchStart={handleDown}
      className="cursor-pointer bg-transparent border-none outline-none focus-visible:ring-2 focus-visible:ring-ring"
      style={{
        width: trackW,
        height: trackH + 8, // Extra space for glow beneath
        borderRadius: trackH / 2,
        position: 'relative',
        zIndex: 101,
        padding: 0,
      }}
      aria-label={jellyMode ? 'Disable Jelly Mode' : 'Enable Jelly Mode'}
      title={jellyMode ? 'Disable Jelly Mode' : 'Enable Jelly Mode'}
      role="switch"
      aria-checked={jellyMode}
    >
      {/* ── Recessed capsule track ── */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: trackH,
        borderRadius: trackH / 2,
        pointerEvents: 'none',
        background: trackBg,
        boxShadow: trackShadow,
        border: trackBorder,
        transition: 'background 0.4s, box-shadow 0.4s, border-color 0.4s',
      }} />

      {/* ── Track inner fill tint (jelly ON only) — subtle, does NOT compete with knob ── */}
      {jellyMode && (
        <div style={{
          position: 'absolute',
          top: 2,
          left: 2,
          right: 2,
          height: trackH - 4,
          borderRadius: (trackH - 4) / 2,
          pointerEvents: 'none',
          background: isDark
            ? 'linear-gradient(90deg, oklch(0.15 0.04 175 / 30%) 0%, oklch(0.20 0.06 175 / 35%) 100%)'
            : 'linear-gradient(90deg, oklch(0.78 0.03 175 / 20%) 0%, oklch(0.74 0.04 175 / 25%) 100%)',
          transition: 'opacity 0.4s',
        }} />
      )}

      {/* ── Colored glow spill beneath knob ── */}
      <div
        ref={glowRef}
        style={{
          position: 'absolute',
          top: trackH - 1,
          left: 0,
          width: knobD * 1.6,
          height: 14,
          borderRadius: '50%',
          pointerEvents: 'none',
          background: jellyMode
            ? isDark
              ? 'radial-gradient(ellipse, oklch(0.55 0.25 175 / 65%) 0%, oklch(0.50 0.20 175 / 30%) 40%, transparent 70%)'
              : 'radial-gradient(ellipse, oklch(0.60 0.22 175 / 50%) 0%, oklch(0.55 0.18 175 / 25%) 40%, transparent 70%)'
            : isDark
              ? 'radial-gradient(ellipse, oklch(0.35 0.03 230 / 20%) 0%, transparent 60%)'
              : 'radial-gradient(ellipse, oklch(0.70 0.02 80 / 15%) 0%, transparent 60%)',
          filter: 'blur(4px)',
          transition: 'background 0.4s',
        }}
      />

      {/* ── Gel knob — translucent with material depth ── */}
      <div
        ref={knobRef}
        style={{
          position: 'absolute',
          top: pad,
          left: 0,
          width: knobD,
          height: knobD,
          borderRadius: '50%',
          transformOrigin: 'center center',
          pointerEvents: 'none',
          background: knobBg,
          boxShadow: knobShadow,
          border: jellyMode
            ? isDark
              ? '1px solid oklch(0.70 0.10 175 / 25%)'
              : '1px solid oklch(0.75 0.08 175 / 20%)'
            : isDark
              ? '1px solid oklch(1 0 0 / 8%)'
              : '1px solid oklch(0 0 0 / 6%)',
          transition: 'background 0.4s, box-shadow 0.4s, border-color 0.4s',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        {/* ── Caustic highlight — white streak across top 35% ── */}
        <div style={{
          position: 'absolute',
          top: '8%',
          left: '15%',
          right: '15%',
          height: '35%',
          borderRadius: '50%',
          background: jellyMode
            ? 'linear-gradient(180deg, oklch(1 0 0 / 45%) 0%, oklch(1 0 0 / 15%) 50%, oklch(1 0 0 / 0%) 100%)'
            : 'linear-gradient(180deg, oklch(1 0 0 / 35%) 0%, oklch(1 0 0 / 10%) 50%, oklch(1 0 0 / 0%) 100%)',
          pointerEvents: 'none',
        }} />

        {/* ── Secondary caustic — smaller, offset ── */}
        <div style={{
          position: 'absolute',
          top: '12%',
          left: '20%',
          width: '30%',
          height: '20%',
          borderRadius: '50%',
          background: jellyMode
            ? 'radial-gradient(ellipse, oklch(1 0 0 / 40%) 0%, transparent 70%)'
            : 'radial-gradient(ellipse, oklch(1 0 0 / 25%) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        {/* ── Blob icon — centered in knob ── */}
        <svg
          width={Math.round(knobD * 0.45)}
          height={Math.round(knobD * 0.45)}
          viewBox="0 0 24 24"
          fill="none"
          style={{ position: 'relative', zIndex: 2, opacity: 0.7 }}
        >
          <path
            d="M12 3C7.5 3 4 6.5 4 10.5c0 2.8 1.2 5 3 6.5 1 1 1.5 2.2 1.5 3.5h7c0-1.3.5-2.5 1.5-3.5 1.8-1.5 3-3.7 3-6.5C20 6.5 16.5 3 12 3z"
            fill={jellyMode
              ? (isDark ? 'oklch(0.95 0.08 175 / 70%)' : 'oklch(0.25 0.12 175 / 65%)')
              : (isDark ? 'oklch(0.70 0 0 / 40%)' : 'oklch(0.40 0 0 / 35%)')
            }
          />
          {/* Specular dot on icon */}
          <ellipse
            cx="10"
            cy="8"
            rx="1.8"
            ry="1"
            fill={jellyMode ? 'oklch(1 0 0 / 40%)' : 'oklch(1 0 0 / 15%)'}
          />
        </svg>
      </div>

      {/* ── Caustic overlay on knob — moves with spring ── */}
      <div
        ref={causticRef}
        style={{
          position: 'absolute',
          top: pad,
          left: 0,
          width: knobD,
          height: knobD,
          borderRadius: '50%',
          pointerEvents: 'none',
          transformOrigin: 'center center',
          background: jellyMode
            ? 'radial-gradient(ellipse at 35% 30%, oklch(1 0 0 / 12%) 0%, transparent 50%)'
            : 'none',
          transition: 'background 0.4s',
        }}
      />
    </button>
  );
}
