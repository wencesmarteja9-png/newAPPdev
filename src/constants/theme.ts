
/**
 * QUELESS DESIGN SYSTEM
 * Official black and gold theme.
 */

import '@/global.css';
import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#FFFFFF',
    background: '#0D0D0D',
    backgroundElement: '#181818',
    backgroundSelected: '#2A2A2A',
    textSecondary: '#A3A3A3',
    primary: '#D4AF37',
    border: '#2A2A2A',
    success: '#4ADE80',
    danger: '#F87171',
    warning: '#D4AF37',
  },

  dark: {
    text: '#FFFFFF',
    background: '#0D0D0D',
    backgroundElement: '#181818',
    backgroundSelected: '#2A2A2A',
    textSecondary: '#A3A3A3',
    primary: '#D4AF37',
    border: '#2A2A2A',
    success: '#4ADE80',
    danger: '#F87171',
    warning: '#D4AF37',
  },
} as const;

export type ThemeColor =
  keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },

  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },

  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const Radius = {
  input: 12,
  button: 14,
  card: 16,
  large: 20,
  full: 999,
} as const;

export const Typography = {
  screenTitle: 24,
  sectionTitle: 20,
  subtitle: 16,
  body: 14,
  caption: 12,
} as const;

export const BottomTabInset =
  Platform.select({ ios: 50, android: 80 }) ?? 0;

export const MaxContentWidth = 800;
