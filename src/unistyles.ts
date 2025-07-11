// src/unistyles.ts
import { StyleSheet } from 'react-native-unistyles';

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
} as const;

const breakpoints = {
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
} as const;

type AppThemes = {
  light: typeof lightTheme;
  dark: typeof darkTheme;
};

type AppBreakpoints = typeof breakpoints;

declare module 'react-native-unistyles' {
  export interface UnistylesThemes extends AppThemes {}
  export interface UnistylesBreakpoints extends AppBreakpoints {}
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