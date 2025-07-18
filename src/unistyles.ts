// src/unistyles.ts
import { Dimensions } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

const { width: screenWidth } = Dimensions.get('window');

// Font scaling utility based on screen width
const scaleFont = (size: number, baseWidth: number = 375) => {
  const scale = screenWidth / baseWidth;
  const newSize = size * scale;
  // Ensure minimum and maximum font sizes
  return Math.max(12, Math.min(newSize, size * 1.2));
};

// Responsive font sizes
const fontSizes = {
  xs: scaleFont(12),
  sm: scaleFont(14),
  md: scaleFont(16),
  lg: scaleFont(18),
  xl: scaleFont(20),
  xxl: scaleFont(24),
  huge: scaleFont(32),
  massive: scaleFont(40),
  gigantic: scaleFont(48),
};

const lightTheme = {
  colors: {
    background: '#FFFFFF',
    text: '#000000',
    primary: '#FF4444',
    secondary: '#FFD700',
    cardBackground: '#F5F5F5',
    cardText: '#333333',
    accent: '#FF4444',
  },
  fonts: fontSizes,
} as const;

const darkTheme = {
  colors: {
    background: '#1A1A1A',
    text: '#FFFFFF',
    primary: '#FF4444',
    secondary: '#FFD700',
    cardBackground: '#2A2A2A',
    cardText: '#CCCCCC',
    accent: '#FF4444',
  },
  fonts: fontSizes,
} as const;

// Mobile-first breakpoints based on common device widths
const breakpoints = {
  xs: 0,        // iPhone SE and smaller
  sm: 375,      // iPhone 6/7/8 size
  md: 414,      // iPhone 6/7/8 Plus size
  lg: 768,      // iPad portrait
  xl: 1024,     // iPad landscape
} as const;

type AppThemes = {
  light: typeof lightTheme;
  dark: typeof darkTheme;
};

type AppBreakpoints = typeof breakpoints;

declare module 'react-native-unistyles' {
  export interface UnistylesThemes extends AppThemes {
    // Required by react-native-unistyles
  }
  export interface UnistylesBreakpoints extends AppBreakpoints {
    // Required by react-native-unistyles
  }
}

StyleSheet.configure({
  themes: {
    light: lightTheme,
    dark: darkTheme,
  },
  breakpoints,
  settings: {
    adaptiveThemes: true,
  },
});