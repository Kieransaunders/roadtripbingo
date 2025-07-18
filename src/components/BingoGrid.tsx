import React from 'react';
import { View, Dimensions, StyleSheet } from 'react-native';
import { BingoTile } from './BingoTile';
import { useGameStore } from '../stores/gameStore';

interface BingoGridProps {
  onTilePress?: (position: number) => void;
}

export const BingoGrid: React.FC<BingoGridProps> = ({ onTilePress }) => {
  const { currentGrid, toggleTile } = useGameStore();
  
  const screenWidth = Dimensions.get('window').width;
  const containerPadding = 10; // paddingHorizontal on container
  const gridPadding = 8; // padding on grid
  const tileMargin = 1; // margin on each tile
  
  // Account for all padding layers:
  // Container: 10px × 2 = 20px
  // Grid: 8px × 2 = 16px  
  // Tile margins: 1px × 2 × 4 tiles = 8px
  const totalSpacing = (containerPadding * 2) + (gridPadding * 2) + (tileMargin * 8);
  const tileSize = (screenWidth - totalSpacing) / 4;
  
  const handleTilePress = (position: number) => {
    toggleTile(position);
    onTilePress?.(position);
  };

  if (!currentGrid || currentGrid.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <View style={styles.emptyGrid}>
          {Array.from({ length: 16 }, (_, index) => (
            <View
              key={index}
              style={[
                styles.emptyTile,
                { width: tileSize, height: tileSize }
              ]}
            />
          ))}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {currentGrid.map((cell, index) => (
          <BingoTile
            key={`${cell.tile.id}-${index}`}
            cell={cell}
            onPress={handleTilePress}
            size={tileSize}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    maxWidth: '100%',
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  emptyGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    maxWidth: '100%',
    backgroundColor: '#2A2A2A',
    borderRadius: 12,
    padding: 8,
    opacity: 0.5,
  },
  emptyTile: {
    backgroundColor: '#1A1A1A',
    borderRadius: 8,
    margin: 2,
    borderWidth: 1,
    borderColor: '#CCCCCC20',
  },
});