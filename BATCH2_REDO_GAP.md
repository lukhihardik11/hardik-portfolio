# Batch 2 Redo — Visual Gap Analysis

## What the reference shows (TypeGPU jelly switch)

The reference knob is a **translucent 3D gel cube** with visible internal light scattering, caustic white highlights on top, a soft colored glow radiating beneath it, and genuine volume — it looks like a physical object sitting on a surface. The track is a **deeply recessed metallic channel** with visible depth. The knob **protrudes above** the track, creating real 3D separation.

## What my current implementation looks like

A small dark pill with a tiny circle knob. The track is barely distinguishable from the navbar background. The knob has no translucency, no internal highlights, no glow beneath it. It reads as a generic iOS-style toggle, not a gel/jelly control.

## Exact properties I need to add/amplify

### 1. KNOB — must feel like a gel droplet with mass
- **Much larger knob-to-track ratio** — knob should be 85-90% of track height, not 70%
- **Translucent gradient** — not opaque solid color. Use multiple gradient layers to simulate seeing through gel
- **Internal caustic highlight** — a bright white/light streak across the top 30% of the knob, like light refracting through gel
- **Rim light** — thin bright edge on the top-left quadrant where light catches the curved surface
- **Colored glow beneath** — a soft radial gradient BELOW the knob that casts colored light onto the track surface
- **Multiple layered box-shadows** — outer glow (colored, spread), contact shadow (dark, tight), inner highlight (white, inset top)

### 2. TRACK — must feel like a recessed channel
- **Deeper inset appearance** — stronger inset shadows, especially at the top edge
- **Metallic/matte fill** — not transparent/invisible. The track should have visible substance
- **Wider and thicker** — increase track height for more visual presence in the navbar
- **Visible rim/edge** — thin highlight along the bottom edge suggesting depth

### 3. JELLY MODE ON vs OFF
- **OFF state**: Clean, professional, muted. Knob is a soft neutral with subtle depth. Track is a quiet recessed channel.
- **ON state**: Dramatic transformation. Knob becomes translucent teal/blue gel with internal glow, caustic highlights, colored light spill beneath. Track gets a subtle teal tint.

### 4. NAVBAR HARMONY
- Both toggles should be **slightly larger** than current — they're too small relative to the mail icon
- Consistent spacing between toggles and mail icon
- The toggles should feel like a designed set — same track shape, different knob treatment

### 5. SIZE TARGETS
- Track width: ~70px (was ~63px)
- Track height: ~34px (was ~31px)  
- Knob diameter: ~28px (was ~22px)
- This gives more room for the visual effects to breathe
