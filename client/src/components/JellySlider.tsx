/**
 * JellySlider — Thick glass tube with colored gel fill.
 *
 * Inspired by the reference images:
 *   - Track is a thick glass tube with visible depth and edge thickness
 *   - Fill is a colored gel that sits inside the tube
 *   - Specular highlight strip on top of the fill
 *   - Colored glow beneath the filled portion
 *   - Smooth scroll-triggered animation
 */
import { useEffect, useRef, useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

export type BlobColor = 'amber' | 'teal';

interface JellySliderProps {
  value: number;
  label?: string;
  blobColor?: BlobColor;
  animate?: boolean;
  delay?: number;
}

export function JellySlider({ value, label, blobColor = 'amber' }: JellySliderProps) {
  const pct = Math.max(0, Math.min(100, value));
  const isAmber = blobColor === 'amber';
  const [animPct, setAnimPct] = useState(0);
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  /* Intersection observer for scroll-triggered animation */
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          obs.unobserve(el);
        }
      },
      { threshold: 0.2 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  /* Animate fill */
  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(() => setAnimPct(pct), 100);
    return () => clearTimeout(t);
  }, [visible, pct]);

  /* ── Color system ── */
  const hue = isAmber ? 65 : 230;
  const chroma = isAmber ? 0.15 : 0.18;
  const lightBase = isAmber ? 0.72 : 0.55;

  /* Gel fill — thick translucent colored gel inside the glass tube */
  const gelFill = isDark
    ? `linear-gradient(180deg,
        oklch(${lightBase + 0.12} ${chroma * 0.6} ${hue} / 45%) 0%,
        oklch(${lightBase + 0.04} ${chroma * 0.9} ${hue} / 55%) 30%,
        oklch(${lightBase} ${chroma} ${hue} / 60%) 50%,
        oklch(${lightBase - 0.06} ${chroma * 1.1} ${hue} / 55%) 70%,
        oklch(${lightBase - 0.12} ${chroma * 0.8} ${hue} / 45%) 100%)`
    : `linear-gradient(180deg,
        oklch(${lightBase + 0.16} ${chroma * 0.5} ${hue} / 50%) 0%,
        oklch(${lightBase + 0.06} ${chroma * 0.8} ${hue} / 60%) 30%,
        oklch(${lightBase} ${chroma} ${hue} / 65%) 50%,
        oklch(${lightBase - 0.04} ${chroma * 1.0} ${hue} / 60%) 70%,
        oklch(${lightBase - 0.10} ${chroma * 0.7} ${hue} / 50%) 100%)`;

  /* Glow color */
  const glowColor = isDark
    ? `oklch(${lightBase} ${chroma} ${hue} / 15%)`
    : `oklch(${lightBase} ${chroma} ${hue} / 10%)`;

  const trackH = 16;  /* Thicker glass tube */
  const fillH = 12;
  const fillOffset = (trackH - fillH) / 2;

  return (
    <div className="w-full" ref={ref}>
      {label && (
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-foreground/70 tracking-tight">{label}</span>
          <span className="text-[11px] font-mono text-muted-foreground/50 tabular-nums">{pct}%</span>
        </div>
      )}

      {/* Track container — thick glass tube */}
      <div className="relative w-full" style={{ height: trackH }}>
        {/* Glass tube background — visible depth and edge thickness */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: trackH / 2,
            background: isDark
              ? 'linear-gradient(180deg, oklch(0.10 0 0 / 15%) 0%, oklch(0.15 0 0 / 20%) 40%, oklch(0.12 0 0 / 15%) 100%)'
              : 'linear-gradient(180deg, oklch(0.50 0 0 / 6%) 0%, oklch(0.50 0 0 / 8%) 40%, oklch(0.50 0 0 / 6%) 100%)',
            border: 'none',
            boxShadow: isDark
              ? `inset 0 1px 3px oklch(0 0 0 / 20%),
                 0 0 1px oklch(1 0 0 / 4%)`
              : `inset 0 1px 3px oklch(0 0 0 / 6%),
                 0 0 1px oklch(0 0 0 / 4%)`,
          }}
        />

        {/* Gel fill — colored translucent gel inside the glass tube */}
        <div
          style={{
            position: 'absolute',
            top: fillOffset,
            left: fillOffset,
            height: fillH,
            width: `calc(${animPct}% - ${fillOffset}px)`,
            minWidth: animPct > 0 ? fillH : 0,
            borderRadius: fillH / 2,
            background: gelFill,
            transition: 'width 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
            overflow: 'hidden',
            border: 'none',
            boxShadow: `
              0 0 1px oklch(1 0 0 / 10%),
              0 1px 4px ${glowColor}
            `,
          }}
        >
          {/* Top specular highlight — gel surface catches light */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: '3%',
              right: '3%',
              height: '45%',
              borderRadius: 'inherit',
              background: 'linear-gradient(180deg, oklch(1 0 0 / 15%) 0%, oklch(1 0 0 / 0%) 100%)',
              pointerEvents: 'none',
            }}
          />
        </div>

        {/* Caustic glow beneath the filled portion */}
        {animPct > 0 && (
          <div
            style={{
              position: 'absolute',
              top: trackH,
              left: fillOffset,
              width: `calc(${animPct}% - ${fillOffset}px)`,
              height: 6,
              borderRadius: '50%',
              background: `radial-gradient(ellipse 80% 100% at 70% 0%, ${glowColor} 0%, transparent 80%)`,
              filter: 'blur(4px)',
              opacity: 0.5,
              transition: 'width 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
              pointerEvents: 'none',
            }}
          />
        )}
      </div>
    </div>
  );
}
