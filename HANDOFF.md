# Hardik Lukhi — Hardware Engineer Portfolio

## Project Handoff for New Development Sessions

This document provides everything needed to understand, run, and continue developing this portfolio website. It reflects the latest state after the **Batch 2** redesign, which unified the UI toggles and fixed several CSS bugs.

---

## 1. Project Overview

A personal portfolio website for **Hardik Lukhi**, a Hardware Engineer and Project Manager with 8+ years of experience at Meta, Stryker, Abbott, Terumo, and J Group Robotics. The site showcases engineering projects through **scroll-driven exploded-view animations** — a signature feature where scrolling disassembles 3D CAD renders frame-by-frame on a canvas.

### Key Recent Changes (Batch 2)

- **Unified Gel Toggles:** Both the dark/light mode switch and the "Jelly Mode" switch now use a single, unified `GelToggle` component. This ensures they are visually identical and share the same premium, TypeGPU-inspired gel aesthetic.
- **CSS Architecture:** The new toggles are built with pure CSS and spring physics via `framer-motion`, removing the previous complex and inconsistent WebGL implementation.
- **Navbar CSS Fix:** The `jelly-navbar` class was fixed to ensure the navigation bar is always visible in all theme combinations (light/dark, jelly on/off).

---

## 2. Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19 + TypeScript + Tailwind CSS 4 |
| Routing | Wouter |
| Animation | GSAP ScrollTrigger (scroll-driven), Framer Motion (UI physics) |
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

The project is a standard monorepo with `client/`, `server/`, and `shared/` directories.

```
client/
  src/
    App.tsx                <- Routes: /, /project/octolapse, /project/:id, /404
    main.tsx               <- tRPC + React Query providers
    index.css              <- Full Jelly design system (light/dark CSS vars, animations)
    pages/
      Home.tsx             <- Main portfolio page (all sections composed here)
      ProjectPage.tsx      <- Generic project detail page with scroll animation
    components/
      Navbar.tsx           <- Floating glass navbar with unified GelToggles
      GelToggle.tsx        <- **NEW:** Unified component for all premium gel toggles
      JellySwitch.tsx      <- Dark/light mode toggle (now uses GelToggle)
      JellyModeToggle.tsx  <- Jelly mode on/off toggle (now uses GelToggle)
      ExplodedView.tsx     <- Homepage EMG wristband scroll animation
      ProjectExplodedView.tsx <- Reusable scroll animation for all project pages
      ...
    data/
      projects.ts          <- All project metadata (9 projects)
      frameUrlsIndex.ts    <- Central mapping: project ID -> frame URL array
      frameUrls-*.ts       <- CDN URLs for each project's animation frames
    hooks/
    contexts/
    lib/
      trpc.ts              <- tRPC client binding
      utils.ts             <- Tailwind merge utility
server/
  routers.ts               <- tRPC routes (auth.me, auth.logout, system)
  db.ts                    <- Database query helpers
  storage.ts               <- S3 storage helpers
drizzle/
  schema.ts                <- Users table only
```

### Key Component Changes

- **`JellySwitch.tsx` and `JellyModeToggle.tsx`** have been completely refactored. They are now simple wrappers around the new `GelToggle.tsx` component, passing in different color configurations and icons.
- The old WebGL-based implementation and its associated GLSL shader code have been **removed**.

---

## 4. The 9 Engineering Projects

Each project has a scroll-driven exploded-view animation (192 frames on a pinned canvas).

| # | ID | Title | Notes |
|---|---|---|---|
| 1 | `fpc` | EMG Failure Analysis - FPC Design | CT/X-ray style. `contentCropX: 0.05`, `animBgColor: #0a0a0a` |
| 2 | `emg` | EMG Wristband | Homepage also shows this animation. Has IP disclaimer |
| 3 | `bon` | Bed of Nails Test Fixture | Standard cover mode |
| 4 | `cyl` | Cylindrical EMG Band Verification Fixture | `contentCropX: 0.123`, `animBgColor: #1e2530`. User provided Higgsfield video |
| 5 | `mod` | Flatbed Modular Test Fixture | Standard cover mode |
| 6 | `func` | Functional System Test Fixture | Uses Gemini-generated morph frames |
| 7 | `abaqus` | Coating Delamination FEM | Graduate research project |
| 8 | `cpress` | Portable Hydraulic C-Press Machine | `animBgColor: #262626`. AI-upscaled from 1280x720 to 2752x1536 |
| 9 | `octolapse` | Octolapse - DIY 3D Printing Timelapse | Custom OctolapsePage with YouTube link |

---

## 5. Next Steps & Guidance for New Team

### Understanding the Website

To get started with the new Manus project, the team should focus on these key areas:

1.  **Review the Tech Stack (Section 2):** Familiarize yourself with the core technologies. The combination of React, Vite, Tailwind, tRPC, and Drizzle is modern and well-documented.
2.  **Explore the File Structure (Section 3):** The project is organized logically. Start with `client/src/pages/Home.tsx` to see how the main page is assembled from various section components.
3.  **Understand the Data Model:** The project data is decoupled from the UI. All project information is managed in `client/src/data/projects.ts`, and animation frames are indexed in `client/src/data/frameUrlsIndex.ts`. This makes it easy to add or modify projects without touching the React components.
4.  **Examine the Scroll Animations:** The signature feature is the scroll-driven animations. `ProjectExplodedView.tsx` is the key component here. Study how it uses GSAP ScrollTrigger to pin the canvas and `drawFrame` to render the image sequence based on scroll progress.

### Cleanup & Final Commit

The repository has been cleaned of all unnecessary files (debug notes, intermediate screenshots, etc.). The `dist/` directory has also been removed and added to `.gitignore`.

There are no lingering dependencies from the previous implementation. The `package.json` is clean and only contains packages required for the current feature set.

### Running the Project

To run the project locally for development:

```bash
# 1. Install dependencies
pnpm install

# 2. Start the development server
pnpm dev

# 3. Run tests to ensure everything is working
pnpm test
```

The dev server runs on the port assigned by the Manus platform. All 36 tests are currently passing.
