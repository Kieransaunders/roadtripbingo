import React, { useEffect, useState } from 'react';
import { Dimensions, Alert, View, Text, Image, TouchableOpacity, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native-unistyles';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import * as Sentry from '@sentry/react-native';
import { router } from 'expo-router';
import { useGameStore, Achievement } from '../stores/gameStore';
import { BottomNavigation } from '../components/BottomNavigation';
import { IconSymbol } from '../components/ui/IconSymbol';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface VictoryScreenProps {
  onPlayAgain: () => void;
  onContinueGame?: () => void;
  onBackToDashboard?: () => void;
  screenshotUri?: string;
}

// Blood splatter particle component
const BloodSplatterParticle: React.FC<{ delay: number; imageVariation: number }> = ({ delay, imageVariation }) => {
  const translateY = useSharedValue(-50);
  const translateX = useSharedValue(0);
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0);
  const rotation = useSharedValue(0);

  useEffect(() => {
    // Random horizontal position
    const randomX = (Math.random() - 0.5) * SCREEN_WIDTH;
    const fallDistance = SCREEN_HEIGHT + 50; // Reduced fall distance
    const randomRotation = Math.random() * 180; // Reduced rotation range
    
    setTimeout(() => {
      translateX.value = randomX;
      rotation.value = randomRotation;
      opacity.value = withTiming(0.7 + Math.random() * 0.3, { duration: 150 }); // Faster opacity animation
      scale.value = withTiming(0.8 + Math.random() * 0.4, { duration: 200 }); // Use withTiming instead of withSpring for better performance
      translateY.value = withTiming(fallDistance, { 
        duration: 2000 + Math.random() * 1000 // Shorter, more consistent duration
      });
      
      // Fade out earlier for cleanup
      setTimeout(() => {
        opacity.value = withTiming(0, { duration: 300 });
        scale.value = withTiming(0, { duration: 300 }); // Scale down while fading
      }, 1800);
    }, delay);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
      { rotate: `${rotation.value}deg` },
    ],
    opacity: opacity.value,
  }));

  // Create different blood splatter shapes
  const splatterShapes = [
    // Main splatter with droplets
    <View key="main" style={styles.splatterContainer}>
      <View style={[styles.mainSplatter, { backgroundColor: '#8B0000' }]} />
      <View style={[styles.droplet1, { backgroundColor: '#CC0000' }]} />
      <View style={[styles.droplet2, { backgroundColor: '#990000' }]} />
      <View style={[styles.droplet3, { backgroundColor: '#B30000' }]} />
      <View style={[styles.smallDrop1, { backgroundColor: '#AA0000' }]} />
      <View style={[styles.smallDrop2, { backgroundColor: '#770000' }]} />
    </View>,
    
    // Irregular splatter
    <View key="irregular" style={styles.splatterContainer}>
      <View style={[styles.irregularSplatter, { backgroundColor: '#8B0000' }]} />
      <View style={[styles.streak1, { backgroundColor: '#990000' }]} />
      <View style={[styles.streak2, { backgroundColor: '#AA0000' }]} />
    </View>,
    
    // Scattered drops
    <View key="scattered" style={styles.splatterContainer}>
      <View style={[styles.centerDrop, { backgroundColor: '#8B0000' }]} />
      <View style={[styles.scatteredDrop1, { backgroundColor: '#990000' }]} />
      <View style={[styles.scatteredDrop2, { backgroundColor: '#CC0000' }]} />
      <View style={[styles.scatteredDrop3, { backgroundColor: '#770000' }]} />
    </View>
  ];

  return (
    <Animated.View style={[styles.bloodParticle, animatedStyle]}>
      {splatterShapes[imageVariation % splatterShapes.length]}
    </Animated.View>
  );
};

// Main Victory Screen component
export const VictoryScreen: React.FC<VictoryScreenProps> = ({ 
  onPlayAgain,
  onContinueGame,
  onBackToDashboard,
  screenshotUri
}) => {
  const { currentGrid, gameMode, gameStartTime, checkAchievements, resetGameWonState, currentGameWins } = useGameStore();
  const [showStats, setShowStats] = useState(false);
  const [newAchievements, setNewAchievements] = useState<Achievement[]>([]);
  const [showScreenshot, setShowScreenshot] = useState(false);
  const [animationsComplete, setAnimationsComplete] = useState(false);
  const insets = useSafeAreaInsets();

  // Animation values
  const titleOpacity = useSharedValue(0);
  const statsOpacity = useSharedValue(0);
  const buttonsTranslateY = useSharedValue(50);
  const screenshotOpacity = useSharedValue(0);

  // Calculate game duration
  const calculateGameTime = (): string => {
    if (!gameStartTime) return "0:00";
    
    const duration = Date.now() - gameStartTime.getTime();
    const minutes = Math.floor(duration / 60000);
    const seconds = Math.floor((duration % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    // Haptic feedback on mount
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    // Play victory sound (TODO: Implement with expo-av)
    // playVictorySound();

    // Check for new achievements (this was already done in completeGame, but get the results)
    const newlyUnlocked = checkAchievements();
    setNewAchievements(newlyUnlocked);

    // Coordinate all animations to start together
    // Start title immediately
    setTimeout(() => {
      titleOpacity.value = withTiming(1, { duration: 300 });
    }, 0);

    // Show stats shortly after
    setTimeout(() => {
      setShowStats(true);
      statsOpacity.value = withTiming(1, { duration: 300 });
    }, 100);

    // Show buttons quickly after stats
    setTimeout(() => {
      buttonsTranslateY.value = withTiming(0, { duration: 300 });
    }, 200);

    // Mark animations as complete earlier
    setTimeout(() => {
      setAnimationsComplete(true);
      // Only show screenshot after all animations complete to prevent flicker
      if (screenshotUri) {
        setShowScreenshot(true);
        screenshotOpacity.value = withTiming(1, { duration: 500 });
      }
    }, 1000);

    // Reduced haptic feedback to prevent interference
    setTimeout(() => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }, 400);
  }, []);

  const titleAnimatedStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
  }));

  const statsAnimatedStyle = useAnimatedStyle(() => ({
    opacity: statsOpacity.value,
  }));

  const buttonsAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: buttonsTranslateY.value }],
  }));

  const screenshotAnimatedStyle = useAnimatedStyle(() => ({
    opacity: screenshotOpacity.value,
  }));

  // Calculate victory stats
  const spottedCount = currentGrid.filter(cell => cell.isSpotted).length;
  const completionPercentage = Math.round((spottedCount / 16) * 100);
  const gameTime = calculateGameTime();
  const winningPattern = gameMode === 'standard' ? "3 in a row" : "4 in a row";


  const handlePlayAgain = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onPlayAgain();
  };

  const handleContinueGame = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // Reset the game won state so we don't get stuck in a loop
    resetGameWonState();
    try {
      router.push('/game');
    } catch (error) {
      console.error('Error navigating to game screen:', error);
      Sentry.captureException(error);
    }
  };

  const handleHallOfShame = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    try {
      router.push('/hall-of-shame');
    } catch (error) {
      console.error('Error navigating to hall of shame screen:', error);
      Sentry.captureException(error);
    }
  };


  return (
    <View style={[styles.container, { 
      paddingTop: insets.top + 20,
      paddingBottom: insets.bottom + 250, // Add extra padding for bottom navigation
      paddingLeft: (insets.left || 0) + 20,
      paddingRight: (insets.right || 0) + 20,
    }]}>
      {/* Blood splatter particles - reduced count for better performance */}
      {Array.from({ length: 15 }, (_, i) => (
        <BloodSplatterParticle
          key={i}
          delay={i * 80 + Math.random() * 200}
          imageVariation={i % 3}
        />
      ))}

      {/* Main content */}
      <View style={styles.content}>
        {/* Victory Title */}
        <View style={styles.titleContainer}>
          <Text style={styles.mainTitle}>ROADKILL</Text>
          <Text style={styles.bingoTitle}>BINGO!</Text>
          {currentGameWins === 1 ? (
            <Text style={styles.subtitle}>🎉 YOU WON! 🎉</Text>
          ) : (
            <Text style={styles.subtitle}>🔥 WIN #{currentGameWins}! 🔥</Text>
          )}
        </View>

        {/* Victory Stats */}
        {showStats && (
          <Animated.View style={[styles.statsContainer, statsAnimatedStyle]}>
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{spottedCount}/16</Text>
                <Text style={styles.statLabel}>Tiles Spotted</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{gameTime}</Text>
                <Text style={styles.statLabel}>Time</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{completionPercentage}%</Text>
                <Text style={styles.statLabel}>Complete</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{currentGameWins}x {winningPattern}</Text>
                <Text style={styles.statLabel}>Victories</Text>
              </View>
            </View>

            {currentGameWins > 1 && (
              <View style={styles.continueWinMessage}>
                <Text style={styles.continueWinText}>
                  🎯 Multiple Lines! You got {currentGameWins} winning combinations!
                </Text>
              </View>
            )}

            {newAchievements.length > 0 && (
              <View style={styles.achievementContainer}>
                {newAchievements.map((achievement, index) => (
                  <View key={achievement.id} style={styles.achievementItem}>
                    <Text style={styles.achievementText}>
                      {achievement.icon} {achievement.title} unlocked!
                    </Text>
                    <Text style={styles.achievementDescription}>
                      {achievement.description}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </Animated.View>
        )}

        {/* Action Buttons */}
        <Animated.View style={[styles.buttonsContainer, buttonsAnimatedStyle]}>
          <TouchableOpacity
            style={[styles.button, styles.continueButton]}
            onPress={handleContinueGame}
          >
            <View style={styles.buttonContent}>
              <IconSymbol 
                name="arrow.right.circle.fill" 
                size={24} 
                color="white"
                style={styles.buttonIcon}
              />
              <View style={styles.buttonTextContainer}>
                <Text style={styles.buttonText}>Continue Game</Text>
                <Text style={styles.buttonSubtext}>Try to get another line!</Text>
              </View>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.button, styles.playAgainButton]}
            onPress={handlePlayAgain}
          >
            <View style={styles.buttonContent}>
              <IconSymbol 
                name="gamecontroller.fill" 
                size={24} 
                color="white"
                style={styles.buttonIcon}
              />
              <Text style={styles.buttonText}>Play Again</Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.button, styles.hallOfShameButton]}
            onPress={handleHallOfShame}
          >
            <View style={styles.buttonContent}>
              <IconSymbol 
                name="trophy.fill" 
                size={24} 
                color="white"
                style={styles.buttonIcon}
              />
              <Text style={styles.buttonText}>Hall of Shame</Text>
            </View>
          </TouchableOpacity>
        </Animated.View>
      </View>
      
      {/* Optional Screenshot Preview - Only shown after animations complete */}
      {showScreenshot && screenshotUri && (
        <Animated.View style={[styles.screenshotContainer, screenshotAnimatedStyle]}>
          <Image
            source={{ uri: screenshotUri }}
            style={styles.screenshotImage}
            resizeMode="contain"
          />
        </Animated.View>
      )}
      
      <BottomNavigation />
    </View>
  );
};

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100, // Higher than screenshot but lower than particles
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 40,
    marginTop: 40, // Fixed top margin to prevent clipping
    paddingTop: 20, // Add padding for safe display
  },
  mainTitle: {
    fontSize: theme.fonts.massive,
    fontWeight: 'bold',
    color: '#FF4444',
    textAlign: 'center',
    textShadowColor: 'rgba(255, 68, 68, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  bingoTitle: {
    fontSize: theme.fonts.huge,
    fontWeight: 'bold',
    color: '#FFD700',
    textAlign: 'center',
    marginTop: -8,
    textShadowColor: 'rgba(255, 215, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: theme.fonts.lg,
    color: '#fff',
    textAlign: 'center',
    marginTop: 16,
    fontWeight: '600',
  },
  statsContainer: {
    width: '100%',
    marginBottom: 40,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    backgroundColor: '#2a2a4a',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  statItem: {
    width: '48%', // Use percentage width
    alignItems: 'center',
    marginBottom: 16,
  },
  statValue: {
    fontSize: theme.fonts.lg,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: theme.fonts.xs,
    color: '#ccc',
    textAlign: 'center',
  },
  continueWinMessage: {
    backgroundColor: '#FF9800',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  continueWinText: {
    fontSize: theme.fonts.md,
    color: 'white',
    textAlign: 'center',
    fontWeight: '600',
  },
  achievementContainer: {
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    gap: 8,
  },
  achievementItem: {
    alignItems: 'center',
    paddingVertical: 4,
  },
  achievementText: {
    fontSize: theme.fonts.md,
    color: 'white',
    textAlign: 'center',
    fontWeight: '600',
  },
  achievementDescription: {
    fontSize: theme.fonts.sm,
    color: '#E8F5E8',
    textAlign: 'center',
    marginTop: 4,
  },
  buttonsContainer: {
    width: '100%',
    gap: 16,
  },
  button: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  continueButton: {
    backgroundColor: '#4CAF50',
  },
  playAgainButton: {
    backgroundColor: '#FF4444',
  },
  hallOfShameButton: {
    backgroundColor: '#9C27B0',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonTextContainer: {
    alignItems: 'center',
  },
  buttonText: {
    fontSize: theme.fonts.lg,
    fontWeight: 'bold',
    color: 'white',
  },
  buttonSubtext: {
    fontSize: theme.fonts.sm,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
  },
  bloodParticle: {
    position: 'absolute',
    width: 40,
    height: 40,
    top: -50,
    zIndex: 1000, // Higher z-index than screenshot
  },
  splatterContainer: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  // Main splatter shapes
  mainSplatter: {
    position: 'absolute',
    width: 20,
    height: 16,
    borderRadius: 8,
    top: 8,
    left: 10,
    transform: [{ skewX: '-15deg' }],
  },
  droplet1: {
    position: 'absolute',
    width: 8,
    height: 12,
    borderRadius: 6,
    top: 2,
    left: 15,
  },
  droplet2: {
    position: 'absolute',
    width: 6,
    height: 8,
    borderRadius: 4,
    top: 4,
    left: 8,
  },
  droplet3: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
    top: 20,
    left: 18,
  },
  smallDrop1: {
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: 2,
    top: 6,
    left: 32,
  },
  smallDrop2: {
    position: 'absolute',
    width: 3,
    height: 3,
    borderRadius: 1.5,
    top: 15,
    left: 5,
  },
  // Irregular splatter shapes
  irregularSplatter: {
    position: 'absolute',
    width: 18,
    height: 14,
    borderRadius: 7,
    top: 10,
    left: 12,
    transform: [{ rotate: '25deg' }],
  },
  streak1: {
    position: 'absolute',
    width: 12,
    height: 4,
    borderRadius: 2,
    top: 8,
    left: 8,
    transform: [{ rotate: '-45deg' }],
  },
  streak2: {
    position: 'absolute',
    width: 8,
    height: 3,
    borderRadius: 1.5,
    top: 18,
    left: 20,
    transform: [{ rotate: '60deg' }],
  },
  // Scattered drops
  centerDrop: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    top: 14,
    left: 14,
  },
  scatteredDrop1: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
    top: 5,
    left: 10,
  },
  scatteredDrop2: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    top: 8,
    left: 25,
  },
  scatteredDrop3: {
    position: 'absolute',
    width: 5,
    height: 5,
    borderRadius: 2.5,
    top: 25,
    left: 8,
  },
  screenshotContainer: {
    position: 'absolute',
    bottom: 150, // Above bottom navigation
    right: 20,
    width: 120,
    height: 200,
    borderRadius: 12,
    backgroundColor: '#2a2a4a',
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 10, // Lower z-index than particles/animations
  },
  screenshotImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
}));
