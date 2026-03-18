/**
 * JellyModeContext — Manages the "Jelly Mode" toggle state.
 * 
 * Default mode: Clean, elegant design with minimal animations.
 * Jelly mode: Enhanced jelly-like spring physics on all interactive elements,
 *   translucent glassmorphism surfaces, wobbly hover effects, and bouncy transitions.
 * 
 * Jelly mode uses CSS spring animations via framer-motion — works on ALL devices.
 * No WebGPU dependency. Persists user preference in localStorage.
 */
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

interface JellyModeContextType {
  jellyMode: boolean;
  toggleJellyMode: () => void;
}

const JellyModeContext = createContext<JellyModeContextType | undefined>(undefined);

const JELLY_MODE_KEY = 'jelly-mode';

export function JellyModeProvider({ children }: { children: React.ReactNode }) {
  const [jellyMode, setJellyMode] = useState(() => {
    try {
      const stored = localStorage.getItem(JELLY_MODE_KEY);
      // Default to OFF for new visitors (stored === null)
      return stored === 'true';
    } catch {
      return false;
    }
  });

  // Update html class and persist
  useEffect(() => {
    if (jellyMode) {
      document.documentElement.classList.add('jelly-mode');
    } else {
      document.documentElement.classList.remove('jelly-mode');
    }
    try {
      localStorage.setItem(JELLY_MODE_KEY, String(jellyMode));
    } catch {
      // ignore
    }
  }, [jellyMode]);

  const toggleJellyMode = useCallback(() => {
    setJellyMode(prev => !prev);
  }, []);

  return (
    <JellyModeContext.Provider value={{ jellyMode, toggleJellyMode }}>
      {children}
    </JellyModeContext.Provider>
  );
}

export function useJellyMode() {
  const context = useContext(JellyModeContext);
  if (!context) {
    throw new Error('useJellyMode must be used within JellyModeProvider');
  }
  return context;
}
