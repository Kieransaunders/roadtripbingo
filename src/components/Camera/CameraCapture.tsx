import React, { useState, useRef, useEffect } from 'react';
import { View, Alert, TouchableOpacity, Text } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';
import { uploadImageToCloudinary } from '../../services/cloudinary';
import { postToInstagram, openInstagramAccount, generateGameDescription } from '../../services/instagramAPI';
import { savePhotoToGallery, checkDailyPhotoLimit } from './PhotoGallery';
import { useConsentDialog } from '../../hooks/useConsentDialog';
import { Strings } from '../../constants/Strings';

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
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [isUploading, setIsUploading] = useState(false);
  const [hasShownConsent, setHasShownConsent] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [dailyLimitInfo, setDailyLimitInfo] = useState<{ remainingPhotos: number; todayCount: number }>({ remainingPhotos: 1, todayCount: 0 });
  const cameraRef = useRef<CameraView>(null);
  const { showConsentDialog } = useConsentDialog();

  // Show ConsentDialog when component mounts with permissions
  useEffect(() => {
    if (permission?.granted && !hasShownConsent) {
      const handleConsentFlow = async () => {
        try {
          const consentGiven = await showConsentDialog();
          
          if (consentGiven) {
            setHasShownConsent(true);
            setShowCamera(true);
          } else {
            // User cancelled, navigate back/close gracefully
            onClose?.();
          }
        } catch (error) {
          console.error('Error showing consent dialog:', error);
          // Fallback to closing the component
          onClose?.();
        }
      };
      
      handleConsentFlow();
    }
  }, [permission?.granted, hasShownConsent, onClose, showConsentDialog]);

  // Load daily limit info when camera shows
  useEffect(() => {
    if (showCamera) {
      const loadDailyLimitInfo = async () => {
        const { remainingPhotos, todayCount } = await checkDailyPhotoLimit(1);
        setDailyLimitInfo({ remainingPhotos, todayCount });
      };
      loadDailyLimitInfo();
    }
  }, [showCamera]);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          {Strings.camera.permissions.title}
        </Text>
        <TouchableOpacity onPress={requestPermission} style={styles.button}>
          <Text style={styles.buttonText}>{Strings.camera.permissions.grant}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const takePicture = async () => {
    try {
      // Check daily photo limit before taking picture
      const { canUpload, remainingPhotos, todayCount } = await checkDailyPhotoLimit(1);
      
      if (!canUpload) {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        Alert.alert(
          '📸 Daily Limit Reached',
          `You've already uploaded ${todayCount} photo${todayCount === 1 ? '' : 's'} today!\n\nDaily limit: 1 photo per day\nTry again tomorrow for more roadkill hunting! 🦫`,
          [{ text: 'Got It' }]
        );
        return;
      }

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
      
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
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
      
    } catch (error: any) {
      console.error('❌ Upload error:', error);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
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

  // Don't show camera preview until consent is given
  if (!showCamera) {
    return <View />;
  }

  return (
    <View style={styles.container}>
      <CameraView 
        ref={cameraRef} 
        style={styles.camera} 
        facing={facing}
      >
        {/* Daily Limit Indicator */}
        <View style={styles.dailyLimitContainer}>
          <Text style={styles.dailyLimitText}>
            📸 {dailyLimitInfo.remainingPhotos} photo{dailyLimitInfo.remainingPhotos === 1 ? '' : 's'} remaining today
          </Text>
          {dailyLimitInfo.todayCount > 0 && (
            <Text style={styles.uploadedTodayText}>
              {dailyLimitInfo.todayCount} uploaded today
            </Text>
          )}
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={onClose}
            style={[styles.button, styles.secondaryButton]}
          >
            <Text style={styles.buttonText}>{Strings.camera.controls.cancel}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={takePicture}
            disabled={isUploading}
            style={[styles.button, styles.captureButton]}
          >
            <Text style={styles.captureButtonText}>
              {isUploading ? Strings.camera.states.uploading : Strings.camera.controls.capture}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={toggleCameraFacing}
            style={[styles.button, styles.secondaryButton]}
          >
            <Text style={styles.buttonText}>{Strings.camera.controls.flip}</Text>
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#000',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
    color: '#fff',
    fontSize: 16,
    margin: 20,
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
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    minHeight: 48,
  },
  secondaryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  captureButton: {
    backgroundColor: '#FF4444',
    borderRadius: 50,
    paddingVertical: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  captureButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  dailyLimitContainer: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  dailyLimitText: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  uploadedTodayText: {
    color: '#ccc',
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
  },
});
