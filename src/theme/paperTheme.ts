// Paper UI theme that follows our design guide
import { MD3DarkTheme, MD3LightTheme } from 'react-native-paper';
import type { MD3Theme } from 'react-native-paper';

// Design tokens from our style guide
const designTokens = {
  colors: {
    // Primary Brand Colors  
    primary: '#dc3545',           // Game red
    primaryContainer: '#f8d7da',
    onPrimary: '#ffffff',
    onPrimaryContainer: '#9a1a24',
    
    // Secondary (Gold accent)
    secondary: '#FFD700',
    secondaryContainer: '#fff8e1',
    onSecondary: '#000000',
    onSecondaryContainer: '#664d00',
    
    // Success Colors
    tertiary: '#28a745',
    tertiaryContainer: '#d4edda', 
    onTertiary: '#ffffff',
    onTertiaryContainer: '#0f4419',
    
    // Error Colors
    error: '#dc3545',
    errorContainer: '#f8d7da',
    onError: '#ffffff',
    onErrorContainer: '#9a1a24',
    
    // Background Colors
    background: '#ffffff',
    onBackground: '#212121',
    surface: '#fafafa',
    onSurface: '#212121',
    surfaceVariant: '#f5f5f5',
    onSurfaceVariant: '#404040',
    
    // Missing required colors
    surfaceDisabled: 'rgba(33, 33, 33, 0.12)',
    onSurfaceDisabled: 'rgba(33, 33, 33, 0.38)',
    backdrop: 'rgba(0, 0, 0, 0.4)',
    
    // Outline Colors
    outline: '#d9d9d9',
    outlineVariant: '#e6e6e6',
    
    // Other colors
    shadow: '#000000',
    scrim: '#000000',
    inverseSurface: '#1f1f1f',
    inverseOnSurface: '#f2f2f2',
    inversePrimary: '#ff6b7a',
    
    // Elevation colors
    elevation: {
      level0: 'transparent',
      level1: 'rgb(247, 243, 249)',
      level2: 'rgb(243, 237, 246)', 
      level3: 'rgb(238, 232, 244)',
      level4: 'rgb(236, 230, 243)',
      level5: 'rgb(233, 227, 241)',
    },
  },
  fonts: {
    // Default font required by MD3
    default: {
      fontFamily: 'Inter',
      fontWeight: '400' as const,
      letterSpacing: 0,
    },
    // Typography scale matching our design guide
    displayLarge: {
      fontFamily: 'Space Mono',
      fontSize: 56,
      fontWeight: '700' as const,
      lineHeight: 64,
      letterSpacing: -0.25,
    },
    displayMedium: {
      fontFamily: 'Space Mono', 
      fontSize: 40,
      fontWeight: '700' as const,
      lineHeight: 44,
      letterSpacing: -0.25,
    },
    displaySmall: {
      fontFamily: 'Space Mono',
      fontSize: 32,
      fontWeight: '600' as const,
      lineHeight: 38,
      letterSpacing: 0,
    },
    headlineLarge: {
      fontFamily: 'Inter',
      fontSize: 24,
      fontWeight: '600' as const,
      lineHeight: 29,
      letterSpacing: 0,
    },
    headlineMedium: {
      fontFamily: 'Inter',
      fontSize: 20,
      fontWeight: '500' as const,
      lineHeight: 26,
      letterSpacing: 0,
    },
    headlineSmall: {
      fontFamily: 'Inter',
      fontSize: 18,
      fontWeight: '500' as const,
      lineHeight: 25,
      letterSpacing: 0,
    },
    titleLarge: {
      fontFamily: 'Inter',
      fontSize: 20,
      fontWeight: '400' as const,
      lineHeight: 30,
      letterSpacing: 0,
    },
    titleMedium: {
      fontFamily: 'Inter',
      fontSize: 16,
      fontWeight: '400' as const,
      lineHeight: 24,
      letterSpacing: 0,
    },
    titleSmall: {
      fontFamily: 'Inter',
      fontSize: 14,
      fontWeight: '400' as const,
      lineHeight: 20,
      letterSpacing: 0,
    },
    bodyLarge: {
      fontFamily: 'Inter',
      fontSize: 20,
      fontWeight: '400' as const,
      lineHeight: 30,
      letterSpacing: 0,
    },
    bodyMedium: {
      fontFamily: 'Inter',
      fontSize: 16,
      fontWeight: '400' as const,
      lineHeight: 24,
      letterSpacing: 0,
    },
    bodySmall: {
      fontFamily: 'Inter',
      fontSize: 14,
      fontWeight: '400' as const,
      lineHeight: 20,
      letterSpacing: 0,
    },
    labelLarge: {
      fontFamily: 'Inter',
      fontSize: 14,
      fontWeight: '500' as const,
      lineHeight: 20,
      letterSpacing: 0.1,
    },
    labelMedium: {
      fontFamily: 'Inter',
      fontSize: 12,
      fontWeight: '400' as const,
      lineHeight: 20,
      letterSpacing: 0.5,
    },
    labelSmall: {
      fontFamily: 'Inter',
      fontSize: 12,
      fontWeight: '400' as const,
      lineHeight: 20,
      letterSpacing: 0.5,
    },
  },
};

// Dark theme variant
const darkColors = {
  ...designTokens.colors,
  background: '#1A1A1A',
  onBackground: '#f2f2f2',
  surface: '#1f1f1f',
  onSurface: '#f2f2f2', 
  surfaceVariant: '#292929',
  onSurfaceVariant: '#cccccc',
  surfaceDisabled: 'rgba(242, 242, 242, 0.12)',
  onSurfaceDisabled: 'rgba(242, 242, 242, 0.38)',
  backdrop: 'rgba(0, 0, 0, 0.4)',
  outline: '#4d4d4d',
  outlineVariant: '#404040',
  inverseSurface: '#f2f2f2',
  inverseOnSurface: '#1f1f1f',
  elevation: {
    level0: 'transparent',
    level1: 'rgb(22, 26, 31)',
    level2: 'rgb(28, 32, 38)', 
    level3: 'rgb(33, 38, 45)',
    level4: 'rgb(36, 41, 48)',
    level5: 'rgb(40, 46, 54)',
  },
};

export const deadAheadLightTheme: MD3Theme = {
  ...MD3LightTheme,
  colors: designTokens.colors,
  fonts: designTokens.fonts,
};

export const deadAheadDarkTheme: MD3Theme = {
  ...MD3DarkTheme,
  colors: darkColors,
  fonts: designTokens.fonts,
};