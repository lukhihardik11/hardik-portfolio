/*
 * PROJECTS — Engineering Project Cards with project thumbnail images
 * All projects displayed in a uniform grid layout.
 * Cards have subtle hover effects. No hover on tags, stats, badges.
 */
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef, useEffect } from "react";
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useFineHover } from '../hooks/useFineHover';
import { JellyWrapper } from '@/components/JellyWrapper';

gsap.registerPlugin(ScrollTrigger);
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { projects } from "@/data/projects";
import { getProjectThumbnail } from "@/data/frameUrlsIndex";

const btnSpring = {
  type: "spring" as const,
  stiffness: 200,
  damping: 15,
  mass: 0.8,
};

export function ProjectsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  /* Scroll-reactive wobble — desktop only */
  const isFine = useFineHover();
  const sectionSkew = useTransform(
    scrollYProgress,
    [0, 0.3, 0.5, 0.7, 1],
    isFine ? [0.15, -0.08, 0, 0.05, -0.1] : [0, 0, 0, 0, 0]
  );
  const sectionSX = useTransform(
    scrollYProgress,
    [0, 0.3, 0.5, 0.7, 1],
    isFine ? [1.001, 0.999, 1, 1.001, 0.999] : [1, 1, 1, 1, 1]
  );
  const sectionSY = useTransform(
    scrollYProgress,
    [0, 0.3, 0.5, 0.7, 1],
    isFine ? [0.999, 1.001, 1, 0.999, 1.001] : [1, 1, 1, 1, 1]
  );
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
      id="projects"
      ref={sectionRef}
      style={{ skewX: springSkew, scaleX: springSX, scaleY: springSY }}
      className="relative py-16 sm:py-24 lg:py-32 overflow-hidden"
    >
      {/* Floating blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute w-[450px] h-[450px] top-1/4 -right-32 jelly-float-blob-1 opacity-0 dark:opacity-15"
          style={{
            background:
              "radial-gradient(ellipse, oklch(0.55 0.18 230 / 10%) 0%, transparent 70%)",
            borderRadius: "60% 40% 30% 70% / 60% 30% 70% 40%",
          }}
        />
      </div>

      <div className="container">
        {/* Section header */}
        <motion.div
          ref={headerRef}
          initial={{
            opacity: 0,
            y: 30,
            scaleX: 0.95,
            scaleY: 1.05,
            rotate: -1,
          }}
          whileInView={{ opacity: 1, y: 0, scaleX: 1, scaleY: 1, rotate: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{
            type: "spring" as const,
            stiffness: 120,
            damping: 10,
            mass: 1.2,
          }}
          className="mb-12 sm:mb-16"
        >
          <p className="jelly-section-label">Projects</p>
          <h2 className="jelly-section-title max-w-xl">
            Engineering that pushes boundaries
          </h2>
          <p className="text-sm text-muted-foreground/60 mt-3 max-w-lg">
            Click any project to explore its interactive scroll-driven assembly
            animation
          </p>
        </motion.div>

        {/* Uniform Project Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5 lg:gap-6">
          {projects.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{
                opacity: 0,
                y: 40,
                scaleX: 0.95,
                scaleY: 1.05,
                rotate: i % 2 === 0 ? -1.5 : 1.5,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
                scaleX: 1,
                scaleY: 1,
                rotate: 0,
              }}
              viewport={{ once: true }}
              transition={{
                type: "spring" as const,
                stiffness: 130,
                damping: 10,
                mass: 1,
                delay: i * 0.06,
              }}
              className="rounded-[1.25rem]"
              style={{ background: 'inherit' }}
            >
              <ProjectCard project={project} index={i} />
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

function ProjectCard({
  project,
  index,
}: {
  project: (typeof projects)[0];
  index: number;
}) {
  const thumbnail = getProjectThumbnail(project.id);
  const href = project.id === "octolapse" ? "/project/octolapse" : `/project/${project.id}`;

  return (
    <Link
      href={href}
      className="no-underline block h-full"
    >
      <JellyWrapper
        intensity="bouncy"
        noEntrance
        hoverScale={1.02}
        className="jelly-card gel-fill overflow-hidden group relative cursor-pointer h-full flex flex-col"
      >
        <div className="jelly-caustic jelly-caustic-amber -bottom-4 left-1/4 right-1/4 h-10" />

        {/* Project thumbnail image — fills container */}
        <div
          className="relative h-48 sm:h-52 overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${project.accentColor}15, ${project.accentColor}05)`,
          }}
        >
          {thumbnail ? (
            <>
              <img
                src={thumbnail}
                alt={project.title}
                className="absolute inset-0 w-full h-full object-cover"
                loading="lazy"
                style={project.contentCropX ? { transform: `scale(${1 / (1 - 2 * project.contentCropX)})` } : undefined}
              />
              {/* Dark vignette overlay to blend light-bg thumbnails with dark theme */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 pointer-events-none" />
            </>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div
                  className="w-14 h-14 rounded-xl mx-auto mb-3 flex items-center justify-center"
                  style={{
                    background: `${project.accentColor}12`,
                    border: `1px solid ${project.accentColor}20`,
                  }}
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={project.accentColor}
                    strokeWidth="1.5"
                  >
                    <path d="M12 2L2 7l10 5 10-5-10-5z" />
                    <path d="M2 17l10 5 10-5" />
                    <path d="M2 12l10 5 10-5" />
                  </svg>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 sm:p-5 flex flex-col flex-1">
          <p className="text-[10px] font-mono text-muted-foreground/40 mb-1">
            {project.category}
          </p>
          <h3 className="text-xs sm:text-sm font-semibold text-foreground mb-1 line-clamp-2">
            {project.title}
          </h3>
          <p className="text-[11px] sm:text-xs text-muted-foreground leading-relaxed mb-3 sm:mb-4 line-clamp-2">
            {project.description}
          </p>

          {/* Stats — no hover */}
          <div className="flex gap-2 sm:gap-3 mb-3 sm:mb-4">
            {project.stats.map((stat) => (
              <div key={stat.label} className="text-center flex-1">
                <div
                  className="text-[11px] sm:text-xs font-bold font-mono"
                  style={{ color: project.accentColor }}
                >
                  {stat.value}
                </div>
                <div className="text-[8px] sm:text-[9px] text-muted-foreground/40">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* Tags — no hover */}
          <div className="flex flex-wrap gap-1 mb-3 sm:mb-4">
            {project.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="glass-pill px-1.5 sm:px-2 py-0.5 text-[8px] sm:text-[9px] font-mono cursor-default"
                style={{
                  color: `${project.accentColor}b3`,
                  background: `${project.accentColor}0a`,
                  borderColor: `${project.accentColor}15`,
                }}
              >
                {tag}
              </span>
            ))}
            {project.tags.length > 3 && (
              <span className="px-1.5 py-0.5 text-[8px] sm:text-[9px] font-mono text-muted-foreground/30">
                +{project.tags.length - 3}
              </span>
            )}
          </div>

          {/* Explore button — standardized, pushed to bottom */}
          <div className="mt-auto">
            <ExploreButton color={project.accentColor} />
          </div>
        </div>
      </JellyWrapper>
    </Link>
  );
}

/** Standardized Explore button used across all project cards */
function ExploreButton({ color, label = "Explore" }: { color: string; label?: string }) {
  return (
    <div
      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium group-hover:gap-3 transition-all duration-300"
      style={{
        color: color,
        background: `${color}12`,
        border: `1px solid ${color}20`,
      }}
    >
      {label}
      <ArrowRight
        size={13}
        className="group-hover:translate-x-1 transition-transform"
      />
    </div>
  );
}
