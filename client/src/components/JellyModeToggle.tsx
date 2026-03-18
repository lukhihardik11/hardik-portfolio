/**
 * JellyModeToggle — A simple toggle button for enabling/disabling jelly mode.
 * Shows a jelly icon that wobbles when active.
 */
import { motion } from 'framer-motion';
import { useJellyMode } from '@/contexts/JellyModeContext';

export function JellyModeToggle() {
  const { jellyMode, toggleJellyMode } = useJellyMode();

  return (
    <motion.button
      onClick={toggleJellyMode}
      aria-label={jellyMode ? 'Disable Jelly Mode' : 'Enable Jelly Mode'}
      title={jellyMode ? 'Disable Jelly Mode' : 'Enable Jelly Mode'}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="relative flex items-center justify-center w-9 h-9 rounded-full transition-colors"
      style={{
        background: jellyMode
          ? 'linear-gradient(145deg, oklch(0.7 0.15 180 / 30%), oklch(0.5 0.12 180 / 20%))'
          : 'oklch(0.5 0 0 / 10%)',
        boxShadow: jellyMode
          ? '0 0 12px oklch(0.7 0.15 180 / 25%), inset 0 1px 2px oklch(1 0 0 / 15%)'
          : 'inset 0 1px 2px oklch(0 0 0 / 10%)',
      }}
    >
      {/* Jelly blob icon */}
      <motion.svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        animate={jellyMode ? {
          scaleX: [1, 1.15, 0.9, 1.05, 1],
          scaleY: [1, 0.85, 1.1, 0.95, 1],
        } : {}}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        {/* Blob shape */}
        <path
          d="M12 3C7 3 4 6 4 10c0 3 1 5 3 7 1.5 1.5 2 3 2 5h6c0-2 .5-3.5 2-5 2-2 3-4 3-7 0-4-3-7-8-7z"
          fill={jellyMode ? 'oklch(0.7 0.15 180)' : 'oklch(0.6 0 0 / 40%)'}
          stroke={jellyMode ? 'oklch(0.8 0.12 180 / 60%)' : 'oklch(0.5 0 0 / 20%)'}
          strokeWidth="1.5"
        />
        {/* Specular highlight */}
        <ellipse
          cx="10"
          cy="8"
          rx="2.5"
          ry="1.5"
          fill="oklch(1 0 0 / 30%)"
        />
      </motion.svg>
    </motion.button>
  );
}
