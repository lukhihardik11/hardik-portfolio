import React, { createContext, useContext, useEffect, useState, useCallback } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme?: () => void;
  switchable: boolean;
  isAutoMode: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
  switchable?: boolean;
}

/** Determine whether it's daytime based on user's local hour.
 *  Sunrise ≈ 6:00 AM, Sunset ≈ 18:00 (6 PM).
 *  Returns "light" during the day, "dark" at night. */
function getTimeBasedTheme(): Theme {
  const hour = new Date().getHours();
  // Daytime: 6 AM (inclusive) to 6 PM (exclusive)
  return hour >= 6 && hour < 18 ? "light" : "dark";
}

const THEME_KEY = "theme";
const THEME_MODE_KEY = "theme-mode"; // "auto" | "manual"

export function ThemeProvider({
  children,
  defaultTheme = "light",
  switchable = false,
}: ThemeProviderProps) {
  const [isAutoMode, setIsAutoMode] = useState<boolean>(() => {
    if (!switchable) return false;
    const mode = localStorage.getItem(THEME_MODE_KEY);
    // Default to auto mode for new visitors
    return mode !== "manual";
  });

  const [theme, setTheme] = useState<Theme>(() => {
    if (!switchable) return defaultTheme;

    const mode = localStorage.getItem(THEME_MODE_KEY);
    if (mode === "manual") {
      // User previously manually toggled — respect their stored preference
      const stored = localStorage.getItem(THEME_KEY);
      if (stored === "light" || stored === "dark") return stored;
    }

    // Auto mode: use time-based theme
    return getTimeBasedTheme();
  });

  // Update theme on the DOM
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    if (switchable) {
      localStorage.setItem(THEME_KEY, theme);
    }
  }, [theme, switchable]);

  // In auto mode, check the time every minute and update theme accordingly
  useEffect(() => {
    if (!switchable || !isAutoMode) return;

    const checkTime = () => {
      const timeTheme = getTimeBasedTheme();
      setTheme(timeTheme);
    };

    // Check immediately
    checkTime();

    // Then check every 60 seconds
    const interval = setInterval(checkTime, 60_000);
    return () => clearInterval(interval);
  }, [switchable, isAutoMode]);

  const toggleTheme = useCallback(() => {
    if (!switchable) return;

    // Manual toggle: switch to manual mode and flip the theme
    setIsAutoMode(false);
    localStorage.setItem(THEME_MODE_KEY, "manual");
    setTheme(prev => {
      const next = prev === "light" ? "dark" : "light";
      localStorage.setItem(THEME_KEY, next);
      return next;
    });
  }, [switchable]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme: switchable ? toggleTheme : undefined,
        switchable,
        isAutoMode,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}
