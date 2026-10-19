/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://unistyl.es/), etc.
 */

import '@/global.css';

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#000000',
    background: '#ffffff',
    backgroundElement: '#F0F0F3',
    backgroundSelected: '#E0E1E6',
    textSecondary: '#60646C',
    primary: '#2563EB',
    primaryMuted: '#EFF6FF',
    border: '#E2E8F0',
    borderFocused: '#2563EB',
    borderError: '#EF4444',
    borderSuccess: '#10B981',
    inputBackground: '#F8FAFC',
    cardBackground: '#FFFFFF',
    placeholder: '#94A3B8',
    disabled: '#F1F5F9',
    disabledText: '#94A3B8',
    error: '#EF4444',
    errorBackground: '#FEF2F2',
    success: '#10B981',
    successBackground: '#ECFDF5',
    warning: '#F59E0B',
  },
  dark: {
    text: '#ffffff',
    background: '#000000',
    backgroundElement: '#212225',
    backgroundSelected: '#2E3135',
    textSecondary: '#B0B4BA',
    primary: '#3B82F6',
    primaryMuted: '#1E293B',
    border: '#2E323B',
    borderFocused: '#60A5FA',
    borderError: '#F87171',
    borderSuccess: '#34D399',
    inputBackground: '#16181D',
    cardBackground: '#1A1D24',
    placeholder: '#64748B',
    disabled: '#1E222A',
    disabledText: '#5A6270',
    error: '#F87171',
    errorBackground: '#2A1616',
    success: '#34D399',
    successBackground: '#10261E',
    warning: '#FBBF24',
  },
} as const;

export const BorderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 9999,
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
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

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
