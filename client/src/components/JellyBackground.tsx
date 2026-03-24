/**
 * JellyBackground — SVG Gooey Metaball Background + Jelly Cursor
 *
 * REWRITE: Fix-forward strategy for toggle contamination
 * Root cause: AnimatePresence mount/unmount of MetaballBlobs during theme/jelly
 * toggles created stale GPU paint layers on mobile compositors.
 *
 * Fix approach:
 * 1. REMOVE AnimatePresence for blob mount/unmount — blobs are always in DOM
 * 2. Use CSS opacity transition to show/hide blobs (no mount/unmount cycle)
 * 3. Force reflow after theme changes to flush compositor
 * 4. Restore proper blob colors, gradients, and animations
 * 5. Re-enable gooey SVG filter with mobile-safe settings
 * 6. Use fixed positioning (original) with proper z-indexing
 * 7. Keep cursor blob desktop-only via CSS media query + JS check
 */
import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';
import { useJellyMode } from '@/contexts/JellyModeContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useFineHover } from '@/hooks/useFineHover';

/**
 * Detect if the device is primarily touch-based.
 * Catches iPads, tablets, and phones — even iPads that report as desktop.
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

/* ─── Jelly Cursor (desktop only) ─── */
function JellyCursor({ visible }: { visible: boolean }) {
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
    if (!visible) return;
    const onMove = (e: MouseEvent) => { mouseX.set(e.clientX); mouseY.set(e.clientY); };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, [mouseX, mouseY, visible]);

  const colors = isDark
    ? { main: 'oklch(0.62 0.18 230 / 45%)', trail: 'oklch(0.78 0.15 65 / 30%)', tail: 'oklch(0.55 0.16 230 / 20%)' }
    : { main: 'oklch(0.72 0.16 65 / 35%)',  trail: 'oklch(0.55 0.18 230 / 25%)', tail: 'oklch(0.75 0.12 65 / 15%)' };

  return (
    <div
      className="fixed inset-0 pointer-events-none"
      style={{
        zIndex: 40,
        filter: 'url(#gooey-cursor)',
        opacity: visible ? 0.35 : 0,
        transition: 'opacity 0.4s ease',
      }}
    >
      <motion.div
        className="fixed pointer-events-none rounded-full"
        style={{
          x: springX, y: springY,
          width: 32, height: 32, marginLeft: -16, marginTop: -16,
          background: colors.main,
        }}
      />
      <motion.div
        className="fixed pointer-events-none rounded-full"
        style={{
          x: trailX, y: trailY,
          width: 44, height: 44, marginLeft: -22, marginTop: -22,
          background: colors.trail,
        }}
      />
      <motion.div
        className="fixed pointer-events-none rounded-full"
        style={{
          x: trail3X, y: trail3Y,
          width: 24, height: 24, marginLeft: -12, marginTop: -12,
          background: colors.tail,
        }}
      />
    </div>
  );
}

/* ─── Metaball Blobs (always in DOM, visibility controlled by CSS opacity) ─── */
function MetaballBlobs({ visible, isFine }: { visible: boolean; isFine: boolean }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const containerRef = useRef<HTMLDivElement>(null);

  /*
   * Theme-aware blob colors — rich gradients restored.
   * Dark mode: deeper, more saturated tones
   * Light mode: softer pastels
   */
  const colors = isDark ? {
    blob1: 'radial-gradient(circle at 40% 30%, #3b82f6, #1e40af)',
    blob2: 'radial-gradient(circle at 60% 30%, #14b8a6, #0f766e)',
    blob3: 'radial-gradient(circle at 50% 50%, #8b5cf6, #6d28d9)',
  } : {
    blob1: 'radial-gradient(circle at 40% 30%, #bfdbfe, #93c5fd)',
    blob2: 'radial-gradient(circle at 60% 30%, #99f6e4, #5eead4)',
    blob3: 'radial-gradient(circle at 50% 50%, #ddd6fe, #c4b5fd)',
  };

  /*
   * CRITICAL FIX: Force reflow after theme change to flush mobile compositor.
   * This prevents stale paint layers from persisting after CSS variable updates.
   */
  useEffect(() => {
    if (containerRef.current) {
      // Force synchronous layout recalculation
      void containerRef.current.offsetHeight;
    }
  }, [theme]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      style={{
        /*
         * Gooey filter re-enabled with mobile-safe settings.
         * The filter creates the organic metaball merging effect.
         * Softened threshold prevents hard color wash.
         */
        /* SVG gooey filter disabled on touch devices — too expensive for mobile GPUs
           and causes compositor artifacts during scroll */
        filter: (visible && isFine) ? 'url(#gooey-bg)' : 'none',
        /*
         * KEY FIX: Use CSS opacity transition instead of AnimatePresence mount/unmount.
         * This keeps blobs in the DOM at all times, preventing the stale paint layer
         * issue that caused toggle contamination on mobile.
         */
        opacity: visible ? (isDark ? 0.22 : 0.18) : 0,
        transition: 'opacity 0.6s ease-out, filter 0.3s ease',
        willChange: 'opacity',
      }}
    >
      {/* Blob 1 — largest, drifts across upper-left quadrant */}
      <div className="absolute rounded-full jelly-metaball-1"
        style={{
          width: '22vw', height: '22vw',
          minWidth: 160, minHeight: 160,
          maxWidth: 400, maxHeight: 400,
          background: colors.blob1,
        }} />
      {/* Blob 2 — medium, drifts across lower-right quadrant */}
      <div className="absolute rounded-full jelly-metaball-2"
        style={{
          width: '18vw', height: '18vw',
          minWidth: 140, minHeight: 140,
          maxWidth: 350, maxHeight: 350,
          background: colors.blob2,
        }} />
      {/* Blob 3 — smallest, drifts across center */}
      <div className="absolute rounded-full jelly-metaball-3"
        style={{
          width: '15vw', height: '15vw',
          minWidth: 120, minHeight: 120,
          maxWidth: 300, maxHeight: 300,
          background: colors.blob3,
        }} />
    </div>
  );
}

export function JellyBackground() {
  const { jellyMode } = useJellyMode();
  const { theme } = useTheme();
  const isFineHover = useFineHover();
  const [isTouch, setIsTouch] = useState(false);
  const prevThemeRef = useRef(theme);

  useEffect(() => {
    setIsTouch(isTouchDevice());
    const onResize = () => setIsTouch(isTouchDevice());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  /*
   * CRITICAL FIX: Force global reflow on theme change.
   * Mobile browsers (especially WebKit/Blink on Android/iOS) can retain
   * stale compositor layers when CSS custom properties change.
   * This forces the browser to recalculate all styles and repaint.
   */
  useEffect(() => {
    if (prevThemeRef.current !== theme) {
      prevThemeRef.current = theme;
      // Force synchronous reflow to flush stale compositor state
      requestAnimationFrame(() => {
        void document.documentElement.offsetHeight;
      });
    }
  }, [theme]);

  return (
    <>
      <svg className="absolute w-0 h-0" aria-hidden="true">
        <defs>
          {/*
           * Gooey background filter — softened for mobile safety.
           * stdDeviation=18 (was 20): slightly tighter blur for cleaner edges
           * Alpha matrix 12/-5: moderate threshold, gradual transition
           * This creates organic blob merging without the hard color wash.
           */}
          <filter id="gooey-bg">
            <feGaussianBlur in="SourceGraphic" stdDeviation="18" result="blur" />
            <feColorMatrix in="blur" mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 12 -5" result="gooey" />
            <feComposite in="SourceGraphic" in2="gooey" operator="atop" />
          </filter>
          {/* Cursor gooey filter */}
          <filter id="gooey-cursor">
            <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur" />
            <feColorMatrix in="blur" mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 16 -6" result="gooey" />
            <feComposite in="SourceGraphic" in2="gooey" operator="atop" />
          </filter>
        </defs>
      </svg>

      {/*
       * KEY ARCHITECTURAL CHANGE:
       * Blobs are ALWAYS mounted in the DOM. Visibility is controlled by CSS opacity.
       * This eliminates the AnimatePresence mount/unmount cycle that caused
       * stale paint layers and toggle contamination on mobile browsers.
       */}
      <MetaballBlobs visible={jellyMode} isFine={isFineHover} />
      {/* Cursor blob: always mounted on desktop, visibility controlled by CSS */}
      {!isTouch && <JellyCursor visible={jellyMode} />}
    </>
  );
}
