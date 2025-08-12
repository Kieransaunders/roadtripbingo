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
    // Play blood splatter sound for all tile presses
    if (!cell.isSpotted) {
      await soundManager.playBloodSplatterSound();
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
      <View style={styles.imageContainer}>
        <Image
          source={cell.tile.image}
          style={[
            styles.image,
            cell.isSpotted && { opacity: 0.5 }
          ]}
          resizeMode="cover"
        />
      </View>
      
      {/* Tile Name */}
      <View style={styles.nameContainer}>
        <Text 
          style={[
            styles.tileName, 
            { color: theme.colors.onSurfaceVariant }
          ]} 
          numberOfLines={2}
        >
          {cell.tile.name}
        </Text>
      </View>
      
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
    borderWidth: 2,
    flex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    justifyContent: 'space-between',
  },
  imageContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  image: {
    width: '95%',
    height: '100%',
    borderRadius: 4,
  },
  nameContainer: {
    paddingHorizontal: 2,
    paddingVertical: 2,
    minHeight: 24,
    justifyContent: 'center',
  },
  tileName: {
    fontSize: 9,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 10,
    letterSpacing: 0.2,
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
