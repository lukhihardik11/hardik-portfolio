/**
 * JellyModeToggle — Jelly mode ON/OFF toggle using unified GelToggle.
 *
 * Phase 2B: Improved material quality
 * - OFF knob now has visible gel character (not flat gray)
 * - Better track contrast in light mode
 * - Added trackRimLight for recessed groove definition
 * - Knob proportions updated to match new 1.35x overflow ratio
 */
import { useJellyMode } from '@/contexts/JellyModeContext';
import { useTheme } from '@/contexts/ThemeContext';
import { GelToggle, type GelToggleColors } from './GelToggle';

/* ── Color configurations ── */

const LIGHT_COLORS: GelToggleColors = {
  // Track OFF: darker warm neutral for contrast against cream bg
  trackOff: 'linear-gradient(180deg, oklch(0.72 0.008 75) 0%, oklch(0.77 0.006 75) 40%, oklch(0.74 0.008 75) 100%)',
  // Track ON: teal-tinted groove
  trackOn: 'linear-gradient(180deg, oklch(0.68 0.05 174) 0%, oklch(0.73 0.045 174) 40%, oklch(0.70 0.05 174) 100%)',
  trackShadow: [
    'inset 0 2px 5px oklch(0 0 0 / 15%)',
    'inset 0 1px 2px oklch(0 0 0 / 10%)',
    'inset 0 -1px 1px oklch(1 0 0 / 25%)',
  ].join(', '),
  trackRimLight: 'oklch(1 0 0 / 20%)',
  // Knob OFF: soft warm pearl gel (not flat gray — retains gel character)
  knobOff: 'radial-gradient(ellipse at 30% 25%, oklch(0.94 0.02 75 / 95%) 0%, oklch(0.84 0.04 75 / 91%) 45%, oklch(0.76 0.04 72 / 87%) 100%)',
  // Knob ON: bright teal gel
  knobOn: 'radial-gradient(ellipse at 30% 25%, oklch(0.93 0.06 174 / 96%) 0%, oklch(0.83 0.14 174 / 93%) 40%, oklch(0.72 0.18 174 / 89%) 100%)',
  knobShadowOff: [
    '0 0 6px oklch(0.82 0.03 75 / 22%)',
    '0 4px 10px oklch(0 0 0 / 15%)',
    '0 1px 4px oklch(0 0 0 / 10%)',
    'inset 0 3px 5px oklch(1 0 0 / 55%)',
    'inset 0 -2px 4px oklch(0 0 0 / 10%)',
    'inset 1px 1px 3px oklch(1 0 0 / 38%)',
  ].join(', '),
  knobShadowOn: [
    '0 0 14px oklch(0.58 0.22 174 / 42%)',
    '0 0 6px oklch(0.63 0.20 174 / 30%)',
    '0 4px 12px oklch(0 0 0 / 20%)',
    '0 1px 4px oklch(0 0 0 / 14%)',
    'inset 0 3px 6px oklch(1 0 0 / 52%)',
    'inset 0 -3px 5px oklch(0.48 0.14 174 / 24%)',
    'inset 2px 1px 4px oklch(1 0 0 / 30%)',
  ].join(', '),
  glowOff: 'radial-gradient(ellipse, oklch(0.68 0.04 75 / 15%) 0%, transparent 60%)',
  glowOn: 'radial-gradient(ellipse, oklch(0.58 0.24 174 / 48%) 0%, oklch(0.53 0.20 174 / 22%) 40%, transparent 70%)',
  borderOff: '1px solid oklch(0 0 0 / 6%)',
  borderOn: '1px solid oklch(0.53 0.14 174 / 14%)',
  causticIntensity: 1.0,
};

const DARK_COLORS: GelToggleColors = {
  // Track OFF: deep dark recessed groove
  trackOff: 'linear-gradient(180deg, oklch(0.09 0.012 228) 0%, oklch(0.13 0.016 228) 40%, oklch(0.10 0.012 228) 100%)',
  // Track ON: dark teal-tinted groove
  trackOn: 'linear-gradient(180deg, oklch(0.08 0.045 174) 0%, oklch(0.12 0.055 174) 40%, oklch(0.09 0.045 174) 100%)',
  trackShadow: [
    'inset 0 3px 7px oklch(0 0 0 / 65%)',
    'inset 0 1px 3px oklch(0 0 0 / 40%)',
    'inset 0 -1px 1px oklch(1 0 0 / 6%)',
    '0 2px 8px oklch(0 0 0 / 35%)',
    '0 1px 3px oklch(0 0 0 / 22%)',
  ].join(', '),
  trackRimLight: 'oklch(1 0 0 / 8%)',
  // Knob OFF: muted cool gel (not invisible — has visible gel character)
  knobOff: 'radial-gradient(ellipse at 30% 25%, oklch(0.50 0.03 228 / 91%) 0%, oklch(0.38 0.04 228 / 87%) 45%, oklch(0.30 0.04 228 / 83%) 100%)',
  // Knob ON: bright teal gel
  knobOn: 'radial-gradient(ellipse at 30% 25%, oklch(0.86 0.10 174 / 95%) 0%, oklch(0.68 0.20 174 / 91%) 40%, oklch(0.54 0.24 174 / 87%) 100%)',
  knobShadowOff: [
    '0 0 5px oklch(0.38 0.04 228 / 20%)',
    '0 4px 10px oklch(0 0 0 / 38%)',
    '0 1px 4px oklch(0 0 0 / 25%)',
    'inset 0 2px 5px oklch(1 0 0 / 18%)',
    'inset 0 -2px 4px oklch(0 0 0 / 25%)',
    'inset 1px 1px 3px oklch(1 0 0 / 12%)',
  ].join(', '),
  knobShadowOn: [
    '0 0 16px oklch(0.53 0.24 174 / 52%)',
    '0 0 7px oklch(0.58 0.22 174 / 38%)',
    '0 4px 12px oklch(0 0 0 / 38%)',
    '0 1px 4px oklch(0 0 0 / 28%)',
    'inset 0 3px 6px oklch(0.86 0.10 174 / 48%)',
    'inset 0 -3px 5px oklch(0.28 0.16 174 / 32%)',
    'inset 2px 1px 4px oklch(1 0 0 / 20%)',
  ].join(', '),
  glowOff: 'radial-gradient(ellipse, oklch(0.33 0.04 228 / 18%) 0%, transparent 60%)',
  glowOn: 'radial-gradient(ellipse, oklch(0.53 0.27 174 / 62%) 0%, oklch(0.48 0.22 174 / 30%) 40%, transparent 70%)',
  borderOff: '1.5px solid oklch(1 0 0 / 8%)',
  borderOn: '1.5px solid oklch(0.43 0.14 174 / 24%)',
  causticIntensity: 0.85,
};

/* ── Component ── */
interface Props {
  size?: number;
}

export function JellyModeToggle({ size = 38 }: Props) {
  const { jellyMode, toggleJellyMode } = useJellyMode();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const trackH = Math.round(size * 0.82);
  const knobD = Math.round(trackH * 1.35);
  const iconSize = Math.round(knobD * 0.38);

  return (
    <GelToggle
      checked={jellyMode}
      onChange={() => toggleJellyMode()}
      colors={LIGHT_COLORS}
      darkColors={DARK_COLORS}
      isDark={isDark}
      size={size}
      ariaLabel={jellyMode ? 'Disable Jelly Mode' : 'Enable Jelly Mode'}
      title={jellyMode ? 'Disable Jelly Mode' : 'Enable Jelly Mode'}
      jellyMode={jellyMode}
      icon={
        <svg
          width={iconSize}
          height={iconSize}
          viewBox="0 0 24 24"
          fill="none"
          style={{ opacity: 0.75 }}
        >
          <path
            d="M12 3C7.5 3 4 6.5 4 10.5c0 2.8 1.2 5 3 6.5 1 1 1.5 2.2 1.5 3.5h7c0-1.3.5-2.5 1.5-3.5 1.8-1.5 3-3.7 3-6.5C20 6.5 16.5 3 12 3z"
            fill={
              jellyMode
                ? isDark
                  ? 'oklch(0.95 0.08 174 / 72%)'
                  : 'oklch(0.22 0.14 174 / 68%)'
                : isDark
                  ? 'oklch(0.68 0 0 / 42%)'
                  : 'oklch(0.38 0 0 / 38%)'
            }
          />
          {/* Specular dot on icon */}
          <ellipse
            cx="10"
            cy="8"
            rx="1.8"
            ry="1"
            fill={
              jellyMode
                ? 'oklch(1 0 0 / 42%)'
                : 'oklch(1 0 0 / 18%)'
            }
          />
        </svg>
      }
    />
  );
}
