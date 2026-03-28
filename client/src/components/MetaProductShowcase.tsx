import { useRef, useEffect, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const IMAGES = {
  gen1: "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/gen1_nobg_667a4f55.png",
  gen2: "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/gen2_nobg_5152b37d.png",
  gen3: "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/gen3_nobg_8b276098.png",
  gen4: "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/gen4_nobg_f820031b.png",
  gen5side: "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/gen5_hq_side_66aace6e.png",
  gen5hero: "https://d2xsxph8kpxj0f.cloudfront.net/310519663369311609/hgFV94mVzuuSGundqkrv86/gen5_nobg_7c92a432.png",
};

interface Generation {
  id: number;
  name: string;
  year: string;
  era: string;
  tagline: string;
  description: string;
  specs: string[];
  image: string;
  sourceUrl: string;
  sourceLabel: string;
}

const PRIMARY_GENERATIONS: Generation[] = [
  {
    id: 3, name: "Internal Platform", year: "2020", era: "FB Connect Demo",
    tagline: "Industrial Precision",
    description: "A robust, industrial-grade wristband showcased at Facebook Connect. Thicker profile with gold-plated sensor arrays and advanced signal processing, designed for extensive internal testing and research validation.",
    specs: ["Industrial design", "Gold sensor arrays", "Robust housing", "Internal testing"],
    image: IMAGES.gen3,
    sourceUrl: "https://about.fb.com/news/2021/03/inside-facebook-reality-labs-wrist-based-interaction-for-the-next-computing-platform/",
    sourceLabel: "Meta Blog",
  },
  {
    id: 4, name: "Orion Companion", year: "2024", era: "AR Orion Demo",
    tagline: "Refined for AR",
    description: "A dramatically slimmer wristband with premium fabric exterior and gold sensor contacts. Paired with Orion AR glasses at Meta Connect 2024, demonstrating seamless neural input for augmented reality.",
    specs: ["Fabric exterior", "Slim profile", "AR-optimized", "Gold contacts"],
    image: IMAGES.gen4,
    sourceUrl: "https://about.fb.com/news/2024/09/introducing-orion-our-first-true-augmented-reality-glasses/",
    sourceLabel: "Meta Blog",
  },
  {
    id: 5, name: "Neural Band", year: "2025", era: "Consumer Launch",
    tagline: "Invisible Technology",
    description: "The consumer-ready Meta Neural Band — an ultra-slim woven textile wristband indistinguishable from a fashion accessory. All sEMG sensors hidden beneath the fabric, paired with Meta Ray-Ban Display glasses.",
    specs: ["Woven textile", "All-day comfort", "Hidden sensors", "Consumer-ready"],
    image: IMAGES.gen5hero,
    sourceUrl: "https://about.fb.com/news/2025/09/meta-ray-ban-display-ai-glasses-emg-wristband/",
    sourceLabel: "Meta Blog",
  },
];

const EARLIER_GENERATIONS: Generation[] = [
  {
    id: 1, name: "Research Prototype", year: "2015", era: "Ctrl-Labs Founded",
    tagline: "Where It Began",
    description: "The original research prototype featured exposed PCB circuitry with 16 sensor pods arranged in a circular band. Raw engineering — visible chips, solder points, and gold electrode contacts for direct skin-surface EMG capture.",
    specs: ["Exposed PCB design", "16 sensor pods", "Gold electrodes", "Research-grade"],
    image: IMAGES.gen1,
    sourceUrl: "https://www.theverge.com/2019/9/23/20881032/facebook-ctrl-labs-acquisition-neural-interface-armband-ar-vr-deal",
    sourceLabel: "The Verge",
  },
  {
    id: 2, name: "Development Kit", year: "2019", era: "Acquired by Meta",
    tagline: "Developer Ready",
    description: "A refined enclosed wristband with green LED indicators and a compact electronics module. This generation marked the transition from lab prototype to developer-ready hardware, coinciding with Meta acquisition of Ctrl-Labs.",
    specs: ["Enclosed housing", "LED indicators", "Silicone band", "Developer kit"],
    image: IMAGES.gen2,
    sourceUrl: "https://www.theverge.com/2019/9/23/20881032/facebook-ctrl-labs-acquisition-neural-interface-armband-ar-vr-deal",
    sourceLabel: "The Verge",
  },
];

const GESTURES = [
  { gesture: "Index Pinch", action: "Select / Go Back" },
  { gesture: "Swipe", action: "Scroll Content" },
  { gesture: "Pinch + Rotate", action: "Zoom / Volume" },
  { gesture: "Double Pinch", action: "Wake / Sleep" },
  { gesture: "Thumb Tap", action: "Activate Meta AI" },
];

export default function MetaProductShowcase() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const carouselWrapRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const gestureRef = useRef<HTMLDivElement>(null);
  const disclaimerRef = useRef<HTMLDivElement>(null);
  const earlierRef = useRef<HTMLDivElement>(null);
  const [showEarlier, setShowEarlier] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!sectionRef.current || !carouselRef.current || !carouselWrapRef.current) return;
    const cards = gsap.utils.toArray<HTMLElement>(carouselRef.current.querySelectorAll(".carousel-card"));
    if (cards.length === 0) return;

    const ctx = gsap.context(() => {
      if (titleRef.current) {
        gsap.fromTo(titleRef.current,
          { clipPath: "inset(0 100% 0 0)", opacity: 0 },
          { clipPath: "inset(0 0% 0 0)", opacity: 1, duration: 1.5, ease: "power3.out",
            scrollTrigger: { trigger: heroRef.current, start: "top 80%", once: true } }
        );
      }
      if (subtitleRef.current) {
        gsap.fromTo(subtitleRef.current,
          { opacity: 0, filter: "blur(10px)", y: 30 },
          { opacity: 1, filter: "blur(0px)", y: 0, duration: 1.2, delay: 0.3, ease: "power2.out",
            scrollTrigger: { trigger: heroRef.current, start: "top 80%", once: true } }
        );
      }

      // Initial card states
      cards.forEach((card, i) => {
        gsap.set(card, {
          opacity: i === 0 ? 1 : 0,
          scale: i === 0 ? 1 : 0.75,
          rotateY: i === 0 ? 0 : 60,
          z: i === 0 ? 0 : -500,
          visibility: i === 0 ? "visible" : "hidden",
          zIndex: i === 0 ? 2 : 1,
        });
      });

      // Pinned scroll timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: carouselWrapRef.current,
          start: "top top",
          end: () => "+=" + (cards.length * 100) + "%",
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          onUpdate: (self) => {
            const p = self.progress;
            const idx = Math.min(Math.floor(p * cards.length), cards.length - 1);
            setActiveIndex(idx);
            if (progressRef.current) {
              progressRef.current.style.transform = `scaleX(${p})`;
            }
          },
        },
      });

      // Staggered card transitions
      cards.forEach((card, i) => {
        if (i < cards.length - 1) {
          const nextCard = cards[i + 1];
          const pos = i;
          tl.to(card, {
            opacity: 0, scale: 0.6, rotateY: -60, z: -600,
            duration: 0.45, ease: "power3.in",
            onComplete: () => { gsap.set(card, { visibility: "hidden", zIndex: 1 }); },
          }, pos);
          tl.set(nextCard, { visibility: "visible", zIndex: 2 }, pos + 0.4);
          tl.fromTo(nextCard,
            { opacity: 0, scale: 0.75, rotateY: 60, z: -500 },
            { opacity: 1, scale: 1, rotateY: 0, z: 0, duration: 0.55, ease: "power3.out" },
            pos + 0.45
          );
        }
      });

      if (gestureRef.current) {
        gsap.fromTo(gestureRef.current,
          { opacity: 0, y: 60 },
          { opacity: 1, y: 0, duration: 1, ease: "power2.out",
            scrollTrigger: { trigger: gestureRef.current, start: "top 85%", once: true } }
        );
      }
      if (disclaimerRef.current) {
        gsap.fromTo(disclaimerRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.8, ease: "power2.out",
            scrollTrigger: { trigger: disclaimerRef.current, start: "top 90%", once: true } }
        );
      }
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (!showEarlier || !earlierRef.current) return;
    const cards = earlierRef.current.querySelectorAll(".earlier-card");
    const ctx = gsap.context(() => {
      cards.forEach((card, i) => {
        gsap.fromTo(card,
          { opacity: 0, y: 60, scale: 0.9, rotateY: i % 2 === 0 ? -8 : 8 },
          { opacity: 1, y: 0, scale: 1, rotateY: 0, duration: 0.8, delay: i * 0.15, ease: "power3.out",
            scrollTrigger: { trigger: card, start: "top 90%", once: true } }
        );
      });
    }, earlierRef);
    return () => ctx.revert();
  }, [showEarlier]);

  const handleToggle = useCallback(() => setShowEarlier((p) => !p), []);

  return (
    <section id="neural-band" ref={sectionRef} className="relative" style={{ background: "#0a0a0a", isolation: "isolate" }}>

      {/* Hero Header */}
      <div ref={heroRef} className="relative px-6 pt-24 pb-12 md:px-12 md:pt-32 md:pb-16 max-w-7xl mx-auto">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] pointer-events-none"
          style={{ background: "radial-gradient(ellipse at center, rgba(46,126,191,0.08) 0%, transparent 70%)" }} />
        <p className="text-xs font-mono tracking-[0.35em] uppercase mb-4" style={{ color: "rgba(232,168,56,0.7)" }}>Product Evolution</p>
        <h2 ref={titleRef} className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05]"
          style={{ color: "#f0f0f0", fontFamily: "'DM Sans', system-ui, sans-serif" }}>Meta Neural Band</h2>
        <p ref={subtitleRef} className="mt-4 md:mt-6 text-base md:text-xl max-w-2xl leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>
          A decade of innovation &mdash; from exposed circuit boards to an invisible wristband that reads your intentions. Powered by surface electromyography (sEMG).
        </p>
        <a href="https://www.meta.com/emerging-tech/emg-wearable-technology/" target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-2 mt-6 md:mt-8 text-sm font-medium transition-colors duration-200 hover:text-[#E8A838]" style={{ color: "#2E7EBF" }}>
          Learn more about EMG technology
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </a>
      </div>

      {/* 3D Rotating Carousel */}
      <div ref={carouselWrapRef} className="relative min-h-screen" style={{ background: "#0a0a0a", perspective: "1200px" }}>

        {/* Progress bar */}
        <div className="absolute top-0 left-0 right-0 z-30 h-[2px]" style={{ background: "rgba(255,255,255,0.06)" }}>
          <div ref={progressRef} className="h-full origin-left" style={{ background: "linear-gradient(90deg, #2E7EBF, #E8A838)", transform: "scaleX(0)" }} />
        </div>

        {/* Dot indicators */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3">
          {PRIMARY_GENERATIONS.map((gen, i) => (
            <div key={gen.id} className="flex items-center gap-3">
              <div className="flex flex-col items-center gap-1">
                <div className="w-2.5 h-2.5 rounded-full transition-all duration-500"
                  style={{ background: activeIndex === i ? "#E8A838" : "rgba(255,255,255,0.2)", transform: activeIndex === i ? "scale(1.3)" : "scale(1)" }} />
                <span className="text-[10px] font-mono transition-colors duration-500"
                  style={{ color: activeIndex === i ? "#E8A838" : "rgba(255,255,255,0.3)" }}>{gen.year}</span>
              </div>
              {i < PRIMARY_GENERATIONS.length - 1 && (
                <div className="w-10 h-[1px]" style={{ background: activeIndex > i ? "#E8A838" : "rgba(255,255,255,0.1)" }} />
              )}
            </div>
          ))}
        </div>

        {/* Cards */}
        <div ref={carouselRef} className="relative w-full h-screen flex items-center justify-center" style={{ transformStyle: "preserve-3d" }}>
          {PRIMARY_GENERATIONS.map((gen, i) => (
            <div key={gen.id} className="carousel-card absolute inset-0 flex items-center justify-center px-6 md:px-12"
              style={{ transformStyle: "preserve-3d", backfaceVisibility: "hidden" }}>
              <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center">

                {/* Image */}
                <div className="relative flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full opacity-20 blur-[80px]"
                    style={{ background: i === 2 ? "radial-gradient(circle, #2E7EBF 0%, transparent 70%)" : "radial-gradient(circle, #E8A838 0%, transparent 70%)" }} />
                  <img src={gen.image} alt={gen.name}
                    className="relative z-10 w-full max-w-[500px] h-auto object-contain drop-shadow-2xl"
                    style={{ filter: "drop-shadow(0 20px 60px rgba(0,0,0,0.5))" }} />
                </div>

                {/* Content */}
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-mono tracking-[0.3em] uppercase" style={{ color: "#E8A838" }}>Generation {gen.id}</p>
                    <span className="text-xs font-mono" style={{ color: "rgba(255,255,255,0.3)" }}>{i + 1}/{PRIMARY_GENERATIONS.length}</span>
                  </div>
                  <h3 className="text-3xl md:text-5xl font-bold tracking-tight mb-2" style={{ color: "#f0f0f0", fontFamily: "'DM Sans', system-ui, sans-serif" }}>{gen.name}</h3>
                  <p className="text-lg font-medium mb-1" style={{ color: "#E8A838" }}>{gen.tagline}</p>
                  <p className="text-xs font-mono mb-6" style={{ color: "#2E7EBF" }}>{gen.era} &mdash; {gen.year}</p>
                  <p className="text-base leading-relaxed mb-6" style={{ color: "rgba(255,255,255,0.6)" }}>{gen.description}</p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {gen.specs.map((s) => (
                      <span key={s} className="px-3 py-1 text-xs font-mono rounded-full border" style={{ borderColor: "rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.5)" }}>{s}</span>
                    ))}
                  </div>
                  <a href={gen.sourceUrl} target="_blank" rel="noopener noreferrer"
                    className="text-xs font-mono transition-colors hover:text-[#E8A838]" style={{ color: "rgba(255,255,255,0.35)" }}>
                    Source: {gen.sourceLabel} &#8599;
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2 animate-bounce">
          <span className="text-[10px] font-mono tracking-[0.3em] uppercase" style={{ color: "rgba(255,255,255,0.3)" }}>Scroll to explore</span>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 3V13M8 13L3 8M8 13L13 8" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </div>
      </div>

      {/* Gesture Control */}
      <div ref={gestureRef} className="px-6 py-24 md:px-12 md:py-32 max-w-5xl mx-auto">
        <h3 className="text-2xl md:text-4xl font-bold tracking-tight mb-4 text-center" style={{ color: "#f0f0f0", fontFamily: "'DM Sans', system-ui, sans-serif" }}>Gesture Control</h3>
        <p className="text-sm text-center mb-12 max-w-xl mx-auto" style={{ color: "rgba(255,255,255,0.45)" }}>Navigate AR interfaces with natural hand movements detected by sEMG sensors.</p>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {GESTURES.map((g) => (
            <div key={g.gesture} className="group relative p-4 rounded-xl border text-center transition-all duration-300 hover:border-[#2E7EBF]/40 hover:bg-[#2E7EBF]/5"
              style={{ borderColor: "rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.02)" }}>
              <p className="text-sm font-medium mb-1" style={{ color: "rgba(255,255,255,0.8)" }}>{g.gesture}</p>
              <p className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>{g.action}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Earlier Prototypes Toggle */}
      <div className="px-6 pb-8 md:px-12 max-w-5xl mx-auto text-center">
        <button onClick={handleToggle}
          className="group inline-flex items-center gap-3 px-8 py-3 rounded-full border text-sm font-mono tracking-wide transition-all duration-300 hover:border-[#E8A838]/50 hover:bg-[#E8A838]/5"
          style={{ borderColor: "rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.6)" }}>
          {showEarlier ? "Hide Earlier Prototypes" : "Reveal Earlier Prototypes (Gen 1 & 2)"}
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className={`transition-transform duration-300 ${showEarlier ? "rotate-180" : ""}`}>
            <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <p className="mt-3 text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>2 additional generations not shown above &mdash; all information is publicly available.</p>
      </div>

      {showEarlier && (
        <div ref={earlierRef} className="px-6 py-16 md:px-12 max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {EARLIER_GENERATIONS.map((gen) => (
              <div key={gen.id} className="earlier-card group relative p-8 rounded-2xl border transition-all duration-300 hover:border-[#2E7EBF]/30"
                style={{ borderColor: "rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)" }}>
                <div className="flex items-start gap-6">
                  <div className="w-32 h-32 flex-shrink-0 rounded-xl overflow-hidden" style={{ background: "rgba(255,255,255,0.04)" }}>
                    <img src={gen.image} alt={gen.name} className="w-full h-full object-contain p-2" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-mono tracking-[0.3em] uppercase mb-1" style={{ color: "#E8A838" }}>Generation {gen.id}</p>
                    <h4 className="text-xl font-bold mb-1" style={{ color: "#f0f0f0" }}>{gen.name}</h4>
                    <p className="text-xs font-mono mb-3" style={{ color: "#2E7EBF" }}>{gen.era} &mdash; {gen.year}</p>
                    <p className="text-sm leading-relaxed mb-4" style={{ color: "rgba(255,255,255,0.5)" }}>{gen.description}</p>
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {gen.specs.map((s) => (
                        <span key={s} className="px-2 py-0.5 text-[10px] font-mono rounded-full border" style={{ borderColor: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.4)" }}>{s}</span>
                      ))}
                    </div>
                    <a href={gen.sourceUrl} target="_blank" rel="noopener noreferrer"
                      className="text-[10px] font-mono transition-colors hover:text-[#E8A838]" style={{ color: "rgba(255,255,255,0.3)" }}>Source: {gen.sourceLabel} &#8599;</a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <div ref={disclaimerRef} className="px-6 py-16 md:px-12 max-w-4xl mx-auto text-center">
        <div className="p-6 rounded-xl border" style={{ borderColor: "rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.015)" }}>
          <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.35)" }}>
            All product information and images shown are from publicly available sources including
            {" "}<a href="https://about.fb.com/news/2021/03/inside-facebook-reality-labs-wrist-based-interaction-for-the-next-computing-platform/" target="_blank" rel="noopener noreferrer" className="underline hover:text-[#2E7EBF]">Meta Reality Labs Blog</a>,
            {" "}<a href="https://www.theverge.com/2019/9/23/20881032/facebook-ctrl-labs-acquisition-neural-interface-armband-ar-vr-deal" target="_blank" rel="noopener noreferrer" className="underline hover:text-[#2E7EBF]">The Verge</a>,
            {" "}<a href="https://about.fb.com/news/2024/09/introducing-orion-our-first-true-augmented-reality-glasses/" target="_blank" rel="noopener noreferrer" className="underline hover:text-[#2E7EBF]">Meta Connect 2024</a>, and
            {" "}<a href="https://www.meta.com/emerging-tech/emg-wearable-technology/" target="_blank" rel="noopener noreferrer" className="underline hover:text-[#2E7EBF]">Meta Emerging Tech</a>.
            {" "}No proprietary or confidential information is disclosed. Product evolution timeline based on the
            {" "}<a href="https://colfuse.ai" target="_blank" rel="noopener noreferrer" className="underline hover:text-[#2E7EBF]">Colfuse</a> public presentation deck.
          </p>
        </div>
      </div>

    </section>
  );
}
