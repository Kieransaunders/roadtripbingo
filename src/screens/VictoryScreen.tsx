import React, { useEffect, useState } from 'react';
import { View, Dimensions, StyleSheet, Alert, Linking } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText, Box, Button } from '@joe111/neo-ui';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  withSequence,
  withTiming,
  interpolate,
  runOnJS,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import * as WebBrowser from 'expo-web-browser';
import * as Clipboard from 'expo-clipboard';
import { useGameStore } from '../stores/gameStore';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface VictoryScreenProps {
  onPlayAgain: () => void;
  onBackToDashboard: () => void;
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
  onBackToDashboard 
}) => {
  const { gameStats, currentGrid, gameMode, gameStartTime } = useGameStore();
  const [showStats, setShowStats] = useState(false);

  // Animation values
  const titleScale = useSharedValue(0);
  const titleRotation = useSharedValue(-10);
  const statsOpacity = useSharedValue(0);
  const buttonsTranslateY = useSharedValue(100);

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

    // Title animation sequence
    titleScale.value = withSequence(
      withSpring(1.2, { damping: 8 }),
      withSpring(1.0, { damping: 12 })
    );
    titleRotation.value = withSpring(0, { damping: 15 });

    // Show stats after title animation
    setTimeout(() => {
      setShowStats(true);
      statsOpacity.value = withTiming(1, { duration: 800 });
    }, 1000);

    // Show buttons last
    setTimeout(() => {
      buttonsTranslateY.value = withSpring(0, { damping: 12 });
    }, 1500);

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

  // Calculate victory stats
  const spottedCount = currentGrid.filter(cell => cell.isSpotted).length;
  const completionPercentage = Math.round((spottedCount / 25) * 100);
  const gameTime = calculateGameTime();
  const winningPattern = gameMode === 'standard' ? "3 in a row" : "4 in a row";

  const handleShare = async () => {
    try {
      // Create victory message
      const victoryMessage = `I just won ROADKILL BINGO with ${spottedCount}/25 tiles spotted in ${gameTime}! 🎉`;
      
      // Instagram hashtags - encoded for URL
      const hashtags = encodeURIComponent('#deadahead #roadkill');
      
      // Try to open Instagram app first, fallback to web browser
      const instagramUrl = `instagram://camera?hashtags=${hashtags}`;
      const instagramWebUrl = `https://www.instagram.com/create/story/?hashtags=${hashtags}`;
      
      // Check if Instagram app is available
      const canOpenInstagram = await Linking.canOpenURL(instagramUrl);
      
      if (canOpenInstagram) {
        // Open Instagram app
        await Linking.openURL(instagramUrl);
      } else {
        // Fallback to web browser
        await WebBrowser.openBrowserAsync(instagramWebUrl);
      }
      
      // Show additional context alert
      Alert.alert(
        "Share on Instagram! 📸", 
        `${victoryMessage}\n\nShare your victory with hashtags:\n#deadahead #roadkill`,
        [{ text: "Got it!" }]
      );
    } catch (error) {
      console.error('Error opening Instagram:', error);
      
      // Fallback alert with manual sharing instructions
      Alert.alert(
        "Share Your Victory! 🎉", 
        `I just won ROADKILL BINGO with ${spottedCount}/25 tiles spotted in ${gameTime}!\n\nShare on Instagram with:\n#deadahead #roadkill`,
        [
          { text: "Copy Message", onPress: async () => {
            const shareMessage = `I just won ROADKILL BINGO with ${spottedCount}/25 tiles spotted in ${gameTime}! 🎉 #deadahead #roadkill`;
            await Clipboard.setStringAsync(shareMessage);
            Alert.alert("Copied!", "Victory message copied to clipboard!");
          }},
          { text: "OK" }
        ]
      );
    }
  };

  const handlePlayAgain = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onPlayAgain();
  };

  const handleBackToDashboard = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onBackToDashboard();
  };

  return (
    <SafeAreaView style={styles.container}>
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
      <Box style={styles.content}>
        {/* Victory Title */}
        <Animated.View style={[styles.titleContainer, titleAnimatedStyle]}>
          <ThemedText style={styles.mainTitle}>ROADKILL</ThemedText>
          <ThemedText style={styles.bingoTitle}>BINGO!</ThemedText>
          <ThemedText style={styles.subtitle}>🎉 YOU WON! 🎉</ThemedText>
        </Animated.View>

        {/* Victory Stats */}
        {showStats && (
          <Animated.View style={[styles.statsContainer, statsAnimatedStyle]}>
            <Box style={styles.statsGrid}>
              <Box style={styles.statItem}>
                <ThemedText style={styles.statValue}>{spottedCount}/25</ThemedText>
                <ThemedText style={styles.statLabel}>Tiles Spotted</ThemedText>
              </Box>
              <Box style={styles.statItem}>
                <ThemedText style={styles.statValue}>{gameTime}</ThemedText>
                <ThemedText style={styles.statLabel}>Time</ThemedText>
              </Box>
              <Box style={styles.statItem}>
                <ThemedText style={styles.statValue}>{completionPercentage}%</ThemedText>
                <ThemedText style={styles.statLabel}>Complete</ThemedText>
              </Box>
              <Box style={styles.statItem}>
                <ThemedText style={styles.statValue}>{winningPattern}</ThemedText>
                <ThemedText style={styles.statLabel}>Victory</ThemedText>
              </Box>
            </Box>

            <Box style={styles.achievementContainer}>
              <ThemedText style={styles.achievementText}>
                🏆 New roadkill spotter achievement unlocked!
              </ThemedText>
            </Box>
          </Animated.View>
        )}

        {/* Action Buttons */}
        <Animated.View style={[styles.buttonsContainer, buttonsAnimatedStyle]}>
          <Button
            style={[styles.button, styles.playAgainButton]}
            onPress={handlePlayAgain}
          >
            <ThemedText style={styles.buttonText}>🎮 Play Again</ThemedText>
          </Button>

          <Button
            style={[styles.button, styles.shareButton]}
            onPress={handleShare}
          >
            <ThemedText style={styles.buttonText}>📸 Share Victory</ThemedText>
          </Button>

          <Button
            style={[styles.button, styles.dashboardButton]}
            onPress={handleBackToDashboard}
          >
            <ThemedText style={styles.buttonText}>🏠 Back to Dashboard</ThemedText>
          </Button>
        </Animated.View>
      </Box>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  mainTitle: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FF4444',
    textAlign: 'center',
    textShadowColor: 'rgba(255, 68, 68, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  bingoTitle: {
    fontSize: 56,
    fontWeight: 'bold',
    color: '#FFD700',
    textAlign: 'center',
    marginTop: -8,
    textShadowColor: 'rgba(255, 215, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 18,
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
    width: '48%',
    alignItems: 'center',
    marginBottom: 16,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#ccc',
    textAlign: 'center',
  },
  achievementContainer: {
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  achievementText: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    fontWeight: '600',
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
  dashboardButton: {
    backgroundColor: '#2a2a4a',
    borderWidth: 2,
    borderColor: '#FF4444',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  particle: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 2, // Less round, more splatter-like
    top: -50,
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
});
