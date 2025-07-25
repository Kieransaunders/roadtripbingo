// src/unistyles.ts - Dead Ahead Bingo Design System v2.0
import { Dimensions } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

const { width: screenWidth } = Dimensions.get('window');

// Font scaling utility based on screen width
const scaleFont = (size: number, baseWidth: number = 375) => {
  const scale = screenWidth / baseWidth;
  const newSize = size * scale;
  // Ensure minimum and maximum font sizes for accessibility
  return Math.max(12, Math.min(newSize, size * 1.2));
};

// Design System: Typography Scale (Updated to match style guide)
const fontSizes = {
  xs: scaleFont(12),    // clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem)
  sm: scaleFont(14),    // clamp(0.875rem, 0.8rem + 0.375vw, 1rem)
  base: scaleFont(16),  // clamp(1rem, 0.9rem + 0.5vw, 1.125rem)
  md: scaleFont(18),    // clamp(1.125rem, 1rem + 0.625vw, 1.25rem)
  lg: scaleFont(20),    // clamp(1.25rem, 1.1rem + 0.75vw, 1.5rem)
  xl: scaleFont(24),    // clamp(1.5rem, 1.3rem + 1vw, 2rem)
  xxl: scaleFont(32),   // clamp(2rem, 1.7rem + 1.5vw, 2.5rem)
  huge: scaleFont(40),  // clamp(2.5rem, 2rem + 2.5vw, 3.5rem)
  massive: scaleFont(56), // clamp(3.5rem, 2.5rem + 5vw, 5rem)
} as const;

// Design System: Font Weights (Updated to match style guide)
const fontWeights = {
  thin: '100',
  light: '300',
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  extrabold: '800',
  black: '900',
} as const;

// Design System: Font Families (Updated to match style guide)
const fontFamilies = {
  heading: 'Space Mono',
  body: 'Inter',
  ui: 'System',
  code: 'Space Mono',
} as const;

// Design System: Line Heights (New from style guide)
const lineHeights = {
  tight: 1.1,      // Headlines, large text
  snug: 1.2,       // Subheadings
  normal: 1.4,     // UI elements, buttons
  relaxed: 1.5,    // Body text, optimal reading
  loose: 1.75,     // Long-form content
} as const;

// Design System: Letter Spacing (New from style guide)
const letterSpacing = {
  tighter: -0.05,
  tight: -0.025,
  normal: 0,
  wide: 0.025,
  wider: 0.05,
  widest: 0.1,
} as const;

// Design System: 8-Point Spacing Scale (Updated to match style guide)
const spacing = {
  1: 4,    // 0.5 × 8px - micro spacing
  2: 8,    // 1 × 8px - base unit
  3: 12,   // 1.5 × 8px - small spacing
  4: 16,   // 2 × 8px - medium spacing
  5: 24,   // 3 × 8px - large spacing
  6: 32,   // 4 × 8px - extra large spacing
  7: 48,   // 6 × 8px - section spacing
  8: 64,   // 8 × 8px - layout spacing
  9: 96,   // 12 × 8px - major sections
  10: 128, // 16 × 8px - page sections
  
  // Fine-tuning increments
  xs: 2,   // micro adjustments
  xxs: 1,  // hairline borders/adjustments
  
  // Touch Targets - WCAG AAA Compliance
  touchMin: 44,        // Minimum touch target size
  touchComfortable: 48, // Comfortable touch target
} as const;

// Design System: Enhanced Color Palette (From style guide)
const colors = {
  // Primary Brand Colors
  primary: '#0066ff',           // hsl(220, 100%, 50%) - Primary actions
  primaryHover: '#0052cc',      // hsl(220, 100%, 45%) - Hover states  
  primaryActive: '#0047b3',     // hsl(220, 100%, 40%) - Active states
  primaryLight: '#e6f2ff',      // hsl(220, 100%, 95%) - Background tint
  primaryText: '#003d99',       // hsl(220, 100%, 35%) - Accessible text
  
  // Game Accent Colors
  red: '#dc3545',               // hsl(0, 75%, 50%) - Game elements
  redHover: '#c82333',          // hsl(0, 75%, 45%) - Hover state
  redActive: '#b21e2c',         // hsl(0, 75%, 40%) - Active state
  redLight: '#f8d7da',          // hsl(0, 75%, 95%) - Background
  redText: '#9a1a24',           // hsl(0, 75%, 35%) - Accessible text
  secondaryGold: '#FFD700',     // Highlight accent
  
  // Success Colors
  success: '#28a745',           // hsl(120, 60%, 40%) - Success actions
  successHover: '#1e7e34',      // hsl(120, 60%, 35%) - Hover state
  successActive: '#155724',     // hsl(120, 60%, 30%) - Active state
  successLight: '#d4edda',      // hsl(120, 60%, 95%) - Background
  successText: '#0f4419',       // hsl(120, 60%, 25%) - Accessible text
  
  // Warning Colors
  warning: '#ffc107',           // hsl(45, 100%, 50%) - Warning color
  warningHover: '#e6ac00',      // hsl(45, 100%, 45%) - Hover state
  warningActive: '#cc9900',     // hsl(45, 100%, 40%) - Active state
  warningLight: '#fff8e1',      // hsl(45, 100%, 95%) - Background
  warningText: '#664d00',       // hsl(45, 100%, 25%) - Accessible text
  
  // Information Colors
  info: '#17a2b8',              // hsl(195, 100%, 45%) - Info color
  infoHover: '#138496',         // hsl(195, 100%, 40%) - Hover state
  infoActive: '#0f6674',        // hsl(195, 100%, 35%) - Active state
  infoLight: '#d1ecf1',         // hsl(195, 100%, 95%) - Background
  infoText: '#0c4851',          // hsl(195, 100%, 30%) - Accessible text
  
  // Background Colors - Light Theme
  bg: '#ffffff',                // hsl(0, 0%, 100%) - Main background
  surface1: '#fafafa',          // hsl(0, 0%, 98%) - Elevated surfaces
  surface2: '#f5f5f5',          // hsl(0, 0%, 96%) - Card backgrounds
  surface3: '#f0f0f0',          // hsl(0, 0%, 94%) - Input backgrounds
  
  // Text Colors - High Contrast
  textPrimary: '#212121',       // hsl(0, 0%, 13%) - 15.8:1 contrast
  textSecondary: '#404040',     // hsl(0, 0%, 25%) - 12.6:1 contrast
  textMuted: '#666666',         // hsl(0, 0%, 40%) - 7.0:1 contrast
  textPlaceholder: '#999999',   // hsl(0, 0%, 60%) - Placeholder text
  textDisabled: '#b3b3b3',      // hsl(0, 0%, 70%) - Disabled text
  textInverse: '#ffffff',       // hsl(0, 0%, 100%) - Dark backgrounds
  
  // Border Colors
  borderLight: '#e6e6e6',       // hsl(0, 0%, 90%) - Subtle borders
  border: '#d9d9d9',            // hsl(0, 0%, 85%) - Default borders
  borderStrong: '#bfbfbf',      // hsl(0, 0%, 75%) - Emphasized borders
  
  // Interactive States
  focus: '#0066ff',             // Focus outline color
  focusShadow: 'rgba(0, 102, 255, 0.25)', // Focus shadow with opacity
  selectionBg: '#e6f2ff',       // Selection background
  selectionText: '#003d99',     // Selection text
  hoverOverlay: 'rgba(0, 0, 0, 0.05)', // Generic hover overlay
  hoverBg: '#f5f5f5',           // Hover background
  
  // Dark Mode Variants
  bgDark: '#141414',            // hsl(0, 0%, 8%) - Dark background
  surface1Dark: '#1f1f1f',      // hsl(0, 0%, 12%) - Dark elevated
  surface2Dark: '#292929',      // hsl(0, 0%, 16%) - Dark cards
  surface3Dark: '#333333',      // hsl(0, 0%, 20%) - Dark inputs
  
  textPrimaryDark: '#f2f2f2',   // hsl(0, 0%, 95%) - Dark primary text
  textSecondaryDark: '#cccccc', // hsl(0, 0%, 80%) - Dark secondary text
  textMutedDark: '#a6a6a6',     // hsl(0, 0%, 65%) - Dark muted text
  
  borderLightDark: '#404040',   // hsl(0, 0%, 25%) - Dark subtle borders
  borderDark: '#4d4d4d',        // hsl(0, 0%, 30%) - Dark default borders
  borderStrongDark: '#666666',  // hsl(0, 0%, 40%) - Dark emphasized borders
} as const;

// Component-specific design tokens
const componentTokens = {
  // Button tokens
  btnPaddingY: spacing[3],                    // 12px vertical padding
  btnPaddingX: spacing[5],                    // 24px horizontal padding
  btnPaddingYSm: spacing[2],                  // 8px for small buttons
  btnPaddingXSm: spacing[4],                  // 16px for small buttons
  btnBorderRadius: spacing[2],                // 8px rounded corners
  btnBorderWidth: 2,                          // Border thickness
  btnFocusRingWidth: 2,                       // Focus outline width
  btnIconSpacing: spacing[2],                 // Space between icon and text
  
  // Card tokens
  cardBorderRadius: 12,
  cardPadding: spacing[4],                    // Standard card padding
  cardPaddingCompact: spacing[3],             // Compact card padding
  cardPaddingSpacious: spacing[6],            // Generous card padding
  
  // Input tokens
  inputBorderRadius: spacing[2],
  inputPaddingY: spacing[3],
  inputPaddingX: spacing[4],
  inputBorderWidth: 2,
  
  // Shadows & elevation
  shadowSm: '0 1px 2px rgba(0, 0, 0, 0.05)',
  shadowMd: '0 4px 6px rgba(0, 0, 0, 0.1)',
  shadowLg: '0 10px 15px rgba(0, 0, 0, 0.1)',
  shadowXl: '0 20px 25px rgba(0, 0, 0, 0.1)',
  shadowFocus: `0 0 0 2px ${colors.focusShadow}`,
  
  // Transitions
  transitionFast: '0.15s ease-out',
  transitionNormal: '0.2s ease-out',
  transitionSlow: '0.3s ease-out',
} as const;

const lightTheme = {
  colors: {
    ...colors,
    // Light theme overrides
    background: colors.bg,
    text: colors.textPrimary,
    primary: colors.red,                      // Game red as primary
    secondary: colors.secondaryGold,          // Gold accent
    cardBackground: colors.surface2,
    cardText: colors.textPrimary,
    accent: colors.red,
  },
  fonts: fontSizes,
  fontWeights,
  fontFamilies,
  lineHeights,
  letterSpacing,
  spacing,
  componentTokens,
} as const;

const darkTheme = {
  colors: {
    ...colors,
    // Dark mode overrides
    background: colors.bgDark,
    text: colors.textPrimaryDark,
    primary: colors.red,
    secondary: colors.secondaryGold,
    cardBackground: colors.surface2Dark,
    cardText: colors.textPrimaryDark,
    accent: colors.red,
    
    // Override with dark variants
    textPrimary: colors.textPrimaryDark,
    textSecondary: colors.textSecondaryDark,
    textMuted: colors.textMutedDark,
    
    borderLight: colors.borderLightDark,
    border: colors.borderDark,
    borderStrong: colors.borderStrongDark,
    
    surface1: colors.surface1Dark,
    surface2: colors.surface2Dark,
    surface3: colors.surface3Dark,
    
    hoverOverlay: 'rgba(255, 255, 255, 0.05)',
    hoverBg: colors.surface1Dark,
  },
  fonts: fontSizes,
  fontWeights,
  fontFamilies,
  lineHeights,
  letterSpacing,
  spacing,
  componentTokens,
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
  export interface UnistylesTheme {
    colors: typeof lightTheme.colors;
    fonts: typeof lightTheme.fonts;
    fontWeights: typeof lightTheme.fontWeights;
    fontFamilies: typeof lightTheme.fontFamilies;
    lineHeights: typeof lightTheme.lineHeights;
    letterSpacing: typeof lightTheme.letterSpacing;
    spacing: typeof lightTheme.spacing;
    componentTokens: typeof lightTheme.componentTokens;
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