/*
 * CONTACT & FOOTER — Refined spring physics
 * Subtle hover on interactive elements (buttons, links). No hover on text/icons.
 */
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useRef, useEffect, useMemo } from 'react';
import { useJellyMode } from '../contexts/JellyModeContext';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
import { Mail, Linkedin, Phone, ArrowUpRight, MapPin } from 'lucide-react';

const btnSpringOff = { type: 'spring' as const, stiffness: 300, damping: 25, mass: 0.8 };
const btnSpringOn  = { type: 'spring' as const, stiffness: 220, damping: 16, mass: 1.0 };

const contactLinks = [
  { label: 'Email', value: 'lukhihardik11@gmail.com', href: 'mailto:lukhihardik11@gmail.com', icon: Mail, color: 'oklch(0.55 0.18 230)' },
  { label: 'LinkedIn', value: 'linkedin.com/in/hardiklukhi', href: 'https://linkedin.com/in/hardiklukhi', icon: Linkedin, color: 'oklch(0.50 0.14 230)' },
  { label: 'Phone', value: '361-228-5831', href: 'tel:+13612285831', icon: Phone, color: 'oklch(0.75 0.15 65)' },
];

export function ContactSection() {
  const { jellyMode } = useJellyMode();
  const btnSpring = useMemo(() => jellyMode ? btnSpringOn : btnSpringOff, [jellyMode]);
  const hoverScale = jellyMode ? 1.04 : 1.02;
  const hoverY = jellyMode ? -3 : -2;
  const tapScale = jellyMode ? 0.95 : 0.97;
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const sectionSkew = useTransform(scrollYProgress, [0, 0.3, 0.5, 0.7, 1], [0.12, -0.06, 0, 0.04, -0.08]);
  const sectionSX = useTransform(scrollYProgress, [0, 0.3, 0.5, 0.7, 1], [1.001, 0.999, 1, 1.001, 0.999]);
  const sectionSY = useTransform(scrollYProgress, [0, 0.3, 0.5, 0.7, 1], [0.999, 1.001, 1, 0.999, 1.001]);
  const springSkew = useSpring(sectionSkew, { stiffness: 80, damping: 15 });
  const springSX = useSpring(sectionSX, { stiffness: 80, damping: 15 });
  const springSY = useSpring(sectionSY, { stiffness: 80, damping: 15 });

  // GSAP header mask reveal
  useEffect(() => {
    if (headerRef.current) {
      gsap.fromTo(
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
    }

    return () => {
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === headerRef.current) st.kill();
      });
    };
  }, []);

  return (
    <motion.section
      id="contact"
      ref={sectionRef}
      style={{ skewX: springSkew, scaleX: springSX, scaleY: springSY }}
      className="relative py-16 sm:py-24 lg:py-32 overflow-hidden"
    >
      {/* Floating blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute w-[350px] h-[350px] top-1/4 -left-20 jelly-float-blob-2 opacity-15"
          style={{
            background: 'radial-gradient(ellipse, oklch(0.55 0.18 230 / 10%) 0%, transparent 70%)',
            borderRadius: '40% 60% 70% 30% / 50% 40% 60% 50%',
          }}
        />
      </div>

      <div className="container">
        <div className="max-w-3xl mx-auto">
          {/* Section header */}
          <motion.div
            ref={headerRef}
            initial={{ opacity: 0, y: 30, scaleX: 0.95, scaleY: 1.05, rotate: -1 }}
            whileInView={{ opacity: 1, y: 0, scaleX: 1, scaleY: 1, rotate: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ type: 'spring' as const, stiffness: 120, damping: 10, mass: 1.2 }}
            className="text-center mb-16"
          >
            <p className="jelly-section-label">Contact</p>
            <h2 className="jelly-section-title mb-4">Let&apos;s build something extraordinary</h2>
            <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
              Open to discussing hardware engineering roles, project management opportunities,
              and collaborative work in wearable technology and medical devices.
            </p>
          </motion.div>

          {/* Primary CTA — subtle hover */}
          <motion.div
            initial={{ opacity: 0, y: 30, scaleX: 0.95, scaleY: 1.05, rotate: -1 }}
            whileInView={{ opacity: 1, y: 0, scaleX: 1, scaleY: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ type: 'spring' as const, stiffness: 130, damping: 10, mass: 1 }}
            className="flex justify-center mb-14"
          >
            <motion.a
              href="mailto:lukhihardik11@gmail.com"
              whileHover={{ scale: hoverScale, y: hoverY }}
              whileTap={{ scale: tapScale }}
              transition={btnSpring}
              className="jelly-btn jelly-btn-teal px-8 py-4 text-sm no-underline"
            >
              <Mail size={16} />
              Say Hello
              <ArrowUpRight size={14} />
            </motion.a>
          </motion.div>

          {/* Contact cards — subtle hover */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-12">
            {contactLinks.map((link, i) => {
              const Icon = link.icon;
              return (
                <motion.a
                  key={link.label}
                  href={link.href}
                  target={link.href.startsWith('http') ? '_blank' : undefined}
                  rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  initial={{ opacity: 0, y: 35, scaleX: 0.96, scaleY: 1.04, rotate: i % 2 === 0 ? -1 : 1 }}
                  whileInView={{ opacity: 1, y: 0, scaleX: 1, scaleY: 1, rotate: 0 }}
                  viewport={{ once: true }}
                  transition={{ type: 'spring' as const, stiffness: 140, damping: 10, mass: 1, delay: i * 0.08 }}
                  whileHover={{ y: -4, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="jelly-card p-5 text-center group no-underline"
                >
                  <div
                    className={`jelly-icon-box w-10 h-10 mx-auto mb-3 ${
                      i === 2 ? 'jelly-icon-box-amber' : 'jelly-icon-box-teal'
                    }`}
                  >
                    <Icon size={16} />
                  </div>
                  <div className="text-xs font-semibold text-foreground mb-0.5">{link.label}</div>
                  <div className="text-[11px] text-muted-foreground font-mono flex items-center justify-center gap-1">
                    {link.value}
                    <ArrowUpRight size={9} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </motion.a>
              );
            })}
          </div>

          {/* Location — no hover */}
          <motion.div
            initial={{ opacity: 0, y: 20, scaleX: 0.97, scaleY: 1.03 }}
            whileInView={{ opacity: 1, y: 0, scaleX: 1, scaleY: 1 }}
            viewport={{ once: true }}
            transition={{ type: 'spring' as const, stiffness: 150, damping: 10, delay: 0.3 }}
            className="text-center"
          >
            <div className="glass-pill jelly-interactive inline-flex items-center gap-2 px-4 py-2">
              <MapPin size={12} style={{ color: 'oklch(0.55 0.18 230 / 60%)' }} />
              <span className="text-[11px] text-muted-foreground/50">Ridgefield Park, NJ</span>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}

export function Footer() {
  return (
    <footer className="py-8 relative">
      <div className="jelly-divider mb-8" />
      <div className="container">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground/35">© {new Date().getFullYear()} Hardik Lukhi</span>
          </div>

          <span className="text-[10px] font-mono text-muted-foreground/20 tracking-wider">
            Designed & engineered with precision
          </span>

          <div className="flex items-center gap-2">
            {contactLinks.map((link) => {
              const Icon = link.icon;
              return (
                <motion.a
                  key={link.label}
                  href={link.href}
                  target={link.href.startsWith('http') ? '_blank' : undefined}
                  rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  whileHover={{ y: -2, scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={btnSpringOff}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground/30 hover:text-foreground/60 transition-colors duration-200 no-underline jelly-social-icon"
                  aria-label={link.label}
                >
                  <Icon size={13} />
                </motion.a>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
}
