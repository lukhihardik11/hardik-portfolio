# Exhaustive Cross-Device Test Plan — PR #6

## Purpose

This test plan validates that jelly mode scroll glitches are eliminated on all target devices while preserving the full desktop jelly experience. Every test case must pass before PR #6 can be merged.

## Target Viewports

| ID | Device | Viewport | Touch | Pointer | Expected Path |
|----|--------|----------|-------|---------|---------------|
| D1 | Desktop 1080p | 1920x1080 | No | Fine | Full (scroll deform, gooey filter, caustic shimmer) |
| D2 | Desktop 1440p | 2560x1440 | No | Fine | Full |
| D3 | Desktop 768p (small laptop) | 1366x768 | No | Fine | Full |
| M1 | iPhone 15 Pro | 393x852 | Yes | Coarse | Lighter (no scroll deform, no gooey, no shimmer) |
| M2 | iPhone SE | 375x667 | Yes | Coarse | Lighter |
| M3 | Samsung Galaxy S24 | 412x915 | Yes | Coarse | Lighter |
| M4 | Pixel 8 | 412x915 | Yes | Coarse | Lighter |
| T1 | iPad Air (portrait) | 820x1180 | Yes | Coarse | Lighter |
| T2 | iPad Air (landscape) | 1180x820 | Yes | Coarse | Lighter |
| T3 | iPad Pro 12.9 (portrait) | 1024x1366 | Yes | Coarse | Lighter |
| T4 | Samsung Galaxy Tab S9 | 800x1280 | Yes | Coarse | Lighter |

## Test Matrix

### TC-01: Jelly Mode Toggle

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Load page in normal mode | Page renders without jelly effects |
| 2 | Enable jelly mode via toggle | Jelly effects activate smoothly |
| 3 | Rapidly toggle 10x | No visual artifacts, no stuck states |
| 4 | Toggle theme while jelly is on | Theme changes cleanly, no contamination |
| 5 | Rapidly alternate jelly + theme toggles | No double-box, no stuck knobs |

### TC-02: Scroll Through All Sections (Jelly Mode ON)

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Enable jelly mode | Jelly effects active |
| 2 | Slow scroll from top to bottom | No random areas flash, no stale tiles |
| 3 | Fast scroll (fling) from top to bottom | No visual glitches, no blank areas |
| 4 | Scroll back to top quickly | No artifacts on reverse scroll |
| 5 | Scroll to each section boundary | No content overlap or z-index issues |
| 6 | Repeat steps 2-5 three times | Consistent behavior across repetitions |

### TC-03: Section-Specific Scroll Checks

| Section | Desktop Check | Mobile Check |
|---------|--------------|--------------|
| Hero | Scroll deform visible (skew/scale) | No deform, smooth fade/parallax only |
| About | Scroll deform visible | No deform, cards render cleanly |
| Philosophy | Scroll deform visible, word reveal works | No deform, word reveal works |
| Projects | Scroll deform visible, cards load | No deform, cards load cleanly |
| Education | Scroll deform visible | No deform, cards render cleanly |
| Contact | Scroll deform visible | No deform, form renders cleanly |

### TC-04: Jelly Background Blobs

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Enable jelly mode on desktop | Gooey filter active, blobs merge organically |
| 2 | Enable jelly mode on mobile | Blobs visible but NO gooey filter (simple round blobs) |
| 3 | Scroll with blobs visible (desktop) | Blobs drift smoothly, no scroll interference |
| 4 | Scroll with blobs visible (mobile) | Blobs visible, no scroll glitches |
| 5 | Toggle theme with blobs visible | Blob colors update cleanly |

### TC-05: Jelly Cards (backdrop-filter)

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | View jelly cards on desktop | Full blur(20px) saturate(1.4) |
| 2 | View jelly cards on mobile | Lighter blur(8px) saturate(1.2) |
| 3 | Scroll past jelly cards on mobile | No repaint artifacts behind cards |
| 4 | Hover jelly card on desktop | Wobble animation plays |
| 5 | Tap jelly card on mobile | No wobble (desktop-only), tap feedback only |

### TC-06: Caustic Shimmer Background

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Enable jelly mode on desktop | Body background shimmer animation active |
| 2 | Enable jelly mode on mobile | Static gradient (no animation) |
| 3 | Scroll on mobile with jelly mode | No background repaint flicker |

### TC-07: Button Interactions in Jelly Mode

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Hover button on desktop | Wobble animation plays |
| 2 | Click button on desktop | Squash animation plays |
| 3 | Tap button on mobile | No wobble, no squash animation |
| 4 | Scroll past buttons on mobile | No :active trigger during scroll |

### TC-08: Performance Metrics

| Metric | Desktop Target | Mobile Target |
|--------|---------------|---------------|
| Compositor layers (jelly ON) | < 25 | < 10 |
| will-change elements (jelly ON) | < 15 | < 5 |
| JS errors during scroll | 0 | 0 |
| Layout shifts during scroll | 0 | 0 |
| Scroll FPS (jelly ON) | > 55 fps | > 50 fps |

### TC-09: Theme + Jelly Mode Combinations

| Combination | Expected Result |
|-------------|-----------------|
| Light + Jelly OFF | Normal light theme |
| Light + Jelly ON | Jelly effects with light colors |
| Dark + Jelly OFF | Normal dark theme |
| Dark + Jelly ON | Jelly effects with dark colors |
| Toggle theme while scrolling (jelly ON) | No flash, no stale tiles |
| Toggle jelly while scrolling | No flash, no stale tiles |

### TC-10: Edge Cases

| Case | Expected Result |
|------|-----------------|
| Orientation change (portrait to landscape) | Layout adjusts, no glitches |
| Background tab → return | Page renders correctly |
| Pinch zoom on mobile | No layout break |
| Pull-to-refresh on mobile | Page reloads cleanly |
| Low-end device (2GB RAM) | Lighter path prevents crashes |

## Automated Test Coverage

The following viewports are tested via Puppeteer in the sandbox:

| Viewport | Width | Height | Mobile | Touch |
|----------|-------|--------|--------|-------|
| Desktop | 1440 | 900 | No | No |
| Android (Galaxy S24) | 412 | 915 | Yes | Yes |
| iPhone 15 Pro | 393 | 852 | Yes | Yes |
| iPad Air (portrait) | 820 | 1180 | Yes | Yes |
| iPad Air (landscape) | 1180 | 820 | Yes | Yes |

Automated tests cover: TC-01 (toggle), TC-02 (scroll), TC-04 (blobs), TC-08 (performance metrics), TC-09 (theme combinations).

Manual testing recommended for: TC-03 (visual section checks), TC-05 (backdrop-filter visual quality), TC-07 (button feel), TC-10 (edge cases).

## Pass Criteria

All automated tests must pass with 0 JS errors and 0 layout overflow issues across all viewports. Visual inspection of screenshots must show no artifacts, no stale tiles, and no blank areas during scroll.
