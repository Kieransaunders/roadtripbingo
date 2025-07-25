import React, { useState, useEffect } from 'react';
import { FlatList, TouchableOpacity, Alert, View, Text } from 'react-native';
import { Image } from 'expo-image';
import { StyleSheet } from 'react-native-unistyles';
import * as Haptics from 'expo-haptics';
import { openInstagramAccount } from '../../services/instagramAPI';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface PhotoRecord {
  id: string;
  localUri: string;
  cloudinaryUrl?: string;
  instagramPostId?: string;
  timestamp: number;
  tileName?: string;
  gameMode?: string;
}

interface PhotoGalleryProps {
  onClose?: () => void;
}

export const PhotoGallery: React.FC<PhotoGalleryProps> = ({ onClose }) => {
  const styles = stylesheet;
  const [photos, setPhotos] = useState<PhotoRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPhotos();
  }, []);

  const loadPhotos = async () => {
    try {
      const storedPhotos = await AsyncStorage.getItem('roadkill_photos');
      if (storedPhotos) {
        const parsedPhotos: PhotoRecord[] = JSON.parse(storedPhotos);
        setPhotos(parsedPhotos.sort((a, b) => b.timestamp - a.timestamp));
      }
    } catch (error) {
      console.error('Error loading photos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoPress = (photo: PhotoRecord) => {
    Alert.alert(
      'Photo Options',
      `Taken: ${new Date(photo.timestamp).toLocaleDateString()}\n${photo.tileName ? `Tile: ${photo.tileName}` : ''}`,
      [
        {
          text: 'View on Instagram',
          onPress: () => viewOnInstagram(photo)
        },
        {
          text: 'Delete Photo',
          style: 'destructive',
          onPress: () => deletePhoto(photo.id)
        },
        { text: 'Cancel' }
      ]
    );
  };

  const viewOnInstagram = async (photo: PhotoRecord) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    if (photo.instagramPostId) {
      // Try to open specific post if we have the ID
      // Instagram doesn't allow direct post links, so we'll open the account
      await openInstagramAccount();
    } else {
      await openInstagramAccount();
    }
  };

  const deletePhoto = async (photoId: string) => {
    try {
      const updatedPhotos = photos.filter(p => p.id !== photoId);
      setPhotos(updatedPhotos);
      await AsyncStorage.setItem('roadkill_photos', JSON.stringify(updatedPhotos));
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch (error) {
      console.error('Error deleting photo:', error);
      Alert.alert('Error', 'Failed to delete photo');
    }
  };

  const clearAllPhotos = () => {
    Alert.alert(
      'Clear All Photos?',
      'This will delete all photos from your gallery. This cannot be undone.',
      [
        {
          text: 'Delete All',
          style: 'destructive',
          onPress: async () => {
            try {
              setPhotos([]);
              await AsyncStorage.removeItem('roadkill_photos');
              await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            } catch (error) {
              console.error('Error clearing photos:', error);
            }
          }
        },
        { text: 'Cancel' }
      ]
    );
  };

  const renderPhoto = ({ item }: { item: PhotoRecord }) => (
    <TouchableOpacity
      style={styles.photoContainer}
      onPress={() => handlePhotoPress(item)}
      activeOpacity={0.8}
    >
      <Image
        source={{ uri: item.localUri }}
        style={styles.photo}
        contentFit="cover"
        transition={200}
      />
      <View style={styles.photoOverlay}>
        <Text style={styles.photoDate}>
          {new Date(item.timestamp).toLocaleDateString()}
        </Text>
        {item.tileName && (
          <Text style={styles.tileName}>
            {item.tileName}
          </Text>
        )}
        {item.instagramPostId && (
          <View style={styles.instagramBadge}>
            <Text style={styles.instagramText}>IG</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading photos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Roadkill Gallery</Text>
        <Text style={styles.subtitle}>
          {photos.length} photo{photos.length !== 1 ? 's' : ''} captured
        </Text>
      </View>

      {photos.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>
            No photos yet!
          </Text>
          <Text style={styles.emptySubtext}>
            Start spotting roadkill and taking photos to build your gallery
          </Text>
        </View>
      ) : (
        <FlatList
          data={photos}
          renderItem={renderPhoto}
          keyExtractor={(item) => item.id}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.photoList}
        />
      )}

      <View style={styles.footer}>
        <TouchableOpacity
          onPress={() => openInstagramAccount()}
          style={styles.instagramButton}
          activeOpacity={0.7}
        >
          <Text style={styles.buttonText}>View @deadaheadroadkill</Text>
        </TouchableOpacity>
        
        {photos.length > 0 && (
          <TouchableOpacity
            onPress={clearAllPhotos}
            style={styles.clearButton}
            activeOpacity={0.7}
          >
            <Text style={styles.buttonText}>Clear All</Text>
          </TouchableOpacity>
        )}
        
        {onClose && (
          <TouchableOpacity
            onPress={onClose}
            style={styles.closeButton}
            activeOpacity={0.7}
          >
            <Text style={styles.buttonText}>Close</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

// Helper function to check daily photo limit
export const checkDailyPhotoLimit = async (maxPhotosPerDay: number = 1): Promise<{ canUpload: boolean; remainingPhotos: number; todayCount: number }> => {
  try {
    const existingPhotos = await AsyncStorage.getItem('roadkill_photos');
    const photos: PhotoRecord[] = existingPhotos ? JSON.parse(existingPhotos) : [];
    
    // Get start of today (midnight)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayTimestamp = today.getTime();
    
    // Count photos uploaded today
    const todayPhotos = photos.filter(photo => photo.timestamp >= todayTimestamp);
    const todayCount = todayPhotos.length;
    
    const canUpload = todayCount < maxPhotosPerDay;
    const remainingPhotos = Math.max(0, maxPhotosPerDay - todayCount);
    
    return {
      canUpload,
      remainingPhotos,
      todayCount
    };
  } catch (error) {
    console.error('❌ Error checking daily photo limit:', error);
    // If there's an error, allow upload (fail open)
    return { canUpload: true, remainingPhotos: 1, todayCount: 0 };
  }
};

// Helper function to save photo to gallery
export const savePhotoToGallery = async (photoData: Omit<PhotoRecord, 'id' | 'timestamp'>) => {
  try {
    const newPhoto: PhotoRecord = {
      ...photoData,
      id: `photo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
    };

    const existingPhotos = await AsyncStorage.getItem('roadkill_photos');
    const photos: PhotoRecord[] = existingPhotos ? JSON.parse(existingPhotos) : [];
    
    photos.unshift(newPhoto); // Add to beginning of array
    
    // Keep only last 50 photos to prevent storage issues
    const trimmedPhotos = photos.slice(0, 50);
    
    await AsyncStorage.setItem('roadkill_photos', JSON.stringify(trimmedPhotos));
    console.log('✅ Photo saved to gallery:', newPhoto.id);
    
    return newPhoto;
  } catch (error) {
    console.error('❌ Error saving photo to gallery:', error);
    throw error;
  }
};

const stylesheet = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#444',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#CCCCCC',
    textAlign: 'center',
    marginTop: 4,
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#CCCCCC',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    textAlign: 'center',
    color: 'white',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: 'center',
    color: '#CCCCCC',
    opacity: 0.8,
  },
  photoList: {
    padding: 10,
  },
  photoContainer: {
    flex: 1,
    margin: 5,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#2a2a4a',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  photo: {
    width: '100%',
    aspectRatio: 1,
  },
  photoOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 8,
  },
  photoDate: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  tileName: {
    color: '#FFD700',
    fontSize: 10,
    marginTop: 2,
  },
  instagramBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  instagramText: {
    fontSize: 12,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#444',
    gap: 12,
  },
  instagramButton: {
    backgroundColor: '#E4405F',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  clearButton: {
    backgroundColor: '#FF4444',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  closeButton: {
    backgroundColor: '#333',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
}));