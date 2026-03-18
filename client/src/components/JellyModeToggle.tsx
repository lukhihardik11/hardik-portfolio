/**
 * JellyModeToggle — Jelly mode ON/OFF toggle using unified GelToggle.
 *
 * Uses teal/cyan tones when ON, muted neutral when OFF.
 * Blob icon indicates jelly mode state.
 */
import { useJellyMode } from '@/contexts/JellyModeContext';
import { useTheme } from '@/contexts/ThemeContext';
import { GelToggle, type GelToggleColors } from './GelToggle';

/* ── Color configurations ── */

const LIGHT_COLORS: GelToggleColors = {
  // Track OFF: warm neutral recessed groove (matches JellySwitch)
  trackOff: 'linear-gradient(180deg, oklch(0.80 0.005 80) 0%, oklch(0.85 0.003 80) 40%, oklch(0.82 0.005 80) 100%)',
  // Track ON: slightly teal-tinted groove
  trackOn: 'linear-gradient(180deg, oklch(0.74 0.04 175) 0%, oklch(0.78 0.035 175) 40%, oklch(0.75 0.04 175) 100%)',
  trackShadow: [
    'inset 0 3px 6px oklch(0 0 0 / 20%)',
    'inset 0 1px 2px oklch(0 0 0 / 10%)',
    'inset 0 -1.5px 1px oklch(1 0 0 / 65%)',
    'inset 0 1px 0 oklch(1 0 0 / 30%)',
    '0 2px 6px oklch(0 0 0 / 10%)',
    '0 1px 2px oklch(0 0 0 / 6%)',
  ].join(', '),
  // Knob OFF: muted neutral gel
  knobOff: 'radial-gradient(ellipse at 32% 28%, oklch(0.95 0.01 80 / 96%) 0%, oklch(0.86 0.02 80 / 92%) 50%, oklch(0.80 0.02 80 / 88%) 100%)',
  // Knob ON: bright teal gel
  knobOn: 'radial-gradient(ellipse at 32% 28%, oklch(0.95 0.04 175 / 97%) 0%, oklch(0.85 0.12 175 / 94%) 45%, oklch(0.75 0.16 175 / 90%) 100%)',
  knobShadowOff: [
    '0 0 4px oklch(0.85 0.01 80 / 18%)',
    '0 3px 8px oklch(0 0 0 / 12%)',
    '0 1px 3px oklch(0 0 0 / 8%)',
    'inset 0 2px 4px oklch(1 0 0 / 55%)',
    'inset 0 -2px 3px oklch(0 0 0 / 8%)',
    'inset 1px 1px 2px oklch(1 0 0 / 35%)',
  ].join(', '),
  knobShadowOn: [
    '0 0 12px oklch(0.60 0.20 175 / 40%)',
    '0 0 5px oklch(0.65 0.18 175 / 28%)',
    '0 3px 10px oklch(0 0 0 / 18%)',
    '0 1px 3px oklch(0 0 0 / 12%)',
    'inset 0 3px 5px oklch(1 0 0 / 50%)',
    'inset 0 -2px 4px oklch(0.50 0.12 175 / 22%)',
    'inset 2px 1px 3px oklch(1 0 0 / 28%)',
  ].join(', '),
  glowOff: 'radial-gradient(ellipse, oklch(0.70 0.02 80 / 12%) 0%, transparent 60%)',
  glowOn: 'radial-gradient(ellipse, oklch(0.60 0.22 175 / 45%) 0%, oklch(0.55 0.18 175 / 20%) 40%, transparent 70%)',
  borderOff: '1.5px solid oklch(0 0 0 / 8%)',
  borderOn: '1.5px solid oklch(0.55 0.12 175 / 18%)',
  causticIntensity: 1.0,
};

const DARK_COLORS: GelToggleColors = {
  // Track OFF: dark recessed groove (matches JellySwitch)
  trackOff: 'linear-gradient(180deg, oklch(0.10 0.01 230) 0%, oklch(0.14 0.015 230) 40%, oklch(0.11 0.01 230) 100%)',
  // Track ON: dark teal-tinted groove
  trackOn: 'linear-gradient(180deg, oklch(0.09 0.04 175) 0%, oklch(0.13 0.05 175) 40%, oklch(0.10 0.04 175) 100%)',
  trackShadow: [
    'inset 0 3px 6px oklch(0 0 0 / 60%)',
    'inset 0 1px 2px oklch(0 0 0 / 35%)',
    'inset 0 -1.5px 1px oklch(1 0 0 / 8%)',
    '0 2px 8px oklch(0 0 0 / 30%)',
    '0 1px 3px oklch(0 0 0 / 20%)',
  ].join(', '),
  // Knob OFF: muted neutral gel
  knobOff: 'radial-gradient(ellipse at 32% 28%, oklch(0.52 0.02 230 / 92%) 0%, oklch(0.36 0.03 230 / 88%) 50%, oklch(0.28 0.03 230 / 84%) 100%)',
  // Knob ON: bright teal gel
  knobOn: 'radial-gradient(ellipse at 32% 28%, oklch(0.88 0.08 175 / 96%) 0%, oklch(0.70 0.18 175 / 92%) 45%, oklch(0.56 0.22 175 / 88%) 100%)',
  knobShadowOff: [
    '0 0 4px oklch(0.40 0.03 230 / 18%)',
    '0 3px 8px oklch(0 0 0 / 35%)',
    '0 1px 3px oklch(0 0 0 / 22%)',
    'inset 0 2px 4px oklch(1 0 0 / 15%)',
    'inset 0 -2px 3px oklch(0 0 0 / 22%)',
    'inset 1px 1px 2px oklch(1 0 0 / 10%)',
  ].join(', '),
  knobShadowOn: [
    '0 0 14px oklch(0.55 0.22 175 / 50%)',
    '0 0 6px oklch(0.60 0.20 175 / 35%)',
    '0 3px 10px oklch(0 0 0 / 35%)',
    '0 1px 3px oklch(0 0 0 / 25%)',
    'inset 0 3px 5px oklch(0.88 0.08 175 / 45%)',
    'inset 0 -2px 4px oklch(0.30 0.15 175 / 30%)',
    'inset 2px 1px 3px oklch(1 0 0 / 18%)',
  ].join(', '),
  glowOff: 'radial-gradient(ellipse, oklch(0.35 0.03 230 / 15%) 0%, transparent 60%)',
  glowOn: 'radial-gradient(ellipse, oklch(0.55 0.25 175 / 60%) 0%, oklch(0.50 0.20 175 / 28%) 40%, transparent 70%)',
  borderOff: '1.5px solid oklch(1 0 0 / 6%)',
  borderOn: '1.5px solid oklch(0.45 0.12 175 / 22%)',
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
  const knobD = Math.round(trackH * 1.15);
  const iconSize = Math.round(knobD * 0.42);

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
          style={{ opacity: 0.7 }}
        >
          <path
            d="M12 3C7.5 3 4 6.5 4 10.5c0 2.8 1.2 5 3 6.5 1 1 1.5 2.2 1.5 3.5h7c0-1.3.5-2.5 1.5-3.5 1.8-1.5 3-3.7 3-6.5C20 6.5 16.5 3 12 3z"
            fill={
              jellyMode
                ? isDark
                  ? 'oklch(0.95 0.08 175 / 70%)'
                  : 'oklch(0.25 0.12 175 / 65%)'
                : isDark
                  ? 'oklch(0.70 0 0 / 40%)'
                  : 'oklch(0.40 0 0 / 35%)'
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
                ? 'oklch(1 0 0 / 40%)'
                : 'oklch(1 0 0 / 15%)'
            }
          />
        </svg>
      }
    />
  );
}
