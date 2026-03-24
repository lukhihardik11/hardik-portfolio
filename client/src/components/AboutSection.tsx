/*
 * ABOUT — Refined jelly physics + GSAP ScrollTrigger counters
 * Subtle spring animations on scroll. Hover effects only on cards, not on individual elements.
 */
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useFineHover } from '../hooks/useFineHover';

gsap.registerPlugin(ScrollTrigger);
import { Cpu, Shield, Factory } from 'lucide-react';

const btnSpring = { type: 'spring' as const, stiffness: 200, damping: 15, mass: 0.8 };

const metrics = [
  { value: 1900, suffix: '+', label: 'Fleet Units Fixed', color: 'oklch(0.55 0.18 230)', type: 'teal' as const },
  { value: 400, suffix: '+', label: 'Devices Analyzed', color: 'oklch(0.75 0.15 65)', type: 'amber' as const },
  { value: 20, suffix: '+', label: 'Custom Test Fixtures', color: 'oklch(0.55 0.18 230)', type: 'teal' as const },
  { value: 6, suffix: '', label: 'Product Generations', color: 'oklch(0.75 0.15 65)', type: 'amber' as const },
];

const specializations = [
  {
    title: 'Hardware Sustainment & Test',
    desc: 'End-to-end project delivery across prototyping, test development, CT scanning, fixture design, factory test automation, and CM transfer for EMG wearables at Meta.',
    icon: Cpu,
    type: 'teal' as const,
  },
  {
    title: 'NPI, DfX & Failure Analysis',
    desc: 'New Product Introduction, Design for Manufacturing/Test, and comprehensive failure analysis with root cause investigation across six product generations.',
    icon: Factory,
    type: 'amber' as const,
  },
  {
    title: 'Quality & Regulatory',
    desc: 'FDA, ISO 13485, EU MDR, cGMP compliance, Six Sigma, SPC, and 8D methodology across medical device and consumer electronics industries.',
    icon: Shield,
    type: 'teal' as const,
  },
];

/* Jelly bounce-in for each child */
const jellyChild = {
  hidden: { opacity: 0, y: 40, scaleX: 0.94, scaleY: 1.06, rotate: -1.5 },
  visible: {
    opacity: 1, y: 0, scaleX: 1, scaleY: 1, rotate: 0,
    transition: { type: 'spring' as const, stiffness: 140, damping: 10, mass: 1 },
  },
};

export function AboutSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const blob1Ref = useRef<HTMLDivElement>(null);
  const blob2Ref = useRef<HTMLDivElement>(null);
  const metricsRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  /* Scroll-reactive wobble — desktop only.
     On mobile, these promote entire sections to GPU layers causing scroll glitches. */
  const isFine = useFineHover();
  const sectionSkew = useTransform(scrollYProgress, [0, 0.3, 0.5, 0.7, 1], isFine ? [0.15, -0.08, 0, 0.05, -0.1] : [0, 0, 0, 0, 0]);
  const sectionSX = useTransform(scrollYProgress, [0, 0.3, 0.5, 0.7, 1], isFine ? [1.001, 0.999, 1, 1.001, 0.999] : [1, 1, 1, 1, 1]);
  const sectionSY = useTransform(scrollYProgress, [0, 0.3, 0.5, 0.7, 1], isFine ? [0.999, 1.001, 1, 0.999, 1.001] : [1, 1, 1, 1, 1]);
  const springSkew = useSpring(sectionSkew, { stiffness: 80, damping: 15 });
  const springSX = useSpring(sectionSX, { stiffness: 80, damping: 15 });
  const springSY = useSpring(sectionSY, { stiffness: 80, damping: 15 });

  // GSAP parallax on blobs and header mask reveal
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const triggers: ScrollTrigger[] = [];

    // Parallax on blobs
    [blob1Ref.current, blob2Ref.current].forEach((blob, i) => {
      if (!blob) return;
      const anim = gsap.to(blob, {
        y: i === 0 ? -60 : -40,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      });
      if (anim.scrollTrigger) triggers.push(anim.scrollTrigger);
    });

    // Header mask reveal
    if (headerRef.current) {
      const anim = gsap.fromTo(
        headerRef.current,
        { clipPath: 'inset(0 100% 0 0)', opacity: 0 },
        {
          clipPath: 'inset(0 0% 0 0)',
          opacity: 1,
          duration: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: headerRef.current,
            start: 'top 85%',
          },
        }
      );
      if (anim.scrollTrigger) triggers.push(anim.scrollTrigger);
    }

    return () => {
      triggers.forEach((st) => st.kill());
    };
  }, []);

  return (
    <motion.section
      id="about"
      ref={sectionRef}
      style={{ skewX: springSkew, scaleX: springSX, scaleY: springSY }}
      className="relative py-16 sm:py-24 lg:py-32 overflow-hidden"
    >
      {/* Floating jelly blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          ref={blob1Ref}
          className="absolute w-[400px] h-[400px] -top-20 right-0 jelly-float-blob-2 opacity-20"
          style={{
            background: 'radial-gradient(ellipse, oklch(0.55 0.18 230 / 12%) 0%, transparent 70%)',
            borderRadius: '40% 60% 70% 30% / 50% 40% 60% 50%',
          }}
        />
        <div
          ref={blob2Ref}
          className="absolute w-[350px] h-[350px] bottom-0 -left-20 jelly-float-blob-1 opacity-15"
          style={{
            background: 'radial-gradient(ellipse, oklch(0.75 0.15 65 / 10%) 0%, transparent 70%)',
            borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%',
          }}
        />
      </div>

      <div className="container relative z-10">
        {/* Section header */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 30, scaleX: 0.95, scaleY: 1.05, rotate: -1 }}
          whileInView={{ opacity: 1, y: 0, scaleX: 1, scaleY: 1, rotate: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ type: 'spring' as const, stiffness: 120, damping: 10, mass: 1.2 }}
          className="mb-14"
        >
          <p className="jelly-section-label">About</p>
          <h2 className="jelly-section-title max-w-xl">Engineering with purpose</h2>
          <p className="text-base text-muted-foreground mt-4 max-w-lg leading-relaxed">
            Hardware Engineer and Project Manager who owns Meta's end-to-end EMG wearable sustainment pipeline — spanning failure investigation, CT scanning, fixture design, factory test automation, and CM transfer across six product generations.
          </p>
        </motion.div>

        {/* Metrics — GSAP ScrollTrigger counters */}
        <div ref={metricsRef} className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 mb-20 sm:mb-28">
          {metrics.map((m, i) => (
            <motion.div
              key={m.label}
              variants={jellyChild}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={i}
              transition={{ delay: i * 0.08 }}
            >
              <motion.div
                whileHover={{ y: -4, scale: 1.02 }}
                transition={btnSpring}
                className="jelly-card p-6 text-center cursor-default group relative overflow-hidden"
              >
                <div className={`jelly-caustic -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-12 ${
                  m.type === 'teal' ? 'jelly-caustic-teal' : 'jelly-caustic-amber'
                }`} />
                <GSAPCounter target={m.value} suffix={m.suffix} color={m.color} />
                <p className="text-[11px] font-medium text-muted-foreground mt-2 tracking-wide">{m.label}</p>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Specializations — subtle card hover */}
        <div className="grid sm:grid-cols-3 gap-3 sm:gap-5">
          {specializations.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 40, scaleX: 0.95, scaleY: 1.05, rotate: i % 2 === 0 ? -1.5 : 1.5 }}
                whileInView={{ opacity: 1, y: 0, scaleX: 1, scaleY: 1, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ type: 'spring' as const, stiffness: 130, damping: 10, mass: 1, delay: i * 0.1 }}
              >
                <motion.div
                  whileHover={{ y: -4, scale: 1.01 }}
                  transition={btnSpring}
                  className="jelly-card p-6 h-full cursor-default relative overflow-hidden group"
                >
                  <div className={`jelly-caustic -bottom-6 left-1/4 right-1/4 h-12 ${
                    s.type === 'teal' ? 'jelly-caustic-teal' : 'jelly-caustic-amber'
                  }`} />

                  <div
                    className={`jelly-icon-box w-10 h-10 mb-4 ${
                      s.type === 'teal' ? 'jelly-icon-box-teal' : 'jelly-icon-box-amber'
                    }`}
                  >
                    <Icon size={18} />
                  </div>

                  <span className="text-[10px] font-mono text-muted-foreground/35 tracking-wider">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="text-sm font-semibold text-foreground mt-1.5 mb-2.5">{s.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{s.desc}</p>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.section>
  );
}

/**
 * GSAP ScrollTrigger-driven counter animation.
 * Counts from 0 to target when scrolled into view with power2.out easing.
 */
function GSAPCounter({ target, suffix, color }: { target: number; suffix: string; color: string }) {
  const counterRef = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(`0${suffix}`);

  useEffect(() => {
    const el = counterRef.current;
    if (!el) return;

    const obj = { val: 0 };
    const tween = gsap.to(obj, {
      val: target,
      duration: 2,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 90%',
        once: true,
      },
      onUpdate: () => {
        setDisplay(`${Math.round(obj.val)}${suffix}`);
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [target, suffix]);

  return (
    <span
      ref={counterRef}
      className="jelly-stat-number inline-block"
      style={{ color }}
    >
      {display}
    </span>
  );
}
