/*
 * ExplodedView — GSAP ScrollTrigger-Driven Canvas Flipbook
 * 
 * Uses GSAP ScrollTrigger for:
 * - Pinning the canvas viewport during scroll
 * - Smooth scrub (0.5s) linking scroll position to frame index
 * - Timeline-driven staggered label reveals with connector line animations
 * - Text mask reveals (clip-path) on the title
 * - Progress bar driven by ScrollTrigger onUpdate
 */

import { useRef, useEffect, useState, useCallback } from "react";
import { FRAME_URLS, TOTAL_FRAMES } from "./frameUrls";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ExplodedView() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef(0);
  const [loadProgress, setLoadProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [scrollPercent, setScrollPercent] = useState(0);
  const labelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const titleRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const scrollHintRef = useRef<HTMLDivElement>(null);
  const statusBadgeRef = useRef<HTMLDivElement>(null);

  // Draw a specific frame on the canvas
  const drawFrame = useCallback((frameIndex: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const images = imagesRef.current;
    const idx = Math.max(0, Math.min(frameIndex, TOTAL_FRAMES - 1));
    const img = images[idx];

    if (!img || !img.complete || img.naturalWidth === 0) return;

    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const w = rect.width;
    const h = rect.height;

    if (canvas.width !== Math.round(w * dpr) || canvas.height !== Math.round(h * dpr)) {
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    ctx.clearRect(0, 0, w, h);

    const imgAspect = img.naturalWidth / img.naturalHeight;
    const canvasAspect = w / h;

    let drawW: number, drawH: number, drawX: number, drawY: number;

    if (imgAspect > canvasAspect) {
      drawH = h;
      drawW = h * imgAspect;
      drawX = (w - drawW) / 2;
      drawY = 0;
    } else {
      drawW = w;
      drawH = w / imgAspect;
      drawX = 0;
      drawY = (h - drawH) / 2;
    }

    ctx.drawImage(img, drawX, drawY, drawW, drawH);
    currentFrameRef.current = idx;
  }, []);

  // Preload all frames
  useEffect(() => {
    let loadedCount = 0;
    const images: HTMLImageElement[] = new Array(TOTAL_FRAMES);

    const onLoad = () => {
      loadedCount++;
      setLoadProgress(Math.round((loadedCount / TOTAL_FRAMES) * 100));
      if (loadedCount === TOTAL_FRAMES) {
        imagesRef.current = images;
        setIsLoaded(true);
        drawFrame(0);
      }
    };

    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = onLoad;
      img.onerror = onLoad;
      img.src = FRAME_URLS[i];
      images[i] = img;
    }

    return () => {
      images.forEach((img) => {
        img.onload = null;
        img.onerror = null;
      });
    };
  }, [drawFrame]);

  // GSAP ScrollTrigger setup — replaces raw scroll listener
  useEffect(() => {
    if (!isLoaded || !sectionRef.current) return;

    const frameObj = { frame: 0 };

    // Main timeline with ScrollTrigger
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.5,
        onUpdate: (self) => {
          const pct = Math.round(self.progress * 100);
          setScrollPercent(pct);

          // Update progress bar
          if (progressBarRef.current) {
            progressBarRef.current.style.height = `${pct}%`;
          }
        },
      },
    });

    // Frame sequence animation — ease: "none" for linear mapping
    tl.to(frameObj, {
      frame: TOTAL_FRAMES - 1,
      ease: "none",
      duration: 10,
      onUpdate: () => {
        const idx = Math.round(frameObj.frame);
        if (idx !== currentFrameRef.current) {
          drawFrame(idx);
        }
      },
    });

    // Title mask reveal
    if (titleRef.current) {
      gsap.fromTo(
        titleRef.current,
        { clipPath: "inset(0 100% 0 0)", opacity: 0 },
        {
          clipPath: "inset(0 0% 0 0)",
          opacity: 1,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "+=300",
            scrub: 0.3,
          },
        }
      );
    }

    // Staggered label reveals driven by scroll position
    labelRefs.current.forEach((labelEl, i) => {
      if (!labelEl) return;
      const label = labels[i];
      const isRight = label.side === "right";

      // Label card animation
      gsap.fromTo(
        labelEl,
        {
          opacity: 0,
          x: isRight ? 60 : -60,
          scale: 0.9,
        },
        {
          opacity: 1,
          x: 0,
          scale: 1,
          duration: 0.8,
          ease: "back.out(1.4)",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: `top+=${label.threshold * 40} top`,
            end: `top+=${label.threshold * 40 + 200} top`,
            scrub: 0.3,
          },
        }
      );

    });

    // Scroll hint fade out
    if (scrollHintRef.current) {
      gsap.to(scrollHintRef.current, {
        opacity: 0,
        y: 20,
        duration: 0.5,
        ease: "power2.in",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=200",
          scrub: true,
        },
      });
    }

    // Status badge fade in
    if (statusBadgeRef.current) {
      gsap.fromTo(
        statusBadgeRef.current,
        { opacity: 0, y: -10 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "+=100",
            scrub: 0.3,
          },
        }
      );
    }

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === sectionRef.current) {
          st.kill();
        }
      });
    };
  }, [isLoaded, drawFrame]);

  // Handle resize
  useEffect(() => {
    if (!isLoaded) return;

    const handleResize = () => {
      drawFrame(currentFrameRef.current);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isLoaded, drawFrame]);

  // Layer labels that appear at specific scroll percentages
  const labels = [
    { name: "Top Cover", desc: "Matte black polycarbonate shell with green LED indicator", threshold: 15, side: "right" as const },
    { name: "Logic Board", desc: "Custom PCB with MCU, Bluetooth module & signal processing", threshold: 30, side: "left" as const },
    { name: "Battery", desc: "Lithium polymer cell for all-day wearable operation", threshold: 45, side: "right" as const },
    { name: "Housing Frame", desc: "Structural frame with band mount & vibration motor", threshold: 60, side: "left" as const },
    { name: "Electrode Array", desc: "Gold circular EMG sensor pads for skin contact", threshold: 75, side: "right" as const },
  ];

  return (
    <section
      id="engineering"
      ref={sectionRef}
      className="relative"
      style={{ height: "500vh" }}
    >
      {/* Sticky container that pins the canvas to the viewport */}
      <div ref={stickyRef} className="sticky top-0 h-screen w-full overflow-hidden bg-black">
        {/* Loading overlay */}
        {!isLoaded && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black">
            <div className="mb-6 text-sm font-mono tracking-[0.3em] text-white/40 uppercase">
              Loading Engineering View
            </div>
            <div className="w-56 h-[2px] bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-300 ease-out"
                style={{
                  width: `${loadProgress}%`,
                  background: "linear-gradient(90deg, #fbbf24, #f59e0b)",
                }}
              />
            </div>
            <div className="mt-3 text-xs text-white/30 font-mono tabular-nums">
              {loadProgress}%
            </div>
          </div>
        )}

        {/* The canvas — full viewport */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          style={{
            opacity: isLoaded ? 1 : 0,
            transition: "opacity 0.8s ease",
          }}
        />

        {/* Header overlay — top left with gradient for readability */}
        <div
          className="absolute top-0 left-0 right-0 z-10 pointer-events-none"
          style={{
            opacity: isLoaded ? 1 : 0,
            transition: "opacity 0.6s ease 0.3s",
            background: "linear-gradient(to bottom, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.6) 50%, transparent 100%)",
          }}
        >
          <div ref={titleRef} className="px-4 pt-16 pb-12 sm:px-6 sm:pt-20 sm:pb-16 md:px-12 md:pt-24 md:pb-20">
            <p className="text-[10px] md:text-xs font-mono tracking-[0.3em] text-amber-400/70 uppercase mb-2">
              Engineering
            </p>
            <h2 className="text-xl sm:text-2xl md:text-4xl font-bold text-white tracking-tight">
              Scroll to Disassemble
            </h2>
            <p className="mt-1 text-sm md:text-base text-white/40 font-light max-w-md">
              Precision-engineered for bioelectric signal acquisition
            </p>
            <p className="mt-3 text-[9px] md:text-[10px] text-white/25 font-mono max-w-lg leading-relaxed italic">
              Disclaimer: This wristband is for demonstration purposes only and is not a real product. While I have worked on EMG products professionally, this render does not represent any proprietary design to protect Intellectual Property (IP).
            </p>
          </div>
        </div>

        {/* Progress bar — left edge, driven by GSAP */}
        <div
          className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-10 pointer-events-none"
          style={{
            opacity: isLoaded ? 1 : 0,
            transition: "opacity 0.6s ease 0.5s",
          }}
        >
          <div className="flex flex-col items-center gap-3">
            <div className="w-[2px] h-24 bg-white/10 rounded-full overflow-hidden">
              <div
                ref={progressBarRef}
                className="w-full bg-amber-400 rounded-full"
                style={{ height: "0%", transition: "none" }}
              />
            </div>
            <span className="text-[10px] font-mono text-white/30 tabular-nums">
              {scrollPercent}%
            </span>
          </div>
        </div>

        {/* Status badge — top right */}
        <div
          ref={statusBadgeRef}
          className="absolute top-16 sm:top-20 md:top-24 right-4 sm:right-6 md:right-12 z-10 pointer-events-none"
          style={{ opacity: 0 }}
        >
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 backdrop-blur-md border border-white/10">
            <div
              className="w-1.5 h-1.5 rounded-full transition-colors duration-300"
              style={{
                backgroundColor:
                  scrollPercent < 5
                    ? "#34d399"
                    : scrollPercent > 90
                    ? "#f87171"
                    : "#fbbf24",
              }}
            />
            <span className="text-[10px] font-mono text-white/60 tracking-wider uppercase">
              {scrollPercent < 5
                ? "Assembled"
                : scrollPercent > 90
                ? "Exploded"
                : "Disassembling"}
            </span>
          </div>
        </div>

        {/* Layer labels — GSAP-driven staggered reveals */}
        {isLoaded &&
          labels.map((label, i) => {
            const isRight = label.side === "right";
            return (
              <div
                key={i}
                ref={(el) => { labelRefs.current[i] = el; }}
                className={`absolute z-10 pointer-events-none hidden md:block ${
                  isRight ? "right-6 md:right-16" : "left-6 md:left-16"
                }`}
                style={{
                  top: `${18 + i * 13}%`,
                  opacity: 0,
                }}
              >
                <div
                  className={`flex items-center gap-3 ${
                    isRight ? "flex-row" : "flex-row-reverse"
                  }`}
                >
                  {/* Label card — glassmorphism */}
                  <div
                    className={`px-4 py-2.5 rounded-xl backdrop-blur-md border border-white/10 ${
                      isRight ? "text-left" : "text-right"
                    }`}
                    style={{
                      background: "rgba(0,0,0,0.6)",
                      boxShadow: "0 4px 30px rgba(0,0,0,0.1), 0 0 20px rgba(251,191,36,0.05)",
                    }}
                  >
                    <div className="text-xs font-semibold text-white/90 tracking-wide">
                      {label.name}
                    </div>
                    <div className="text-[10px] text-white/40 mt-0.5 max-w-[200px] leading-relaxed">
                      {label.desc}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

        {/* Scroll hint at bottom */}
        {isLoaded && (
          <div
            ref={scrollHintRef}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 pointer-events-none"
          >
            <div className="flex flex-col items-center gap-3">
              <span className="text-[10px] font-mono text-white/25 tracking-[0.3em] uppercase">
                Scroll to explore
              </span>
              <svg
                width="20"
                height="30"
                viewBox="0 0 20 30"
                fill="none"
                className="text-white/20"
              >
                <rect
                  x="1"
                  y="1"
                  width="18"
                  height="28"
                  rx="9"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <circle cx="10" cy="10" r="2.5" fill="currentColor">
                  <animate
                    attributeName="cy"
                    values="10;20;10"
                    dur="1.5s"
                    repeatCount="indefinite"
                  />
                </circle>
              </svg>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
