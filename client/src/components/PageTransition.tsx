/*
 * PageTransition — GSAP-powered page transition wrapper.
 * Provides a smooth fade + slide animation when navigating between routes.
 */
import { useRef, useEffect, useState, type ReactNode } from 'react';
import { useLocation } from 'wouter';
import gsap from 'gsap';

interface PageTransitionProps {
  children: ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [location] = useLocation();
  const prevLocation = useRef(location);
  const [displayChildren, setDisplayChildren] = useState(children);
  const isFirstRender = useRef(true);

  useEffect(() => {
    // Skip animation on first render
    if (isFirstRender.current) {
      isFirstRender.current = false;
      prevLocation.current = location;
      return;
    }

    // Only animate if the route actually changed
    if (prevLocation.current === location) return;
    prevLocation.current = location;

    const container = containerRef.current;
    const overlay = overlayRef.current;
    if (!container || !overlay) return;

    // Create transition timeline
    const tl = gsap.timeline();

    // Phase 1: Overlay slides in from bottom
    tl.to(overlay, {
      y: '0%',
      duration: 0.35,
      ease: 'power3.in',
    });

    // Phase 2: Swap content while overlay covers the screen
    tl.call(() => {
      setDisplayChildren(children);
      window.scrollTo(0, 0);
    });

    // Phase 3: Overlay slides out to top
    tl.to(overlay, {
      y: '-100%',
      duration: 0.35,
      ease: 'power3.out',
      delay: 0.05,
    });

    // Phase 4: Reset overlay position for next transition
    tl.set(overlay, { y: '100%' });

    return () => {
      tl.kill();
    };
  }, [location, children]);

  // Update children immediately if location hasn't changed (e.g., re-renders)
  useEffect(() => {
    if (prevLocation.current === location) {
      setDisplayChildren(children);
    }
  }, [children, location]);

  return (
    <div ref={containerRef} className="relative">
      {displayChildren}
      {/* Transition overlay */}
      <div
        ref={overlayRef}
        className="fixed inset-0 z-[9999] pointer-events-none"
        style={{
          transform: 'translateY(100%)',
          background: 'var(--background, #0a0a0a)',
        }}
      />
    </div>
  );
}
