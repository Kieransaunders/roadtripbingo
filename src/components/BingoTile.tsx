import React from 'react';
import { Pressable, Image, Text, View, StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';
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
  const theme = useTheme();
  
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
        { 
          width: size, 
          height: size,
          backgroundColor: theme.colors.surfaceVariant,
          borderColor: cell.isSpotted ? theme.colors.primary : 'transparent'
        },
        cell.isSpotted && { opacity: 0.5 }
      ]}
      onPress={handlePress}
    >
      <Image
        source={cell.tile.image}
        style={[
          styles.image,
          cell.isSpotted && { opacity: 0.5 }
        ]}
        resizeMode="cover"
      />
      
      {cell.isSpotted && (
        <View style={[
          styles.spottedOverlay,
          { backgroundColor: theme.colors.primary }
        ]}>
          <Text style={[styles.spottedText, { color: theme.colors.onPrimary }]}>✓</Text>
        </View>
      )}
      
      {cell.tile.category === 'special' && (
        <View style={[
          styles.specialBadge,
          { backgroundColor: theme.colors.secondary }
        ]}>
          <Text style={[styles.specialText, { color: theme.colors.onSecondary }]}>FREE</Text>
        </View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    padding: 4,
    margin: 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    minHeight: 44,
    minWidth: 44,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: '95%',
    height: '95%',
    borderRadius: 4,
  },
  spottedOverlay: {
    position: 'absolute',
    top: 4,
    right: 4,
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  spottedText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  specialBadge: {
    position: 'absolute',
    top: 4,
    left: 4,
    borderRadius: 4,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  specialText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
});
