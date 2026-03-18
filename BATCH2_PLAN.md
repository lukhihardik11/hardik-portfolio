# Batch 2 — Toggle Redesign Implementation Plan

## Current State Analysis

### JellySwitch (Dark/Light Toggle)
- Already has a WebGL SDF ray-marched sphere blob with spring physics
- Already has squash/stretch/wiggle on click
- Already has Fresnel, Beer-Lambert, subsurface scattering in the shader
- Has both WebGL and CSS fallback paths
- **Problem**: The TRACK is nearly invisible — very low opacity, barely visible capsule shape
- **Problem**: Track has no recessed/machined appearance — just a faint transparent gradient
- **Problem**: No visible rim/edge highlight on the track
- **Problem**: No contact shadow beneath the track
- **Problem**: The "DARK"/"Light" text label is unnecessary clutter
- **Problem**: In CSS fallback, the blob is a simple radial gradient circle — no material quality

### JellyModeToggle
- A small 36x36px circle button with a blob SVG icon
- Wobbles when active via framer-motion
- **Problem**: Doesn't match the toggle form factor at all — it's a circle button, not a capsule toggle
- **Problem**: No visual relationship to the dark/light toggle
- **Problem**: Too small and hard to discover

### Navbar Context
- Logo (HL badge + "Hardik Lukhi" text) on left
- Nav links in center (desktop)
- Right side: JellyModeToggle | JellySwitch | Mail icon | Hamburger (mobile)
- Mail icon is a 36x36 circle with gradient — this is the size reference
- **The toggle must harmonize with the mail icon size**

## Design Decisions for Batch 2

### 1. Dark/Light Toggle Track
The track must become a proper recessed capsule:
- **Recessed appearance**: `inset box-shadow` with darker tones to look machined/sunken
- **Rim highlight**: Thin bright inset shadow along top edge (white at 10-15% opacity)
- **Contact shadow**: Soft `box-shadow` beneath the track
- **Visible in both themes**: Currently nearly invisible in light mode
- **Size**: Keep current proportions (trackW = size * 1.85, trackH = size * 0.92) — these are good
- **Remove "DARK"/"Light" text label** — the sun/moon icon inside the blob is sufficient

### 2. Dark/Light Toggle Blob (WebGL)
The WebGL blob is already good — it has real 3D material quality. Keep it.
- The shader already does Fresnel, Beer-Lambert, subsurface scattering
- Spring physics already provide squash/stretch/wiggle
- **Only change**: Ensure the glow beneath the blob is more visible (colored light spill)

### 3. Dark/Light Toggle Blob (CSS Fallback)
The CSS fallback needs improvement:
- Better radial gradient to suggest volume (not just a flat circle)
- Inset highlight for specular
- Stronger colored glow beneath

### 4. Jelly Mode Toggle
Convert from a circle button to a proper capsule toggle matching the dark/light toggle style:
- Same capsule track form factor but smaller
- A knob that slides left/right
- "J" or blob icon inside the knob
- When OFF: knob on left, muted colors
- When ON: knob on right, teal/green accent glow

### 5. Jelly Mode ON Enhancement
When jelly mode is ON, BOTH toggles should get enhanced:
- Stronger glow beneath blobs
- Track gets subtle pulsing glow
- More dramatic spring physics (lower damping)

### 6. Navbar Harmony
- Remove "DARK"/"Light" text label to save space
- Ensure both toggles are visually balanced with the mail icon
- Test at both mobile (size=32) and desktop (size=48) scales

## Files to Modify
1. `client/src/components/JellySwitch.tsx` — Track styling, remove label, enhance glow
2. `client/src/components/JellyModeToggle.tsx` — Complete rewrite to capsule toggle
3. `client/src/index.css` — Any supporting CSS for track recessed appearance
4. `client/src/components/Navbar.tsx` — Remove label span, adjust spacing

## Files NOT to Touch
- All section components (About, Experience, Projects, Skills, Education, Contact)
- HeroSection, JellyBackground, JellySlider
- Home.tsx, App.tsx
- Any context files
