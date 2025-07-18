import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Alert, Dimensions, TouchableOpacity } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { Image } from 'expo-image';
import * as MediaLibrary from 'expo-media-library';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { StyleSheet } from 'react-native-unistyles';
import { ThemeProvider, Button, Box, ThemedText } from '@joe111/neo-ui';
import { useGameStore } from '../src/stores/gameStore';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { openInstagramAccount } from '../src/services/instagramAPI';
import { savePhotoToGallery } from '../src/components/Camera/PhotoGallery';
import { BottomNavigation } from '../src/components/BottomNavigation';

const { width, height } = Dimensions.get('window');

// Define stylesheet at module level
const stylesheet = StyleSheet.create(theme => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  camera: {
    flex: 1,
  },
  loadingText: {
    fontSize: 18,
    textAlign: 'center',
    color: theme.colors.text,
  },
  permissionText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    color: theme.colors.primary,
  },
  permissionSubtext: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
    color: '#888',
    paddingHorizontal: 20,
  },
  permissionButton: {
    marginHorizontal: 20,
    marginBottom: 12,
  },
  backButton: {
    marginHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  backButtonSmall: {
    minWidth: 60,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.6)',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  flipButton: {
    minWidth: 60,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.6)',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  instructions: {
    position: 'absolute',
    top: 140,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingVertical: 12,
  },
  instructionText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 4,
  },
  instructionSubtext: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  controls: {
    position: 'absolute',
    bottom: 80, // Add space for bottom navigation
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    paddingBottom: 40,
    paddingTop: 20,
  },
  captureButtonContainer: {
    alignItems: 'center',
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.primary,
    borderWidth: 4,
    borderColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureButtonDisabled: {
    opacity: 0.6,
  },
  previewContainer: {
    flex: 1,
    padding: 20,
    paddingBottom: 100, // Add space for bottom navigation
    justifyContent: 'center',
    backgroundColor: theme.colors.background,
  },
  previewTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 32,
    color: theme.colors.primary,
  },
  photoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  capturedImage: {
    width: width * 0.9,
    height: height * 0.5,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  photoPlaceholder: {
    width: width * 0.8,
    height: height * 0.4,
    backgroundColor: '#2a2a4a',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#333',
  },
  photoText: {
    marginTop: 12,
    fontSize: 16,
    color: '#888',
  },
  previewButtons: {
    gap: 12,
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginVertical: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  retakeButton: {
    backgroundColor: 'transparent',
    borderColor: '#888',
    borderWidth: 1,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginVertical: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shareButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginVertical: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  instagramButton: {
    backgroundColor: '#E4405F',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginVertical: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  headerButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  captureButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
}));

export default function CameraScreen() {
  const styles = stylesheet;
  const insets = useSafeAreaInsets();
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [mediaPermission, requestMediaPermission] = MediaLibrary.usePermissions();
  const [isCapturing, setIsCapturing] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const cameraRef = useRef<CameraView>(null);
  
  const { incrementPhotosUploaded, hapticEnabled } = useGameStore();

  useEffect(() => {
    // Request permissions on mount
    if (!permission?.granted) {
      requestPermission();
    }
    if (!mediaPermission?.granted) {
      requestMediaPermission();
    }
  }, [permission?.granted, mediaPermission?.granted, requestPermission, requestMediaPermission]);

  const triggerHaptic = () => {
    if (hapticEnabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  };

  const takePicture = async () => {
    if (!cameraRef.current || isCapturing) return;
    
    try {
      setIsCapturing(true);
      triggerHaptic();
      
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: false,
        exif: false,
      });

      if (photo) {
        setCapturedPhoto(photo.uri);
        // Auto-save to gallery when photo is taken
        await savePhoto(photo.uri);
      }
    } catch (error) {
      console.error('Error taking picture:', error);
      Alert.alert('Error', 'Failed to take picture. Please try again.');
    }
  };

  const savePhoto = async (photoUri?: string) => {
    const uriToSave = photoUri || capturedPhoto;
    if (!uriToSave) return;
    
    try {
      // Save to device media library
      await MediaLibrary.createAssetAsync(uriToSave);
      
      // Save to app gallery
      await savePhotoToGallery({
        localUri: uriToSave,
        tileName: 'Roadkill Spotted',
        gameMode: 'Standard'
      });
      
      // Increment the photos uploaded counter
      incrementPhotosUploaded();
      
      console.log('✅ Photo automatically saved to gallery');
    } catch (error) {
      console.error('Error saving photo:', error);
      Alert.alert('Error', 'Failed to save photo. Please check your permissions.');
    }
  };

  const retakePhoto = () => {
    triggerHaptic();
    setCapturedPhoto(null);
  };

  const viewDeadAheadInsta = async () => {
    triggerHaptic();
    try {
      await openInstagramAccount();
      Alert.alert(
        'Instagram Opened! 📱',
        'Check out @deadaheadroadkill for more roadkill content!',
        [{ text: 'OK' }]
      );
    } catch {
      Alert.alert('Error', 'Could not open Instagram. Please try again.');
    }
  };

  const sharePhotoToWorkflow = async () => {
    if (!capturedPhoto) return;
    
    triggerHaptic();
    try {
      // Import the necessary services
      const { uploadImageToCloudinaryWithFallback } = await import('../src/services/cloudinary');
      const { postToInstagram, generateGameDescription } = await import('../src/services/instagramAPI');
      
      console.log('🔄 Starting photo upload workflow...');
      
      Alert.alert(
        'Uploading Photo... 📸',
        'Your photo is being uploaded and posted to Instagram!',
        [{ text: 'OK' }]
      );
      
      // Upload image with fallback presets
      console.log('🔄 Step 1: Uploading image...');
      const cloudinaryUrl = await uploadImageToCloudinaryWithFallback(capturedPhoto);
      console.log('✅ Step 1 Complete: Image URL:', cloudinaryUrl);
      
      // Generate description
      const description = generateGameDescription({
        tileName: 'Roadkill Spotted',
        gameMode: 'Standard'
      });
      console.log('🔄 Step 2: Generated description:', description);
      
      // Post to Instagram via n8n workflow
      console.log('🔄 Step 3: Posting to Instagram via n8n...');
      console.log('🔄 Webhook URL:', 'https://n8n.iconnectit.co.uk/webhook/instagram-post');
      console.log('🔄 Image URL:', cloudinaryUrl);
      console.log('🔄 Description:', description);
      
      try {
        const result = await postToInstagram(cloudinaryUrl, description);
        console.log('✅ Step 3 Complete: Instagram result:', result);
        
        if (result.success) {
          Alert.alert(
            'Success! 🎉',
            `Photo uploaded and posted to @deadaheadroadkill!\n\nPost ID: ${result.post_id || 'Unknown'}`,
            [
              {
                text: 'View on Instagram',
                onPress: () => openInstagramAccount()
              },
              { text: 'OK' }
            ]
          );
        } else {
          throw new Error(result.message || 'Failed to post to Instagram');
        }
      } catch (instagramError) {
        console.log('⚠️ Instagram posting failed, but photo was uploaded successfully');
        console.log('⚠️ Error:', instagramError.message);
        
        // Fallback: Photo uploaded successfully but Instagram posting failed
        Alert.alert(
          'Photo Uploaded! 📸',
          `Your photo was uploaded successfully!\n\nURL: ${cloudinaryUrl}\n\nInstagram posting failed (webhook needs activation), but you can manually share the image.`,
          [
            {
              text: 'Copy URL',
              onPress: () => {
                // Copy URL to clipboard if available
                if (typeof navigator !== 'undefined' && navigator.clipboard) {
                  navigator.clipboard.writeText(cloudinaryUrl);
                }
              }
            },
            {
              text: 'View Instagram',
              onPress: () => openInstagramAccount()
            },
            { text: 'OK' }
          ]
        );
      }
    } catch (error) {
      console.error('❌ Camera upload error:', error);
      Alert.alert(
        'Upload Failed 😞',
        `${error.message}\n\nPlease check your internet connection and try again.`,
        [
          { text: 'Retry', onPress: () => sharePhotoToWorkflow() },
          { text: 'Cancel' }
        ]
      );
    }
  };

  const flipCamera = () => {
    triggerHaptic();
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  if (!permission) {
    // Camera permissions are still loading
    return (
      <ThemeProvider>
        <Box style={styles.container}>
          <ThemedText style={styles.loadingText}>Loading camera...</ThemedText>
        </Box>
      </ThemeProvider>
    );
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <ThemeProvider>
        <Box style={[styles.container, { paddingTop: insets.top + 40 }]}>
          <ThemedText style={styles.permissionText}>
            📸 Snap the Splat!
          </ThemedText>
          <ThemedText style={styles.permissionSubtext}>
            We need camera access to capture your roadkill evidence for the leaderboard!
          </ThemedText>
          <Button
            onPress={requestPermission}
            style={styles.permissionButton}
          >
            Grant Camera Access
          </Button>
          <Button
            onPress={() => router.back()}
            style={styles.backButton}
          >
            Back to Game
          </Button>
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <Box style={styles.container}>
        {capturedPhoto ? (
          // Photo Preview Screen
          <View style={[styles.previewContainer, { paddingTop: insets.top + 20 }]}>
            <Text style={styles.previewTitle}>🎯 Snap Successful!</Text>
            <View style={styles.photoContainer}>
              <Image
                source={{ uri: capturedPhoto }}
                style={styles.capturedImage}
                contentFit="cover"
              />
            </View>
            
            <View style={styles.previewButtons}>
              <TouchableOpacity
                onPress={sharePhotoToWorkflow}
                style={styles.shareButton}
              >
                <Text style={styles.buttonText}>📤 Share Photo to Instagram</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={retakePhoto}
                style={styles.retakeButton}
              >
                <Text style={styles.buttonText}>🔄 Retake</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          // Camera View
          <>
            <CameraView
              ref={cameraRef}
              style={styles.camera}
              facing={facing}
              ratio="16:9"
            >
              {/* Header */}
              <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
                <TouchableOpacity
                  onPress={() => router.back()}
                  style={styles.backButtonSmall}
                >
                  <Text style={styles.headerButtonText}>← Back</Text>
                </TouchableOpacity>
                <ThemedText style={styles.headerTitle}>Snap the Splat! 📸</ThemedText>
                <TouchableOpacity
                  onPress={flipCamera}
                  style={styles.flipButton}
                >
                  <Text style={styles.headerButtonText}>🔄</Text>
                </TouchableOpacity>
              </View>

              {/* Instructions */}
              <View style={[styles.instructions, { top: insets.top + 100 }]}>
                <ThemedText style={styles.instructionText}>
                  🎯 Spot roadkill? Capture the evidence!
                </ThemedText>
                <ThemedText style={styles.instructionSubtext}>
                  Photos help verify your bingo wins
                </ThemedText>
              </View>

              {/* Bottom Controls */}
              <View style={styles.controls}>
                <View style={styles.captureButtonContainer}>
                  <TouchableOpacity
                    onPress={takePicture}
                    disabled={isCapturing}
                    style={[
                      styles.captureButton,
                      isCapturing && styles.captureButtonDisabled
                    ]}
                  >
                    <Text style={styles.captureButtonText}>
                      {isCapturing ? "📸 Capturing..." : "📸 SNAP!"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </CameraView>
          </>
        )}
        
        <BottomNavigation />
      </Box>
    </ThemeProvider>
  );
}