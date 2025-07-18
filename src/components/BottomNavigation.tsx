import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router, usePathname } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useGameStore } from '../stores/gameStore';

interface NavigationButton {
  id: string;
  icon: string;
  label: string;
  route: string;
  isNewGame?: boolean;
}

const navigationButtons: NavigationButton[] = [
  { id: 'dashboard', icon: '🏠', label: 'Dashboard', route: '/' },
  { id: 'new-game', icon: '🎮', label: 'New Game', route: '/game', isNewGame: true },
  { id: 'camera', icon: '📷', label: 'Camera', route: '/camera' },
  { id: 'settings', icon: '⚙️', label: 'Settings', route: '/settings' },
  { id: 'hall-of-shame', icon: '🏆', label: 'Hall of Shame', route: '/hall-of-shame' },
];

export const BottomNavigation: React.FC = () => {
  const insets = useSafeAreaInsets();
  const pathname = usePathname();
  const { startNewGame } = useGameStore();

  const handlePress = (button: NavigationButton) => {
    // Haptic feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    if (button.isNewGame) {
      // Start new game before navigating
      startNewGame();
    }

    // Navigate to the route
    router.push(button.route);
  };

  const isActive = (button: NavigationButton): boolean => {
    if (button.route === '/' && pathname === '/') return true;
    if (button.route !== '/' && pathname.startsWith(button.route)) return true;
    return false;
  };

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <View style={styles.buttonsContainer}>
        {navigationButtons.map((button) => {
          const active = isActive(button);
          
          return (
            <TouchableOpacity
              key={button.id}
              style={[styles.button, active && styles.activeButton]}
              onPress={() => handlePress(button)}
              activeOpacity={0.7}
            >
              <Text style={[styles.icon, active && styles.activeIcon]}>
                {button.icon}
              </Text>
              <Text style={[styles.label, active && styles.activeLabel]}>
                {button.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#1a1a2e',
    borderTopWidth: 1,
    borderTopColor: '#333',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  button: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 2,
    borderRadius: 8,
    minHeight: 60,
    justifyContent: 'center',
  },
  activeButton: {
    backgroundColor: 'rgba(255, 68, 68, 0.1)',
  },
  icon: {
    fontSize: 20,
    marginBottom: 2,
    color: '#888',
  },
  activeIcon: {
    color: '#FF4444',
  },
  label: {
    fontSize: 10,
    color: '#888',
    textAlign: 'center',
    fontWeight: '500',
    lineHeight: 12,
  },
  activeLabel: {
    color: '#FF4444',
    fontWeight: '600',
  },
});