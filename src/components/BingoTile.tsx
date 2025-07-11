import React from 'react';
import { Pressable, Image, Text, View, StyleSheet } from 'react-native';
import { BingoCell } from '../stores/gameStore';

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
  
  const handlePress = () => {
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
      
      <Text style={[styles.label, cell.isSpotted && styles.spottedLabel]}>
        {cell.tile.name}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#2A2A2A',
    borderRadius: 8,
    padding: 4,
    margin: 2,
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
    width: '80%',
    height: '60%',
    borderRadius: 4,
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
  label: {
    color: '#CCCCCC',
    fontSize: 10,
    textAlign: 'center',
    marginTop: 2,
  },
  spottedLabel: {
    opacity: 0.7,
    textDecorationLine: 'line-through',
  },
});