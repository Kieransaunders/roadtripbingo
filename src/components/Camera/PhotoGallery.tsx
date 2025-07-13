import React, { useState, useEffect } from 'react';
import { FlatList, TouchableOpacity, Alert } from 'react-native';
import { Image } from 'expo-image';
import { Button, ThemedText, Box } from '@neo-ui/react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
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
  const { styles } = useStyles(stylesheet);
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
      '📸 Photo Options',
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
              await Haptics.successAsync();
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
      <Box style={styles.photoOverlay}>
        <ThemedText style={styles.photoDate}>
          {new Date(item.timestamp).toLocaleDateString()}
        </ThemedText>
        {item.tileName && (
          <ThemedText style={styles.tileName}>
            {item.tileName}
          </ThemedText>
        )}
        {item.instagramPostId && (
          <Box style={styles.instagramBadge}>
            <ThemedText style={styles.instagramText}>📱</ThemedText>
          </Box>
        )}
      </Box>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <Box style={styles.container}>
        <ThemedText style={styles.loadingText}>Loading photos...</ThemedText>
      </Box>
    );
  }

  return (
    <Box style={styles.container}>
      <Box style={styles.header}>
        <ThemedText style={styles.title}>📸 Roadkill Gallery</ThemedText>
        <ThemedText style={styles.subtitle}>
          {photos.length} photo{photos.length !== 1 ? 's' : ''} captured
        </ThemedText>
      </Box>

      {photos.length === 0 ? (
        <Box style={styles.emptyState}>
          <ThemedText style={styles.emptyText}>
            No photos yet! 📸
          </ThemedText>
          <ThemedText style={styles.emptySubtext}>
            Start spotting roadkill and taking photos to build your gallery
          </ThemedText>
        </Box>
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

      <Box style={styles.footer}>
        <Button
          onPress={() => openInstagramAccount()}
          title="View @deadaheadroadkill"
          variant="secondary"
          style={styles.instagramButton}
        />
        
        {photos.length > 0 && (
          <Button
            onPress={clearAllPhotos}
            title="Clear All"
            variant="destructive"
            style={styles.clearButton}
          />
        )}
        
        <Button
          onPress={onClose}
          title="Close"
          style={styles.closeButton}
        />
      </Box>
    </Box>
  );
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

const stylesheet = createStyleSheet((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.primary,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: theme.colors.textSecondary,
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
    color: theme.colors.textSecondary,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: 'center',
    color: theme.colors.textSecondary,
    opacity: 0.7,
  },
  photoList: {
    padding: 10,
  },
  photoContainer: {
    flex: 1,
    margin: 5,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: theme.colors.surface,
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
    color: theme.colors.secondary,
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
    borderTopColor: theme.colors.border,
    gap: 10,
  },
  instagramButton: {
    backgroundColor: '#E4405F',
  },
  clearButton: {
    backgroundColor: theme.colors.error,
  },
  closeButton: {
    backgroundColor: theme.colors.surface,
  },
}));