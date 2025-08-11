import React, { useState, useRef, useEffect } from 'react';
import { View, Alert, Dimensions, Platform } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { Image } from 'expo-image';
import * as MediaLibrary from 'expo-media-library';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { StyleSheet } from 'react-native-unistyles';
import { Card, Text, IconButton, Button, Surface, FAB } from 'react-native-paper';
import { useGameStore } from '../src/stores/gameStore';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { openInstagramAccount } from '../src/services/instagramAPI';
import { savePhotoToGallery } from '../src/components/Camera/PhotoGallery';
import { BottomNavigation } from '../src/components/BottomNavigation';
import { useConsentDialog } from '../src/hooks/useConsentDialog';
import { IconSymbol } from '../src/components/ui/IconSymbol';

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
  permissionCard: {
    marginHorizontal: 20,
    padding: 20,
  },
  permissionContent: {
    alignItems: 'center',
  },
  permissionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  permissionText: {
    textAlign: 'center',
    marginBottom: 16,
    color: theme.colors.primary,
  },
  permissionSubtext: {
    textAlign: 'center',
    marginBottom: 32,
    color: '#888',
  },
  permissionButton: {
    marginBottom: 12,
    width: '100%',
  },
  backButton: {
    width: '100%',
  },
  buttonContent: {
    paddingVertical: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  backButtonSmall: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerTitle: {
    color: 'white',
    textAlign: 'center',
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    flex: 1,
  },
  flipButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerSpacer: {
    width: 56, // Same width as IconButton to balance the layout
  },
  instructions: {
    position: 'absolute',
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  instructionText: {
    color: 'white',
    textAlign: 'center',
    marginBottom: 4,
  },
  instructionSubtext: {
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
    backgroundColor: theme.colors.primary,
  },
  previewContainer: {
    flex: 1,
    padding: 20,
    paddingBottom: 100,
    justifyContent: 'center',
    backgroundColor: theme.colors.background,
  },
  previewTitle: {
    textAlign: 'center',
    marginBottom: 32,
    color: theme.colors.primary,
  },
  photoCard: {
    marginBottom: 32,
    overflow: 'hidden',
  },
  capturedImage: {
    width: '100%',
    height: height * 0.5,
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
  shareButton: {
    backgroundColor: '#4CAF50',
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
  const { showConsentDialog } = useConsentDialog();
  
  // Debug: Log hook availability
  console.log('🔍 Camera - Consent dialog hook available:', !!showConsentDialog);
  
  console.log('🔍 Camera component - useConsentDialog hook available:', !!showConsentDialog);

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
        tileName: 'Road Trip Sighting',
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


  const viewRoadTripBingoInsta = async () => {
    triggerHaptic();
    try {
      await openInstagramAccount();
      Alert.alert(
        'Instagram Opened! 📱',
        'Check out @roadtripbingo for more road trip content!',
        [{ text: 'OK' }]
      );
    } catch {
      Alert.alert('Error', 'Could not open Instagram. Please try again.');
    }
  };

  const sharePhotoToWorkflow = async () => {
    if (!capturedPhoto) return;
    
    triggerHaptic();
    
    console.log('🔍 sharePhotoToWorkflow called - showing consent dialog');
    
    try {
      const consentGiven = await showConsentDialog();
      console.log('🔍 Consent dialog result:', consentGiven);
      if (!consentGiven) {
        console.log('🔍 Consent not given, exiting');
        return;
      }
    } catch (error) {
      console.error('Error showing consent dialog:', error);
      Alert.alert('Error', 'Failed to show consent dialog. Please try again.');
      return;
    }
    
    try {
      // Import the necessary services
      const { uploadImageToCloudinaryWithFallback } = await import('../src/services/cloudinary');
      const { postToInstagram, generateGameDescription } = await import('../src/services/instagramAPI');
      
      console.log('🔄 Starting photo upload workflow...');
      
      // Upload image with fallback presets
      console.log('🔄 Step 1: Uploading image...');
      const cloudinaryUrl = await uploadImageToCloudinaryWithFallback(capturedPhoto);
      console.log('✅ Step 1 Complete: Image URL:', cloudinaryUrl);
      
      // Generate description
      const description = generateGameDescription({
        tileName: 'Road Trip Sighting',
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
            `Photo uploaded and posted to @roadtripbingo!\n\nPost ID: ${result.post_id || 'Unknown'}`,
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
        console.log('⚠️ Error:', instagramError instanceof Error ? instagramError.message : String(instagramError));
        
        // Fallback: Photo uploaded successfully but Instagram posting failed
        Alert.alert(
          'Photo Uploaded!',
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
        `${error instanceof Error ? error.message : 'An unknown error occurred'}\n\nPlease check your internet connection and try again.`,
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
      <View style={styles.container}>
        <Text variant="bodyLarge" style={styles.loadingText}>Loading camera...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <Surface style={[styles.container, { paddingTop: insets.top + 40 }]}>
        <Card style={styles.permissionCard} mode="contained">
          <Card.Content style={styles.permissionContent}>
            <View style={styles.permissionTitleContainer}>
              <IconSymbol name="camera.fill" size={24} color="#FF4444" />
              <Text variant="headlineMedium" style={styles.permissionText}>
                Snap & Share!
              </Text>
            </View>
            <Text variant="bodyMedium" style={styles.permissionSubtext}>
              We need camera access to capture your road trip sightings for the leaderboard!
            </Text>
            <Button
              mode="contained"
              onPress={requestPermission}
              style={styles.permissionButton}
              contentStyle={styles.buttonContent}
              icon="camera"
            >
              Grant Camera Access
            </Button>
            <Button
              mode="outlined"
              onPress={() => router.back()}
              style={styles.backButton}
              contentStyle={styles.buttonContent}
              icon="arrow-left"
            >
              Back to Game
            </Button>
          </Card.Content>
        </Card>
      </Surface>
    );
  }

  return (
    <View style={styles.container}>
        {capturedPhoto ? (
          // Photo Preview Screen
          <Surface style={[styles.previewContainer, { paddingTop: insets.top + 20 }]}>
            <Text variant="headlineMedium" style={styles.previewTitle}>🎯 Snap Successful!</Text>
            <Card style={styles.photoCard} mode="outlined">
              <Image
                source={{ uri: capturedPhoto }}
                style={styles.capturedImage}
                contentFit="cover"
              />
            </Card>
            
            <View style={styles.previewButtons}>
              <Button
                mode="contained"
                onPress={sharePhotoToWorkflow}
                style={styles.shareButton}
                contentStyle={styles.buttonContent}
                icon="share"
              >
                Share Photo to Instagram
              </Button>
            </View>
          </Surface>
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
              <Surface style={[styles.header, { paddingTop: insets.top + 16 }]} elevation={3}>
                <View style={styles.headerSpacer} />
                <IconButton
                  icon="camera-flip"
                  size={24}
                  onPress={flipCamera}
                  style={styles.flipButton}
                  iconColor="white"
                />
              </Surface>

              {/* Instructions */}
              <Card style={[styles.instructions, { top: insets.top + 100 }]} mode="contained">
                <Card.Content>
                  <Text variant="titleMedium" style={styles.instructionText}>
                    🎯 Spot something interesting? Capture the moment!
                  </Text>
                  <Text variant="bodyMedium" style={styles.instructionSubtext}>
                    Photos help verify your bingo wins
                  </Text>
                </Card.Content>
              </Card>

              {/* Bottom Controls */}
              <View style={styles.controls}>
                <View style={styles.captureButtonContainer}>
                  <FAB
                    icon={(props) => (
                      <IconSymbol name="camera.fill" size={props.size ?? 24} color={props.color ?? 'white'} />
                    )}
                    onPress={takePicture}
                    disabled={isCapturing}
                    style={styles.captureButton}
                    size="large"
                    label={isCapturing ? "Capturing..." : "SNAP!"}
                    mode="elevated"
                    accessibilityLabel="Take Picture"
                  />
                </View>
              </View>
            </CameraView>
          </>
        )}
        
        <BottomNavigation />
    </View>
  );
}