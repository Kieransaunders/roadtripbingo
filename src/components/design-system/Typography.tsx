import React from 'react';
import { Text as RNText, TextStyle } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

export type TypographyVariant = 
  | 'displayLarge'
  | 'displayMedium' 
  | 'displaySmall'
  | 'headlineLarge'
  | 'headlineMedium'
  | 'headlineSmall'
  | 'titleLarge'
  | 'titleMedium'
  | 'titleSmall'
  | 'bodyLarge'
  | 'bodyMedium'
  | 'bodySmall'
  | 'labelLarge'
  | 'labelMedium'
  | 'labelSmall';

export type TextColor = 'primary' | 'secondary' | 'tertiary' | 'accent' | 'success' | 'warning' | 'error';
export type TextAlign = 'left' | 'center' | 'right';

interface TypographyProps {
  children: React.ReactNode;
  variant?: TypographyVariant;
  color?: TextColor;
  align?: TextAlign;
  numberOfLines?: number;
  style?: TextStyle;
  testID?: string;
}

export const Typography: React.FC<TypographyProps> = ({
  children,
  variant = 'bodyMedium',
  color = 'primary',
  align = 'left',
  numberOfLines,
  style,
  testID,
}) => {
  return (
    <RNText
      style={[
        styles.base,
        styles[variant],
        styles[`${color}Color`],
        { textAlign: align },
        style,
      ]}
      numberOfLines={numberOfLines}
      testID={testID}
    >
      {children}
    </RNText>
  );
};

// Convenience components for common use cases
export const Heading1: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="displayLarge" {...props} />
);

export const Heading2: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="headlineLarge" {...props} />
);

export const Heading3: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="headlineMedium" {...props} />
);

export const Heading4: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="titleLarge" {...props} />
);

export const Body: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="bodyMedium" {...props} />
);

export const Caption: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="bodySmall" {...props} />
);

export const Label: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="labelMedium" {...props} />
);

const styles = StyleSheet.create((theme) => ({
  base: {
    fontFamily: theme.fontFamilies.body,
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  
  // Display styles (largest) - Updated to match style guide
  displayLarge: {
    fontFamily: theme.fontFamilies.heading,
    fontSize: theme.fonts.massive,
    fontWeight: theme.fontWeights.bold,
    lineHeight: theme.lineHeights.tight,
    letterSpacing: theme.letterSpacing.tight,
  },
  displayMedium: {
    fontFamily: theme.fontFamilies.heading,
    fontSize: theme.fonts.huge,
    fontWeight: theme.fontWeights.bold,
    lineHeight: theme.lineHeights.tight,
    letterSpacing: theme.letterSpacing.tight,
  },
  displaySmall: {
    fontFamily: theme.fontFamilies.heading,
    fontSize: theme.fonts.xxl,
    fontWeight: theme.fontWeights.semibold,
    lineHeight: theme.lineHeights.snug,
    letterSpacing: theme.letterSpacing.tight,
  },
  
  // Headline styles
  headlineLarge: {
    fontFamily: theme.fontFamilies.body,
    fontSize: theme.fonts.xl,
    fontWeight: theme.fontWeights.semibold,
    lineHeight: theme.lineHeights.snug,
    letterSpacing: theme.letterSpacing.normal,
  },
  headlineMedium: {
    fontFamily: theme.fontFamilies.body,
    fontSize: theme.fonts.lg,
    fontWeight: theme.fontWeights.medium,
    lineHeight: theme.lineHeights.normal,
    letterSpacing: theme.letterSpacing.normal,
  },
  headlineSmall: {
    fontFamily: theme.fontFamilies.body,
    fontSize: theme.fonts.md,
    fontWeight: theme.fontWeights.medium,
    lineHeight: theme.lineHeights.normal,
    letterSpacing: theme.letterSpacing.normal,
  },
  
  // Title styles
  titleLarge: {
    fontFamily: theme.fontFamilies.body,
    fontSize: theme.fonts.lg,
    fontWeight: theme.fontWeights.regular,
    lineHeight: theme.lineHeights.relaxed,
    letterSpacing: theme.letterSpacing.normal,
  },
  titleMedium: {
    fontFamily: theme.fontFamilies.body,
    fontSize: theme.fonts.base,
    fontWeight: theme.fontWeights.regular,
    lineHeight: theme.lineHeights.relaxed,
    letterSpacing: theme.letterSpacing.normal,
  },
  titleSmall: {
    fontFamily: theme.fontFamilies.body,
    fontSize: theme.fonts.sm,
    fontWeight: theme.fontWeights.regular,
    lineHeight: theme.lineHeights.normal,
    letterSpacing: theme.letterSpacing.normal,
  },
  
  // Body styles
  bodyLarge: {
    fontFamily: theme.fontFamilies.body,
    fontSize: theme.fonts.lg,
    fontWeight: theme.fontWeights.regular,
    lineHeight: theme.lineHeights.relaxed,
    letterSpacing: theme.letterSpacing.normal,
  },
  bodyMedium: {
    fontFamily: theme.fontFamilies.body,
    fontSize: theme.fonts.base,
    fontWeight: theme.fontWeights.regular,
    lineHeight: theme.lineHeights.relaxed,
    letterSpacing: theme.letterSpacing.normal,
  },
  bodySmall: {
    fontFamily: theme.fontFamilies.body,
    fontSize: theme.fonts.sm,
    fontWeight: theme.fontWeights.regular,
    lineHeight: theme.lineHeights.normal,
    letterSpacing: theme.letterSpacing.normal,
  },
  
  // Label styles
  labelLarge: {
    fontFamily: theme.fontFamilies.body,
    fontSize: theme.fonts.sm,
    fontWeight: theme.fontWeights.medium,
    lineHeight: theme.lineHeights.normal,
    letterSpacing: theme.letterSpacing.wide,
  },
  labelMedium: {
    fontFamily: theme.fontFamilies.body,
    fontSize: theme.fonts.xs,
    fontWeight: theme.fontWeights.regular,
    lineHeight: theme.lineHeights.normal,
    letterSpacing: theme.letterSpacing.wide,
  },
  labelSmall: {
    fontFamily: theme.fontFamilies.body,
    fontSize: theme.fonts.xs,
    fontWeight: theme.fontWeights.regular,
    lineHeight: theme.lineHeights.normal,
    letterSpacing: theme.letterSpacing.wider,
  },
  
  // Color variants using design tokens
  primaryColor: {
    color: theme.colors.textPrimary,
  },
  secondaryColor: {
    color: theme.colors.textSecondary,
  },
  tertiaryColor: {
    color: theme.colors.textMuted,
  },
  accentColor: {
    color: theme.colors.red, // Game accent color
  },
  successColor: {
    color: theme.colors.successText,
  },
  warningColor: {
    color: theme.colors.warningText,
  },
  errorColor: {
    color: theme.colors.redText,
  },
}));
