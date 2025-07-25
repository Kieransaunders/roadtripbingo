// Fallback for using MaterialIcons on Android and web.

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SymbolWeight, SymbolViewProps } from 'expo-symbols';
import { ComponentProps } from 'react';
import { OpaqueColorValue, type StyleProp, type TextStyle } from 'react-native';

type IconMapping = Record<SymbolViewProps['name'], ComponentProps<typeof MaterialIcons>['name']>;
type IconSymbolName = keyof typeof MAPPING;

/**
 * Add your SF Symbols to Material Icons mappings here.
 * - see Material Icons in the [Icons Directory](https://icons.expo.fyi).
 * - see SF Symbols in the [SF Symbols](https://developer.apple.com/sf-symbols/) app.
 */
const MAPPING = {
  // Navigation & UI
  'house.fill': 'home',
  'paperplane.fill': 'send',
  'chevron.left.forwardslash.chevron.right': 'code',
  'chevron.right': 'chevron-right',
  
  // Menu Icons
  'car': 'directions-car',
  'camera.fill': 'camera-alt',
  'trophy.fill': 'emoji-events',
  'gearshape.fill': 'settings',
  
  // Link & External Icons
  'iphone': 'smartphone',
  'globe': 'language',
  'androidrobot': 'android',
  
  // Game & Info Icons
  'gamecontroller.fill': 'sports-esports',
  'info.circle.fill': 'info',
  'exclamationmark.triangle.fill': 'warning',
  'target': 'gps-fixed',
  'heart.fill': 'favorite',
  
  // Actions & Navigation
  'arrow.left': 'arrow-back',
  'arrow.clockwise': 'refresh',
  'checkmark.circle.fill': 'check-circle',
  'plus.circle.fill': 'add-circle',
  
  // Time & Progress Icons
  'clock.fill': 'schedule',
  'bolt.fill': 'flash-on',
} as unknown as IconMapping;

/**
 * An icon component that uses native SF Symbols on iOS, and Material Icons on Android and web.
 * This ensures a consistent look across platforms, and optimal resource usage.
 * Icon `name`s are based on SF Symbols and require manual mapping to Material Icons.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  return <MaterialIcons color={color} size={size} name={MAPPING[name]} style={style} />;
}
