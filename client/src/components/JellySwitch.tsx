/**
 * JellySwitch — Dark/Light mode toggle using unified GelToggle.
 *
 * Uses warm amber tones for light mode, cool blue tones for dark mode.
 * Sun/Moon icons indicate current state.
 */
import { Sun, Moon } from 'lucide-react';
import { useJellyMode } from '@/contexts/JellyModeContext';
import { GelToggle, type GelToggleColors } from './GelToggle';

/* ── Color configurations ── */

const LIGHT_COLORS: GelToggleColors = {
  // Track: warm neutral recessed groove
  trackOff: 'linear-gradient(180deg, oklch(0.80 0.005 80) 0%, oklch(0.85 0.003 80) 40%, oklch(0.82 0.005 80) 100%)',
  trackOn: 'linear-gradient(180deg, oklch(0.80 0.005 80) 0%, oklch(0.85 0.003 80) 40%, oklch(0.82 0.005 80) 100%)',
  trackShadow: [
    'inset 0 3px 6px oklch(0 0 0 / 20%)',
    'inset 0 1px 2px oklch(0 0 0 / 10%)',
    'inset 0 -1.5px 1px oklch(1 0 0 / 65%)',
    'inset 0 1px 0 oklch(1 0 0 / 30%)',
    '0 2px 6px oklch(0 0 0 / 10%)',
    '0 1px 2px oklch(0 0 0 / 6%)',
  ].join(', '),
  // Knob OFF (light mode = sun): warm amber gel
  knobOff: 'radial-gradient(ellipse at 32% 28%, oklch(0.97 0.06 75 / 97%) 0%, oklch(0.88 0.12 70 / 94%) 45%, oklch(0.78 0.14 65 / 90%) 100%)',
  // Knob ON (dark mode = moon): cool blue gel
  knobOn: 'radial-gradient(ellipse at 32% 28%, oklch(0.82 0.10 240 / 96%) 0%, oklch(0.62 0.20 235 / 92%) 45%, oklch(0.50 0.24 230 / 88%) 100%)',
  knobShadowOff: [
    '0 0 10px oklch(0.80 0.14 70 / 35%)',
    '0 0 4px oklch(0.82 0.12 70 / 22%)',
    '0 3px 10px oklch(0 0 0 / 15%)',
    '0 1px 3px oklch(0 0 0 / 10%)',
    'inset 0 3px 5px oklch(1 0 0 / 50%)',
    'inset 0 -2px 4px oklch(0.65 0.10 65 / 20%)',
    'inset 2px 1px 3px oklch(1 0 0 / 28%)',
  ].join(', '),
  knobShadowOn: [
    '0 0 12px oklch(0.58 0.22 235 / 40%)',
    '0 0 5px oklch(0.60 0.20 235 / 28%)',
    '0 3px 10px oklch(0 0 0 / 18%)',
    '0 1px 3px oklch(0 0 0 / 12%)',
    'inset 0 3px 5px oklch(0.88 0.08 240 / 45%)',
    'inset 0 -2px 4px oklch(0.35 0.15 230 / 25%)',
    'inset 2px 1px 3px oklch(1 0 0 / 22%)',
  ].join(', '),
  glowOff: 'radial-gradient(ellipse, oklch(0.80 0.14 70 / 35%) 0%, oklch(0.78 0.12 70 / 15%) 40%, transparent 70%)',
  glowOn: 'radial-gradient(ellipse, oklch(0.55 0.22 235 / 40%) 0%, oklch(0.50 0.18 235 / 18%) 40%, transparent 70%)',
  borderOff: '1.5px solid oklch(0 0 0 / 8%)',
  borderOn: '1.5px solid oklch(0 0 0 / 8%)',
  causticIntensity: 1.0,
};

const DARK_COLORS: GelToggleColors = {
  // Track: dark recessed groove
  trackOff: 'linear-gradient(180deg, oklch(0.10 0.01 230) 0%, oklch(0.14 0.015 230) 40%, oklch(0.11 0.01 230) 100%)',
  trackOn: 'linear-gradient(180deg, oklch(0.10 0.01 230) 0%, oklch(0.14 0.015 230) 40%, oklch(0.11 0.01 230) 100%)',
  trackShadow: [
    'inset 0 3px 6px oklch(0 0 0 / 60%)',
    'inset 0 1px 2px oklch(0 0 0 / 35%)',
    'inset 0 -1.5px 1px oklch(1 0 0 / 8%)',
    '0 2px 8px oklch(0 0 0 / 30%)',
    '0 1px 3px oklch(0 0 0 / 20%)',
  ].join(', '),
  // Knob OFF (light mode = sun): warm amber gel, brighter for dark bg
  knobOff: 'radial-gradient(ellipse at 32% 28%, oklch(0.92 0.08 75 / 96%) 0%, oklch(0.78 0.16 70 / 92%) 45%, oklch(0.65 0.18 65 / 88%) 100%)',
  // Knob ON (dark mode = moon): cool blue gel, brighter for dark bg
  knobOn: 'radial-gradient(ellipse at 32% 28%, oklch(0.78 0.12 240 / 95%) 0%, oklch(0.58 0.22 235 / 90%) 45%, oklch(0.48 0.26 230 / 86%) 100%)',
  knobShadowOff: [
    '0 0 12px oklch(0.75 0.16 70 / 45%)',
    '0 0 5px oklch(0.78 0.14 70 / 30%)',
    '0 3px 10px oklch(0 0 0 / 30%)',
    '0 1px 3px oklch(0 0 0 / 20%)',
    'inset 0 3px 5px oklch(1 0 0 / 40%)',
    'inset 0 -2px 4px oklch(0.50 0.12 65 / 25%)',
    'inset 2px 1px 3px oklch(1 0 0 / 18%)',
  ].join(', '),
  knobShadowOn: [
    '0 0 14px oklch(0.52 0.24 235 / 50%)',
    '0 0 6px oklch(0.55 0.22 235 / 35%)',
    '0 3px 10px oklch(0 0 0 / 35%)',
    '0 1px 3px oklch(0 0 0 / 25%)',
    'inset 0 3px 5px oklch(0.85 0.10 240 / 45%)',
    'inset 0 -2px 4px oklch(0.30 0.15 230 / 30%)',
    'inset 2px 1px 3px oklch(1 0 0 / 18%)',
  ].join(', '),
  glowOff: 'radial-gradient(ellipse, oklch(0.72 0.16 70 / 45%) 0%, oklch(0.68 0.14 70 / 20%) 40%, transparent 70%)',
  glowOn: 'radial-gradient(ellipse, oklch(0.50 0.24 235 / 55%) 0%, oklch(0.48 0.20 235 / 25%) 40%, transparent 70%)',
  borderOff: '1.5px solid oklch(1 0 0 / 6%)',
  borderOn: '1.5px solid oklch(1 0 0 / 6%)',
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
  const knobD = Math.round(trackH * 1.15);
  const iconSize = Math.round(knobD * 0.36);
  const iconColor = isDark
    ? 'oklch(0.95 0.04 240 / 80%)'
    : 'oklch(0.35 0.12 65 / 80%)';

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
