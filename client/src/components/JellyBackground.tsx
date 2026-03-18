/**
 * JellyBackground — SVG Gooey Metaball Background + Jelly Cursor
 *
 * Improvements:
 *   - Proper touch device detection (iPad, tablets, phones)
 *   - Cursor blob only on desktop with mouse (not touch)
 *   - Reduced opacity and size for less intrusive feel
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
  // Check for touch support
  const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  // Check for coarse pointer (touch screens)
  const hasCoarsePointer = window.matchMedia?.('(pointer: coarse)')?.matches;
  // Check for hover support (touch devices typically don't have hover)
  const hasNoHover = window.matchMedia?.('(hover: none)')?.matches;
  // iPad detection (iPadOS reports as Mac)
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
    ? { main: 'oklch(0.62 0.18 230 / 50%)', trail: 'oklch(0.78 0.15 65 / 35%)', tail: 'oklch(0.55 0.16 230 / 25%)' }
    : { main: 'oklch(0.72 0.16 65 / 40%)',  trail: 'oklch(0.55 0.18 230 / 30%)', tail: 'oklch(0.75 0.12 65 / 20%)' };

  return (
    <div
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 9999, filter: 'url(#gooey-cursor)', opacity: 0.5 }}
    >
      {/* Main cursor blob */}
      <motion.div
        className="fixed pointer-events-none rounded-full"
        style={{
          x: springX, y: springY,
          width: 36, height: 36, marginLeft: -18, marginTop: -18,
          background: colors.main,
          willChange: 'transform',
        }}
      />
      {/* Trailing blob */}
      <motion.div
        className="fixed pointer-events-none rounded-full"
        style={{
          x: trailX, y: trailY,
          width: 50, height: 50, marginLeft: -25, marginTop: -25,
          background: colors.trail,
          willChange: 'transform',
        }}
      />
      {/* Third trailing blob */}
      <motion.div
        className="fixed pointer-events-none rounded-full"
        style={{
          x: trail3X, y: trail3Y,
          width: 28, height: 28, marginLeft: -14, marginTop: -14,
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

  const colors = isDark ? {
    blob1: '#1e40af',
    blob2: '#0f766e',
    blob3: '#6d28d9',
    blob4: '#b45309',
    blob5: '#1e3a5f',
  } : {
    blob1: '#93c5fd',
    blob2: '#5eead4',
    blob3: '#c4b5fd',
    blob4: '#fcd34d',
    blob5: '#bae6fd',
  };

  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      style={{
        filter: 'url(#gooey-bg)',
        opacity: isDark ? 0.25 : 0.15,
        willChange: 'contents',
      }}
    >
      <div className="absolute rounded-full jelly-metaball-1"
        style={{ width: '30vw', height: '30vw', minWidth: 250, minHeight: 250, maxWidth: 600, maxHeight: 600,
          background: `radial-gradient(circle at 40% 40%, ${colors.blob1}, ${colors.blob1}dd)` }} />
      <div className="absolute rounded-full jelly-metaball-2"
        style={{ width: '25vw', height: '25vw', minWidth: 200, minHeight: 200, maxWidth: 500, maxHeight: 500,
          background: `radial-gradient(circle at 60% 30%, ${colors.blob2}, ${colors.blob2}dd)` }} />
      <div className="absolute rounded-full jelly-metaball-3"
        style={{ width: '20vw', height: '20vw', minWidth: 160, minHeight: 160, maxWidth: 400, maxHeight: 400,
          background: `radial-gradient(circle at 50% 50%, ${colors.blob3}, ${colors.blob3}dd)` }} />
      <div className="absolute rounded-full jelly-metaball-4"
        style={{ width: '22vw', height: '22vw', minWidth: 180, minHeight: 180, maxWidth: 450, maxHeight: 450,
          background: `radial-gradient(circle at 40% 60%, ${colors.blob4}, ${colors.blob4}dd)` }} />
      <div className="absolute rounded-full jelly-metaball-5"
        style={{ width: '35vw', height: '35vw', minWidth: 300, minHeight: 300, maxWidth: 700, maxHeight: 700,
          background: `radial-gradient(circle at 30% 70%, ${colors.blob5}, ${colors.blob5}dd)` }} />
    </div>
  );
}

export function JellyBackground() {
  const { jellyMode } = useJellyMode();
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    setIsTouch(isTouchDevice());
    // Re-check on resize (orientation change on tablets)
    const onResize = () => setIsTouch(isTouchDevice());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return (
    <>
      <svg className="absolute w-0 h-0" aria-hidden="true">
        <defs>
          <filter id="gooey-bg">
            <feGaussianBlur in="SourceGraphic" stdDeviation="25" result="blur" />
            <feColorMatrix in="blur" mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="gooey" />
            <feComposite in="SourceGraphic" in2="gooey" operator="atop" />
          </filter>
          <filter id="gooey-cursor">
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
            <feColorMatrix in="blur" mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -8" result="gooey" />
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
