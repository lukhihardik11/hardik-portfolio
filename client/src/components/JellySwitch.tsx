/**
 * JellySwitch — Dark/Light mode toggle using unified GelToggle.
 *
 * Phase 2B: Improved material quality
 * - Better track contrast in light mode (no longer blends into cream bg)
 * - Richer knob gradients with more translucent gel feel
 * - Added trackRimLight for recessed groove definition
 * - Knob proportions updated to match new 1.35x overflow ratio
 */
import { Sun, Moon } from 'lucide-react';
import { useJellyMode } from '@/contexts/JellyModeContext';
import { GelToggle, type GelToggleColors } from './GelToggle';

/* ── Color configurations ── */

const LIGHT_COLORS: GelToggleColors = {
  // Track: darker warm neutral for contrast against cream background
  trackOff: 'linear-gradient(180deg, oklch(0.72 0.008 75) 0%, oklch(0.77 0.006 75) 40%, oklch(0.74 0.008 75) 100%)',
  trackOn: 'linear-gradient(180deg, oklch(0.70 0.010 75) 0%, oklch(0.75 0.008 75) 40%, oklch(0.72 0.010 75) 100%)',
  trackShadow: [
    'inset 0 3px 7px oklch(0 0 0 / 25%)',
    'inset 0 1px 3px oklch(0 0 0 / 15%)',
    'inset 0 -1px 1px oklch(1 0 0 / 50%)',
    '0 2px 6px oklch(0 0 0 / 12%)',
    '0 1px 2px oklch(0 0 0 / 8%)',
  ].join(', '),
  trackRimLight: 'oklch(1 0 0 / 50%)',
  // Knob OFF (light mode = sun): warm amber gel with translucency
  knobOff: 'radial-gradient(ellipse at 30% 25%, oklch(0.96 0.07 72 / 96%) 0%, oklch(0.86 0.14 68 / 92%) 40%, oklch(0.74 0.16 62 / 88%) 100%)',
  // Knob ON (dark mode = moon): cool blue gel
  knobOn: 'radial-gradient(ellipse at 30% 25%, oklch(0.80 0.12 238 / 95%) 0%, oklch(0.60 0.22 234 / 91%) 40%, oklch(0.48 0.26 228 / 87%) 100%)',
  knobShadowOff: [
    '0 0 12px oklch(0.78 0.15 70 / 38%)',
    '0 0 5px oklch(0.80 0.13 70 / 25%)',
    '0 4px 12px oklch(0 0 0 / 18%)',
    '0 1px 4px oklch(0 0 0 / 12%)',
    'inset 0 3px 6px oklch(1 0 0 / 55%)',
    'inset 0 -3px 5px oklch(0.60 0.12 62 / 22%)',
    'inset 2px 1px 4px oklch(1 0 0 / 30%)',
  ].join(', '),
  knobShadowOn: [
    '0 0 14px oklch(0.56 0.24 234 / 42%)',
    '0 0 6px oklch(0.58 0.22 234 / 30%)',
    '0 4px 12px oklch(0 0 0 / 20%)',
    '0 1px 4px oklch(0 0 0 / 14%)',
    'inset 0 3px 6px oklch(0.86 0.10 238 / 48%)',
    'inset 0 -3px 5px oklch(0.32 0.16 228 / 28%)',
    'inset 2px 1px 4px oklch(1 0 0 / 24%)',
  ].join(', '),
  glowOff: 'radial-gradient(ellipse, oklch(0.78 0.15 70 / 38%) 0%, oklch(0.76 0.13 70 / 18%) 40%, transparent 70%)',
  glowOn: 'radial-gradient(ellipse, oklch(0.53 0.24 234 / 45%) 0%, oklch(0.48 0.20 234 / 20%) 40%, transparent 70%)',
  borderOff: '1.5px solid oklch(0 0 0 / 10%)',
  borderOn: '1.5px solid oklch(0 0 0 / 10%)',
  causticIntensity: 1.0,
};

const DARK_COLORS: GelToggleColors = {
  // Track: deep dark recessed groove with blue undertone
  trackOff: 'linear-gradient(180deg, oklch(0.09 0.012 228) 0%, oklch(0.13 0.016 228) 40%, oklch(0.10 0.012 228) 100%)',
  trackOn: 'linear-gradient(180deg, oklch(0.08 0.014 228) 0%, oklch(0.12 0.018 228) 40%, oklch(0.09 0.014 228) 100%)',
  trackShadow: [
    'inset 0 3px 7px oklch(0 0 0 / 65%)',
    'inset 0 1px 3px oklch(0 0 0 / 40%)',
    'inset 0 -1px 1px oklch(1 0 0 / 6%)',
    '0 2px 8px oklch(0 0 0 / 35%)',
    '0 1px 3px oklch(0 0 0 / 22%)',
  ].join(', '),
  trackRimLight: 'oklch(1 0 0 / 8%)',
  // Knob OFF (light mode = sun): warm amber gel, brighter for dark bg
  knobOff: 'radial-gradient(ellipse at 30% 25%, oklch(0.90 0.10 72 / 95%) 0%, oklch(0.76 0.18 68 / 91%) 40%, oklch(0.62 0.20 62 / 87%) 100%)',
  // Knob ON (dark mode = moon): cool blue gel, brighter for dark bg
  knobOn: 'radial-gradient(ellipse at 30% 25%, oklch(0.76 0.14 238 / 94%) 0%, oklch(0.56 0.24 234 / 89%) 40%, oklch(0.46 0.28 228 / 85%) 100%)',
  knobShadowOff: [
    '0 0 14px oklch(0.73 0.18 70 / 48%)',
    '0 0 6px oklch(0.76 0.16 70 / 32%)',
    '0 4px 12px oklch(0 0 0 / 32%)',
    '0 1px 4px oklch(0 0 0 / 22%)',
    'inset 0 3px 6px oklch(1 0 0 / 42%)',
    'inset 0 -3px 5px oklch(0.48 0.14 62 / 28%)',
    'inset 2px 1px 4px oklch(1 0 0 / 20%)',
  ].join(', '),
  knobShadowOn: [
    '0 0 16px oklch(0.50 0.26 234 / 52%)',
    '0 0 7px oklch(0.53 0.24 234 / 38%)',
    '0 4px 12px oklch(0 0 0 / 38%)',
    '0 1px 4px oklch(0 0 0 / 28%)',
    'inset 0 3px 6px oklch(0.83 0.12 238 / 48%)',
    'inset 0 -3px 5px oklch(0.28 0.16 228 / 32%)',
    'inset 2px 1px 4px oklch(1 0 0 / 20%)',
  ].join(', '),
  glowOff: 'radial-gradient(ellipse, oklch(0.70 0.18 70 / 48%) 0%, oklch(0.66 0.16 70 / 22%) 40%, transparent 70%)',
  glowOn: 'radial-gradient(ellipse, oklch(0.48 0.26 234 / 58%) 0%, oklch(0.46 0.22 234 / 28%) 40%, transparent 70%)',
  borderOff: '1.5px solid oklch(1 0 0 / 8%)',
  borderOn: '1.5px solid oklch(1 0 0 / 8%)',
  causticIntensity: 0.85,
};

/* ── Component ── */
interface Props {
  checked: boolean;
  onChange: (v: boolean) => void;
  size?: number;
}

export default function JellySwitch({ checked, onChange, size = 38 }: Props) {
  const isDark = checked;
  const { jellyMode } = useJellyMode();

  const trackH = Math.round(size * 0.82);
  const knobD = Math.round(trackH * 1.35);
  const iconSize = Math.round(knobD * 0.34);
  const iconColor = isDark
    ? 'oklch(0.95 0.04 238 / 85%)'
    : 'oklch(0.30 0.14 62 / 85%)';

  return (
    <GelToggle
      checked={checked}
      onChange={onChange}
      colors={LIGHT_COLORS}
      darkColors={DARK_COLORS}
      isDark={isDark}
      size={size}
      ariaLabel={checked ? 'Switch to light mode' : 'Switch to dark mode'}
      title={checked ? 'Switch to light mode' : 'Switch to dark mode'}
      jellyMode={jellyMode}
      icon={
        <span style={{ color: iconColor, transition: 'color 0.4s' }}>
          {isDark ? <Moon size={iconSize} /> : <Sun size={iconSize} />}
        </span>
      }
    />
  );
}
