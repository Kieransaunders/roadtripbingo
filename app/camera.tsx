import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Alert, Dimensions, Platform } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { Image } from 'expo-image';
import * as MediaLibrary from 'expo-media-library';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { StyleSheet } from 'react-native-unistyles';
import { ThemeProvider } from '@joe111/neo-ui';
import { Button, Box, ThemedText } from '@joe111/neo-ui';
import { Ionicons } from '@expo/vector-icons';
import { useGameStore } from '../src/stores/gameStore';

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
    color: theme.colors.textSecondary,
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
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  flipButton: {
    minWidth: 60,
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
    bottom: 0,
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
  },
  captureButtonDisabled: {
    opacity: 0.6,
  },
  previewContainer: {
    flex: 1,
    padding: 20,
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
    backgroundColor: theme.colors.card,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: theme.colors.border,
  },
  photoText: {
    marginTop: 12,
    fontSize: 16,
    color: theme.colors.textSecondary,
  },
  previewButtons: {
    gap: 12,
  },
  saveButton: {
    backgroundColor: theme.colors.success || theme.colors.primary,
  },
  retakeButton: {
    borderColor: theme.colors.textSecondary,
  },
}));

export default function CameraScreen() {
  const styles = stylesheet; // Directly use the stylesheet
  // If theme is needed for dynamic styles or logic, we'll need to find another way to get it.
  // For now, let's assume it's not directly needed in the component's logic, only in the stylesheet definition.

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
  }, []);

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
      }
    } catch (error) {
      console.error('Error taking picture:', error);
      Alert.alert('Error', 'Failed to take picture. Please try again.');
    }
  };

  const savePhoto = async () => {
    if (!capturedPhoto) return;
    
    try {
      triggerHaptic();
      
      // Save to media library
      const asset = await MediaLibrary.createAssetAsync(capturedPhoto);
      
      // Increment the photos uploaded counter
      incrementPhotosUploaded();
      
      Alert.alert(
        'Snap Successful! 🎯', 
        'Your roadkill evidence has been captured! This will be added to your Hall of Shame stats.',
        [
          {
            text: 'Take Another',
            onPress: () => setCapturedPhoto(null),
          },
          {
            text: 'Back to Game',
            onPress: () => router.back(),
            style: 'default',
          },
        ]
      );
    } catch (error) {
      console.error('Error saving photo:', error);
      Alert.alert('Error', 'Failed to save photo. Please check your permissions.');
    }
  };

  const retakePhoto = () => {
    triggerHaptic();
    setCapturedPhoto(null);
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
        <Box style={styles.container}>
          <ThemedText style={styles.permissionText}>
            📸 Snap the Splat!
          </ThemedText>
          <ThemedText style={styles.permissionSubtext}>
            We need camera access to capture your roadkill evidence for the leaderboard!
          </ThemedText>
          <Button
            title="Grant Camera Access"
            onPress={requestPermission}
            style={styles.permissionButton}
          />
          <Button
            title="Back to Game"
            onPress={() => router.back()}
            variant="outline"
            style={styles.backButton}
          />
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <Box style={styles.container}>
        {capturedPhoto ? (
          // Photo Preview Screen
          <View style={styles.previewContainer}>
            <Text style={styles.previewTitle}>🎯 Snap Successful!</Text>
            <View style={styles.photoContainer}>
              <Image
                source={{ uri: capturedPhoto }}
                style={styles.capturedImage}
                contentFit="cover"
              />
            </View>
            
            <View style={styles.previewButtons}>
              <Button
                title="💾 Save to Hall of Shame"
                onPress={savePhoto}
                style={styles.saveButton}
              />
              <Button
                title="🔄 Retake"
                onPress={retakePhoto}
                variant="outline"
                style={styles.retakeButton}
              />
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
              <View style={styles.header}>
                <Button
                  title="← Back"
                  onPress={() => router.back()}
                  variant="outline"
                  style={styles.backButtonSmall}
                />
                <ThemedText style={styles.headerTitle}>Snap the Splat! 📸</ThemedText>
                <Button
                  title="🔄"
                  onPress={flipCamera}
                  variant="outline"
                  style={styles.flipButton}
                />
              </View>

              {/* Instructions */}
              <View style={styles.instructions}>
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
                  <Button
                    title={isCapturing ? "📸 Capturing..." : "📸 SNAP!"}
                    onPress={takePicture}
                    disabled={isCapturing}
                    style={[
                      styles.captureButton,
                      isCapturing && styles.captureButtonDisabled
                    ]}
                  />
                </View>
              </View>
            </CameraView>
          </>
        )}
      </Box>
    </ThemeProvider>
  );
}