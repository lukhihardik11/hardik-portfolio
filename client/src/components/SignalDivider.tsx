/*
 * SIGNAL DIVIDER — GSAP line-draw animation
 * Horizontal divider with animated line drawing on scroll.
 */
import { motion } from 'framer-motion';
import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function SignalDivider() {
  const containerRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Line draw-in
    if (lineRef.current) {
      gsap.fromTo(
        lineRef.current,
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: container,
            start: 'top 85%',
          },
        }
      );
    }

    // Center dot pop-in
    if (dotRef.current) {
      gsap.fromTo(
        dotRef.current,
        { scale: 0 },
        {
          scale: 1,
          duration: 0.5,
          delay: 0.3,
          ease: 'back.out(2)',
          scrollTrigger: {
            trigger: container,
            start: 'top 85%',
          },
        }
      );
    }

    return () => {
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === container) st.kill();
      });
    };
  }, []);

  return (
    <div ref={containerRef} className="relative py-8 overflow-hidden flex items-center justify-center">
      <div
        ref={lineRef}
        className="w-full max-w-[240px] jelly-divider"
        style={{ transform: 'scaleX(0)' }}
      />
      <div
        ref={dotRef}
        className="absolute jelly-dot jelly-dot-teal"
        style={{ width: 8, height: 8, transform: 'scale(0)' }}
      />
    </div>
  );
}

export function JellyDivider({ color = 'teal' }: { color?: 'teal' | 'amber' }) {
  return (
    <div className="relative py-8 overflow-hidden flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scaleX: 0, scaleY: 2 }}
        whileInView={{ opacity: 1, scaleX: 1, scaleY: 1 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ type: 'spring' as const, stiffness: 100, damping: 10, mass: 1.5 }}
        className="w-full max-w-[200px] jelly-divider"
      />
      <div
        className={`absolute jelly-dot ${color === 'teal' ? 'jelly-dot-teal' : 'jelly-dot-amber'}`}
        style={{ width: 8, height: 8 }}
      />
    </div>
  );
}
