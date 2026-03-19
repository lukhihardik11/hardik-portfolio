/*
 * NAVBAR — Gel/Glass aesthetic with translucent pill nav buttons
 * Batch 2 v3: Unified toggle sizing, both use GelToggle architecture
 */
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Mail } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useJellyMode } from '@/contexts/JellyModeContext';
import JellySwitch from '@/components/JellySwitch';
import { JellyModeToggle } from '@/components/JellyModeToggle';

const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Experience', href: '#experience' },
  { label: 'Projects', href: '#projects' },
  { label: 'Skills', href: '#skills' },
  { label: 'Education', href: '#education' },
  { label: 'Contact', href: '#contact' },
];

/* Gel pill colors — each nav link gets a unique color */
const GEL_COLORS = [
  { bg: 'oklch(0.72 0.14 145)', shadow: 'oklch(0.60 0.16 145 / 40%)', text: 'oklch(0.20 0.06 145)' },
  { bg: 'oklch(0.68 0.16 25)',  shadow: 'oklch(0.58 0.18 25 / 40%)',  text: 'oklch(0.22 0.06 25)' },
  { bg: 'oklch(0.75 0.14 65)',  shadow: 'oklch(0.65 0.16 65 / 40%)',  text: 'oklch(0.25 0.06 65)' },
  { bg: 'oklch(0.62 0.18 280)', shadow: 'oklch(0.50 0.20 280 / 40%)', text: 'oklch(0.20 0.06 280)' },
  { bg: 'oklch(0.60 0.18 230)', shadow: 'oklch(0.48 0.20 230 / 40%)', text: 'oklch(0.18 0.06 230)' },
  { bg: 'oklch(0.70 0.12 180)', shadow: 'oklch(0.58 0.14 180 / 40%)', text: 'oklch(0.20 0.06 180)' },
];

const btnSpring = { type: 'spring' as const, stiffness: 200, damping: 18, mass: 0.8 };
const jellyBtnSpring = { type: 'spring' as const, stiffness: 600, damping: 12, mass: 0.4 };

/* Unified toggle size — both toggles use the same size parameter */
const TOGGLE_SIZE = 36;
const TOGGLE_SIZE_MOBILE = 30;

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const { theme, toggleTheme } = useTheme();
  const { jellyMode } = useJellyMode();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const sections = navLinks.map(l => l.href.slice(1));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: '-30% 0px -60% 0px' }
    );
    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const nav = (href: string) => {
    setMobileOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  const isDark = theme === 'dark';
  const sz = isMobile ? TOGGLE_SIZE_MOBILE : TOGGLE_SIZE;

  return (
    <>
      <motion.header
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring' as const, stiffness: 120, damping: 16 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'py-2' : 'py-3'}`}
      >
        <div className="container">
          <nav
            className={`flex items-center justify-between px-3 sm:px-5 py-2 sm:py-2.5 transition-all duration-500 ${
              scrolled ? 'jelly-navbar' : ''
            }`}
          >
            {/* Logo — gel badge */}
            <motion.a
              href="#"
              onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              whileHover={{ scale: 1.05, y: -1 }}
              whileTap={{ scale: 0.95 }}
              transition={btnSpring}
              className="no-jelly flex items-center gap-2 no-underline shrink-0"
            >
              <div
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center text-white text-[10px] sm:text-xs font-bold relative overflow-hidden"
                style={{
                  background: `linear-gradient(145deg, oklch(0.65 0.16 230 / 70%), oklch(0.50 0.22 230 / 75%))`,
                  border: 'none',
                  boxShadow: `
                    0 0 1px oklch(1 0 0 / 15%),
                    0 3px 8px oklch(0.55 0.20 230 / 20%)
                  `,
                }}
              >
                HL
              </div>
              <span className="text-sm font-semibold text-foreground tracking-tight hidden sm:block">
                Hardik Lukhi
              </span>
            </motion.a>

            {/* Desktop links — gel pill capsules */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link, i) => {
                const isActive = activeSection === link.href.slice(1);
                const gelColor = GEL_COLORS[i % GEL_COLORS.length];
                return (
                  <motion.button
                    key={link.href}
                    onClick={() => nav(link.href)}
                    whileHover={jellyMode
                      ? { y: -4, scale: 1.1, rotate: [0, -2, 2, 0] }
                      : { y: -2, scale: 1.04 }
                    }
                    whileTap={jellyMode
                      ? { scale: 0.85, scaleX: 1.15, scaleY: 0.85 }
                      : { scale: 0.96 }
                    }
                    transition={jellyMode ? jellyBtnSpring : btnSpring}
                    className={`no-jelly relative px-3.5 py-1.5 text-xs font-semibold rounded-full cursor-pointer border-none outline-none transition-colors ${!isActive ? 'text-muted-foreground hover:bg-foreground/[0.06] hover:text-foreground' : ''}`}
                    style={isActive ? {
                      background: `linear-gradient(145deg, ${gelColor.bg}, oklch(from ${gelColor.bg} calc(l - 0.08) c h))`,
                      color: isDark ? 'oklch(0.98 0 0)' : gelColor.text,
                      border: 'none',
                      boxShadow: `
                        0 0 1px oklch(1 0 0 / 15%),
                        0 3px 10px ${gelColor.shadow}
                      `,
                    } : {
                      background: 'transparent',
                      border: 'none',
                      boxShadow: 'none',
                    }}
                  >
                    {isActive && (
                      <span
                        className="absolute top-0 left-[15%] right-[15%] h-[45%] rounded-full pointer-events-none"
                        style={{
                          background: 'linear-gradient(180deg, oklch(1 0 0 / 45%) 0%, oklch(1 0 0 / 0%) 100%)',
                        }}
                      />
                    )}
                    <span className="relative z-10">{link.label}</span>
                  </motion.button>
                );
              })}
            </div>

            {/* Right side controls — toggles + mail + hamburger */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 mt-[5px]">
              {/* Jelly Mode toggle — hidden on small mobile */}
              <div className="hidden sm:flex items-center">
                <JellyModeToggle size={sz} />
              </div>

              {/* Dark/Light toggle */}
              {toggleTheme && (
                <JellySwitch
                  checked={theme === 'dark'}
                  onChange={() => toggleTheme()}
                  size={sz}
                />
              )}

              {/* Contact button — gel orb */}
              <motion.a
                href="#contact"
                onClick={(e) => { e.preventDefault(); nav('#contact'); }}
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.92 }}
                transition={btnSpring}
                className="no-jelly hidden sm:flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full text-white no-underline shrink-0"
                style={{
                  background: `linear-gradient(145deg, oklch(0.65 0.16 230 / 70%), oklch(0.48 0.22 230 / 75%))`,
                  border: 'none',
                  boxShadow: `
                    0 0 1px oklch(1 0 0 / 15%),
                    0 3px 10px oklch(0.55 0.20 230 / 20%)
                  `,
                }}
                aria-label="Contact"
              >
                <Mail size={14} />
              </motion.a>

              {/* Hamburger menu button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={btnSpring}
                onClick={() => setMobileOpen(!mobileOpen)}
                className="no-jelly lg:hidden p-1 sm:p-2 rounded-xl text-foreground hover:bg-foreground/[0.04] shrink-0"
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X size={16} /> : <Menu size={16} />}
              </motion.button>
            </div>
          </nav>
        </div>
      </motion.header>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 lg:hidden jelly-mobile-overlay"
          >
            <div className="flex flex-col items-center justify-center h-full gap-5">
              {navLinks.map((link, i) => {
                const gelColor = GEL_COLORS[i % GEL_COLORS.length];
                return (
                  <motion.button
                    key={link.href}
                    initial={jellyMode
                      ? { opacity: 0, y: 30, scale: 0.8, scaleY: 1.2 }
                      : { opacity: 0, y: 20 }
                    }
                    animate={jellyMode
                      ? { opacity: 1, y: 0, scale: 1, scaleY: 1 }
                      : { opacity: 1, y: 0 }
                    }
                    exit={{ opacity: 0, y: 10 }}
                    transition={jellyMode
                      ? { ...jellyBtnSpring, delay: i * 0.06 }
                      : { duration: 0.2, delay: i * 0.04 }
                    }
                    whileHover={jellyMode
                      ? { y: -5, scale: 1.12, rotate: [0, -3, 3, 0] }
                      : { y: -2, scale: 1.04 }
                    }
                    whileTap={jellyMode
                      ? { scale: 0.8, scaleX: 1.2, scaleY: 0.8 }
                      : { scale: 0.96 }
                    }
                    onClick={() => nav(link.href)}
                    className="no-jelly px-6 py-2.5 text-lg font-semibold rounded-full cursor-pointer border-none outline-none"
                    style={{
                      background: `linear-gradient(145deg, ${gelColor.bg}, oklch(from ${gelColor.bg} calc(l - 0.08) c h))`,
                      color: isDark ? 'oklch(0.98 0 0)' : gelColor.text,
                      border: '2px solid oklch(1 0 0 / 30%)',
                      boxShadow: `
                        inset 0 3px 6px oklch(1 0 0 / 40%),
                        inset 0 -3px 5px oklch(0 0 0 / 18%),
                        0 6px 20px ${gelColor.shadow},
                        0 2px 0 oklch(1 0 0 / 15%)
                      `,
                    }}
                  >
                    {link.label}
                  </motion.button>
                );
              })}
              <div className="flex flex-col items-center gap-4 mt-4 pt-4 border-t border-foreground/10">
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground">Jelly Mode</span>
                  <JellyModeToggle size={30} />
                </div>
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  onClick={() => nav('#contact')}
                  className="no-jelly flex items-center justify-center w-11 h-11 rounded-full text-white"
                  style={{
                    background: `linear-gradient(145deg, oklch(0.65 0.16 230 / 90%), oklch(0.48 0.22 230 / 95%))`,
                    border: '2px solid oklch(1 0 0 / 30%)',
                    boxShadow: `
                      inset 0 3px 6px oklch(1 0 0 / 40%),
                      inset 0 -3px 5px oklch(0 0 0 / 18%),
                      0 6px 20px oklch(0.55 0.20 230 / 35%),
                      0 2px 0 oklch(1 0 0 / 15%)
                    `,
                  }}
                  aria-label="Contact"
                >
                  <Mail size={18} />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
