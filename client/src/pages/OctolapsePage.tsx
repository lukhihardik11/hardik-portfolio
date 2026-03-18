/*
 * OctolapsePage — Hobby project showcasing DIY 3D printing timelapse setup
 * using an Android TV box running Armbian OS during the COVID-19 Raspberry Pi shortage.
 * Scroll animation comes FIRST, then text content below.
 */

import { useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ExternalLink, Youtube, Camera, Cpu, Terminal } from "lucide-react";
import { Link } from "wouter";
import { useTheme } from "@/contexts/ThemeContext";
import ProjectExplodedView from "@/components/ProjectExplodedView";
import { getFrameUrls } from "@/data/frameUrlsIndex";
import type { ProjectLabel } from "@/data/projects";

const YOUTUBE_CHANNEL_URL = "https://www.youtube.com/c/HardikLukhi";

const octolapseLabels: ProjectLabel[] = [
  {
    name: "DSLR Camera",
    desc: "Old DSLR connected via USB, controlled by gphoto2 for high-quality timelapse frames",
    threshold: 15,
    side: "right",
  },
  {
    name: "Tabletop Tripod",
    desc: "Compact tripod mount for stable, repeatable camera positioning",
    threshold: 25,
    side: "left",
  },
  {
    name: "3D Printer (Ender 3)",
    desc: "FDM printer with blue aluminum V-slot frame, connected to OctoPrint for remote control",
    threshold: 40,
    side: "right",
  },
  {
    name: "Android TV Box",
    desc: "$15 ARM device running Armbian Linux — Raspberry Pi alternative during chip shortage",
    threshold: 55,
    side: "left",
  },
  {
    name: "OctoPrint Server",
    desc: "Laptop running OctoPrint web interface with Octolapse plugin for synchronized captures",
    threshold: 70,
    side: "right",
  },
];

const techStack = [
  {
    icon: Cpu,
    title: "Android TV Box",
    desc: "Repurposed a cheap Android TV box as a Raspberry Pi alternative during the global chip shortage. Flashed with Armbian Linux for full Debian-based OS capabilities.",
    color: "#34d399",
  },
  {
    icon: Terminal,
    title: "Armbian OS",
    desc: "Installed Armbian (Debian-based Linux) on the Android TV box, providing a full command-line environment with SSH access, package management, and OctoPrint compatibility.",
    color: "#60a5fa",
  },
  {
    icon: Camera,
    title: "DSLR Camera Integration",
    desc: "Connected an old DSLR camera via USB for high-quality timelapse photography. Used gphoto2 for remote shutter control triggered by OctoPrint's Octolapse plugin.",
    color: "#fbbf24",
  },
  {
    icon: Youtube,
    title: "Octolapse Plugin",
    desc: "Configured the Octolapse plugin for OctoPrint to capture perfectly synchronized timelapse frames at each layer change, producing smooth cinematic 3D printing videos.",
    color: "#f87171",
  },
];

const highlights = [
  {
    label: "Cost Savings",
    value: "~$15",
    desc: "Android TV box vs $100+ Raspberry Pi during shortage",
  },
  {
    label: "Camera",
    value: "DSLR",
    desc: "High-quality photos via gphoto2 USB control",
  },
  {
    label: "OS",
    value: "Armbian",
    desc: "Full Debian Linux on ARM hardware",
  },
  {
    label: "Software",
    value: "OctoPrint",
    desc: "Remote 3D printer management + Octolapse",
  },
];

export default function OctolapsePage() {
  const { theme } = useTheme();
  const frameUrls = getFrameUrls("octolapse");

  // Ensure page starts at the top when navigating here
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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

      {/* SCROLL ANIMATION FIRST */}
      {frameUrls.length > 0 && (
        <ProjectExplodedView
          frameUrls={frameUrls}
          labels={octolapseLabels}
          accentColor="#a855f7"
          title="DIY 3D Printing Timelapse System"
          subtitle="Hobby Project — Octolapse"
          disclaimer="Setup visualization: Android TV box + Armbian OS + DSLR + OctoPrint + Octolapse plugin"
        />
      )}

      {/* Text content BELOW the animation */}
      {/* Hero section */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        {/* Background gradient */}
        <div
          className="absolute inset-0"
          style={{
            background:
              theme === "dark"
                ? "linear-gradient(135deg, #0a0a0a 0%, #1a0a2e 50%, #0a1628 100%)"
                : "linear-gradient(135deg, #f8fafc 0%, #ede9fe 50%, #dbeafe 100%)",
          }}
        />

        {/* Animated grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />

        <div className="relative z-10 container max-w-4xl mx-auto px-4 sm:px-6 py-20 sm:py-32 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-3 py-1 rounded-full text-[10px] font-mono tracking-wider uppercase mb-6 bg-purple-500/10 text-purple-400 border border-purple-500/20">
              Hobby Project
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-6xl font-bold tracking-tight mb-6"
          >
            Octolapse
            <span className="block text-lg sm:text-2xl md:text-3xl font-light text-muted-foreground mt-2">
              DIY 3D Printing Timelapse System
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed"
          >
            During the COVID-19 pandemic, when Raspberry Pi boards were impossible to find,
            I repurposed a cheap Android TV box with Armbian OS to run OctoPrint and create
            stunning 3D printing timelapses with an old DSLR camera.
          </motion.p>

          <motion.a
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            href={YOUTUBE_CHANNEL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-red-600 text-white font-medium text-sm no-underline hover:bg-red-700 transition-colors"
          >
            <Youtube size={18} />
            Watch on YouTube
            <ExternalLink size={14} />
          </motion.a>
        </div>
      </section>

      {/* The Story */}
      <section className="py-24 md:py-32">
        <div className="container max-w-4xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-16"
          >
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-6">The Challenge</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed text-sm md:text-base">
              <p>
                In 2021-2022, the global semiconductor shortage made Raspberry Pi boards
                nearly impossible to purchase at retail prices. Boards that normally cost $35
                were being scalped for $100-200+. As a 3D printing enthusiast wanting to set
                up OctoPrint for remote printer management and Octolapse for cinematic
                timelapses, I needed an alternative solution.
              </p>
              <p>
                The solution came from an unlikely source: a cheap Android TV box purchased
                for roughly $15. These ARM-based devices share similar hardware architecture
                with the Raspberry Pi (ARM processor, USB ports, HDMI, ethernet) but were
                still readily available and affordable during the shortage.
              </p>
              <p>
                By flashing the Android TV box with Armbian — a Debian-based Linux
                distribution optimized for ARM single-board computers — I was able to create
                a fully functional OctoPrint server. Combined with an old DSLR camera
                connected via USB and controlled through gphoto2, the setup produced
                professional-quality 3D printing timelapses at a fraction of the cost.
              </p>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16"
          >
            {highlights.map((h, i) => (
              <div
                key={i}
                className="p-4 rounded-xl text-center"
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
                <div className="text-xl md:text-2xl font-bold font-mono text-purple-400">
                  {h.value}
                </div>
                <div className="text-xs font-medium mt-1">{h.label}</div>
                <div className="text-[10px] text-muted-foreground/50 mt-0.5">
                  {h.desc}
                </div>
              </div>
            ))}
          </motion.div>

          {/* Tech Stack */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-16"
          >
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-8">
              Technical Setup
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {techStack.map((tech, i) => {
                const Icon = tech.icon;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.1 }}
                    className="p-5 rounded-xl"
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
                    <div className="flex items-start gap-4">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                        style={{
                          background: `${tech.color}15`,
                          border: `1px solid ${tech.color}25`,
                        }}
                      >
                        <Icon size={18} style={{ color: tech.color }} />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold mb-1">
                          {tech.title}
                        </h4>
                        <p className="text-xs text-muted-foreground/60 leading-relaxed">
                          {tech.desc}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* How it works */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mb-16"
          >
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-8">How It Works</h2>
            <div className="space-y-4">
              {[
                {
                  step: "01",
                  title: "Flash Armbian",
                  desc: "Write Armbian image to SD card, boot the Android TV box from SD, and install to internal eMMC storage for reliability.",
                },
                {
                  step: "02",
                  title: "Install OctoPrint",
                  desc: "Set up Python virtual environment, install OctoPrint via pip, configure it as a systemd service for auto-start on boot.",
                },
                {
                  step: "03",
                  title: "Connect DSLR",
                  desc: "Plug in DSLR via USB, install gphoto2 for remote camera control. Configure Octolapse to trigger captures via gphoto2 commands.",
                },
                {
                  step: "04",
                  title: "Configure Octolapse",
                  desc: "Set up stabilization points, camera triggers, and rendering settings. The printer moves to a fixed position at each layer change for consistent framing.",
                },
                {
                  step: "05",
                  title: "Print & Capture",
                  desc: "Start a print job. At each layer change, the printer pauses, moves to the snapshot position, triggers the DSLR, then resumes printing.",
                },
                {
                  step: "06",
                  title: "Render Timelapse",
                  desc: "Octolapse automatically compiles all captured frames into a smooth timelapse video showing the object materializing layer by layer.",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-start gap-4 p-4 rounded-xl"
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
                  <span className="text-lg font-bold font-mono text-purple-400/60 shrink-0 w-8">
                    {item.step}
                  </span>
                  <div>
                    <h4 className="text-sm font-semibold mb-1">{item.title}</h4>
                    <p className="text-xs text-muted-foreground/60 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* YouTube CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="p-8 rounded-2xl text-center mb-16"
            style={{
              background:
                theme === "dark"
                  ? "linear-gradient(135deg, rgba(139,92,246,0.1), rgba(59,130,246,0.05))"
                  : "linear-gradient(135deg, rgba(139,92,246,0.08), rgba(59,130,246,0.04))",
              border: `1px solid ${
                theme === "dark"
                  ? "rgba(139,92,246,0.15)"
                  : "rgba(139,92,246,0.12)"
              }`,
            }}
          >
            <Youtube size={40} className="mx-auto mb-4 text-red-500" />
            <h3 className="text-lg font-semibold mb-2">
              Watch the Timelapses
            </h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
              Check out the results on my YouTube channel — smooth, cinematic 3D
              printing timelapses captured with this DIY setup.
            </p>
            <a
              href={YOUTUBE_CHANNEL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-red-600 text-white font-medium text-sm no-underline hover:bg-red-700 transition-colors"
            >
              <Youtube size={16} />
              Visit YouTube Channel
              <ExternalLink size={14} />
            </a>
          </motion.div>

          {/* Tags */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mb-16"
          >
            <h3 className="text-lg font-semibold mb-4">
              Technologies & Skills
            </h3>
            <div className="flex flex-wrap gap-2">
              {[
                "Armbian",
                "OctoPrint",
                "Octolapse",
                "gphoto2",
                "Linux",
                "ARM SBC",
                "3D Printing",
                "DSLR Photography",
                "Python",
                "systemd",
                "SSH",
                "Networking",
              ].map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1.5 rounded-lg text-xs font-mono text-purple-400/80 bg-purple-500/10 border border-purple-500/15"
                >
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Back link */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.6 }}
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
