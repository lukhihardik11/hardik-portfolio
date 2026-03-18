# Batch 1 — Failure Analysis + Research Summary

## Batch Name

Batch 1 — Failure Analysis + Research Summary

## Scope

Diagnose why the previous implementation direction failed, summarize real research findings on jelly physics, optics, soft-body interaction, UI reference behavior, and device fallbacks, compare the current implementation against the TypeGPU-inspired target, list exact gaps, and produce a prioritized plan for Batch 2.

---

## Part 1: Why the Previous Direction Failed

The previous implementation made several fundamental errors that caused it to drift away from the target.

**Error 1: Glassmorphism instead of Gel Materialism.** The previous approach treated "jelly" as a synonym for "transparent frosted glass." It applied `backdrop-filter: blur()`, reduced opacity, and added translucent borders everywhere. This produced a generic glassmorphism aesthetic that has no relationship to the TypeGPU jelly references. The TypeGPU references show objects with *volume*, *mass*, and *material thickness*, not transparent panes of frosted glass.

**Error 2: Uniform treatment across all elements.** The previous approach applied the same jelly-like treatment (reduced opacity, blur, rounded corners) to cards, sections, navbar, buttons, and everything else equally. This violated the hierarchy principle: toggles and sliders should receive the strongest jelly treatment, while cards and containers should remain restrained and professional.

**Error 3: Toggle was never redesigned.** The dark/light toggle remained a small flat circle sliding in a track. It was never given a proper capsule form, knob/track ratio, material definition, or 3D impression. The TypeGPU jelly switch shows a translucent gel cube with internal caustic highlights, subsurface scattering, and colored light spill — none of which were attempted.

**Error 4: Skill sliders were only superficially improved.** The skill bars received gradient fills and slightly thicker tracks, but they remained flat 2D progress bars. The TypeGPU jelly slider shows a thick volumetric capsule with a recessed metallic track, translucent fill that glows and spills light, and rim/edge highlights. The current implementation has none of these material properties.

**Error 5: No real physics research.** The implementation did not study how real jelly deforms, how damped harmonic motion works, or how soft-body simulations produce convincing wobble. Without this understanding, the "jelly mode" animations were arbitrary CSS keyframes rather than physically-motivated motion.

**Error 6: Cursor follower was degraded.** The cursor follower behavior was modified without proper device detection, potentially causing artifacts on iPad and touch devices.

**Error 7: No screenshot-based validation.** Changes were declared "fixed" based on code changes alone, without systematic visual comparison against the reference targets.

---

## Part 2: Research Findings

### A. Real-World Jelly / Gel / Silicone Behavior

Based on research into soft-body physics (JellyCar deep dive, mass-spring-damper systems, gelatin mechanics papers), the following physical behaviors define convincing jelly:

**Deformation under pressure.** When pressed, jelly deforms locally at the point of contact while the rest of the body responds with a delayed, damped reaction. The deformation is not uniform — it follows the pressure gradient. In a mass-spring system, this is modeled by springs connecting neighboring point masses, where each spring has a rest length and a damping coefficient.

**Damping and overshoot.** Real jelly exhibits underdamped harmonic motion: when disturbed, it overshoots its rest position, then oscillates back with decreasing amplitude. The damping ratio (typically 0.2–0.5 for soft gels) determines how quickly oscillations decay. This is the "wobble" effect. Critical damping (ratio = 1.0) produces no wobble; overdamping produces sluggish return. For convincing jelly, the damping ratio should be in the underdamped range.

**Volume preservation.** Jelly is nearly incompressible. When compressed in one direction, it bulges outward in perpendicular directions. This is the key visual cue that distinguishes jelly from a deflating balloon. In the TypeGPU implementation, this is achieved through constraint projection that maintains constant distance between neighboring simulation points.

**Wobble from tap/drag.** The wobble amplitude and frequency depend on the input energy: a quick tap produces a short, high-frequency wobble; a slow drag produces a longer, lower-frequency deformation that follows the pointer with elastic lag.

### B. Visual Material Cues of Jelly

Based on analysis of the TypeGPU references (jelly switch image, jelly slider images at 100% in teal and orange, dark mode switch), the following visual properties define the jelly material:

| Property | Description | CSS Approximation Strategy |
|----------|-------------|---------------------------|
| **Translucency** | Light passes through the gel, creating internal color variations. The material is not opaque but not fully transparent either. | Use semi-transparent gradients with multiple color stops. Layer pseudo-elements with different opacities. |
| **Subsurface scattering** | Light enters one side and exits another with color shift and softening. Creates a soft internal glow. | Simulate with radial gradients that are brighter in the center and fade toward edges. Use `box-shadow` with the accent color at low opacity for the glow effect. |
| **Rim/edge highlights** | Thin bright highlights along edges suggest glass-like refraction. These are subtle light catches, not heavy borders. | Use `inset box-shadow` with a thin white/light highlight along the top edge. Can also use a pseudo-element with a thin gradient. |
| **Colored light spill** | The gel material transmits colored light onto nearby surfaces. Blue glow under the switch, teal glow next to the slider. | Use `box-shadow` with the accent color spread beyond the element boundary. Can also use a blurred pseudo-element positioned behind. |
| **Contact shadows** | Soft, diffused shadows beneath the object. Not hard-edged. | Use `box-shadow` with large blur radius and moderate spread, positioned below the element. |
| **Recessed track** | The slider track appears recessed into the surface, like a machined channel. | Use `inset box-shadow` on the track element to create a sunken appearance. Slightly darker background than the surrounding surface. |
| **Volume/thickness** | The capsule has visible height — it's not a thin bar but a substantial 3D form. | Make the track height substantial (16–24px for sliders, proportional for toggles). Use top-to-bottom gradients to suggest curvature. |
| **Internal depth gradient** | The fill transitions from dark (empty/deep) to bright (filled/surface). | Use a horizontal gradient that goes from dark to bright in the fill direction, with the brightest point near the leading edge. |

### C. TypeGPU Reference Analysis

**Jelly Switch (from reference images).** The switch consists of a translucent gel cube sitting on a thin metallic pin, positioned on a recessed metallic track. The cube has rounded edges, internal light scattering, and casts a soft blue glow/halo onto the surface below. In dark mode, the cube appears to glow purple/blue from within against a dark gray surface. The track is a stadium/pill shape with the percentage text embossed into the metallic surface.

**Jelly Slider at 100% (teal variant).** The slider is a very thick stadium/pill capsule. The track has a white/light rim border. The fill transitions from dark gray (empty portion) to vibrant teal (filled portion). The filled portion has a glowing edge on the right side where teal light bleeds out onto the background. The entire track casts a soft shadow below it. The "100%" text is displayed inside the filled portion.

**Jelly Slider at 100% (orange variant).** Same form factor as the teal variant but with an orange fill. The orange glow spills light onto the background surface to the right of the slider. The track has the same recessed appearance with a light rim.

**Key insight from the blog post "Breaking Down the Jelly Slider":** The TypeGPU implementation uses ray marching with signed distance fields (SDFs) to render the slider. The simulation runs in 2D with 17 points connected by springs with constraint projection. The rendering uses Verlet integration, Bézier curve representation, Phong lighting, ambient occlusion, and refraction simulation. This level of rendering is not achievable with CSS alone, but the *visual properties* (translucency, glow, volume, rim highlights) can be approximated using layered CSS techniques.

### D. Soft-Body Simulation Approaches (for CSS Motion)

Since we cannot use WebGPU ray marching, the jelly motion must be achieved through CSS animations and JavaScript spring physics. The key principles to apply:

**Damped spring motion.** For toggle and slider interactions, use a spring-based animation with parameters: stiffness (k), damping (c), and mass (m). A good starting point for jelly feel is k=180, c=12, m=1, which produces a damping ratio of approximately 0.45 (underdamped, with visible but controlled overshoot). In CSS, this can be approximated with `cubic-bezier(0.34, 1.56, 0.64, 1)` for the overshoot, or better yet with the CSS `spring()` timing function where supported, or JavaScript-driven spring animations.

**Wobble on interaction.** When the toggle is clicked or the slider is dragged, apply a brief scale/transform animation that overshoots and settles. For the toggle knob: scale from 1.0 → 1.15 → 0.95 → 1.02 → 1.0 over approximately 400ms. For the slider fill: apply a subtle width overshoot of 2–3% that settles back.

**Squish deformation.** On press/mousedown, the element should compress slightly in the press direction and expand perpendicular (volume preservation). For a toggle knob: `transform: scaleX(0.9) scaleY(1.1)` on press, then spring back on release.

### E. Multi-Device Behavior

**Pointer detection strategy.** Based on research from Smashing Magazine's guide on hover/pointer media queries:

| Device | `pointer` | `hover` | `any-pointer` | `any-hover` | Cursor Follower |
|--------|-----------|---------|---------------|-------------|-----------------|
| Desktop with mouse | `fine` | `hover` | `fine` | `hover` | Full cursor blob |
| Laptop with trackpad | `fine` | `hover` | `fine` | `hover` | Full cursor blob |
| iPad (touch only) | `coarse` | `none` | `coarse` | `none` | Hidden |
| iPad with trackpad | `coarse` | `none` | `fine` | `hover` | Subtle cursor dot (via JS detection) |
| iPhone | `coarse` | `none` | `coarse` | `none` | Hidden |
| Android phone | `coarse` | `none` | `coarse` | `none` | Hidden |

**Critical iPad pitfall.** iPad with a connected trackpad still reports `pointer: coarse` and `hover: none` as its *primary* input. Only `any-pointer: fine` and `any-hover: hover` reveal the trackpad capability. The cursor follower should use `@media (hover: hover) and (pointer: fine)` as the primary gate, with a JavaScript-based secondary check using `matchMedia('(any-hover: hover)')` for hybrid devices.

**Graceful degradation.** On touch-only devices, all hover-dependent interactions (cursor follower, hover glow effects, hover-triggered animations) should be replaced with tap-triggered equivalents or simply omitted. The jelly wobble effect on toggles and sliders should still work via touch/tap events.

---

## Part 3: Gap Analysis — Current vs Target

| Element | Current State | Target State | Gap Severity |
|---------|--------------|--------------|-------------|
| **Dark/Light Toggle** | Flat circle sliding in a flat track. No material quality. No 3D depth. | Capsule-form track with a volumetric knob. Rim highlights, contact shadow, subtle glow. In jelly mode: translucent gel knob with colored light spill. | **Critical** |
| **Jelly Mode Toggle** | Small blob icon button. No capsule form. | Should be a proper capsule toggle matching the dark/light toggle style, or a clearly premium interactive control. | **Critical** |
| **Skill Sliders** | Flat gradient bars in rounded rectangles. No volume, no glow, no recessed track. | Thick volumetric capsules with recessed track, translucent fill with internal depth gradient, rim highlights, colored glow spill at the fill edge. | **Critical** |
| **Cursor Follower** | Modified with touch detection but may have artifacts. | Smooth blob on desktop, hidden on touch-only, subtle dot on iPad with trackpad. No artifacts on any device. | **High** |
| **Section Spacing** | Reduced from previous excessive padding but still has empty areas. | Tight, efficient use of screen real estate. No wasted vertical space. | **Medium** |
| **Card Sizing** | Generally consistent but some side-by-side cards may have height mismatches. | Equal heights for side-by-side cards. Consistent padding and spacing. | **Medium** |
| **Theme Switching** | Generally works but may have flicker or artifact issues. | Zero-flicker transitions. No layout jumps. No transparency flashes. | **Medium** |
| **Jelly Mode (Cards)** | Generic glassmorphism treatment. | Restrained premium softness — subtle edge softening, very mild depth enhancement, NOT full gel treatment. | **Medium** |
| **Responsive Layout** | Basic responsive but not optimized per device class. | Optimized for desktop, laptop, iPad landscape/portrait, iPhone, Android. | **Medium** |

---

## Part 4: Design Implications for Implementation

### Toggle Redesign (Batch 2 Priority)

The toggle must be rebuilt from scratch with these CSS layers:

1. **Track**: Stadium/pill shape, `inset box-shadow` for recessed appearance, subtle inner gradient (darker at bottom, lighter at top) to suggest depth.
2. **Knob**: Circle or rounded-square that is visually substantial (60–70% of track height). In default mode: solid with subtle gradient and highlight. In jelly mode: translucent with radial gradient, colored glow pseudo-element beneath.
3. **Rim highlight**: Thin `inset box-shadow` with white at 15–20% opacity along the top edge.
4. **Contact shadow**: `box-shadow` beneath the track with moderate blur.
5. **Animation**: Spring-based transition for knob movement. Squish on press (scaleX/scaleY). Overshoot on release.

### Slider Redesign (Batch 3 Priority)

The skill sliders must be rebuilt with these CSS layers:

1. **Track**: Thick stadium/pill shape (height: 20–28px). Recessed appearance via `inset box-shadow`. Dark interior gradient.
2. **Fill**: Translucent gradient from dark to bright in the fill direction. The leading edge should be the brightest. In jelly mode: add a glow pseudo-element at the leading edge that spills colored light.
3. **Rim**: Thin light border (1px, white at 15–20% opacity) around the entire track to suggest glass-like edge.
4. **Percentage text**: Positioned inside the fill area, near the leading edge.
5. **Shadow**: Soft `box-shadow` beneath the entire track.

### Cursor Follower (Batch 4 Priority)

Must use proper device detection:
- CSS: `@media (hover: hover) and (pointer: fine)` to show/hide
- JS: `window.matchMedia` for runtime detection
- Touch events: Completely disable cursor follower on `touchstart`
- iPad hybrid: Use `any-hover` check for trackpad detection

---

## Part 5: Prioritized Next Batch

**Batch 2 — Rebuild Toggle Correctly**

Narrow scope: Only the dark/light toggle and jelly mode toggle in the navbar.

Tasks:
1. Redesign the toggle track to a proper capsule/pill form with recessed appearance
2. Redesign the toggle knob to have volume and material quality
3. Add rim highlights, contact shadow, and subtle depth cues
4. Ensure proper knob/track ratio and symmetry
5. In jelly mode ON: enhance with translucent gel appearance and colored glow
6. Fix any theme-switch glitches related to toggle behavior
7. Screenshot-validate against TypeGPU switch reference
8. Commit and push to GitHub

---

## Acceptance Status

**Ready for review** — This is a research-only batch. No code changes were made. The document above constitutes the deliverable.

## Git Backup Status

**Not pushed yet** — No code changes in this batch. Research document saved locally.

## Updated Checklist

| Item | Status |
|------|--------|
| Failure analysis | Implemented |
| Jelly physics research | Implemented |
| TypeGPU reference analysis | Implemented |
| Device behavior research | Implemented |
| Gap analysis | Implemented |
| Design implications | Implemented |
| Batch 2 plan | Implemented |
| Toggle redesign | Not started |
| Slider redesign | Not started |
| Cursor follower fix | Not started |
| Responsive layout | Not started |
| Consistency pass | Not started |
| Final QA | Not started |

## Next Batch

Batch 2 — Rebuild Toggle Correctly (dark/light switch and jelly toggle, navbar proportion, capsule form, material definition)
