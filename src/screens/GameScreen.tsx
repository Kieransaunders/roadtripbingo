import React, { useEffect } from 'react';
import { View, ScrollView, Alert, StyleSheet, TouchableOpacity, StatusBar, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText, ThemedView, Box, Button } from '@joe111/neo-ui';
import { BingoGrid } from '../components/BingoGrid';
import { useGameStore } from '../stores/gameStore';
import { router } from 'expo-router';
import { postToInstagram, openInstagramAccount } from '../services/instagramAPI';
import { uploadImageToCloudinary } from '../services/cloudinary';

export const GameScreen: React.FC = () => {
  const { 
    currentGrid, 
    isGameWon, 
    gameMode, 
    startNewGame,
    checkWinCondition,
    soundEnabled,
    hapticEnabled 
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
        router.push('/victory');
      }, 500); // Small delay to let the final tile animation complete
    }
  }, [isGameWon]);

  const handleBack = () => {
    router.back();
  };

  const handleCallBingo = () => {
    const hasWon = checkWinCondition();
    if (hasWon) {
      Alert.alert('ROADKILL BINGO!', 'You won! Well spotted!');
    } else {
      Alert.alert('Not Yet!', 'Keep spotting - you need 3 in a row to win!');
    }
  };

  const handleSnapRoadkill = () => {
    router.push('/camera');
  };

  const handleTestInstagram = async () => {
    console.log('🔵 Instagram test button clicked!');
    
    // First, test if alerts work at all
    if (Platform.OS === 'web') {
      window.alert('🔵 Button clicked! Testing full Cloudinary → Instagram flow...');
    } else {
      Alert.alert('🔵 Button clicked!', 'Testing full Cloudinary → Instagram flow...');
    }
    
    try {
      // Step 1: Get local asset and upload to Cloudinary
      console.log('🔵 Step 1: Using local game asset - Dead Ahead Logo');
      
      // Get the dead ahead logo from assets
      const logoImage = require('../../assets/images/dead_ahead_logo.png');
      
      // For web, we need to fetch the local asset and convert to blob
      const assetResponse = await fetch(logoImage);
      const assetBlob = await assetResponse.blob();
      console.log('🔵 Local asset loaded, size:', assetBlob.size, 'bytes');
      
      // Create file for Cloudinary upload
      const file = new File([assetBlob], 'dead-ahead-logo-test.png', { type: 'image/png' });
      console.log('🔵 Step 2: Uploading to Cloudinary...');
      
      // Upload to Cloudinary
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'roadkill_preset');
      formData.append('tags', 'test,deadahead,logo,instagram');
      formData.append('folder', 'roadkill-bingo');

      const cloudinaryResponse = await fetch('https://api.cloudinary.com/v1_1/dxuq6a1mt/image/upload', {
        method: 'POST',
        body: formData,
      });

      const cloudinaryData = await cloudinaryResponse.json();
      console.log('🔵 Cloudinary response:', cloudinaryData);

      if (!cloudinaryResponse.ok) {
        throw new Error(cloudinaryData.error?.message || 'Failed to upload to Cloudinary');
      }

      const cloudinaryUrl = cloudinaryData.secure_url;
      console.log('🔵 Step 2 Complete: Cloudinary URL:', cloudinaryUrl);

      // Show Cloudinary success
      const cloudinaryMessage = `✅ Step 1 & 2: Complete!\n\n📱 Local Asset: dead_ahead_logo.png\n☁️ Cloudinary: ${cloudinaryUrl}\n\nNow posting to Instagram...`;
      if (Platform.OS === 'web') {
        window.alert(cloudinaryMessage);
      } else {
        Alert.alert('✅ Cloudinary Success!', cloudinaryMessage);
      }

      // Step 3: Post to Instagram using Cloudinary URL
      const testDescription = `🎯 Testing complete flow: Local Asset → Cloudinary → Instagram!\n\n🎮 Dead Ahead: Roadkill Bingo Logo Test\n\nSee it. Spot it. Shout it. Win shotgun or throw up trying! 🤢\n\n#roadkill #deadahead #roadkillbingo #test #logo #cloudinary`;
      
      console.log('🔵 Step 3: Posting to Instagram via n8n with Cloudinary URL...');
      const result = await postToInstagram(cloudinaryUrl, testDescription);
      console.log('🔵 Instagram result:', result);
      
      if (result.success) {
        console.log('🔵 Instagram posting success!');
        const successMessage = `🎉 COMPLETE FLOW SUCCESS!\n\n✅ Local Asset: dead_ahead_logo.png\n✅ Cloudinary: ${cloudinaryUrl}\n✅ n8n Webhook: Called\n✅ Instagram: Posted!\n\nPost ID: ${result.post_id}`;
        
        if (Platform.OS === 'web') {
          window.alert(successMessage);
        } else {
          Alert.alert(
            '🎉 Complete Success!', 
            successMessage,
            [
              { text: 'View on Instagram', onPress: () => openInstagramAccount() },
              { text: 'OK' }
            ]
          );
        }
      } else {
        console.log('🔵 Instagram failed:', result);
        const message = `❌ Instagram Step Failed\n\n✅ Image URL: ${testImageUrl}\n❌ Instagram: ${result.message || 'Unknown error'}`;
        if (Platform.OS === 'web') {
          window.alert(message);
        } else {
          Alert.alert('❌ Instagram Failed', message);
        }
      }
    } catch (error) {
      console.log('🔵 Full flow error:', error);
      const message = `❌ Full Flow Test Failed\n\n${error.message || 'Unknown error occurred'}`;
      if (Platform.OS === 'web') {
        window.alert(message);
      } else {
        Alert.alert('❌ Test Failed', error.message || 'Unknown error occurred');
      }
    }
  };

  const getSpottedCount = () => {
    return currentGrid.filter(cell => cell.isSpotted).length;
  };

  const getWinRequirement = () => {
    return gameMode === 'standard' ? '3 in a row' : '4 in a row';
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />
      
      {/* Header with Back Button */}
      <Box style={styles.gameHeader}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <ThemedText style={styles.backIcon}>‹</ThemedText>
        </TouchableOpacity>
        <ThemedText style={styles.gameTitle}>Solo Road Trip</ThemedText>
        <View style={styles.placeholder} />
      </Box>

      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.content}>
        <Box style={styles.header}>
          <ThemedText style={styles.title}>DEAD AHEAD</ThemedText>
          <ThemedText style={styles.subtitle}>Roadkill Bingo</ThemedText>
          <ThemedText style={styles.tagline}>
            "See it. Spot it. Shout it. Win shotgun or throw up trying."
          </ThemedText>
        </Box>

        <Box style={styles.gameInfo}>
          <Box style={styles.infoRow}>
            <Box style={styles.infoItem}>
              <ThemedText style={styles.infoLabel}>Mode</ThemedText>
              <ThemedText style={styles.infoValue}>{gameMode.toUpperCase()}</ThemedText>
            </Box>
            <Box style={styles.infoItem}>
              <ThemedText style={styles.infoLabel}>Win Condition</ThemedText>
              <ThemedText style={styles.infoValue}>{getWinRequirement()}</ThemedText>
            </Box>
            <Box style={styles.infoItem}>
              <ThemedText style={styles.infoLabel}>Spotted</ThemedText>
              <ThemedText style={styles.infoValue}>{getSpottedCount()}/25</ThemedText>
            </Box>
          </Box>
        </Box>

      <View style={styles.gridContainer}>
        <BingoGrid />
      </View>

      <Box style={styles.buttonContainer}>
        <Button 
          style={[styles.button, styles.bingoButton]}
          onPress={handleCallBingo}
        >
          <ThemedText style={styles.buttonText}>Call Roadkill Bingo!</ThemedText>
        </Button>

        <Button 
          style={[styles.button, styles.snapButton]}
          onPress={handleSnapRoadkill}
        >
          <ThemedText style={styles.buttonText}>📸 Snap the Splat!</ThemedText>
        </Button>

        <Button 
          style={[styles.button, styles.newGameButton]}
          onPress={startNewGame}
        >
          <ThemedText style={styles.buttonText}>New Game</ThemedText>
        </Button>

        <TouchableOpacity 
          style={[styles.button, styles.testButton]}
          onPress={handleTestInstagram}
          activeOpacity={0.7}
        >
          <ThemedText style={styles.buttonText}>📤 Test Instagram</ThemedText>
        </TouchableOpacity>
      </Box>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  gameHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
  },
  gameTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  placeholder: {
    width: 44,
    height: 44,
  },
  scrollContainer: {
    flex: 1,
  },
  content: {
    paddingVertical: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FF4444',
    textAlign: 'center',
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 18,
    color: '#FFD700',
    textAlign: 'center',
    marginBottom: 8,
  },
  tagline: {
    fontSize: 14,
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
    fontSize: 12,
    color: '#CCCCCC',
    opacity: 0.7,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
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
    backgroundColor: '#FFD700',
  },
  newGameButton: {
    backgroundColor: '#2A2A2A',
    borderWidth: 2,
    borderColor: '#FF4444',
  },
  testButton: {
    backgroundColor: '#FFD700',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
});