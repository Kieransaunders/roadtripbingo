import '../src/unistyles';
import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PaperProvider, MD3DarkTheme, adaptNavigationTheme } from 'react-native-paper';

import { useColorScheme } from '@/src/hooks/useColorScheme';
import { useGameStore } from '@/src/stores/gameStore';
import { ConsentDialogProvider } from '@/src/hooks/useConsentDialog';
import { LoadingScreen } from '@/src/components/LoadingScreen';
import { useRouter, useSegments } from 'expo-router';

// Custom Paper theme following our design guide
const paperTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    // Primary Brand Colors (Game Red)
    primary: '#dc3545',              // Game red
    primaryContainer: '#f8d7da',     // Light red background
    onPrimary: '#ffffff',            // White text on red
    onPrimaryContainer: '#9a1a24',   // Dark red text
    
    // Secondary (Gold accent)
    secondary: '#FFD700',            // Gold
    secondaryContainer: '#fff8e1',   // Light gold background
    onSecondary: '#000000',          // Black text on gold
    onSecondaryContainer: '#664d00', // Dark gold text
    
    // Background colors
    background: '#1A1A1A',           // Dark background
    onBackground: '#f2f2f2',         // Light text
    surface: '#1f1f1f',              // Dark surface
    onSurface: '#f2f2f2',            // Light text on surface
    surfaceVariant: '#292929',       // Darker surface variant
    onSurfaceVariant: '#cccccc',     // Medium text
    outline: '#666666',
    surfaceDisabled: '#333333',
    onSurfaceDisabled: '#888888',
  },
};

// Adapt the Paper theme for React Navigation
const { LightTheme, DarkTheme: NavDarkTheme } = adaptNavigationTheme({
  reactNavigationLight: DarkTheme,
  reactNavigationDark: DarkTheme,
});

const GameTheme = {
  ...NavDarkTheme,
  colors: {
    ...NavDarkTheme.colors,
    primary: '#FF4444',
    background: '#1a1a2e',
    card: '#2a2a4a',
    text: '#ffffff',
    border: '#333',
  },
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const loadSettings = useGameStore(state => state.loadSettings);
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });
  const [isNavigationReady, setIsNavigationReady] = useState(false);

  // Load settings when app starts
  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  // Handle navigation ready state to prevent flash
  useEffect(() => {
    if (Platform.OS === 'web') {
      // Check if we're on initial load or refresh
      const isRefresh = performance.navigation?.type === 1; // TYPE_RELOAD
      const delay = isRefresh ? 50 : 0; // Shorter delay for better UX
      
      const timer = setTimeout(() => {
        setIsNavigationReady(true);
      }, delay);
      return () => clearTimeout(timer);
    } else {
      setIsNavigationReady(true);
    }
  }, []);

  if (!loaded || (Platform.OS === 'web' && !isNavigationReady)) {
    return (
      <SafeAreaProvider>
        <PaperProvider theme={paperTheme}>
          <LoadingScreen />
          <StatusBar style="light" />
        </PaperProvider>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <PaperProvider theme={paperTheme}>
        <ThemeProvider value={GameTheme}>
          <ConsentDialogProvider>
            <Stack screenOptions={{ headerShown: false, animation: 'none' }}>
              <Stack.Screen name="index" />
              <Stack.Screen name="game" />
              <Stack.Screen name="victory" />
              <Stack.Screen name="hall-of-shame" />
              <Stack.Screen name="settings" />
              <Stack.Screen name="camera" />
              <Stack.Screen name="+not-found" options={{ headerShown: true }} />
            </Stack>
            <StatusBar style="light" />
          </ConsentDialogProvider>
        </ThemeProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
}
