/**
 * JellyModeToggle — Capsule toggle for enabling/disabling jelly mode.
 *
 * Batch 2: Redesigned from a circle button to a proper capsule toggle
 * that matches the dark/light JellySwitch form factor.
 *
 * - Recessed capsule track (same visual language as JellySwitch)
 * - Sliding knob with blob icon
 * - OFF: Muted, knob on left
 * - ON: Teal accent glow, knob on right
 * - Spring-based animation for knob movement
 * - Squish on press (volume preservation cue)
 */
import { useRef, useCallback, useEffect, useState } from 'react';
import { useJellyMode } from '@/contexts/JellyModeContext';
import { useTheme } from '@/contexts/ThemeContext';

/* ───────── Spring Physics (same as JellySwitch) ───────── */
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

export function JellyModeToggle({ size = 36 }: Props) {
  const { jellyMode, toggleJellyMode } = useJellyMode();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  /* Sizing — proportional capsule */
  const trackW = Math.round(size * 1.75);
  const trackH = Math.round(size * 0.85);
  const pad = Math.round(trackH * 0.13);
  const knobD = trackH - pad * 2;
  const travel = trackW - knobD - pad * 2;

  /* Spring for slide position */
  const springRef = useRef(
    Object.assign(new Spring(0.8, 220, 15), {
      value: jellyMode ? 1 : 0,
      target: jellyMode ? 1 : 0,
    })
  );
  const squashRef = useRef(new Spring(0.4, 600, 10));
  const lastT = useRef(0);
  const rafRef = useRef(0);
  const knobRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const [, forceRender] = useState(0);

  /* Update spring target when jellyMode changes */
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

      const slideVal = Math.max(0, Math.min(1, sp.value));
      const knobLeft = pad + slideVal * travel;
      const squashVal = sq.value;

      if (knobRef.current) {
        knobRef.current.style.transform = `translateX(${knobLeft}px) scaleX(${1 + squashVal * 0.15}) scaleY(${1 - squashVal * 0.1})`;
      }
      if (glowRef.current) {
        glowRef.current.style.transform = `translateX(${knobLeft + (knobD - knobD * 1.3) / 2}px)`;
        glowRef.current.style.opacity = String(0.15 + slideVal * 0.45);
      }

      if (!sp.atRest() || !sq.atRest()) {
        rafRef.current = requestAnimationFrame(frame);
      }
    }
    rafRef.current = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(rafRef.current);
  }, [pad, travel, knobD]);

  /* Click handler with spring impulse */
  const handleClick = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const sp = springRef.current;
    const sq = squashRef.current;
    sp.velocity = jellyMode ? -3 : 3;
    sq.velocity = jellyMode ? 4 : -4;
    toggleJellyMode();
    // Restart animation loop
    lastT.current = performance.now();
    cancelAnimationFrame(rafRef.current);
    const loop = (ts: number) => {
      const dt = Math.min((ts - lastT.current) * 0.001, 0.1);
      lastT.current = ts;
      sp.update(dt);
      sq.update(dt);
      const slideVal = Math.max(0, Math.min(1, sp.value));
      const knobLeft = pad + slideVal * travel;
      const squashVal = sq.value;
      if (knobRef.current) {
        knobRef.current.style.transform = `translateX(${knobLeft}px) scaleX(${1 + squashVal * 0.15}) scaleY(${1 - squashVal * 0.1})`;
      }
      if (glowRef.current) {
        glowRef.current.style.transform = `translateX(${knobLeft + (knobD - knobD * 1.3) / 2}px)`;
        glowRef.current.style.opacity = String(0.15 + slideVal * 0.45);
      }
      if (!sp.atRest() || !sq.atRest()) {
        rafRef.current = requestAnimationFrame(loop);
      }
    };
    rafRef.current = requestAnimationFrame(loop);
  }, [jellyMode, toggleJellyMode, pad, travel, knobD]);

  const handleDown = useCallback(() => {
    squashRef.current.velocity = -3;
    // Restart animation
    lastT.current = performance.now();
    cancelAnimationFrame(rafRef.current);
    const loop = (ts: number) => {
      const dt = Math.min((ts - lastT.current) * 0.001, 0.1);
      lastT.current = ts;
      springRef.current.update(dt);
      squashRef.current.update(dt);
      const slideVal = Math.max(0, Math.min(1, springRef.current.value));
      const knobLeft = pad + slideVal * travel;
      const squashVal = squashRef.current.value;
      if (knobRef.current) {
        knobRef.current.style.transform = `translateX(${knobLeft}px) scaleX(${1 + squashVal * 0.15}) scaleY(${1 - squashVal * 0.1})`;
      }
      if (glowRef.current) {
        glowRef.current.style.transform = `translateX(${knobLeft + (knobD - knobD * 1.3) / 2}px)`;
        glowRef.current.style.opacity = String(0.15 + slideVal * 0.45);
      }
      if (!springRef.current.atRest() || !squashRef.current.atRest()) {
        rafRef.current = requestAnimationFrame(loop);
      }
    };
    rafRef.current = requestAnimationFrame(loop);
  }, [pad, travel, knobD]);

  /* Accent color — teal when ON */
  const accentColor = jellyMode ? 'oklch(0.70 0.16 175)' : (isDark ? 'oklch(0.45 0.02 0)' : 'oklch(0.65 0.02 0)');

  return (
    <button
      onClick={handleClick}
      onMouseDown={handleDown}
      onTouchStart={handleDown}
      className="cursor-pointer bg-transparent border-none outline-none focus-visible:ring-2 focus-visible:ring-ring"
      style={{
        width: trackW,
        height: trackH,
        borderRadius: trackH / 2,
        position: 'relative',
        zIndex: 101,
      }}
      aria-label={jellyMode ? 'Disable Jelly Mode' : 'Enable Jelly Mode'}
      title={jellyMode ? 'Disable Jelly Mode' : 'Enable Jelly Mode'}
      role="switch"
      aria-checked={jellyMode}
    >
      {/* Recessed capsule track */}
      <div style={{
        position: 'absolute',
        inset: 0,
        borderRadius: trackH / 2,
        pointerEvents: 'none' as const,
        background: isDark
          ? jellyMode
            ? 'linear-gradient(180deg, oklch(0.14 0.04 175) 0%, oklch(0.18 0.05 175) 50%, oklch(0.15 0.04 175) 100%)'
            : 'linear-gradient(180deg, oklch(0.12 0.015 230) 0%, oklch(0.16 0.02 230) 50%, oklch(0.13 0.015 230) 100%)'
          : jellyMode
            ? 'linear-gradient(180deg, oklch(0.88 0.03 175) 0%, oklch(0.92 0.02 175) 50%, oklch(0.89 0.03 175) 100%)'
            : 'linear-gradient(180deg, oklch(0.88 0.005 80) 0%, oklch(0.92 0.003 80) 50%, oklch(0.89 0.005 80) 100%)',
        boxShadow: isDark
          ? [
              'inset 0 2px 4px oklch(0 0 0 / 50%)',
              'inset 0 -1px 1px oklch(1 0 0 / 6%)',
              'inset 0 1px 0 oklch(1 0 0 / 4%)',
              '0 2px 8px oklch(0 0 0 / 30%)',
              '0 1px 2px oklch(0 0 0 / 20%)',
              jellyMode ? `0 0 12px oklch(0.65 0.16 175 / 15%)` : '',
            ].filter(Boolean).join(', ')
          : [
              'inset 0 2px 4px oklch(0 0 0 / 15%)',
              'inset 0 -1px 1px oklch(1 0 0 / 60%)',
              'inset 0 1px 0 oklch(1 0 0 / 40%)',
              '0 2px 6px oklch(0 0 0 / 10%)',
              '0 1px 2px oklch(0 0 0 / 8%)',
              jellyMode ? `0 0 10px oklch(0.65 0.16 175 / 12%)` : '',
            ].filter(Boolean).join(', '),
        border: isDark
          ? `1px solid ${jellyMode ? 'oklch(0.50 0.10 175 / 15%)' : 'oklch(1 0 0 / 5%)'}`
          : `1px solid ${jellyMode ? 'oklch(0.60 0.10 175 / 15%)' : 'oklch(0 0 0 / 8%)'}`,
        transition: 'background 0.4s, box-shadow 0.4s, border-color 0.4s',
      }} />

      {/* Colored glow beneath knob */}
      <div
        ref={glowRef}
        style={{
          position: 'absolute',
          top: trackH - 2,
          left: 0,
          width: knobD * 1.3,
          height: 10,
          borderRadius: '50%',
          background: jellyMode
            ? 'radial-gradient(ellipse, oklch(0.65 0.20 175 / 50%) 0%, transparent 70%)'
            : 'radial-gradient(ellipse, oklch(0.5 0.05 0 / 15%) 0%, transparent 70%)',
          filter: 'blur(5px)',
          pointerEvents: 'none',
          opacity: jellyMode ? 0.6 : 0.15,
          transition: 'background 0.4s',
        }}
      />

      {/* Sliding knob — positioned via spring */}
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
          pointerEvents: 'none' as const,
          background: jellyMode
            ? isDark
              ? 'radial-gradient(ellipse at 35% 28%, oklch(0.78 0.14 175 / 95%), oklch(0.55 0.20 175 / 90%))'
              : 'radial-gradient(ellipse at 35% 28%, oklch(0.85 0.10 175 / 95%), oklch(0.65 0.16 175 / 90%))'
            : isDark
              ? 'radial-gradient(ellipse at 35% 28%, oklch(0.50 0.02 0 / 90%), oklch(0.35 0.02 0 / 85%))'
              : 'radial-gradient(ellipse at 35% 28%, oklch(0.92 0.01 0 / 95%), oklch(0.78 0.01 0 / 90%))',
          boxShadow: jellyMode
            ? isDark
              ? [
                  '0 3px 10px oklch(0.55 0.18 175 / 45%)',
                  '0 1px 3px oklch(0 0 0 / 25%)',
                  'inset 0 2px 3px oklch(0.88 0.08 175 / 35%)',
                  'inset 0 -1px 2px oklch(0 0 0 / 20%)',
                ].join(', ')
              : [
                  '0 3px 10px oklch(0.60 0.16 175 / 35%)',
                  '0 1px 3px oklch(0 0 0 / 12%)',
                  'inset 0 2px 3px oklch(1 0 0 / 45%)',
                  'inset 0 -1px 2px oklch(0 0 0 / 10%)',
                ].join(', ')
            : isDark
              ? [
                  '0 2px 6px oklch(0 0 0 / 40%)',
                  '0 1px 2px oklch(0 0 0 / 25%)',
                  'inset 0 1px 2px oklch(1 0 0 / 15%)',
                  'inset 0 -1px 1px oklch(0 0 0 / 20%)',
                ].join(', ')
              : [
                  '0 2px 6px oklch(0 0 0 / 15%)',
                  '0 1px 2px oklch(0 0 0 / 10%)',
                  'inset 0 1px 2px oklch(1 0 0 / 50%)',
                  'inset 0 -1px 1px oklch(0 0 0 / 8%)',
                ].join(', '),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'background 0.4s, box-shadow 0.4s',
        }}
      >
        {/* Blob icon inside knob */}
        <svg
          width={Math.round(knobD * 0.55)}
          height={Math.round(knobD * 0.55)}
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M12 4C8 4 5 7 5 10.5c0 2.5 1 4.5 2.5 6 1.2 1.2 1.5 2.5 1.5 4h6c0-1.5.3-2.8 1.5-4 1.5-1.5 2.5-3.5 2.5-6C19 7 16 4 12 4z"
            fill={jellyMode
              ? (isDark ? 'oklch(0.90 0.10 175 / 80%)' : 'oklch(0.30 0.10 175 / 80%)')
              : (isDark ? 'oklch(0.65 0 0 / 50%)' : 'oklch(0.45 0 0 / 40%)')
            }
            stroke={jellyMode
              ? (isDark ? 'oklch(0.85 0.08 175 / 40%)' : 'oklch(0.50 0.10 175 / 30%)')
              : 'none'
            }
            strokeWidth="1"
          />
          {/* Specular highlight dot */}
          <ellipse
            cx="10"
            cy="8.5"
            rx="2"
            ry="1.2"
            fill={jellyMode ? 'oklch(1 0 0 / 35%)' : 'oklch(1 0 0 / 15%)'}
          />
        </svg>
      </div>
    </button>
  );
}
