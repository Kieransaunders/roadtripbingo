import React from 'react';
import { Pressable, Text, View, ActivityIndicator, StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';

export type ButtonVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'ghost';
export type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  onPress?: () => void;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  testID?: string;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  onPress,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  testID,
}) => {
  const theme = useTheme();
  
  const handlePress = () => {
    if (!disabled && !loading && onPress) {
      onPress();
    }
  };

  const isInteractive = !disabled && !loading;

  const getButtonStyles = () => {
    const baseStyle = {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
    };
    
    switch (variant) {
      case 'secondary':
        return {
          backgroundColor: 'transparent',
          borderColor: theme.colors.primary,
        };
      case 'success':
        return {
          backgroundColor: theme.colors.tertiary,
          borderColor: theme.colors.tertiary,
        };
      case 'danger':
        return {
          backgroundColor: theme.colors.error,
          borderColor: theme.colors.error,
        };
      case 'ghost':
        return {
          backgroundColor: 'transparent',
          borderColor: 'transparent',
        };
      default:
        return baseStyle;
    }
  };
  
  const getTextStyles = () => {
    switch (variant) {
      case 'secondary':
      case 'ghost':
        return { color: theme.colors.primary };
      case 'success':
        return { color: theme.colors.onTertiary };
      case 'danger':
        return { color: theme.colors.onError };
      default:
        return { color: theme.colors.onPrimary };
    }
  };

  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        getButtonStyles(),
        styles[size],
        fullWidth && styles.fullWidth,
        disabled && styles.disabled,
        pressed && isInteractive && styles.pressed,
      ]}
      onPress={handlePress}
      disabled={disabled || loading}
      testID={testID}
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || loading }}
    >
      <View style={[styles.content, fullWidth && styles.fullWidthContent]}>
        {loading ? (
          <ActivityIndicator
            size="small"
            color={getTextStyles().color}
            testID={`${testID}-loading`}
          />
        ) : (
          <>
            {icon && iconPosition === 'left' && (
              <View style={[styles.icon, styles.iconLeft]}>{icon}</View>
            )}
            <Text style={[styles.text, getTextStyles()]}>{children}</Text>
            {icon && iconPosition === 'right' && (
              <View style={[styles.icon, styles.iconRight]}>{icon}</View>
            )}
          </>
        )}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    minHeight: 44,
    borderRadius: 8,
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  
  // Sizes
  small: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    minHeight: 36,
  },
  medium: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    minHeight: 44,
  },
  large: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    minHeight: 56,
  },
  
  // States
  disabled: {
    opacity: 0.4,
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  
  // Layout
  fullWidth: {
    width: '100%',
  },
  
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullWidthContent: {
    width: '100%',
  },
  
  // Text styles
  text: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  
  // Icon styles
  icon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
});
