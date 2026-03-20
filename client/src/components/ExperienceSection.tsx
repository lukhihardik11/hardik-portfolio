/*
 * EXPERIENCE — Performance-optimized
 * Removed: scroll-reactive skew/scale wobble, heavy spring deformations
 * Kept: simple fade-in, GSAP timeline line, subtle card hover, header mask reveal
 */
import { motion } from 'framer-motion';
import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
import { ChevronRight } from 'lucide-react';

const btnSpring = { type: 'spring' as const, stiffness: 200, damping: 18, mass: 0.8 };

const experiences = [
  {
    company: 'Meta Platforms',
    role: 'Project Manager & Senior Mechanical Engineer',
    roleDate: 'Mar 2023 – Present',
    prevRole: 'Previously: Sustaining Mechanical Engineer (Nov 2021 – Feb 2023)',
    via: 'via Cognizant, Royal Monarch Solutions, Resource Logistics Inc.',
    period: 'Nov 2021 — Present',
    location: 'New York, NY',
    description: 'Promoted to lead hardware sustainment program for next-generation wearable devices across full lifecycle: prototyping, test development, failure analysis, lab operations, and research coordination.',
    highlights: [
      'Promoted to lead hardware sustainment program for next-generation wearable devices across full lifecycle: prototyping, test development, failure analysis, lab operations, and research coordination',
      'Led critical hardware failure investigation \u2014 identified root cause affecting deployed fleet and deployed preventive solution across 1,900+ units',
      'Established CT scanning capability at lab facility (Nikon XT H 225) enabling 2D radiography and 3D analysis for accelerated failure investigation',
      'Conducted comprehensive failure analysis on 400+ EMG wearable devices, identifying root causes and driving corrective actions that improved field reliability',
      'Designed and developed 20+ custom test fixtures and mechanical assemblies, increasing test throughput by 40%',
      'Automated factory test procedures using Python scripting and DAQ hardware APIs for power and signal testing, reducing test cycle times by 33%',
      'Participated in contract manufacturer transfer summit, validating manufacturing process for overseas production handoff',
      'Designed and deployed hardware verification stations at multiple sites for decentralized device health checks',
      'Architected and oversee end-to-end MFG test solutions including test script development, PCB design, and driver integration',
      'Generated engineering BOMs and manufacturing documentation, enabling seamless handoff to contract manufacturers',
      'Directed cross-functional team of engineers across mechanical, electrical, and firmware disciplines to deliver projects on schedule',
      'Improved flexible circuit (FPC) designs through iterative testing, increasing product resilience and extending service life by 25%',
      'Applied SPC methodologies (Cpk, FAI) to validate manufacturing process capability and drive continuous improvement',
      'Implemented Agile Sprint methodology with workflow automation, project dashboards, and sprint velocity tracking',
    ],
    prevHighlights: [
      'Supported 200+ device CM builds: test station development, fixture design, test scripts for board-level through full assembly validation',
      'Executed reliability testing and failure analysis on consumer wearable programs',
      'Rapidly prototyped sensor mount for factory test automation \u2014 recognized for contribution cutting test time by 33%',
      'Designed mechanical components and assemblies for EMG wearables using SolidWorks with FEA simulation validation',
      'Built and maintained inventory management system for test fixtures and failed units, improving lab efficiency',
      'Managed high-security prototype device logistics with serial number tracking',
      'Collaborated with software and firmware engineers to define test requirements and develop comprehensive test protocols',
    ],
    tech: ['Project Management', 'Agile/Scrum', 'JIRA', 'DOE', 'SPC', 'Failure Analysis', 'Test Fixtures', 'SolidWorks', 'Python', 'PCB Design', 'CT Scanning', 'DAQ Systems', 'CM Transfer'],
    color: 'oklch(0.55 0.18 230)',
    dotColor: 'teal' as const,
    badge: 'Current',
  },
  {
    company: 'Stryker',
    role: 'Manufacturing Process Analyst',
    via: 'via White Collar Technologies, Inc.',
    period: 'Jun 2021 — Nov 2021',
    location: 'Arlington, TN',
    description: 'Conducted comprehensive gap analysis following corporate acquisition, identifying discrepancies between manufacturing processes and Stryker quality policies. Drove remediation and compliance initiatives.',
    highlights: [
      'Conducted comprehensive gap analysis following corporate acquisition, identifying discrepancies between manufacturing processes and Stryker quality policies',
      'Developed remediation plans to align legacy systems with Stryker quality standards, ensuring seamless integration and compliance',
      'Evaluated process documentation against corporate requirements, updating SOPs, work instructions, and quality procedures',
      'Supported ISO 9001, ISO 13485, and FDA QMS compliance through process validation and gap closure activities',
      'Applied SPC and process capability analysis to assess manufacturing readiness against Stryker standards',
    ],
    tech: ['Gap Analysis', 'ISO 9001', 'ISO 13485', 'FDA QMS', 'SPC', 'SOPs', 'Process Validation'],
    color: 'oklch(0.75 0.15 65)',
    dotColor: 'amber' as const,
  },
  {
    company: 'Abbott',
    role: 'Quality Engineer',
    via: 'via Populus Group',
    period: 'Feb 2021 — Jun 2021',
    location: 'Gurnee, IL',
    description: 'Supported high-volume COVID-19 AG rapid test kit manufacturing operations. Performed quality control inspections, audits, and FMEA on test kit assembly processes.',
    highlights: [
      'Supported high-volume COVID-19 AG rapid test kit manufacturing operations, performing quality control inspections',
      'Conducted audits on manufacturing cells and production equipment, identifying non-conformances and implementing corrective actions',
      'Performed FMEA on test kit assembly processes, identifying potential failure points and reducing defect rates',
      'Reviewed and approved FAI reports for production equipment and tooling, ensuring compliance with design specifications',
      'Supported FDA and ISO 13485 audit readiness, maintaining quality documentation and regulatory compliance',
    ],
    tech: ['FMEA', 'FAI', 'ISO 13485', 'FDA', 'Quality Audits', 'Corrective Actions'],
    color: 'oklch(0.55 0.18 230)',
    dotColor: 'teal' as const,
  },
  {
    company: 'Terumo',
    role: 'Complaints Quality Engineer II',
    via: 'via Vastek Inc.',
    period: 'Jun 2019 — Feb 2021',
    location: 'Elkton, MD',
    description: 'Managed end-to-end customer complaint resolution for vascular closure devices (VCDs) and catheter product lines. Led root cause investigations and drove corrective actions improving product reliability and patient safety.',
    highlights: [
      'Managed end-to-end customer complaint resolution for vascular closure devices (VCDs) and catheter product lines',
      'Led root cause investigations on VCD deployment failures, implementing corrective actions improving product reliability and patient safety',
      'Supported EU MDR readiness initiatives, ensuring product documentation met European regulatory requirements',
      'Developed quality improvement initiatives using FMEA and 8D methodology for vascular access device failures',
      'Created technical documentation including Master Validation Plans and DHF per FDA 21 CFR Part 820 and ISO 13485',
      'Coordinated cross-functional corrective actions with Manufacturing, R&D, and Regulatory teams',
    ],
    tech: ['FMEA', '8D Methodology', 'EU MDR', 'ISO 13485', 'FDA 21 CFR 820', 'DHF', 'CAPA'],
    color: 'oklch(0.75 0.15 65)',
    dotColor: 'amber' as const,
  },
  {
    company: 'J Group Robotics',
    role: 'Mechanical Engineer',
    period: 'Jun 2015 — Jul 2017',
    location: 'Mumbai, India',
    description: 'Designed and developed mechanical components using 3D printing and rapid prototyping technologies. Conducted FEA to ensure design integrity and led design reviews for junior engineers.',
    highlights: [
      'Designed and developed mechanical components using 3D printing and rapid prototyping technologies',
      'Conducted finite element analysis (FEA) to ensure design integrity and optimize performance',
      'Led design reviews and provided mentorship to junior engineers, improving overall design quality',
      'Collaborated with cross-disciplinary teams to integrate new technologies and optimize product designs',
    ],
    tech: ['3D Printing', 'FEA', 'Rapid Prototyping', 'SolidWorks', 'Design Reviews'],
    color: 'oklch(0.55 0.18 280)',
    dotColor: 'teal' as const,
  },
];

export function ExperienceSection() {
  const headerRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  // GSAP header mask reveal + timeline line growth
  useEffect(() => {
    const triggers: ScrollTrigger[] = [];

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

    // Timeline line grows as user scrolls
    if (timelineRef.current) {
      const line = timelineRef.current.querySelector('.timeline-line') as HTMLElement;
      if (line) {
        const anim = gsap.fromTo(
          line,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: timelineRef.current,
              start: 'top 80%',
              end: 'bottom 20%',
              scrub: 0.3,
            },
          }
        );
        if (anim.scrollTrigger) triggers.push(anim.scrollTrigger);
      }
    }

    return () => {
      triggers.forEach((st) => st.kill());
    };
  }, []);

  return (
    <section
      id="experience"
      className="relative py-16 sm:py-24 lg:py-32 overflow-hidden"
    >
      <div className="container">
        {/* Section header */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ type: 'spring' as const, stiffness: 100, damping: 16 }}
          className="mb-14"
        >
          <p className="jelly-section-label">Experience</p>
          <h2 className="jelly-section-title max-w-xl">Professional journey</h2>
        </motion.div>

        {/* Timeline */}
        <div ref={timelineRef} className="relative max-w-3xl mx-auto">
          {/* Timeline line — GSAP grows it */}
          <div className="absolute left-[11px] lg:left-[15px] top-0 bottom-0 w-[2px]">
            <div className="timeline-line w-full h-full origin-top" style={{ background: 'linear-gradient(180deg, var(--jelly-teal), var(--jelly-amber))' }} />
          </div>

          <div className="flex flex-col gap-10 sm:gap-14">
            {experiences.map((exp, i) => (
              <motion.div
                key={exp.company}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ type: 'spring' as const, stiffness: 100, damping: 16, delay: i * 0.05 }}
                className="relative pl-10 lg:pl-14"
              >
                {/* Timeline dot */}
                <div className="absolute left-[5px] lg:left-[9px] top-6">
                  <div
                    className={`w-[14px] h-[14px] jelly-dot ${
                      exp.dotColor === 'teal' ? 'jelly-dot-teal' : 'jelly-dot-amber'
                    }`}
                    style={{ border: 'none' }}
                  />
                </div>

                {/* Card — subtle hover */}
                <motion.div
                  whileHover={{ y: -2, scale: 1.003 }}
                  transition={btnSpring}
                  className="jelly-card p-6 lg:p-7 group relative overflow-hidden"
                >
                  <div className={`jelly-caustic -bottom-6 left-1/4 right-1/4 h-12 ${
                    exp.dotColor === 'teal' ? 'jelly-caustic-teal' : 'jelly-caustic-amber'
                  }`} />

                  {/* Header */}
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-base font-semibold text-foreground">{exp.company}</h3>
                        {'badge' in exp && exp.badge && (
                          <span className="jelly-badge jelly-badge-amber">
                            {exp.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-foreground/70 font-medium">
                        {exp.role}
                        {'roleDate' in exp && exp.roleDate && (
                          <span className="text-[10px] text-muted-foreground/70 font-mono ml-2">({exp.roleDate})</span>
                        )}
                      </p>
                      {'prevRole' in exp && exp.prevRole && (
                        <p className="text-[11px] text-muted-foreground/80 font-mono mt-0.5">{exp.prevRole}</p>
                      )}
                      {'via' in exp && exp.via && (
                        <p className="text-[11px] text-muted-foreground/70 italic mt-0.5">{exp.via}</p>
                      )}
                    </div>
                    <div className="flex flex-col items-start sm:items-end gap-1 shrink-0">
                      <span className="font-mono text-[10px] sm:text-[11px] text-muted-foreground/80">{exp.period}</span>
                      <span className="text-[10px] sm:text-[11px] text-muted-foreground/70">{exp.location}</span>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">{exp.description}</p>

                  <div className="flex flex-col gap-2 mb-4">
                    {exp.highlights.map((h, j) => (
                      <div key={j} className="flex items-start gap-2 text-[11px] sm:text-xs text-muted-foreground leading-relaxed">
                        <ChevronRight size={12} className="mt-1 shrink-0" style={{ color: exp.color }} />
                        <span className="text-[11px] sm:text-xs leading-relaxed">{h}</span>
                      </div>
                    ))}
                  </div>

                  {/* Previous role highlights (for Meta) */}
                  {'prevHighlights' in exp && (exp as any).prevHighlights && (
                    <div className="mb-5">
                      <p className="text-[11px] font-semibold text-foreground/50 mb-2 mt-2 pt-3" style={{ borderTop: '1px solid oklch(0.50 0.005 80 / 8%)' }}>
                        As Sustaining Mechanical Engineer:
                      </p>
                      <div className="flex flex-col gap-1.5">
                        {((exp as any).prevHighlights as string[]).map((h: string, j: number) => (
                          <div key={`prev-${j}`} className="flex items-start gap-2 text-sm text-foreground/55">
                            <ChevronRight size={12} className="mt-1 shrink-0" style={{ color: exp.color, opacity: 0.6 }} />
                            <span className="text-xs leading-relaxed">{h}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Tech tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {exp.tech.map((t) => (
                      <span
                        key={t}
                        className="glass-pill px-2.5 py-1 text-[10px] font-mono cursor-default"
                        style={{
                          color: `oklch(from ${exp.color} l c h / 80%)`,
                          background: `oklch(from ${exp.color} l c h / 3%)`,
                          border: 'none',
                          boxShadow: `0 0 1px oklch(from ${exp.color} l c h / 8%)`,
                        }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
