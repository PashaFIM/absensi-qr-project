import test from 'node:test';
import assert from 'node:assert/strict';
import {
  applyThemeClass,
  getInitialTheme,
  getNextTheme,
  normalizeTheme,
  THEME_STORAGE_KEY,
} from './theme.js';

test('normalizes theme values to light or dark', () => {
  assert.equal(normalizeTheme('dark'), 'dark');
  assert.equal(normalizeTheme('light'), 'light');
  assert.equal(normalizeTheme('system'), null);
  assert.equal(normalizeTheme(undefined), null);
});

test('reads a saved theme before falling back to system preference', () => {
  const storage = new Map([[THEME_STORAGE_KEY, 'dark']]);
  const localStorage = { getItem: (key) => storage.get(key) };

  assert.equal(getInitialTheme({ localStorage, prefersDark: false }), 'dark');
});

test('falls back to system preference when saved theme is invalid', () => {
  const storage = new Map([[THEME_STORAGE_KEY, 'unexpected']]);
  const localStorage = { getItem: (key) => storage.get(key) };

  assert.equal(getInitialTheme({ localStorage, prefersDark: true }), 'dark');
  assert.equal(getInitialTheme({ localStorage, prefersDark: false }), 'light');
});

test('toggles between light and dark', () => {
  assert.equal(getNextTheme('light'), 'dark');
  assert.equal(getNextTheme('dark'), 'light');
});

test('applies the dark class and color scheme to the root element', () => {
  const classes = new Set();
  const documentElement = {
    classList: {
      add: (value) => classes.add(value),
      remove: (value) => classes.delete(value),
    },
    style: {},
  };

  applyThemeClass(documentElement, 'dark');
  assert.equal(classes.has('dark'), true);
  assert.equal(documentElement.style.colorScheme, 'dark');

  applyThemeClass(documentElement, 'light');
  assert.equal(classes.has('dark'), false);
  assert.equal(documentElement.style.colorScheme, 'light');
});
