/*
 * HERO — Refined jelly physics
 * Subtle spring animations on interactive elements only.
 * Non-interactive text/badges have no hover effects.
 */
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useRef, useEffect, Suspense, lazy, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
import { ArrowDown, Download } from 'lucide-react';

const Spline = lazy(() => import('@splinetool/react-spline'));

/* Subtle spring for buttons */
const btnSpring = { type: 'spring' as const, stiffness: 200, damping: 15, mass: 0.8 } as const;

/* Stagger with entrance */
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
};

const jellyChild = {
  hidden: {
    opacity: 0,
    y: 60,
    scaleX: 0.85,
    scaleY: 1.18,
    rotate: -3,
  },
  visible: {
    opacity: 1,
    y: 0,
    scaleX: 1,
    scaleY: 1,
    rotate: 0,
    transition: {
      type: 'spring' as const,
      stiffness: 140,
      damping: 10,
      mass: 1,
    },
  },
};

export function HeroSection() {
  const ref = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const blob1Ref = useRef<HTMLDivElement>(null);
  const blob2Ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.5], [0, 80]);
  const scrollSkew = useTransform(scrollYProgress, [0, 0.3, 0.5], [0, -1, 0]);
  const scrollScaleX = useTransform(scrollYProgress, [0, 0.25, 0.5], [1, 1.01, 0.99]);
  const scrollScaleY = useTransform(scrollYProgress, [0, 0.25, 0.5], [1, 0.99, 1.01]);
  const springSkew = useSpring(scrollSkew, { stiffness: 80, damping: 15 });
  const springSX = useSpring(scrollScaleX, { stiffness: 80, damping: 15 });
  const springSY = useSpring(scrollScaleY, { stiffness: 80, damping: 15 });

  // GSAP text mask reveal on the name
  useEffect(() => {
    if (!nameRef.current) return;

    gsap.fromTo(
      nameRef.current,
      { clipPath: 'inset(0 100% 0 0)' },
      {
        clipPath: 'inset(0 0% 0 0)',
        duration: 1.2,
        ease: 'power3.out',
        delay: 0.3,
      }
    );

    // Parallax on blobs
    [blob1Ref.current, blob2Ref.current].forEach((blob, i) => {
      if (!blob) return;
      gsap.to(blob, {
        y: i === 0 ? -80 : -50,
        ease: 'none',
        scrollTrigger: {
          trigger: ref.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === ref.current) st.kill();
      });
    };
  }, []);

  const onSplineLoad = useCallback((splineApp: any) => {
    try {
      if (typeof splineApp?.setBackgroundColor === 'function') {
        splineApp.setBackgroundColor('rgba(0,0,0,0)');
      }
      if (splineApp?._scene?.background) splineApp._scene.background = null;
      if (splineApp?._renderer) {
        const r = splineApp._renderer;
        if (typeof r.setClearColor === 'function') r.setClearColor(0x000000, 0);
        if (typeof r.setClearAlpha === 'function') r.setClearAlpha(0);
      }
      document.querySelectorAll('#hero canvas').forEach((c) => {
        (c as HTMLCanvasElement).style.background = 'transparent';
      });
    } catch (e) {
      console.warn('Could not set Spline transparent bg:', e);
    }
  }, []);

  return (
    <section ref={ref} id="hero" className="relative min-h-screen flex items-center overflow-hidden">
      {/* Floating blobs — background decoration */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          ref={blob1Ref}
          className="absolute w-[500px] h-[500px] -top-32 -left-32 jelly-float-blob-1 opacity-30"
          style={{
            background: 'radial-gradient(ellipse, oklch(0.55 0.18 230 / 15%) 0%, transparent 70%)',
            borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%',
          }}
        />
        <div
          ref={blob2Ref}
          className="absolute w-[400px] h-[400px] -bottom-20 -right-20 jelly-float-blob-2 opacity-25"
          style={{
            background: 'radial-gradient(ellipse, oklch(0.75 0.15 65 / 12%) 0%, transparent 70%)',
            borderRadius: '40% 60% 70% 30% / 50% 40% 60% 50%',
          }}
        />
        <div
          className="absolute w-[300px] h-[300px] top-1/3 left-1/3 jelly-float-blob-1 opacity-15"
          style={{
            background: 'radial-gradient(ellipse, oklch(0.60 0.14 200 / 10%) 0%, transparent 70%)',
            borderRadius: '50% 60% 30% 60% / 30% 60% 70% 40%',
            animationDelay: '-3s',
          }}
        />
      </div>

      <motion.div
        style={{ opacity, y, skewX: springSkew, scaleX: springSX, scaleY: springSY }}
        className="container relative z-10 pt-24 pb-20"
      >
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-8 items-center min-h-[65vh]">
          {/* Left column — text content */}
          <motion.div variants={stagger} initial="hidden" animate="visible" className="lg:col-span-3 flex flex-col gap-8">
            {/* Status pill */}
            <motion.div variants={jellyChild}>
              <div className="glass-pill inline-flex items-center gap-2.5 px-4 py-2">
                <span
                  className="w-2.5 h-2.5 rounded-full animate-jelly-pulse"
                  style={{
                    background: 'radial-gradient(circle at 35% 35%, oklch(0.80 0.16 155), oklch(0.60 0.20 155))',
                    boxShadow: '0 0 14px oklch(0.65 0.20 155 / 60%)',
                  }}
                />
                <span className="text-[11px] font-medium text-muted-foreground tracking-wide">
                  Open to opportunities
                </span>
              </div>
            </motion.div>

            {/* Name */}
            <motion.div variants={jellyChild}>
              <h1 ref={nameRef} className="text-4xl sm:text-5xl md:text-6xl lg:text-[5.5rem] font-bold tracking-[-0.03em] leading-[1.02]">
                <span className="text-foreground inline-block">Hardik</span>
                <br />
                <span
                  className="bg-clip-text text-transparent inline-block"
                  style={{
                    backgroundImage: 'linear-gradient(135deg, var(--jelly-teal) 0%, oklch(0.65 0.16 200) 40%, var(--jelly-amber) 100%)',
                  }}
                >
                  Lukhi
                </span>
              </h1>
            </motion.div>

            {/* Role */}
            <motion.div variants={jellyChild} className="flex flex-col gap-3">
              <p className="text-lg sm:text-xl font-semibold text-foreground/80 leading-relaxed tracking-[-0.01em]">
                Project Manager | Senior Mechanical Engineer
              </p>
              <p className="text-[11px] sm:text-xs font-medium text-foreground/50 tracking-wide mb-1">
                Hardware Sustainment & Test Engineering
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-lg">
                Results-driven Hardware Engineer and Project Manager with 8+ years of experience in product design, prototyping, and hardware sustainment across consumer electronics and medical devices. Proven track record of leading cross-functional teams, driving root cause analysis, and delivering manufacturing test solutions that improve efficiency and product reliability. Expertise in NPI, DfX, failure analysis, and test automation with hands-on experience supporting cutting-edge wearable technology at Meta.
              </p>
            </motion.div>

            {/* CTA buttons — subtle hover only on buttons */}
            <motion.div variants={jellyChild} className="flex items-center gap-3 flex-wrap pt-1">
              <motion.a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
                }}
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                transition={btnSpring}
                className="jelly-btn jelly-btn-teal no-underline"
              >
                Say Hello
              </motion.a>
              <motion.a
                href="#projects"
                onClick={(e) => {
                  e.preventDefault();
                  document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' });
                }}
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                transition={btnSpring}
                className="jelly-btn jelly-btn-ghost no-underline"
              >
                <Download size={13} />
                View Work
              </motion.a>
              <motion.a
                href="https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/XdtJXnjxMmagBvkJKoy2Gc/Hardik_Lukhi_Resume_8631b7c4.pdf"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                transition={btnSpring}
                className="jelly-btn jelly-btn-ghost no-underline"
              >
                <Download size={13} />
                Resume
              </motion.a>
            </motion.div>

            {/* Company pills — no hover animation, just static */}
            <motion.div variants={jellyChild} className="flex items-center gap-2 sm:gap-2.5 pt-2 flex-wrap">
              {[
                { name: 'Meta', active: true },
                { name: 'Stryker', active: false },
                { name: 'Abbott', active: false },
                { name: 'Terumo', active: false },
              ].map((c) => (
                <span
                  key={c.name}
                  className={`text-[10px] sm:text-xs font-medium px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl cursor-default ${
                    c.active ? 'jelly-badge-teal' : 'glass-pill text-foreground/60'
                  }`}
                >
                  {c.name}
                </span>
              ))}
            </motion.div>
          </motion.div>

          {/* Right column — Spline 3D */}
          <motion.div
            initial={{ opacity: 0, scale: 0.7, rotate: -5, scaleX: 0.8, scaleY: 1.2 }}
            animate={{ opacity: 1, scale: 1, rotate: 0, scaleX: 1, scaleY: 1 }}
            transition={{ type: 'spring', stiffness: 100, damping: 10, mass: 1.5, delay: 0.3 }}
            className="lg:col-span-2 relative h-[380px] sm:h-[440px] lg:h-[520px] hidden md:block"
          >
            <div
              className="absolute inset-0 pointer-events-none z-0"
              style={{
                background: `
                  radial-gradient(ellipse 80% 60% at 50% 50%, oklch(0.55 0.18 230 / 10%) 0%, transparent 70%),
                  radial-gradient(ellipse 60% 50% at 60% 70%, oklch(0.75 0.15 65 / 7%) 0%, transparent 60%)
                `,
              }}
            />
            <Suspense
              fallback={
                <div className="w-full h-full flex items-center justify-center">
                  <motion.div
                    animate={{
                      scale: [1, 1.3, 1],
                      opacity: [0.3, 0.7, 0.3],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-24 h-24"
                    style={{
                      background: 'radial-gradient(circle, oklch(0.55 0.18 230 / 25%) 0%, transparent 70%)',
                    }}
                  />
                </div>
              }
            >
              <div className="spline-container w-full h-full relative z-10">
                <Spline
                  scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
                  className="w-full h-full"
                  onLoad={onSplineLoad}
                  style={{ background: 'transparent' }}
                />
              </div>
            </Suspense>
            <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background via-background/80 to-transparent pointer-events-none z-20" />
            <div className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-b from-background via-background/50 to-transparent pointer-events-none z-20" />
            <div className="absolute top-0 bottom-0 left-0 w-28 bg-gradient-to-r from-background via-background/50 to-transparent pointer-events-none z-20" />
            <div className="absolute top-0 bottom-0 right-0 w-28 bg-gradient-to-l from-background via-background/50 to-transparent pointer-events-none z-20" />
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0, y: 20, scaleY: 1.3 }}
          animate={{ opacity: 1, y: 0, scaleY: 1 }}
          transition={{ type: 'spring' as const, stiffness: 150, damping: 8, mass: 1.2, delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
        >
          <span className="text-[10px] font-mono text-muted-foreground/30 uppercase tracking-[0.2em]">
            Scroll
          </span>
          <motion.div
            animate={{ y: [0, 10, 0], scaleY: [1, 0.85, 1], scaleX: [1, 1.15, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="flex flex-col items-center gap-1"
          >
            <div
              className="w-5 h-8 rounded-full flex items-start justify-center pt-1.5"
              style={{ border: '1.5px solid oklch(0.50 0.005 80 / 20%)' }}
            >
              <motion.div
                animate={{ y: [0, 10, 0], opacity: [1, 0.3, 1], scaleY: [1, 1.5, 1] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                className="w-1.5 h-2 rounded-full"
                style={{ background: 'var(--jelly-teal)' }}
              />
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
