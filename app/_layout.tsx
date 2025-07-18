import '../src/unistyles';
import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { useColorScheme } from '@/src/hooks/useColorScheme';
import { ThemeProvider as NeoUIThemeProvider } from '@joe111/neo-ui';
import { useGameStore } from '@/src/stores/gameStore';
import { ConsentDialogProvider } from '@/src/hooks/useConsentDialog';

// Custom dark theme for the game
const GameTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
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

  // Load settings when app starts
  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <SafeAreaProvider>
      <NeoUIThemeProvider>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : GameTheme}>
          <ConsentDialogProvider>
            <Stack>
              <Stack.Screen name="index" options={{ headerShown: false }} />
              <Stack.Screen name="game" options={{ headerShown: false }} />
              <Stack.Screen name="victory" options={{ headerShown: false }} />
              <Stack.Screen name="hall-of-shame" options={{ headerShown: false }} />
              <Stack.Screen name="settings" options={{ headerShown: false }} />
              <Stack.Screen name="camera" options={{ headerShown: false }} />
              <Stack.Screen name="+not-found" />
            </Stack>
            <StatusBar style="light" />
          </ConsentDialogProvider>
        </ThemeProvider>
      </NeoUIThemeProvider>
    </SafeAreaProvider>
  );
}
