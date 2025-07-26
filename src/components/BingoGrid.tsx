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
  const containerPadding = 4; // Minimal container padding
  const gridPadding = 6; // Minimal grid padding
  const tileGap = 3; // Small gap between tiles
  
  // Calculate exact tile size for 4x4 grid - 4 tiles + 3 gaps per row
  const availableWidth = screenWidth - (containerPadding * 2) - (gridPadding * 2);
  const totalGapWidth = tileGap * 3; // 3 gaps between 4 tiles
  const tileSize = (availableWidth - totalGapWidth) / 4;
  
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
              style={{
                width: tileSize,
                height: tileSize,
                marginRight: (index + 1) % 4 === 0 ? 0 : tileGap,
                marginBottom: index < 12 ? tileGap : 0,
              }}
            >
              <View
                style={[
                  styles.emptyTile,
                  { 
                    width: '100%', 
                    height: '100%',
                    backgroundColor: theme.colors.surface,
                    borderColor: theme.colors.outline
                  }
                ]}
              />
            </View>
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
          <View
            key={`${cell.tile.id}-${index}`}
            style={{
              width: tileSize,
              height: tileSize,
              marginRight: (index + 1) % 4 === 0 ? 0 : tileGap, // No margin on last tile of each row
              marginBottom: index < 12 ? tileGap : 0, // No margin on last row
            }}
          >
            <BingoTile
              cell={cell}
              onPress={handleTilePress}
              size={tileSize}
            />
          </View>
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
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    width: '100%',
    opacity: 0.5,
  },
  emptyTile: {
    borderRadius: 8,
    borderWidth: 1,
  },
});
