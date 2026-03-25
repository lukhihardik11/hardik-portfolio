/**
 * JellySlider — Premium thick gel capsule skill bars.
 *
 * Design:
 *   - Track is a thick frosted glass tube with visible depth
 *   - Fill is a rich colored gel capsule that sits inside the tube
 *   - Specular highlight strip on top of the fill for 3D convex feel
 *   - Colored glow beneath the filled portion
 *   - Smooth scroll-triggered animation with elastic easing
 */
import { useEffect, useRef, useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useJellyMode } from '@/contexts/JellyModeContext';

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
  const { jellyMode } = useJellyMode();
  const [isHovered, setIsHovered] = useState(false);

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
    const t = setTimeout(() => setAnimPct(pct), 150);
    return () => clearTimeout(t);
  }, [visible, pct]);

  /* ── Color system ── */
  const hue = isAmber ? 65 : 230;
  const chroma = isAmber ? 0.15 : 0.18;
  const lightBase = isAmber ? 0.72 : 0.55;

  /* Gel fill — thick translucent colored gel inside the glass tube */
  const gelFill = isDark
    ? `linear-gradient(180deg,
        oklch(${lightBase + 0.15} ${chroma * 0.5} ${hue} / 55%) 0%,
        oklch(${lightBase + 0.05} ${chroma * 0.85} ${hue} / 70%) 25%,
        oklch(${lightBase} ${chroma} ${hue} / 75%) 50%,
        oklch(${lightBase - 0.05} ${chroma * 1.1} ${hue} / 70%) 75%,
        oklch(${lightBase - 0.12} ${chroma * 0.7} ${hue} / 55%) 100%)`
    : `linear-gradient(180deg,
        oklch(${lightBase + 0.18} ${chroma * 0.4} ${hue} / 60%) 0%,
        oklch(${lightBase + 0.08} ${chroma * 0.75} ${hue} / 70%) 25%,
        oklch(${lightBase} ${chroma} ${hue} / 75%) 50%,
        oklch(${lightBase - 0.04} ${chroma * 1.0} ${hue} / 70%) 75%,
        oklch(${lightBase - 0.10} ${chroma * 0.6} ${hue} / 60%) 100%)`;

  /* Glow color */
  const glowColor = isDark
    ? `oklch(${lightBase} ${chroma} ${hue} / 20%)`
    : `oklch(${lightBase} ${chroma} ${hue} / 15%)`;

  const trackH = 20;  /* Thick glass tube */
  const fillH = 14;
  const fillOffset = (trackH - fillH) / 2;

  return (
    <div
      className="w-full"
      ref={ref}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        cursor: jellyMode ? 'pointer' : 'default',
      }}
    >
      {label && (
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-[11px] sm:text-xs font-medium text-foreground/75 tracking-tight">{label}</span>
          <span className="text-[10px] sm:text-[11px] font-mono text-muted-foreground/50 tabular-nums">{pct}%</span>
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
              ? 'linear-gradient(180deg, oklch(0.08 0 0 / 30%) 0%, oklch(0.14 0 0 / 35%) 40%, oklch(0.10 0 0 / 30%) 100%)'
              : 'linear-gradient(180deg, oklch(0.50 0 0 / 5%) 0%, oklch(0.50 0 0 / 8%) 40%, oklch(0.50 0 0 / 5%) 100%)',
            border: isDark
              ? '1px solid oklch(1 0 0 / 5%)'
              : '1px solid oklch(0 0 0 / 5%)',
            boxShadow: isDark
              ? `inset 0 2px 4px oklch(0 0 0 / 30%),
                 inset 0 -1px 2px oklch(1 0 0 / 4%),
                 0 0 1px oklch(1 0 0 / 3%)`
              : `inset 0 2px 4px oklch(0 0 0 / 8%),
                 inset 0 -1px 2px oklch(1 0 0 / 30%),
                 0 0 1px oklch(0 0 0 / 3%)`,
          }}
        />

        {/* Gel fill — colored translucent gel inside the glass tube */}
        <div
          style={{
            position: 'absolute',
            top: fillOffset,
            left: fillOffset,
            height: fillH,
            width: `calc(${animPct}% - ${fillOffset * 2}px)`,
            minWidth: animPct > 0 ? fillH : 0,
            borderRadius: fillH / 2,
            background: gelFill,
            transition: 'width 1.4s cubic-bezier(0.34, 1.56, 0.64, 1), transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
            transform: jellyMode && isHovered ? 'scaleY(1.15) scaleX(1.01) translateZ(0)' : 'scaleY(1) scaleX(1) translateZ(0)',
            willChange: jellyMode ? 'transform' : 'auto',
            overflow: 'hidden',
            border: isDark
              ? '1px solid oklch(1 0 0 / 8%)'
              : '1px solid oklch(1 0 0 / 20%)',
            boxShadow: `
              inset 0 1px 3px oklch(1 0 0 / 15%),
              inset 0 -1px 2px oklch(0 0 0 / 8%),
              0 1px 6px ${glowColor}
            `,
          }}
        >
          {/* Top specular highlight — gel surface catches light */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: '2%',
              right: '2%',
              height: '45%',
              borderRadius: 'inherit',
              background: 'linear-gradient(180deg, oklch(1 0 0 / 30%) 0%, oklch(1 0 0 / 5%) 100%)',
              pointerEvents: 'none',
            }}
          />
        </div>

        {/* Caustic glow beneath the filled portion */}
        {animPct > 0 && (
          <div
            style={{
              position: 'absolute',
              top: trackH + 1,
              left: fillOffset,
              width: `calc(${animPct}% - ${fillOffset * 2}px)`,
              height: 8,
              borderRadius: '50%',
              background: `radial-gradient(ellipse 80% 100% at 60% 0%, ${glowColor} 0%, transparent 80%)`,
              filter: 'blur(5px)',
              opacity: 0.6,
              transition: 'width 1.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
              pointerEvents: 'none',
            }}
          />
        )}
      </div>
    </div>
  );
}
