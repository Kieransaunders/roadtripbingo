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
import * as Clipboard from 'expo-clipboard';
import * as Sentry from '@sentry/react-native';
import { useGameStore, Achievement } from '../stores/gameStore';
import { openInstagramAccount } from '../services/instagramAPI';
import { BottomNavigation } from '../components/BottomNavigation';
import { useConsentDialog } from '../hooks/useConsentDialog';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface VictoryScreenProps {
  onPlayAgain: () => void;
  onBackToDashboard?: () => void;
  screenshotUri?: string;
}

// Confetti/Splatter particle component
const SplatterParticle: React.FC<{ delay: number; color: string }> = ({ delay, color }) => {
  const translateY = useSharedValue(-50);
  const translateX = useSharedValue(0);
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0);

  useEffect(() => {
    // Random horizontal position
    const randomX = (Math.random() - 0.5) * SCREEN_WIDTH;
    const fallDistance = SCREEN_HEIGHT + 100;
    
    setTimeout(() => {
      translateX.value = randomX;
      opacity.value = withTiming(1, { duration: 100 });
      scale.value = withSpring(1, { damping: 12 });
      translateY.value = withTiming(fallDistance, { 
        duration: 3000 + Math.random() * 2000 
      });
      
      // Fade out near the end
      setTimeout(() => {
        opacity.value = withTiming(0, { duration: 500 });
      }, 2500);
    }, delay);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[styles.particle, { backgroundColor: color }, animatedStyle]} />
  );
};

// Main Victory Screen component
export const VictoryScreen: React.FC<VictoryScreenProps> = ({ 
  onPlayAgain,
  onBackToDashboard,
  screenshotUri
}) => {
  const { gameStats: _gameStats, currentGrid, gameMode, gameStartTime, checkAchievements } = useGameStore();
  const { showConsentDialog } = useConsentDialog();
  const [showStats, setShowStats] = useState(false);
  const [newAchievements, setNewAchievements] = useState<Achievement[]>([]);
  const [showScreenshot, setShowScreenshot] = useState(false);
  const [animationsComplete, setAnimationsComplete] = useState(false);
  let insets;
  try {
    insets = useSafeAreaInsets();
  } catch (error) {
    // Fallback if SafeAreaProvider is not available
    insets = { top: Platform.OS === 'ios' ? 44 : 24, bottom: Platform.OS === 'ios' ? 34 : 0 };
  }

  // Animation values
  const titleScale = useSharedValue(0);
  const titleRotation = useSharedValue(-5);
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

    // Title animation sequence - smoother and less jarring
    titleScale.value = withSequence(
      withSpring(1.1, { damping: 12, stiffness: 100 }),
      withSpring(1.0, { damping: 15, stiffness: 120 })
    );
    titleRotation.value = withSpring(0, { damping: 18, stiffness: 100 });

    // Show stats after title animation
    setTimeout(() => {
      setShowStats(true);
      statsOpacity.value = withTiming(1, { duration: 600 });
    }, 800);

    // Show buttons last with more delay to prevent jarring
    setTimeout(() => {
      buttonsTranslateY.value = withSpring(0, { damping: 15, stiffness: 100 });
    }, 1800);

    // Mark animations as complete and optionally show screenshot after all animations finish
    setTimeout(() => {
      setAnimationsComplete(true);
      // Only show screenshot after all animations complete to prevent flicker
      if (screenshotUri) {
        setShowScreenshot(true);
        screenshotOpacity.value = withTiming(1, { duration: 800 });
      }
    }, 2500);

    // Additional haptic feedback during animation
    setTimeout(() => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }, 1000);
  }, []);

  const titleAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: titleScale.value },
      { rotate: `${titleRotation.value}deg` },
    ],
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
  const completionPercentage = Math.round((spottedCount / 25) * 100);
  const gameTime = calculateGameTime();
  const winningPattern = gameMode === 'standard' ? "3 in a row" : "4 in a row";

const handleShare = async () => {
    try {
      const consentGiven = await showConsentDialog();
      if (!consentGiven) {
        return;
      }
    } catch (error) {
      console.error('Error showing consent dialog:', error);
      Sentry.captureException(error);
      Alert.alert('Error', 'Failed to show consent dialog. Please try again.');
      return;
    }
    
    try {
      // Create victory message
      const victoryMessage = `I just won ROADKILL BINGO with ${spottedCount}/25 tiles spotted in ${gameTime}! 🎉`;
      const shareMessage = `${victoryMessage} #deadahead #roadkill #roadkillbingo`;
      
      // Show sharing dialog with copy option first
      Alert.alert(
        "Share Your Victory! 🎉", 
        `${victoryMessage}\n\nShare your victory on social media!`,
        [
          { 
            text: "Copy Message", 
            onPress: async () => {
              try {
                await Clipboard.setStringAsync(shareMessage);
                Alert.alert(
                  "Copied! 📋", 
                  "Victory message copied to clipboard!\n\nYou can now paste it anywhere - Instagram, Twitter, Facebook, etc.",
                  [
                    { 
                      text: "View @deadaheadroadkill", 
                      onPress: () => {
                        try {
                          openInstagramAccount();
                        } catch (error) {
                          console.error('Error opening Instagram:', error);
                          Sentry.captureException(error);
                          Alert.alert('Error', 'Failed to open Instagram. Please try again.');
                        }
                      }
                    },
                    { text: "Done" }
                  ]
                );
              } catch (error) {
                console.error('Error copying to clipboard:', error);
                Sentry.captureException(error);
                Alert.alert('Error', 'Failed to copy to clipboard. Please try again.');
              }
            }
          },
          { 
            text: "View @deadaheadroadkill", 
            onPress: () => {
              try {
                openInstagramAccount();
              } catch (error) {
                console.error('Error opening Instagram:', error);
                Sentry.captureException(error);
                Alert.alert('Error', 'Failed to open Instagram. Please try again.');
              }
            }
          },
          { text: "Later" }
        ]
      );
    } catch (error) {
      console.error('Error sharing victory:', error);
      
      // Simple fallback
      const victoryMessage = `I just won ROADKILL BINGO with ${spottedCount}/25 tiles spotted in ${gameTime}! 🎉`;
      const shareMessage = `${victoryMessage} #deadahead #roadkill #roadkillbingo`;
      
      Alert.alert(
        "Share Your Victory! 🎉", 
        victoryMessage,
        [
          { 
            text: "Copy Message", 
            onPress: async () => {
              try {
                await Clipboard.setStringAsync(shareMessage);
                Alert.alert("Copied!", "Victory message copied to clipboard!");
              } catch (error) {
                console.error('Error copying to clipboard:', error);
                Sentry.captureException(error);
                Alert.alert('Error', 'Failed to copy to clipboard. Please try again.');
              }
            }
          },
          { text: "OK" }
        ]
      );
    }
  };

  const handlePlayAgain = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onPlayAgain();
  };


  return (
    <View style={[styles.container, { 
      paddingTop: insets.top + 20,
      paddingBottom: insets.bottom + 100, // Add extra padding for bottom navigation
      paddingLeft: insets.left + 20,
      paddingRight: insets.right + 20,
    }]}>
      {/* Blood splatter/Confetti particles */}
      {Array.from({ length: 30 }, (_, i) => (
        <SplatterParticle
          key={i}
          delay={i * 80 + Math.random() * 200}
          color={
            i % 4 === 0 ? '#FF4444' : // Red splatter
            i % 4 === 1 ? '#FFD700' : // Gold confetti
            i % 4 === 2 ? '#FF6B6B' : // Light red splatter
            '#FF9800'                 // Orange splatter
          }
        />
      ))}

      {/* Main content */}
      <View style={styles.content}>
        {/* Victory Title */}
        <Animated.View style={[styles.titleContainer, titleAnimatedStyle]}>
          <Text style={styles.mainTitle}>ROADKILL</Text>
          <Text style={styles.bingoTitle}>BINGO!</Text>
          <Text style={styles.subtitle}>🎉 YOU WON! 🎉</Text>
        </Animated.View>

        {/* Victory Stats */}
        {showStats && (
          <Animated.View style={[styles.statsContainer, statsAnimatedStyle]}>
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{spottedCount}/25</Text>
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
                <Text style={styles.statValue}>{winningPattern}</Text>
                <Text style={styles.statLabel}>Victory</Text>
              </View>
            </View>

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
            style={[styles.button, styles.playAgainButton]}
            onPress={handlePlayAgain}
          >
            <Text style={styles.buttonText}>🎮 Play Again</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.shareButton]}
            onPress={handleShare}
          >
            <Text style={styles.buttonText}>📸 Share Victory</Text>
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
    fontSize: theme.fonts.gigantic,
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
  playAgainButton: {
    backgroundColor: '#FF4444',
  },
  shareButton: {
    backgroundColor: '#FFD700',
  },
  buttonText: {
    fontSize: theme.fonts.lg,
    fontWeight: 'bold',
    color: 'white',
  },
  particle: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 2, // Less round, more splatter-like
    top: -50,
    zIndex: 1000, // Higher z-index than screenshot
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
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
