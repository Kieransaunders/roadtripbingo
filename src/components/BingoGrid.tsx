import React from 'react';
import { View, Dimensions, StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';
import { BingoTile } from './BingoTile';
import { useGameStore } from '../stores/gameStore';

interface BingoGridProps {
  onTilePress?: (position: number) => void;
}

export const BingoGrid: React.FC<BingoGridProps> = ({ onTilePress }) => {
  const { currentGrid, toggleTile } = useGameStore();
  const theme = useTheme();
  
  const screenWidth = Dimensions.get('window').width;
  const containerPadding = 2; // Minimal container padding
  const gridPadding = 1; // Minimal grid padding
  const tileGap = 1; // Small gap between tiles
  
  // Account for all padding layers - 4x4 grid with minimal spacing
  const totalSpacing = (containerPadding * 2) + (gridPadding * 2) + (tileGap * 3 * 2); // 3 gaps horizontally and vertically
  const tileSize = (screenWidth - totalSpacing) / 4;
  
  const handleTilePress = (position: number) => {
    toggleTile(position);
    onTilePress?.(position);
  };

  if (!currentGrid || currentGrid.length === 0) {
    return (
      <View style={[styles.emptyContainer, { paddingHorizontal: containerPadding }]}>
        <View style={[
          styles.emptyGrid, 
          { 
            backgroundColor: theme.colors.surfaceVariant,
            padding: gridPadding,
            borderRadius: 8
          }
        ]}>
          {Array.from({ length: 16 }, (_, index) => (
            <View
              key={index}
              style={[
                styles.emptyTile,
                { 
                  width: tileSize, 
                  height: tileSize,
                  backgroundColor: theme.colors.surface,
                  borderColor: theme.colors.outline
                }
              ]}
            />
          ))}
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingHorizontal: containerPadding }]}>
      <View style={[
        styles.grid,
        {
          backgroundColor: theme.colors.surface,
          padding: gridPadding,
          borderRadius: 8
        }
      ]}>
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
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    maxWidth: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    gap: 1,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    maxWidth: '100%',
    opacity: 0.5,
    gap: 2,
  },
  emptyTile: {
    borderRadius: 8,
    margin: 4,
    borderWidth: 1,
  },
});
