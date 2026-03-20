# Hardik Lukhi — Hardware Engineer Portfolio

## Project Handoff for Future Development Sessions

This document provides everything needed to understand, run, and continue developing this portfolio website. It reflects the latest state after the completion of **Phases 1 through 3C**, which established a complete portfolio with a unique "Jelly Mode" design system, mobile performance optimizations, and full design consistency.

---

## 1. Project Overview

A personal portfolio website for **Hardik Lukhi**, a Hardware Engineer and Project Manager with 8+ years of experience at Meta, Stryker, Abbott, Terumo, and J Group Robotics. The site showcases engineering projects through **scroll-driven exploded-view animations** — a signature feature where scrolling disassembles 3D CAD renders frame-by-frame on a canvas.

### Current Visual & System Direction
The portfolio features a custom **Jelly Design System** with two distinct modes controlled by a unified `GelToggle`:
- **Jelly OFF (Default):** A subtle, premium glassmorphism aesthetic with calm interactions.
- **Jelly ON:** A highly expressive, physics-based UI with spring animations, wobbly hover effects, and bouncy transitions powered by Framer Motion.

---

## 2. Current Completed State

The project has progressed through three major phase groups and is currently feature-complete and design-consistent.

### Phase 1: Foundation & Core Features
- Full portfolio site implemented: Hero (Spline 3D), About, Experience, Projects (with individual pages), Skills, Education, Contact, Philosophy.
- Light/dark mode and scroll-driven animations implemented.
- All 1,727 animation frames localized into the repository (no CDN dependency).

### Phase 2: Jelly Mode & Performance
- **Jelly System (2A-2E):** Created the Jelly Mode toggle system. Implemented `JellyWrapper`, `JellyButton`, `JellyText`, metaball background, and comprehensive jelly treatments across all UI elements.
- **Mobile Performance (2F):** Created shared `useFineHover` hook to gate heavy RAF physics off coarse-pointer devices (phones/tablets). Added CSS hover guards to prevent sticky hover on touch devices.
- **Spline Gating (2G):** Implemented conditional rendering for the Hero 3D scene to prevent a 5.6 MB download on mobile, added an 8-second timeout with graceful fallback, and preconnect hints.
- **Secondary Elements (2H):** Upgraded pills, badges, and icons with dense-group calm behavior and standalone interactive behavior.

### Phase 3: Consistency & Polish
- **Project Pages (3A):** Unified project page tags/badges with the design system. Added IP disclaimers to professional projects.
- **System Audit (3B):** Normalized Navbar logo badge, nav links, Skills orbs, Philosophy heading, and About stat counters.
- **Content & Meta (3C):** Aligned Meta title with Hero positioning. Added Open Graph and Twitter/X social sharing tags. Standardized Skills eyebrow label.

---

## 3. Current Design System Behavior

The design system is built on pure CSS and Framer Motion spring physics, completely removing earlier WebGL/GLSL implementations.

### Mode Behaviors
- **Jelly OFF:** Elements have subtle scale transforms and premium glass textures.
- **Jelly ON:** Elements exhibit strong, expressive spring physics (squash and stretch) on hover and click. The background features floating metaballs.

### Device-Specific Behavior
Performance is strictly gated based on device capabilities using the `useFineHover` hook (`(hover: hover) and (pointer: fine)`):
- **Desktop + Mouse:** Full jelly physics and hover effects enabled.
- **Touch Devices (iPad, iPhone, Android):** Heavy RAF physics and sticky hover effects are disabled. Elements use a lighter interaction path to ensure smooth scrolling.

---

## 4. Key Files & Architecture

The project is a Vite + React SPA using `wouter` for client-side routing.

### Core Logic & Components
- **`client/src/components/HeroSection.tsx`**: Hero section with conditional Spline 3D rendering (desktop only).
- **`client/src/components/JellyWrapper.tsx`**: Main jelly physics component with fine-hover gating for mobile performance.
- **`client/src/hooks/useFineHover.ts`**: Shared hook for detecting fine-pointer capability using `matchMedia`.
- **`client/src/hooks/useSplineGating.ts`**: Controls viewport and timeout gating for the Spline 3D scene.
- **`client/src/index.css`**: The heart of the design system. Contains all glass-pill, jelly-badge, hover guards, and mode-specific styling.
- **`client/src/pages/ProjectPage.tsx`**: Individual project pages with scroll-driven exploded views and unified tags/badges.
- **`client/src/components/ProjectExplodedView.tsx`**: The GSAP ScrollTrigger logic that drives the frame-by-frame canvas animations.

### Data & Configuration
- **`client/src/data/projects.ts`**: Central data store for all 9 engineering projects, including metadata, IP disclaimers, and asset references.
- **`client/src/data/frameUrlsIndex.ts`**: Maps project IDs to their respective local frame URL arrays.
- **`client/index.html`**: HTML entry point containing meta tags, OG tags, and Twitter tags.

---

## 5. Assets and Dependency Status

The repository is highly self-contained to ensure long-term stability.

### Fully Localized (Safe)
- **Animation Frames:** All 1,727 `.webp` frames across 9 projects are stored locally in `client/public/frames/`. There is no runtime dependency on external CDNs for scroll animations.
- **Resume:** The PDF resume is correctly located in `client/public/assets/resume/`.

### External Dependencies
- **Spline 3D Scene:** The interactive robot in the Hero section is loaded from `prod.spline.design`. If this fails or times out, the site gracefully falls back to a static gradient.

### ⚠️ Known Asset Issue (Requires Fix)
During the final audit, it was discovered that gallery images and report PDFs referenced in `projects.ts` exist in the top-level `assets/` directory but **were not copied** to `client/public/assets/`. 
- **Impact:** Gallery images and download links on the Abaqus and CPress project pages currently return 404s (or SPA fallback HTML) in the dev server and production build.
- **Action Required:** These files must be moved or copied into `client/public/assets/` before deployment.

---

## 6. Current Known Deferred Items

The following items have been intentionally deferred until the final deployment phase (Phase 4A):

1. **Deployment Platform Setup:** The project requires a deployment configuration (e.g., `vercel.json` with a rewrite rule `{"source": "/(.*)", "destination": "/index.html"}`) to support SPA routing for direct visits to `/project/:id`.
2. **Production Metadata:** 
   - `og:url` and `og:image` content attributes in `index.html` are currently empty placeholders, waiting for the final public URL and share image.
   - Structured data / JSON-LD for SEO has not been added.
3. **Production Readiness Checklist:**
   - Favicon (`favicon.ico`, `apple-touch-icon.png`) needs to be generated and added.
   - `robots.txt` needs to be created.
   - A static `404.html` fallback may be needed depending on the hosting provider.

---

## 7. How to Continue Safely in a New Manus Chat

To resume work on this project in a new session, follow these steps:

1. **Inspect First:** Read this `HANDOFF.md` document to understand the current state and constraints.
2. **Start Branch:** Always start from the latest commit on the `main` branch.
3. **Verify Health:** Run `pnpm install` and `pnpm dev` to ensure the project builds and runs correctly. Check the browser console for any unexpected errors.
4. **Next Phase Options:**
   - **Fix Asset Paths:** Address the missing gallery/report assets in `client/public/assets/` (see Section 5).
   - **Phase 4A (Deployment):** Proceed with the deferred deployment setup, metadata completion, and production readiness checklist (see Section 6).

---

## 8. Repo Safety Rules

Strict adherence to these rules is required to maintain project integrity:

- **No Broad Redesigns:** The design system is finalized. Do not initiate new design phases or layout changes without explicit user approval.
- **Verify Before Acting:** Always check the actual code and repository state before making changes. Do not rely on assumptions from previous sessions.
- **Commit & Push:** Commit and push to GitHub after every approved change or logical phase completion.
- **Artifact Delivery:** Provide comprehensive proof packages (PNG/JPG screenshots, 1080p video for motion, zip bundles) for all visual changes.
- **Keep it Private:** The repository must remain private unless deployment requires otherwise.
