/**
 * JellyBackground — SVG Gooey Metaball Background + Jelly Cursor
 *
 * Phase 2B follow-up: Surgical fix for overlay glitch
 *   - Reduced blob count from 5 → 3 (tuned for visible character without flooding)
 *   - Reduced blob sizes by ~40% (max 400px instead of 700px)
 *   - Lowered container opacity: light 0.15→0.07, dark 0.25→0.10
 *   - Softened gooey filter threshold: 18/-7 → 10/-4 (gentler alpha clipping)
 *   - Lowered JellyCursor z-index: 9999 → 40 (below navbar z-50)
 *   - Reduced cursor blob opacity: 0.5 → 0.35
 *   - Proper touch device detection (iPad, tablets, phones)
 *   - Cursor blob only on desktop with mouse (not touch)
 *   - Theme-aware jelly colors (amber + teal)
 */
import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence, useSpring, useMotionValue } from 'framer-motion';
import { useJellyMode } from '@/contexts/JellyModeContext';
import { useTheme } from '@/contexts/ThemeContext';

/**
 * Detect if the device is primarily touch-based.
 * This catches iPads, tablets, and phones — even iPads that report as desktop.
 */
function isTouchDevice(): boolean {
  if (typeof window === 'undefined') return false;
  const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  const hasCoarsePointer = window.matchMedia?.('(pointer: coarse)')?.matches;
  const hasNoHover = window.matchMedia?.('(hover: none)')?.matches;
  const isIPad = /iPad/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

  return isIPad || (hasTouch && (hasCoarsePointer || hasNoHover));
}

/* ─── Jelly Cursor ─── */
function JellyCursor() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const mouseX = useMotionValue(-200);
  const mouseY = useMotionValue(-200);

  const springX  = useSpring(mouseX, { stiffness: 100, damping: 14, mass: 1.0 });
  const springY  = useSpring(mouseY, { stiffness: 100, damping: 14, mass: 1.0 });
  const trailX   = useSpring(mouseX, { stiffness: 50,  damping: 20, mass: 1.5 });
  const trailY   = useSpring(mouseY, { stiffness: 50,  damping: 20, mass: 1.5 });
  const trail3X  = useSpring(mouseX, { stiffness: 30,  damping: 24, mass: 2.0 });
  const trail3Y  = useSpring(mouseY, { stiffness: 30,  damping: 24, mass: 2.0 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => { mouseX.set(e.clientX); mouseY.set(e.clientY); };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, [mouseX, mouseY]);

  /* Theme-aware cursor colors — more subtle */
  const colors = isDark
    ? { main: 'oklch(0.62 0.18 230 / 45%)', trail: 'oklch(0.78 0.15 65 / 30%)', tail: 'oklch(0.55 0.16 230 / 20%)' }
    : { main: 'oklch(0.72 0.16 65 / 35%)',  trail: 'oklch(0.55 0.18 230 / 25%)', tail: 'oklch(0.75 0.12 65 / 15%)' };

  return (
    <div
      className="fixed inset-0 pointer-events-none"
      style={{
        /* z-40: below navbar (z-50) so cursor blobs never cover controls */
        zIndex: 40,
        filter: 'url(#gooey-cursor)',
        opacity: 0.35,
      }}
    >
      {/* Main cursor blob */}
      <motion.div
        className="fixed pointer-events-none rounded-full"
        style={{
          x: springX, y: springY,
          width: 32, height: 32, marginLeft: -16, marginTop: -16,
          background: colors.main,
          willChange: 'transform',
        }}
      />
      {/* Trailing blob */}
      <motion.div
        className="fixed pointer-events-none rounded-full"
        style={{
          x: trailX, y: trailY,
          width: 44, height: 44, marginLeft: -22, marginTop: -22,
          background: colors.trail,
          willChange: 'transform',
        }}
      />
      {/* Third trailing blob */}
      <motion.div
        className="fixed pointer-events-none rounded-full"
        style={{
          x: trail3X, y: trail3Y,
          width: 24, height: 24, marginLeft: -12, marginTop: -12,
          background: colors.tail,
          willChange: 'transform',
        }}
      />
    </div>
  );
}

/* ─── Metaball Blobs ─── */
function MetaballBlobs() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  /*
   * 3 blobs instead of 5 — enough for visible jelly character
   * without creating dense overlapping regions that flood the viewport.
   * Colors are theme-aware: dark uses deeper tones, light uses softer pastels.
   */
  const colors = isDark ? {
    blob1: '#1e40af',
    blob2: '#0f766e',
    blob3: '#6d28d9',
  } : {
    blob1: '#93c5fd',
    blob2: '#5eead4',
    blob3: '#c4b5fd',
  };

  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      style={{
        filter: 'url(#gooey-bg)',
        /*
         * Opacity tuned so blobs are visible as ambient character
         * but never create a color wash that obscures content.
         * Light: 0.07 (was 0.15), Dark: 0.10 (was 0.25)
         */
        opacity: isDark ? 0.10 : 0.07,
        willChange: 'contents',
      }}
    >
      {/* Blob 1 — largest, drifts across upper-left quadrant */}
      <div className="absolute rounded-full jelly-metaball-1"
        style={{
          width: '22vw', height: '22vw',
          minWidth: 160, minHeight: 160,
          maxWidth: 400, maxHeight: 400,
          background: `radial-gradient(circle at 40% 40%, ${colors.blob1}, ${colors.blob1}cc)`,
        }} />
      {/* Blob 2 — medium, drifts across lower-right quadrant */}
      <div className="absolute rounded-full jelly-metaball-2"
        style={{
          width: '18vw', height: '18vw',
          minWidth: 140, minHeight: 140,
          maxWidth: 350, maxHeight: 350,
          background: `radial-gradient(circle at 60% 30%, ${colors.blob2}, ${colors.blob2}cc)`,
        }} />
      {/* Blob 3 — smallest, drifts across center */}
      <div className="absolute rounded-full jelly-metaball-3"
        style={{
          width: '15vw', height: '15vw',
          minWidth: 120, minHeight: 120,
          maxWidth: 300, maxHeight: 300,
          background: `radial-gradient(circle at 50% 50%, ${colors.blob3}, ${colors.blob3}cc)`,
        }} />
    </div>
  );
}

export function JellyBackground() {
  const { jellyMode } = useJellyMode();
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    setIsTouch(isTouchDevice());
    const onResize = () => setIsTouch(isTouchDevice());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return (
    <>
      <svg className="absolute w-0 h-0" aria-hidden="true">
        <defs>
          {/*
           * Gooey background filter — softened threshold.
           * Old: stdDeviation=25, alpha matrix 18/-7 (sharp edges, solid regions)
           * New: stdDeviation=20, alpha matrix 10/-4 (softer edges, more transparency)
           *
           * The alpha channel formula is: new_alpha = 10 * old_alpha - 4
           * Threshold at alpha > 0.4 (vs old 0.39), but the lower multiplier (10 vs 18)
           * means the transition from transparent to opaque is much more gradual,
           * preventing the hard solid-region effect that caused the color wash.
           */}
          <filter id="gooey-bg">
            <feGaussianBlur in="SourceGraphic" stdDeviation="20" result="blur" />
            <feColorMatrix in="blur" mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 10 -4" result="gooey" />
            <feComposite in="SourceGraphic" in2="gooey" operator="atop" />
          </filter>
          {/* Cursor gooey filter — slightly softened for consistency */}
          <filter id="gooey-cursor">
            <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur" />
            <feColorMatrix in="blur" mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 16 -6" result="gooey" />
            <feComposite in="SourceGraphic" in2="gooey" operator="atop" />
          </filter>
        </defs>
      </svg>

      <AnimatePresence>
        {jellyMode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <MetaballBlobs />
            {/* Only show cursor blob on non-touch devices */}
            {!isTouch && <JellyCursor />}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
