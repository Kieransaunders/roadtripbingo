import React, { useEffect } from 'react';
import { View, ScrollView, StatusBar, TouchableOpacity } from 'react-native';
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
    countryCode,
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

  const getCountryFlag = () => {
    const countryFlags = {
      'uk': '🇬🇧',
      'us': '🇺🇸',
      'aus': '🇦🇺'
    };
    return countryFlags[countryCode] || '🇬🇧';
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
          <Heading1 align="center" color="accent" style={styles.title}>ROAD TRIP</Heading1>
          <Heading3 align="center" style={styles.subtitle}>Bingo</Heading3>
          <Body align="center" style={styles.instructions}>
            Tap tiles when you spot them on your road trip. Get 3 in a row to win!
          </Body>
        </Surface>

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

        <View style={styles.gameInfo}>
          <View style={styles.statsContainer}>
            <TouchableOpacity onPress={handleModePress} activeOpacity={0.7}>
              <Surface style={[styles.statCard, styles.clickableStatCard]} elevation={2}>
                <View style={styles.statCardContent}>
                  <IconSymbol name="gamecontroller.fill" size={20} color="#FFD700" />
                  <View style={styles.statTextContainer}>
                    <Body style={styles.statLabel}>Game Mode</Body>
                    <Body style={styles.statValue}>{getWinRequirement()}</Body>
                  </View>
                  <IconSymbol name="gear" size={16} color="#888" />
                </View>
              </Surface>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={handleModePress} activeOpacity={0.7}>
              <Surface style={[styles.statCard, styles.clickableStatCard]} elevation={2}>
                <View style={styles.statCardContent}>
                  <IconSymbol name="globe.americas.fill" size={20} color="#4CAF50" />
                  <View style={styles.statTextContainer}>
                    <Body style={styles.statLabel}>Country</Body>
                    <Body style={[styles.statValue, styles.flagValue]}>{getCountryFlag()}</Body>
                  </View>
                  <IconSymbol name="gear" size={16} color="#888" />
                </View>
              </Surface>
            </TouchableOpacity>
            
            <Surface style={styles.statCard} elevation={2}>
              <View style={styles.statCardContent}>
                <IconSymbol name="eye.fill" size={20} color="#FF4444" />
                <View style={styles.statTextContainer}>
                  <Body style={styles.statLabel}>Spotted</Body>
                  <Body style={styles.statValue}>{getSpottedCount()}/16</Body>
                </View>
                <IconSymbol name="checkmark.circle.fill" size={16} color="#4CAF50" />
              </View>
            </Surface>
          </View>
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
    fontSize: theme.fonts.xl,
    fontWeight: 'bold',
    color: '#FF4444',
    textAlign: 'center',
    letterSpacing: 1,
    lineHeight: theme.fonts.xl * 1.1,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: theme.fonts.lg,
    color: '#FFD700',
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: theme.fonts.lg * 1.2,
  },
  instructions: {
    fontSize: theme.fonts.sm,
    color: '#FFFFFF',
    textAlign: 'center',
    opacity: 0.9,
    lineHeight: theme.fonts.sm * 1.3,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  gameInfo: {
    marginHorizontal: 16,
    marginBottom: 20,
    marginTop: 16,
  },
  statsContainer: {
    gap: 12,
  },
  statCard: {
    backgroundColor: 'rgba(42, 42, 74, 0.8)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
  },
  clickableStatCard: {
    backgroundColor: 'rgba(255, 212, 0, 0.08)',
    borderColor: 'rgba(255, 212, 0, 0.3)',
  },
  statCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 16,
    gap: 14,
    minHeight: 64,
  },
  statTextContainer: {
    flex: 1,
    paddingVertical: 2,
  },
  statLabel: {
    color: '#B0B0B0',
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 4,
    letterSpacing: 0.3,
    lineHeight: 14,
  },
  statValue: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.2,
    lineHeight: 20,
  },
  flagValue: {
    fontSize: 24,
    lineHeight: 28,
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