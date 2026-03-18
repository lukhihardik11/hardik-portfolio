/*
 * EDUCATION — Refined spring physics
 * Cards with subtle hover. No hover on icons, badges, GPA text.
 */
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
import { GraduationCap, Award, Briefcase } from 'lucide-react';

const btnSpring = { type: 'spring' as const, stiffness: 200, damping: 15, mass: 0.8 };

const education = [
  { degree: 'M.S. Information Technology', school: 'University of the Cumberlands', location: 'Williamsburg, KY', year: '2023', gpa: '4.0 / 4.0', highlight: 'Perfect GPA', color: 'oklch(0.75 0.15 65)' },
  { degree: 'M.S. Mechanical Engineering', school: 'Texas A&M University — Kingsville', location: 'Kingsville, TX', year: '2019', gpa: '3.61 / 4.0', highlight: null, color: 'oklch(0.55 0.18 230)' },
  { degree: 'B.E. Mechanical Engineering', school: 'Gujarat Technological University', location: 'Ahmedabad, India', year: '2016', gpa: '3.68 / 4.0', highlight: null, color: 'oklch(0.50 0.14 200)' },
];

const internships = [
  {
    role: 'Graduate Intern — Manufacturing Engineer',
    company: 'Precision Technology Inc.',
    location: 'Plano, TX',
    period: 'May 2018 — Aug 2018',
    highlights: [
      'Supported PCBA manufacturing process design and development, contributing to production efficiency improvements',
      'Assisted in implementing new manufacturing techniques to enhance production workflow',
    ],
  },
  {
    role: 'Undergraduate Intern — Mechanical Engineer',
    company: 'Goyani Machines Private Limited',
    location: 'Vadodara, India',
    period: 'Apr 2015 — Jun 2015',
    highlights: [
      'Assisted in mechanical design, prototyping, and design validation activities',
      'Gained hands-on experience in engineering processes and manufacturing operations',
    ],
  },
];

export function EducationSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const sectionSkew = useTransform(scrollYProgress, [0, 0.3, 0.5, 0.7, 1], [0.5, -0.3, 0, 0.2, -0.3]);
  const sectionSX = useTransform(scrollYProgress, [0, 0.3, 0.5, 0.7, 1], [1.003, 0.998, 1, 1.002, 0.998]);
  const sectionSY = useTransform(scrollYProgress, [0, 0.3, 0.5, 0.7, 1], [0.997, 1.002, 1, 0.998, 1.002]);
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
      id="education"
      ref={sectionRef}
      style={{ skewX: springSkew, scaleX: springSX, scaleY: springSY }}
      className="relative py-16 sm:py-24 lg:py-32 overflow-hidden"
    >
      <div className="container">
        {/* Section header */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 50, scaleX: 0.85, scaleY: 1.15, rotate: -2 }}
          whileInView={{ opacity: 1, y: 0, scaleX: 1, scaleY: 1, rotate: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ type: 'spring' as const, stiffness: 120, damping: 10, mass: 1.2 }}
          className="mb-14"
        >
          <p className="jelly-section-label">Education</p>
          <h2 className="jelly-section-title max-w-xl">Academic foundation</h2>
        </motion.div>

        {/* Education cards — subtle hover */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-20">
          {education.map((edu, i) => (
            <motion.div
              key={edu.degree}
              initial={{ opacity: 0, y: 70, scaleX: 0.82, scaleY: 1.20, rotate: i % 2 === 0 ? -3 : 3 }}
              whileInView={{ opacity: 1, y: 0, scaleX: 1, scaleY: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ type: 'spring' as const, stiffness: 130, damping: 10, mass: 1, delay: i * 0.1 }}
            >
              <motion.div
                whileHover={{ y: -4, scale: 1.01 }}
                transition={btnSpring}
                className="jelly-card p-6 h-full"
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`jelly-icon-box w-10 h-10 ${i === 0 ? 'jelly-icon-box-amber' : 'jelly-icon-box-teal'}`}
                  >
                    <GraduationCap size={16} />
                  </div>
                  <span className="font-mono text-[10px] text-muted-foreground/35">{edu.year}</span>
                </div>

                <h3 className="text-sm font-semibold text-foreground mb-1">{edu.degree}</h3>
                <p className="text-xs text-muted-foreground mb-1">{edu.school}</p>
                <p className="text-[11px] text-muted-foreground/35 mb-3">{edu.location}</p>

                <div className="flex items-center gap-2 pt-3" style={{ borderTop: '1px solid oklch(0.50 0.005 80 / 8%)' }}>
                  <Award size={12} style={{ color: edu.color }} />
                  <span
                    className="font-mono text-xs font-medium"
                    style={{ color: edu.color }}
                  >
                    GPA: {edu.gpa}
                  </span>
                  {edu.highlight && (
                    <span className="jelly-badge jelly-badge-amber ml-auto">
                      {edu.highlight}
                    </span>
                  )}
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Internships — subtle hover */}
        <motion.div
          initial={{ opacity: 0, y: 40, scaleX: 0.88, scaleY: 1.12 }}
          whileInView={{ opacity: 1, y: 0, scaleX: 1, scaleY: 1 }}
          viewport={{ once: true }}
          transition={{ type: 'spring' as const, stiffness: 120, damping: 10, mass: 1 }}
        >
          <h3 className="text-sm font-semibold text-foreground mb-5 flex items-center gap-2">
            <span className="jelly-icon-box jelly-icon-box-teal w-7 h-7">
              <Briefcase size={12} />
            </span>
            Internships
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {internships.map((intern, i) => (
              <motion.div
                key={intern.company}
                initial={{ opacity: 0, y: 50, scaleX: 0.85, scaleY: 1.15, rotate: i % 2 === 0 ? -2 : 2 }}
                whileInView={{ opacity: 1, y: 0, scaleX: 1, scaleY: 1, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ type: 'spring' as const, stiffness: 140, damping: 10, mass: 1, delay: i * 0.08 }}
              >
                <motion.div
                  whileHover={{ y: -3, scale: 1.005 }}
                  transition={btnSpring}
                  className="jelly-card p-4"
                >
                  <p className="text-xs font-semibold text-foreground mb-1">{intern.role}</p>
                  <p className="text-[11px] text-muted-foreground">{intern.company} — {intern.location}</p>
                  <p className="text-[10px] font-mono text-muted-foreground/35 mt-1 mb-2">{intern.period}</p>
                  {intern.highlights && (
                    <div className="flex flex-col gap-1">
                      {intern.highlights.map((h, j) => (
                        <p key={j} className="text-[10px] text-muted-foreground/60 leading-relaxed">• {h}</p>
                      ))}
                    </div>
                  )}
                </motion.div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}
