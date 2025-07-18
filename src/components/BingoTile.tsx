import React from 'react';
import { Pressable, Image, Text, View, StyleSheet } from 'react-native';
import { BingoCell } from '../stores/gameStore';
import { soundManager } from '../services/soundManager';

interface BingoTileProps {
  cell: BingoCell;
  onPress: (position: number) => void;
  size?: number;
}

export const BingoTile: React.FC<BingoTileProps> = ({ 
  cell, 
  onPress, 
  size = 70 
}) => {
  
  const handlePress = async () => {
    // Play category-specific sound effects
    if (!cell.isSpotted) {
      // Play different sounds based on tile category and content
      switch (cell.tile.category) {
        case 'roadkill':
          // Roadkill tiles get heavy blood splatter or car+blood sounds
          if (Math.random() < 0.4) {
            await soundManager.playFallbackSound(); // Car noise + blood
          } else {
            await soundManager.playBloodSplatterWithIntensity('heavy');
          }
          break;
          
        case 'special':
          await soundManager.playElectricSound();
          break;
          
        case 'vehicles':
          // 30% chance of car+blood, 70% electric sounds for vehicles
          if (Math.random() < 0.3) {
            await soundManager.playFallbackSound();
          } else {
            await soundManager.playElectricSound();
          }
          break;
          
        case 'people':
          // Creepy sounds for people-related tiles
          await soundManager.playCreepySound();
          break;
          
        default:
          // Default blood splatter for other categories, with occasional car+blood fallback
          if (Math.random() < 0.1) {
            await soundManager.playFallbackSound();
          } else {
            await soundManager.playBloodSplatterSound();
          }
          break;
      }
    }
    
    onPress(cell.position);
  };

  return (
    <Pressable
      style={[
        styles.container,
        { width: size, height: size },
        cell.isSpotted && styles.spottedContainer
      ]}
      onPress={handlePress}
    >
      <Image
        source={cell.tile.image}
        style={[
          styles.image,
          cell.isSpotted && styles.spottedImage
        ]}
        resizeMode="cover"
      />
      
      {cell.isSpotted && (
        <View style={styles.spottedOverlay}>
          <Text style={styles.spottedText}>✓</Text>
        </View>
      )}
      
      {cell.tile.category === 'special' && (
        <View style={styles.specialBadge}>
          <Text style={styles.specialText}>FREE</Text>
        </View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#2A2A2A',
    borderRadius: 8,
    padding: 2,
    margin: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  spottedContainer: {
    borderColor: '#FF4444',
    backgroundColor: '#2A2A2A80',
  },
  image: {
    width: '95%',
    height: '95%',
    borderRadius: 6,
  },
  spottedImage: {
    opacity: 0.5,
  },
  spottedOverlay: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#FF4444',
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  spottedText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  specialBadge: {
    position: 'absolute',
    top: 2,
    left: 2,
    backgroundColor: '#FFD700',
    borderRadius: 6,
    paddingHorizontal: 4,
    paddingVertical: 1,
  },
  specialText: {
    color: '#000',
    fontSize: 8,
    fontWeight: 'bold',
  },
});