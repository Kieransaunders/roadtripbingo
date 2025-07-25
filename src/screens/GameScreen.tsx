import React, { useEffect } from 'react';
import { View, ScrollView, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StyleSheet as UnistylesStyleSheet } from 'react-native-unistyles';
import { Surface, Chip } from 'react-native-paper';
import { BingoGrid } from '../components/BingoGrid';
import { useGameStore } from '../stores/gameStore';
import { router } from 'expo-router';
import * as Sentry from '@sentry/react-native';
import { Button, Heading1, Heading3, Body } from '../components/design-system';
import { IconSymbol } from '../components/ui/IconSymbol';
import { BottomNavigation } from '../components/BottomNavigation';

export const GameScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const { 
    currentGrid, 
    isGameWon, 
    gameMode, 
    goreLevel,
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



  const getSpottedCount = () => {
    return currentGrid.filter(cell => cell.isSpotted).length;
  };

  const getWinRequirement = () => {
    return gameMode === 'standard' ? '3 in a row' : '4 in a row';
  };

  const getGoreLevel = () => {
    return goreLevel.charAt(0).toUpperCase() + goreLevel.slice(1);
  };

  const handleModePress = () => {
    try {
      router.push('/settings');
    } catch (error) {
      console.error('Error navigating to settings screen:', error);
      Sentry.captureException(error);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />
      

      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.content}>
        <Surface style={styles.header} elevation={3}>
          <Heading1 align="center" color="accent" style={styles.title}>DEAD AHEAD</Heading1>
          <Heading3 align="center" style={styles.subtitle}>Roadkill Bingo</Heading3>
          <Body align="center" style={styles.tagline}>
            &quot;See it. Spot it. Shout it. Win shotgun or throw up trying.&quot;
          </Body>
        </Surface>

        <View style={styles.gameInfo}>
            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <Chip 
                  mode="outlined" 
                  onPress={handleModePress}
                  style={styles.clickableChip}
                  textStyle={styles.chipText}
                >
                  {getWinRequirement()}
                </Chip>
              </View>
              <View style={styles.infoItem}>
                <Chip 
                  mode="outlined" 
                  onPress={handleModePress}
                  style={styles.clickableChip}
                  textStyle={styles.chipText}
                >
                  {getGoreLevel()}
                </Chip>
              </View>
              <View style={styles.infoItem}>
                <Chip 
                  mode="flat" 
                  style={styles.spottedChip}
                  textStyle={styles.spottedChipText}
                >
                  {getSpottedCount()}/16
                </Chip>
              </View>
            </View>
        </View>

      <View style={styles.gridContainer}>
        <BingoGrid />
      </View>

      <View style={styles.buttonContainer}>
        <Button 
          variant="primary"
          onPress={startNewGame}
          testID="new-game-button"
          icon={<IconSymbol name="arrow.clockwise" size={20} color="white" />}
          iconPosition="left"
        >
          New Game
        </Button>
      </View>
      </ScrollView>
      
      <BottomNavigation />
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
    paddingTop: 16,
    paddingBottom: 100, // Add extra padding for bottom navigation
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 8,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
    zIndex: 10,
  },
  title: {
    fontSize: theme.fonts.massive,
    fontWeight: 'bold',
    color: '#FF4444',
    textAlign: 'center',
    letterSpacing: 2,
    lineHeight: theme.fonts.massive * 1.1,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: theme.fonts.lg,
    color: '#FFD700',
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: theme.fonts.lg * 1.2,
  },
  tagline: {
    fontSize: theme.fonts.sm,
    color: '#FFFFFF',
    textAlign: 'center',
    fontStyle: 'italic',
    opacity: 0.8,
    lineHeight: theme.fonts.sm * 1.3,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  gameInfo: {
    marginHorizontal: 20,
    marginBottom: 12,
    marginTop: 0,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 8,
  },
  infoItem: {
    alignItems: 'center',
    flex: 1,
  },
  infoLabel: {
    color: '#CCCCCC',
    opacity: 0.7,
    marginTop: 4,
    textAlign: 'center',
  },
  clickableChip: {
    backgroundColor: 'rgba(255, 212, 0, 0.1)',
    borderColor: '#FFD700',
  },
  chipText: {
    color: '#FFD700',
    fontSize: 11,
  },
  spottedChip: {
    backgroundColor: 'rgba(255, 68, 68, 0.2)',
  },
  spottedChipText: {
    color: '#FF4444',
    fontSize: 11,
    fontWeight: 'bold',
  },
  gridContainer: {
    marginBottom: 16,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    gap: 12,
  },
  newGameButton: {
    borderColor: '#FF4444',
    borderWidth: 2,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  buttonText: {
    color: '#FF4444',
    fontWeight: 'bold',
  },
}));