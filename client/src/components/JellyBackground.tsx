/**
 * JellyBackground — SVG Gooey Metaball Background + Jelly Cursor
 *
 * The cursor blobs now use theme-aware jelly colors (amber + teal)
 * that adapt to dark/light mode, matching the overall jelly design system.
 */
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useSpring, useMotionValue } from 'framer-motion';
import { useJellyMode } from '@/contexts/JellyModeContext';
import { useTheme } from '@/contexts/ThemeContext';

/* ─── Jelly Cursor ─── */
function JellyCursor() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const mouseX = useMotionValue(-200);
  const mouseY = useMotionValue(-200);

  const springX  = useSpring(mouseX, { stiffness: 120, damping: 12, mass: 1.0 });
  const springY  = useSpring(mouseY, { stiffness: 120, damping: 12, mass: 1.0 });
  const trailX   = useSpring(mouseX, { stiffness: 60,  damping: 18, mass: 1.5 });
  const trailY   = useSpring(mouseY, { stiffness: 60,  damping: 18, mass: 1.5 });
  const trail3X  = useSpring(mouseX, { stiffness: 35,  damping: 22, mass: 2.0 });
  const trail3Y  = useSpring(mouseY, { stiffness: 35,  damping: 22, mass: 2.0 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => { mouseX.set(e.clientX); mouseY.set(e.clientY); };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, [mouseX, mouseY]);

  /* Theme-aware cursor colors */
  const colors = isDark
    ? { main: 'oklch(0.62 0.18 230 / 70%)', trail: 'oklch(0.78 0.15 65 / 55%)', tail: 'oklch(0.55 0.16 230 / 45%)' }
    : { main: 'oklch(0.72 0.16 65 / 60%)',  trail: 'oklch(0.55 0.18 230 / 45%)', tail: 'oklch(0.75 0.12 65 / 35%)' };

  return (
    <div
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 9999, filter: 'url(#gooey-cursor)', opacity: 0.7 }}
    >
      {/* Main cursor blob */}
      <motion.div
        className="fixed pointer-events-none rounded-full"
        style={{
          x: springX, y: springY,
          width: 45, height: 45, marginLeft: -22, marginTop: -22,
          background: colors.main,
          willChange: 'transform',
        }}
      />
      {/* Trailing blob */}
      <motion.div
        className="fixed pointer-events-none rounded-full"
        style={{
          x: trailX, y: trailY,
          width: 60, height: 60, marginLeft: -30, marginTop: -30,
          background: colors.trail,
          willChange: 'transform',
        }}
      />
      {/* Third trailing blob */}
      <motion.div
        className="fixed pointer-events-none rounded-full"
        style={{
          x: trail3X, y: trail3Y,
          width: 35, height: 35, marginLeft: -17, marginTop: -17,
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
        opacity: isDark ? 0.3 : 0.2,
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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const onResize = () => setIsMobile(window.innerWidth < 768);
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
            {!isMobile && <JellyCursor />}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
