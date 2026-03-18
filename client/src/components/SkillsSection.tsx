/*
 * SKILLS — Gel/Glass aesthetic
 * Category badges are gel orbs (round glass spheres with colored interiors).
 * Cards use the enhanced jelly-card glass slab styling.
 * Sliders are thick glass tubes with colored gel fill.
 */
import { motion } from 'framer-motion';
import { useRef, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
import { JellySlider } from '@/components/JellySlider';

const btnSpring = { type: 'spring' as const, stiffness: 200, damping: 18, mass: 0.8 };

/* Gel orb colors for each category */
const GEL_ORB_COLORS = [
  { bg: 'oklch(0.75 0.15 65)',  glow: 'oklch(0.70 0.16 65 / 20%)' },   // amber
  { bg: 'oklch(0.60 0.18 230)', glow: 'oklch(0.55 0.20 230 / 20%)' },  // teal/blue
  { bg: 'oklch(0.72 0.14 145)', glow: 'oklch(0.65 0.16 145 / 20%)' },  // green
  { bg: 'oklch(0.62 0.18 280)', glow: 'oklch(0.55 0.20 280 / 20%)' },  // purple
];

const skillCategories = [
  {
    category: 'Engineering & Design',
    number: '01',
    blobColor: 'amber' as const,
    orbIndex: 0,
    skills: [
      { name: 'Product Design & DfX', level: 95 },
      { name: 'SolidWorks / NX CAD', level: 92 },
      { name: 'GD&T', level: 90 },
      { name: 'FEA (Abaqus)', level: 88 },
      { name: 'Fixture Design', level: 94 },
      { name: '3D Printing & Prototyping', level: 90 },
    ],
  },
  {
    category: 'Quality & Compliance',
    number: '02',
    blobColor: 'teal' as const,
    orbIndex: 1,
    skills: [
      { name: 'Failure Analysis / Root Cause', level: 96 },
      { name: 'Six Sigma / DOE', level: 88 },
      { name: 'FMEA / CAPA', level: 92 },
      { name: 'ISO 13485 / FDA QMS', level: 90 },
      { name: 'SPC (Cpk, FAI)', level: 87 },
      { name: 'EU MDR / cGMP', level: 85 },
    ],
  },
  {
    category: 'Manufacturing & Test',
    number: '03',
    blobColor: 'amber' as const,
    orbIndex: 2,
    skills: [
      { name: 'NPI (EVT \u2192 PVT)', level: 93 },
      { name: 'Test Automation', level: 90 },
      { name: 'PCB Design', level: 85 },
      { name: 'BOM Management', level: 88 },
      { name: 'Contract Manufacturer Mgmt', level: 87 },
      { name: 'EMG Sensor Systems', level: 91 },
    ],
  },
  {
    category: 'Software & Project Mgmt',
    number: '04',
    blobColor: 'teal' as const,
    orbIndex: 3,
    skills: [
      { name: 'Python Scripting', level: 88 },
      { name: 'Minitab / MATLAB', level: 85 },
      { name: 'JIRA / Confluence', level: 92 },
      { name: 'Agile / Scrum', level: 90 },
      { name: 'Sprint Planning & Metrics', level: 88 },
      { name: 'GSD Dashboard / Butterfly', level: 86 },
    ],
  },
];

/* Gel Orb component — round glass sphere with colored interior */
function GelOrb({ number, orbIndex, isDark }: { number: string; orbIndex: number; isDark: boolean }) {
  const orb = GEL_ORB_COLORS[orbIndex % GEL_ORB_COLORS.length];
  return (
    <div
      className="relative w-9 h-9 rounded-full flex items-center justify-center text-[10px] font-mono font-bold text-white/90 shrink-0"
      style={{
        background: `radial-gradient(ellipse 70% 60% at 35% 30%,
          oklch(1 0 0 / 35%),
          ${orb.bg} 60%,
          oklch(from ${orb.bg} calc(l - 0.15) c h) 100%)`,
        border: 'none',
        boxShadow: `
          0 0 1px oklch(1 0 0 / 10%),
          0 3px 10px ${orb.glow}
        `,
      }}
    >
      {/* Specular highlight — white dot at top-left */}
      <span
        className="absolute w-3 h-2 rounded-full pointer-events-none"
        style={{
          top: '15%',
          left: '20%',
          background: 'radial-gradient(ellipse, oklch(1 0 0 / 70%) 0%, transparent 70%)',
        }}
      />
      <span className="relative z-10">{number}</span>
    </div>
  );
}

export function SkillsSection() {
  const headerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

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
    <section
      id="skills"
      className="relative py-16 sm:py-24 lg:py-32 overflow-hidden"
    >
      {/* Static blob */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute w-[400px] h-[400px] -top-20 -left-20 opacity-15"
          style={{
            background: 'radial-gradient(ellipse, oklch(0.55 0.18 230 / 10%) 0%, transparent 70%)',
            borderRadius: '40% 60% 70% 30% / 50% 40% 60% 50%',
          }}
        />
      </div>

      <div className="container">
        {/* Section header */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ type: 'spring' as const, stiffness: 100, damping: 16 }}
          className="mb-20"
        >
          <p className="jelly-section-label">Capabilities</p>
          <h2 className="jelly-section-title max-w-xl">Technical proficiency</h2>
        </motion.div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-8">
          {skillCategories.map((cat, catIndex) => (
            <motion.div
              key={cat.category}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ type: 'spring' as const, stiffness: 100, damping: 16, delay: catIndex * 0.08 }}
            >
              <motion.div
                whileHover={{ y: -3, scale: 1.005 }}
                transition={btnSpring}
                className="jelly-card p-6 lg:p-7 h-full"
              >
                {/* Category header with gel orb badge */}
                <div className="flex items-center justify-between mb-6 pb-3" style={{ borderBottom: 'none' }}>
                  <span className="text-sm font-semibold text-foreground tracking-tight">{cat.category}</span>
                  <GelOrb number={cat.number} orbIndex={cat.orbIndex} isDark={isDark} />
                </div>

                {/* JellySlider for each skill */}
                <div className="flex flex-col gap-4">
                  {cat.skills.map((skill) => (
                    <JellySlider
                      key={skill.name}
                      value={skill.level}
                      label={skill.name}
                      blobColor={cat.blobColor}
                    />
                  ))}
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
