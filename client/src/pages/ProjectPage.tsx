/*
 * ProjectPage — Individual project detail page with scroll-driven exploded view animation.
 * Renders project metadata, the canvas flipbook animation, and technical details.
 */

import { useParams, Link } from "wouter";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ExternalLink, ChevronLeft, ChevronRight, X } from "lucide-react";
import { getProjectById } from "@/data/projects";
import { getFrameUrls } from "@/data/frameUrlsIndex";
import ProjectExplodedView from "@/components/ProjectExplodedView";
import { useTheme } from "@/contexts/ThemeContext";

export default function ProjectPage() {
  const params = useParams<{ id: string }>();
  const projectId = params.id ?? "";
  const project = getProjectById(projectId);
  const frameUrls = getFrameUrls(projectId);
  const { theme } = useTheme();

  // Ensure page starts at the top when navigating to a project
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [projectId]);

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Project Not Found</h1>
          <p className="text-muted-foreground mb-8">
            The project you're looking for doesn't exist.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-foreground text-background font-medium text-sm no-underline hover:opacity-90 transition-opacity"
          >
            <ArrowLeft size={16} />
            Back to Portfolio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Fixed back button */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="fixed top-6 left-6 z-50"
      >
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white text-xs font-medium no-underline hover:bg-black/80 transition-colors"
        >
          <ArrowLeft size={14} />
          Back
        </Link>
      </motion.div>

      {/* Scroll-driven exploded view animation */}
      {project.hasAnimation && frameUrls.length > 0 && (
        <ProjectExplodedView
          frameUrls={frameUrls}
          labels={project.labels}
          accentColor={project.accentColor}
          title={project.title}
          subtitle={project.category}
          disclaimer={project.disclaimer}
          contentCropX={project.contentCropX}
          animBgColor={project.animBgColor}
          fitMode={project.fitMode}
        />
      )}

      {/* Gallery hero for non-animated projects */}
      {!project.hasAnimation && project.galleryImages && project.galleryImages.length > 0 && (
        <ProjectGalleryHero
          images={project.galleryImages}
          title={project.title}
          category={project.category}
          accentColor={project.accentColor}
        />
      )}

      {/* Project details section */}
      <section className="relative py-24 md:py-32">
        <div className="container max-w-4xl mx-auto px-4 sm:px-6">
          {/* Category badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span
              className="inline-block px-3 py-1 rounded-full text-[10px] font-mono tracking-wider uppercase mb-6"
              style={{
                color: project.accentColor,
                background: `${project.accentColor}15`,
                border: `1px solid ${project.accentColor}25`,
              }}
            >
              {project.category}
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-2xl sm:text-3xl md:text-5xl font-bold tracking-tight mb-4"
          >
            {project.title}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg text-muted-foreground mb-12"
          >
            {project.subtitle}
          </motion.p>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-16 p-4 sm:p-6 rounded-2xl"
            style={{
              background:
                theme === "dark"
                  ? "rgba(255,255,255,0.03)"
                  : "rgba(0,0,0,0.02)",
              border: `1px solid ${
                theme === "dark"
                  ? "rgba(255,255,255,0.06)"
                  : "rgba(0,0,0,0.06)"
              }`,
            }}
          >
            {project.stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div
                  className="text-2xl md:text-3xl font-bold font-mono"
                  style={{ color: project.accentColor }}
                >
                  {stat.value}
                </div>
                <div className="text-xs text-muted-foreground/60 mt-1 uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>

          {/* Long description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mb-16"
          >
            <h3 className="text-lg font-semibold mb-4">Overview</h3>
            <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
              {project.longDescription}
            </p>
          </motion.div>

          {/* Component breakdown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mb-16"
          >
            <h3 className="text-lg font-semibold mb-6">Component Breakdown</h3>
            <div className="space-y-3">
              {project.labels.map((label, i) => (
                <div
                  key={i}
                  className="flex items-start gap-4 p-4 rounded-xl transition-colors"
                  style={{
                    background:
                      theme === "dark"
                        ? "rgba(255,255,255,0.02)"
                        : "rgba(0,0,0,0.015)",
                    border: `1px solid ${
                      theme === "dark"
                        ? "rgba(255,255,255,0.04)"
                        : "rgba(0,0,0,0.04)"
                    }`,
                  }}
                >
                  <div
                    className="w-2 h-2 rounded-full mt-1.5 shrink-0"
                    style={{
                      backgroundColor: project.accentColor,
                      boxShadow: `0 0 8px ${project.accentColor}40`,
                    }}
                  />
                  <div>
                    <div className="text-sm font-medium">{label.name}</div>
                    <div className="text-xs text-muted-foreground/60 mt-0.5">
                      {label.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Tags */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mb-16"
          >
            <h3 className="text-lg font-semibold mb-4">Technologies & Skills</h3>
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1.5 rounded-lg text-xs font-mono"
                  style={{
                    color: `${project.accentColor}cc`,
                    background: `${project.accentColor}10`,
                    border: `1px solid ${project.accentColor}20`,
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Back to portfolio */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="pt-8 border-t"
            style={{
              borderColor:
                theme === "dark"
                  ? "rgba(255,255,255,0.06)"
                  : "rgba(0,0,0,0.06)",
            }}
          >
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors no-underline"
            >
              <ArrowLeft size={14} />
              Back to all projects
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

/** Gallery hero section for non-animated projects */
function ProjectGalleryHero({
  images,
  title,
  category,
  accentColor,
}: {
  images: { url: string; caption: string }[];
  title: string;
  category: string;
  accentColor: string;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const next = () => setCurrentIndex((i) => (i + 1) % images.length);
  const prev = () => setCurrentIndex((i) => (i - 1 + images.length) % images.length);

  return (
    <>
      <section className="relative min-h-screen flex flex-col">
        {/* Hero image */}
        <div className="relative flex-1 min-h-[60vh]">
          <AnimatePresence mode="wait">
            <motion.img
              key={currentIndex}
              src={images[currentIndex].url}
              alt={images[currentIndex].caption}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0 w-full h-full object-contain bg-black/90 cursor-pointer"
              onClick={() => {
                setLightboxIndex(currentIndex);
                setLightboxOpen(true);
              }}
            />
          </AnimatePresence>

          {/* Navigation arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={prev}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/50 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-black/70 transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={next}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/50 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-black/70 transition-colors"
              >
                <ChevronRight size={20} />
              </button>
            </>
          )}

          {/* Overlay text */}
          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
            <p
              className="text-[10px] font-mono tracking-[0.25em] uppercase mb-2"
              style={{ color: accentColor }}
            >
              {category}
            </p>
            <h1 className="text-xl sm:text-3xl md:text-4xl font-bold text-white mb-2">
              {title}
            </h1>
            <p className="text-xs text-white/60">
              {images[currentIndex].caption}
            </p>
          </div>

          {/* Dot indicators */}
          <div className="absolute bottom-4 right-6 flex gap-1.5 z-10">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className="w-2 h-2 rounded-full transition-all"
                style={{
                  backgroundColor: i === currentIndex ? accentColor : "rgba(255,255,255,0.3)",
                  transform: i === currentIndex ? "scale(1.3)" : "scale(1)",
                }}
              />
            ))}
          </div>
        </div>

        {/* Thumbnail strip */}
        <div className="bg-black/95 border-t border-white/5 px-4 py-3 overflow-x-auto">
          <div className="flex gap-2 justify-center">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className="relative w-20 h-14 rounded-lg overflow-hidden shrink-0 transition-all"
                style={{
                  border: i === currentIndex ? `2px solid ${accentColor}` : "2px solid transparent",
                  opacity: i === currentIndex ? 1 : 0.5,
                }}
              >
                <img
                  src={img.url}
                  alt={img.caption}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
            onClick={() => setLightboxOpen(false)}
          >
            <button
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
              onClick={() => setLightboxOpen(false)}
            >
              <X size={20} />
            </button>
            <img
              src={images[lightboxIndex].url}
              alt={images[lightboxIndex].caption}
              className="max-w-[90vw] max-h-[90vh] object-contain"
              onClick={(e) => e.stopPropagation()}
            />
            <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-xs text-white/60">
              {images[lightboxIndex].caption}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
