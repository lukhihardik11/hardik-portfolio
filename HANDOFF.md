# Hardik Lukhi — Hardware Engineer Portfolio

## Project Handoff for New Development Sessions

This document provides everything needed to understand, run, and continue developing this portfolio website.

---

## 1. Project Overview

A personal portfolio website for **Hardik Lukhi**, a Hardware Engineer and Project Manager with 8+ years of experience at Meta, Stryker, Abbott, Terumo, and J Group Robotics. The site showcases engineering projects through **scroll-driven exploded-view animations** — a signature feature where scrolling disassembles 3D CAD renders frame-by-frame on a canvas.

---

## 2. Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19 + TypeScript + Tailwind CSS 4 |
| Routing | Wouter |
| Animation | GSAP ScrollTrigger (scroll-driven), Framer Motion (hover/entrance) |
| 3D Hero | Spline (interactive 3D robot scene) |
| Design System | Custom "Jelly" design system (glassmorphism, translucent cards, 3D depth) |
| UI Components | shadcn/ui (Radix primitives) |
| Backend | Express 4 + tRPC 11 |
| Database | MySQL/TiDB via Drizzle ORM |
| Auth | Manus OAuth (pre-configured) |
| Build | Vite 7 + esbuild |
| Testing | Vitest (36 tests passing) |
| Package Manager | pnpm |

---

## 3. Architecture & File Structure

```
client/
  index.html              <- Entry HTML (DM Sans + JetBrains Mono fonts via Google CDN)
  src/
    App.tsx                <- Routes: /, /project/octolapse, /project/:id, /404
    main.tsx               <- tRPC + React Query providers
    const.ts               <- OAuth login URL helper
    index.css              <- Full Jelly design system (light/dark CSS vars, animations)
    pages/
      Home.tsx             <- Main portfolio page (all sections composed here)
      ProjectPage.tsx      <- Generic project detail page with scroll animation
      OctolapsePage.tsx    <- Custom page for Octolapse hobby project
      NotFound.tsx         <- 404 page
    components/
      Navbar.tsx           <- Floating glass navbar with JellySwitch theme toggle + email icon
      HeroSection.tsx      <- Name, title, bio, Spline 3D scene, resume download
      ExplodedView.tsx     <- Homepage EMG wristband scroll animation (pinned canvas)
      ProjectExplodedView.tsx <- Reusable scroll animation for all project pages
      AboutSection.tsx     <- Bio + animated stat counters
      SignalDivider.tsx    <- GSAP line-draw divider
      ExperienceSection.tsx <- Work history timeline (Meta, Stryker, Abbott, Terumo, J Group)
      PhilosophySection.tsx <- Word-by-word GSAP quote reveal
      ProjectsSection.tsx  <- 3x3 uniform project card grid
      SkillsSection.tsx    <- 4 skill categories with JellySlider progress bars
      EducationSection.tsx <- 3 degrees (MS IT, MS ME, BE ME)
      ContactSection.tsx   <- Email + LinkedIn + footer
      ScrollProgress.tsx   <- GSAP-driven top progress bar
      PageTransition.tsx   <- GSAP fade/slide page transitions
      JellyWrapper.tsx     <- Spring physics wrapper (scroll wobble, hover squish, tilt)
      JellySlider.tsx      <- Pure CSS jelly progress bar (used in Skills)
      JellySwitch.tsx      <- Jelly toggle for dark/light mode (used in Navbar)
    data/
      projects.ts          <- All project metadata (9 projects)
      frameUrlsIndex.ts    <- Central mapping: project ID -> frame URL array
      frameUrls-cpress.ts  <- C-Press 192 AI-upscaled frames
      frameUrls-fpc-4k.ts  <- FPC Failure Analysis frames
    components/frameUrls*.ts <- Frame URL arrays for EMG, BON, CYL, MOD, FUNC, ABAQUS, Octolapse
    hooks/
      useGSAPScrollReveal.ts <- Reusable GSAP scroll-triggered text mask reveal
      useScrollAnimation.ts  <- Scroll animation utilities
      useJellyPhysics.ts     <- Jelly physics helpers
      useMobile.tsx          <- Mobile detection hook
    contexts/
      ThemeContext.tsx      <- Auto day/night theme (6AM=light, 6PM=dark) + manual override
    lib/
      trpc.ts              <- tRPC client binding
      utils.ts             <- Tailwind merge utility
      gooui/               <- WebGPU jelly slider/switch library (legacy, NOT actively used)
      jelly-slider/        <- WebGPU jelly slider internals (legacy, NOT actively used)
      jelly-switch/        <- WebGPU jelly switch internals (legacy, NOT actively used)
server/
  routers.ts               <- tRPC routes (auth.me, auth.logout, system)
  db.ts                    <- Database query helpers
  storage.ts               <- S3 storage helpers
  _core/                   <- Framework plumbing (DO NOT EDIT)
drizzle/
  schema.ts                <- Users table only (no custom tables yet)
```

---

## 4. The 9 Engineering Projects

Each project has a scroll-driven exploded-view animation (192 frames on a pinned canvas).

| # | ID | Title | Notes |
|---|-----|-------|-------|
| 1 | `fpc` | EMG Failure Analysis - FPC Design | CT/X-ray style. `contentCropX: 0.05`, `animBgColor: #0a0a0a` |
| 2 | `emg` | EMG Wristband | Homepage also shows this animation. Has IP disclaimer |
| 3 | `bon` | Bed of Nails Test Fixture | Standard cover mode |
| 4 | `cyl` | Cylindrical EMG Band Verification Fixture | `contentCropX: 0.123`, `animBgColor: #1e2530`. User provided Higgsfield video |
| 5 | `mod` | Flatbed Modular Test Fixture | Standard cover mode |
| 6 | `func` | Functional System Test Fixture | Uses Gemini-generated morph frames |
| 7 | `abaqus` | Coating Delamination FEM | Graduate research project |
| 8 | `cpress` | Portable Hydraulic C-Press Machine | `animBgColor: #262626`. AI-upscaled from 1280x720 to 2752x1536 |
| 9 | `octolapse` | Octolapse - DIY 3D Printing Timelapse | Custom OctolapsePage with YouTube link |

### How Scroll Animations Work

1. Each project has ~192 pre-rendered frame images stored as CDN URLs in `frameUrls-*.ts` files
2. `ProjectExplodedView` (or `ExplodedView` for homepage) uses a `<canvas>` element
3. GSAP ScrollTrigger pins the canvas and scrubs through frames based on scroll position
4. Labels appear at configured scroll thresholds with staggered animations
5. The `drawFrame` function handles cover/contain modes, content cropping, and edge gradient blending

### Frame Generation Pipeline

When creating new project animations:
1. Generate assembled (start) and exploded (end) images at high resolution
2. Generate a morph video between the two images (video tool outputs 1280x720)
3. Extract 192 frames from the video using ffmpeg
4. AI-upscale frames using `generate_image_variation` for higher quality (recommended)
5. Upload frames to CDN using `manus-upload-file --webdev`
6. Create/update the `frameUrls-*.ts` file with CDN URLs
7. Register in `frameUrlsIndex.ts`

---

## 5. Design System: "Jelly"

Custom glassmorphism-inspired aesthetic with translucent surfaces, 3D depth, and organic motion.

### Key Design Tokens (in `index.css`)

- **Primary:** `oklch(0.55 0.18 230)` (teal blue)
- **Accent:** `oklch(0.75 0.15 65)` (warm amber)
- **Fonts:** DM Sans (body), JetBrains Mono (code/labels)
- **Border radius:** 1.5rem default
- **All colors use OKLCH format** (required by Tailwind CSS 4)

### Theme System

- **Auto day/night:** Default for new visitors. Light mode 6AM-6PM, dark mode 6PM-6AM (local time)
- **Manual override:** JellySwitch toggle in navbar. Persists in localStorage
- **ThemeProvider** in `App.tsx` with `switchable` prop enabled

### Animation Rules

- **GSAP ScrollTrigger** for all scroll-driven animations
- **Framer Motion** for hover effects, entrance animations, and page transitions
- **No CSS transform transitions on jelly-card/jelly-btn** (Framer Motion handles transforms)
- **Subtle hover effects only:** max 2-4px y-translation, 0.5-2% scale
- **No hover on non-interactive elements**
- **`prefers-reduced-motion`** respected globally

---

## 6. Spline 3D Hero Scene

- **Scene URL:** `https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode`
- Loaded lazily via `React.lazy`
- Background forced transparent via `onSplineLoad` callback
- Blended with page using CSS `mix-blend-mode: multiply` (light) / `lighten` (dark)
- Masked with radial gradient for soft edges

---

## 7. Personal Info & Content

- **Name:** Hardik Lukhi
- **Title:** Project Manager | Senior Mechanical Engineer
- **Subtitle:** Hardware Sustainment & Test Engineering
- **Email:** lukhihardik11@gmail.com
- **LinkedIn:** linkedin.com/in/hardiklukhi
- **YouTube:** youtube.com/c/HardikLukhi
- **Resume PDF:** CDN link in HeroSection.tsx
- **Philosophy quote:** "Great hardware isn't just designed - it's validated, iterated, and perfected."

---

## 8. Key Technical Notes

### Canvas Rendering (ProjectExplodedView)
- `drawFrame()` supports **cover** (default) and **contain** modes
- `contentCropX` crops baked-in black borders from source images
- `animBgColor` sets explicit background color for the canvas container
- Edge gradient fading blends image edges into background color
- `sampleEdgeColor()` auto-detects background color from first frame if no `animBgColor` set

### WebGPU / TypeGPU (Legacy)
- `lib/gooui/`, `lib/jelly-slider/`, `lib/jelly-switch/` contain WebGPU-based components
- These are **NOT actively used** - actual JellySlider and JellySwitch are pure CSS
- WebGPU dependencies remain in package.json but could be removed

### Testing
- 3 test files: `auth.logout.test.ts`, `projects.test.ts`, `gsap-animations.test.ts`
- `projects.test.ts` validates all 9 projects have correct metadata and frame URLs
- `gsap-animations.test.ts` validates animation data structures

### CDN Assets
- All static assets stored on CDN via `manus-upload-file --webdev`
- Local files in the project directory cause deployment timeouts
- Frame images, resume PDF, and thumbnails all use CloudFront CDN URLs

---

## 9. Running the Project

```bash
pnpm install    # Install dependencies
pnpm dev        # Start dev server
pnpm test       # Run tests (36 passing)
pnpm db:push    # Push database schema changes
pnpm build      # Build for production
```

The dev server runs on the port assigned by the Manus platform (do not hardcode port).
