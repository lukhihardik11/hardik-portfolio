/**
 * JellyBackground — Ambient Metaball Background + Jelly Cursor
 *
 * PR #11: COMPLETE FIX for washed-out page and Android compositor artifacts.
 *
 * Previous attempts (PR #9, #10) tried:
 * - Removing SVG filters (helped but wash persisted from blob opacity + blur)
 * - Setting animation: none on mobile (CSS specificity issue — stylesheet animation
 *   property still caused compositor layer creation on Android)
 *
 * This fix:
 * 1. MOBILE: MetaballBlobs returns NULL. Zero fixed-position elements rendered.
 *    No blobs, no blur, no compositor layers, no artifacts. Period.
 * 2. DESKTOP: Blob opacity reduced from 0.15-0.20 to 0.06-0.10, blur reduced
 *    from 25px to 18px. Blobs are barely perceptible ambient glows, not visible
 *    colored washes.
 * 3. CURSOR: Desktop-only, unchanged (individual elements with CSS blur).
 */
import { useEffect, useRef, useState } from 'react';
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
    ? { main: 'oklch(0.62 0.18 230 / 40%)', trail: 'oklch(0.78 0.15 65 / 25%)', tail: 'oklch(0.55 0.16 230 / 15%)' }
    : { main: 'oklch(0.72 0.16 65 / 30%)',  trail: 'oklch(0.55 0.18 230 / 20%)', tail: 'oklch(0.75 0.12 65 / 12%)' };

  return (
    <>
      <motion.div
        className="fixed pointer-events-none rounded-full"
        style={{
          x: springX, y: springY,
          width: 32, height: 32, marginLeft: -16, marginTop: -16,
          background: colors.main,
          filter: 'blur(12px)',
          opacity: visible ? 0.30 : 0,
          transition: 'opacity 0.4s ease',
          zIndex: 40,
        }}
      />
      <motion.div
        className="fixed pointer-events-none rounded-full"
        style={{
          x: trailX, y: trailY,
          width: 44, height: 44, marginLeft: -22, marginTop: -22,
          background: colors.trail,
          filter: 'blur(16px)',
          opacity: visible ? 0.25 : 0,
          transition: 'opacity 0.4s ease',
          zIndex: 40,
        }}
      />
      <motion.div
        className="fixed pointer-events-none rounded-full"
        style={{
          x: trail3X, y: trail3Y,
          width: 24, height: 24, marginLeft: -12, marginTop: -12,
          background: colors.tail,
          filter: 'blur(10px)',
          opacity: visible ? 0.20 : 0,
          transition: 'opacity 0.4s ease',
          zIndex: 40,
        }}
      />
    </>
  );
}

/* ─── Metaball Blobs — DESKTOP ONLY ─── */
function MetaballBlobs({ visible }: { visible: boolean }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  /*
   * Theme-aware blob colors — rich gradients.
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
   * DRASTICALLY reduced opacity — blobs should be barely perceptible
   * ambient glows, NOT visible colored areas that wash out the page.
   * Previous values (0.15-0.20) were way too high with blur(25px).
   */
  const blobOpacity = visible ? (isDark ? 0.08 : 0.06) : 0;

  return (
    <>
      {/* Blob 1 — largest, drifts across upper-left quadrant */}
      <div
        className="fixed pointer-events-none rounded-full jelly-metaball-1"
        style={{
          width: '22vw', height: '22vw',
          minWidth: 160, minHeight: 160,
          maxWidth: 400, maxHeight: 400,
          background: colors.blob1,
          filter: 'blur(18px)',
          opacity: blobOpacity,
          transition: 'opacity 0.6s ease-out',
          zIndex: 0,
        }}
      />
      {/* Blob 2 — medium, drifts across lower-right quadrant */}
      <div
        className="fixed pointer-events-none rounded-full jelly-metaball-2"
        style={{
          width: '18vw', height: '18vw',
          minWidth: 140, minHeight: 140,
          maxWidth: 350, maxHeight: 350,
          background: colors.blob2,
          filter: 'blur(18px)',
          opacity: blobOpacity,
          transition: 'opacity 0.6s ease-out',
          zIndex: 0,
        }}
      />
      {/* Blob 3 — smallest, drifts across center */}
      <div
        className="fixed pointer-events-none rounded-full jelly-metaball-3"
        style={{
          width: '15vw', height: '15vw',
          minWidth: 120, minHeight: 120,
          maxWidth: 300, maxHeight: 300,
          background: colors.blob3,
          filter: 'blur(18px)',
          opacity: blobOpacity,
          transition: 'opacity 0.6s ease-out',
          zIndex: 0,
        }}
      />
    </>
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
   * Force global reflow on theme change.
   * Mobile browsers can retain stale compositor layers when CSS custom
   * properties change. This forces the browser to recalculate all styles.
   */
  useEffect(() => {
    if (prevThemeRef.current !== theme) {
      prevThemeRef.current = theme;
      requestAnimationFrame(() => {
        void document.documentElement.offsetHeight;
      });
    }
  }, [theme]);

  return (
    <>
      {/*
       * MOBILE: Render NOTHING. Zero fixed-position elements.
       * Any fixed-position element on Android causes compositor tile
       * invalidation during scroll, leading to dark rectangular artifacts.
       *
       * DESKTOP: Render ambient blobs + cursor with CSS blur.
       * Blob opacity is very low (0.06-0.08) to prevent wash.
       */}

      {/* Ambient background blobs — DESKTOP ONLY */}
      {isFineHover && <MetaballBlobs visible={jellyMode} />}

      {/* Cursor blobs — DESKTOP ONLY */}
      {!isTouch && isFineHover && <JellyCursor visible={jellyMode} />}
    </>
  );
}
