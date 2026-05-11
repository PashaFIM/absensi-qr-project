export const THEME_STORAGE_KEY = 'absensi-qr-theme';

export const normalizeTheme = (theme) => {
  if (theme === 'light' || theme === 'dark') return theme;
  return null;
};

export const getInitialTheme = ({ localStorage, prefersDark } = {}) => {
  const savedTheme = normalizeTheme(localStorage?.getItem?.(THEME_STORAGE_KEY));
  if (savedTheme) return savedTheme;
  return prefersDark ? 'dark' : 'light';
};

export const getNextTheme = (theme) => (theme === 'dark' ? 'light' : 'dark');

export const applyThemeClass = (documentElement, theme) => {
  if (!documentElement) return;

  if (theme === 'dark') {
    documentElement.classList.add('dark');
    documentElement.style.colorScheme = 'dark';
    return;
  }

  documentElement.classList.remove('dark');
  documentElement.style.colorScheme = 'light';
};
