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
  const containerPadding = 16; // 4 * 4px spacing unit
  const gridPadding = 8; // 2 * 4px spacing unit
  const tileMargin = 4; // xs spacing
  
  // Account for all padding layers
  const totalSpacing = (containerPadding * 2) + (gridPadding * 2) + (tileMargin * 8);
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
    gap: 4,
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
    gap: 4,
  },
  emptyTile: {
    borderRadius: 8,
    margin: 4,
    borderWidth: 1,
  },
});
