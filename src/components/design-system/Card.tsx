import React from 'react';
import { View, Pressable } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

export type CardVariant = 'elevated' | 'outlined' | 'filled';
export type CardPadding = 'none' | 'compact' | 'comfortable' | 'spacious';

interface CardProps {
  children: React.ReactNode;
  variant?: CardVariant;
  padding?: CardPadding;
  onPress?: () => void;
  disabled?: boolean;
  testID?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'elevated',
  padding = 'comfortable',
  onPress,
  disabled = false,
  testID,
}) => {
  const isInteractive = Boolean(onPress && !disabled);

  if (isInteractive) {
    return (
      <Pressable
        style={({ pressed }) => [
          styles.card,
          styles[variant],
          styles[`${padding}Padding`],
          disabled && styles.disabled,
          pressed && styles.pressed,
        ]}
        onPress={onPress}
        disabled={disabled}
        testID={testID}
        accessibilityRole="button"
        accessibilityState={{ disabled }}
      >
        {children}
      </Pressable>
    );
  }

  return (
    <View
      style={[
        styles.card,
        styles[variant],
        styles[`${padding}Padding`],
        disabled && styles.disabled,
      ]}
      testID={testID}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create((theme) => ({
  card: {
    borderRadius: theme.componentTokens.cardBorderRadius,
    backgroundColor: theme.colors.surface1,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
    transition: theme.componentTokens.transitionNormal,
  },
  
  // Variants using design tokens
  elevated: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  outlined: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: theme.colors.border,
    shadowOpacity: 0,
    elevation: 0,
  },
  filled: {
    backgroundColor: theme.colors.surface2,
    borderColor: 'transparent',
    shadowOpacity: 0,
    elevation: 0,
  },
  
  // Padding variants using design tokens
  nonePadding: {
    padding: 0,
  },
  compactPadding: {
    padding: theme.componentTokens.cardPaddingCompact,
  },
  comfortablePadding: {
    padding: theme.componentTokens.cardPadding,
  },
  spaciousPadding: {
    padding: theme.componentTokens.cardPaddingSpacious,
  },
  
  // States
  disabled: {
    opacity: 0.4,
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
}));
