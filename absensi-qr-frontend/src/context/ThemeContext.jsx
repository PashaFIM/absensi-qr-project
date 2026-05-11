import React, { useEffect, useMemo, useState } from 'react';
import {
  applyThemeClass,
  getInitialTheme,
  getNextTheme,
  THEME_STORAGE_KEY,
} from '../utils/theme';
import { ThemeContext } from './themeContextObject';

const getSystemPrefersDark = () => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => getInitialTheme({
    localStorage: typeof window !== 'undefined' ? window.localStorage : undefined,
    prefersDark: getSystemPrefersDark(),
  }));

  useEffect(() => {
    applyThemeClass(document.documentElement, theme);
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  const value = useMemo(() => ({
    theme,
    isDark: theme === 'dark',
    toggleTheme: () => setTheme((currentTheme) => getNextTheme(currentTheme)),
  }), [theme]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
