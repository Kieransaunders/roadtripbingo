import React, { useState, useRef } from 'react';
import { View, Alert } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { Button, ThemedText, Box } from '@neo-ui/react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import * as Haptics from 'expo-haptics';
import { uploadImageToCloudinary } from '../../services/cloudinary';
import { postToInstagram, openInstagramAccount, generateGameDescription } from '../../services/instagramAPI';
import { savePhotoToGallery } from './PhotoGallery';

interface CameraCaptureProps {
  onPhotoTaken?: (photoUri: string) => void;
  onClose?: () => void;
  tileContext?: {
    tileName?: string;
    gameMode?: string;
  };
}

export const CameraCapture: React.FC<CameraCaptureProps> = ({
  onPhotoTaken,
  onClose,
  tileContext
}) => {
  const { styles } = useStyles(stylesheet);
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [isUploading, setIsUploading] = useState(false);
  const cameraRef = useRef<CameraView>(null);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <Box style={styles.container}>
        <ThemedText style={styles.message}>
          We need your permission to show the camera
        </ThemedText>
        <Button onPress={requestPermission} title="Grant Permission" />
      </Box>
    );
  }

  const takePicture = async () => {
    try {
      if (cameraRef.current) {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          base64: false,
        });

        if (photo?.uri) {
          await uploadToCloudinaryAndPost(photo.uri);
        }
      }
    } catch (error) {
      console.error('Error taking picture:', error);
      Alert.alert('Error', 'Failed to take picture');
    }
  };

  const uploadToCloudinaryAndPost = async (photoUri: string) => {
    setIsUploading(true);
    
    try {
      // Step 1: Upload to Cloudinary
      console.log('🔄 Uploading to Cloudinary...');
      const cloudinaryUrl = await uploadImageToCloudinary(photoUri);
      
      // Step 2: Generate description with game context
      const description = generateGameDescription(tileContext);
      
      // Step 3: Send to n8n workflow for Instagram posting
      console.log('🔄 Posting to Instagram...');
      const result = await postToInstagram(cloudinaryUrl, description);
      
      // Step 4: Save to local gallery
      await savePhotoToGallery({
        localUri: photoUri,
        cloudinaryUrl,
        instagramPostId: result.post_id,
        tileName: tileContext?.tileName,
        gameMode: tileContext?.gameMode,
      });
      
      // Step 5: Auto-open Instagram account
      console.log('🔄 Opening Instagram...');
      await openInstagramAccount();
      
      // Callback for parent component
      onPhotoTaken?.(photoUri);
      
      await Haptics.successAsync();
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
      
    } catch (error) {
      console.error('❌ Upload error:', error);
      await Haptics.errorAsync();
      Alert.alert(
        'Upload Failed 😞', 
        `${error.message}\n\nPlease check your internet connection and try again.`,
        [
          { text: 'Try Again', onPress: () => uploadToCloudinaryAndPost(photoUri) },
          { text: 'Cancel' }
        ]
      );
    } finally {
      setIsUploading(false);
    }
  };


  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  return (
    <Box style={styles.container}>
      <CameraView 
        ref={cameraRef} 
        style={styles.camera} 
        facing={facing}
      >
        <Box style={styles.buttonContainer}>
          <Button
            onPress={onClose}
            title="Cancel"
            variant="secondary"
            style={styles.button}
          />
          
          <Button
            onPress={takePicture}
            title={isUploading ? "Uploading..." : "📸 Snap the Splat!"}
            disabled={isUploading}
            style={[styles.button, styles.captureButton]}
          />
          
          <Button
            onPress={toggleCameraFacing}
            title="Flip"
            variant="secondary"
            style={styles.button}
          />
        </Box>
      </CameraView>
    </Box>
  );
};

const stylesheet = createStyleSheet((theme) => ({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  button: {
    flex: 0.3,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  captureButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: 50,
    paddingVertical: 20,
  },
}));