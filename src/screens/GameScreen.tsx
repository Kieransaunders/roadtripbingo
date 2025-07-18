import React, { useEffect } from 'react';
import { View, ScrollView, StatusBar, Text, Platform, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StyleSheet as UnistylesStyleSheet } from 'react-native-unistyles';
import { BingoGrid } from '../components/BingoGrid';
import { useGameStore } from '../stores/gameStore';
import { router } from 'expo-router';
import * as Sentry from '@sentry/react-native';
// import { BottomNavigation } from '../components/BottomNavigation';

export const GameScreen: React.FC = () => {
  let insets;
  try {
    insets = useSafeAreaInsets();
  } catch (error) {
    // Fallback if SafeAreaProvider is not available
    insets = { top: Platform.OS === 'ios' ? 44 : 24, bottom: Platform.OS === 'ios' ? 34 : 0 };
  }
  const { 
    currentGrid, 
    isGameWon, 
    gameMode, 
    longRoadTripEnabled,
    startNewGame
  } = useGameStore();

  useEffect(() => {
    if (currentGrid.length === 0) {
      startNewGame();
    }
  }, [currentGrid.length, startNewGame]);

  useEffect(() => {
    if (isGameWon) {
      // Navigate to victory screen instead of showing alert
      setTimeout(() => {
        try {
          router.push('/victory');
        } catch (error) {
          console.error('Error navigating to victory screen:', error);
          Sentry.captureException(error);
          // Fallback - try to navigate to home
          try {
            router.replace('/');
          } catch (fallbackError) {
            console.error('Fallback navigation also failed:', fallbackError);
            Sentry.captureException(fallbackError);
          }
        }
      }, 500); // Small delay to let the final tile animation complete
    }
  }, [isGameWon]);


  // Removed unused handleCallBingo function - win detection is automatic

  const handleSnapRoadkill = () => {
    try {
      router.push('/camera');
    } catch (error) {
      console.error('Error navigating to camera screen:', error);
      Sentry.captureException(error);
    }
  };


  const getSpottedCount = () => {
    return currentGrid.filter(cell => cell.isSpotted).length;
  };

  const getWinRequirement = () => {
    return gameMode === 'standard' ? '3 in a row' : '4 in a row';
  };

  const getModeName = () => {
    return longRoadTripEnabled ? 'Long Trip' : 'Short Trip';
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />
      

      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>DEAD AHEAD</Text>
          <Text style={styles.subtitle}>Roadkill Bingo</Text>
          <Text style={styles.tagline}>
            &quot;See it. Spot it. Shout it. Win shotgun or throw up trying.&quot;
          </Text>
        </View>

        <View style={styles.gameInfo}>
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Mode</Text>
              <Text style={styles.infoValue}>{getModeName()}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Win Condition</Text>
              <Text style={styles.infoValue}>{getWinRequirement()}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Spotted</Text>
              <Text style={styles.infoValue}>{getSpottedCount()}/16</Text>
            </View>
          </View>
        </View>

      <View style={styles.gridContainer}>
        <BingoGrid />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.button, styles.snapButton]}
          onPress={handleSnapRoadkill}
        >
          <Text style={styles.buttonText}>📸 Snap the Splat!</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.newGameButton]}
          onPress={startNewGame}
        >
          <Text style={styles.buttonText}>New Game</Text>
        </TouchableOpacity>

      </View>
      </ScrollView>
      
      {/* <BottomNavigation /> */}
    </View>
  );
};

const styles = UnistylesStyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  scrollContainer: {
    flex: 1,
  },
  content: {
    paddingVertical: 20,
    paddingBottom: 100, // Add extra padding for bottom navigation
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
    paddingTop: 4,
  },
  title: {
    fontSize: theme.fonts.massive,
    fontWeight: 'bold',
    color: '#FF4444',
    textAlign: 'center',
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: theme.fonts.lg,
    color: '#FFD700',
    textAlign: 'center',
    marginBottom: 8,
  },
  tagline: {
    fontSize: theme.fonts.sm,
    color: '#FFFFFF',
    textAlign: 'center',
    fontStyle: 'italic',
    opacity: 0.8,
  },
  gameInfo: {
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: '#2A2A2A',
    borderRadius: 12,
    padding: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoItem: {
    alignItems: 'center',
    flex: 1,
  },
  infoLabel: {
    fontSize: theme.fonts.xs,
    color: '#CCCCCC',
    opacity: 0.7,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: theme.fonts.sm,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  gridContainer: {
    marginBottom: 20,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    gap: 12,
  },
  button: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  bingoButton: {
    backgroundColor: '#FF4444',
  },
  snapButton: {
    backgroundColor: '#FF4444',
  },
  newGameButton: {
    backgroundColor: '#2A2A2A',
    borderWidth: 2,
    borderColor: '#FF4444',
  },
  buttonText: {
    fontSize: theme.fonts.md,
    fontWeight: 'bold',
    color: 'white',
  },
}));