import { create } from 'zustand';
import { GameTile, FREE_RANGE_TILE, getRandomTiles } from '../data/tiles';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface BingoCell {
  tile: GameTile;
  isSpotted: boolean;
  position: number;
}

export interface GameStats {
  gamesPlayed: number;
  gamesWon: number;
  totalScore: number;
  bestStreak: number;
  currentStreak: number;
  photosUploaded: number;
}

export type GoreLevel = 'mild' | 'moderate' | 'extreme';

export interface GameState {
  // Current game state
  currentGrid: BingoCell[];
  gameMode: 'standard' | 'savage';
  isGameWon: boolean;
  gameStartTime: Date | null;
  
  // Settings
  soundEnabled: boolean;
  hapticEnabled: boolean;
  goreLevel: GoreLevel;
  
  // Stats
  stats: GameStats;
  
  // Actions
  startNewGame: () => void;
  toggleTile: (position: number) => void;
  checkWinCondition: () => boolean;
  setGameMode: (mode: 'standard' | 'savage') => void;
  setSoundEnabled: (enabled: boolean) => void;
  setHapticEnabled: (enabled: boolean) => void;
  setGoreLevel: (level: GoreLevel) => void;
  incrementPhotosUploaded: () => void;
  completeGame: (won: boolean) => void;
  loadSettings: () => Promise<void>;
  saveSettings: () => Promise<void>;
}

const generateBingoGrid = (goreLevel: GoreLevel): BingoCell[] => {
  const grid: BingoCell[] = [];
  const randomTiles = getRandomTiles(24, true);
  
  for (let i = 0; i < 25; i++) {
    if (i === 12) {
      // Center tile - Free Range (always spotted)
      grid.push({
        tile: FREE_RANGE_TILE,
        isSpotted: true,
        position: i
      });
    } else {
      const tileIndex = i > 12 ? i - 1 : i;
      grid.push({
        tile: randomTiles[tileIndex],
        isSpotted: false,
        position: i
      });
    }
  }
  
  return grid;
};

const checkWin = (grid: BingoCell[], gameMode: 'standard' | 'savage'): boolean => {
  const winLength = gameMode === 'standard' ? 3 : 4;
  const gridSize = 5;
  
  // Check rows
  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col <= gridSize - winLength; col++) {
      let count = 0;
      for (let i = 0; i < winLength; i++) {
        if (grid[row * gridSize + col + i].isSpotted) {
          count++;
        }
      }
      if (count === winLength) return true;
    }
  }
  
  // Check columns
  for (let col = 0; col < gridSize; col++) {
    for (let row = 0; row <= gridSize - winLength; row++) {
      let count = 0;
      for (let i = 0; i < winLength; i++) {
        if (grid[(row + i) * gridSize + col].isSpotted) {
          count++;
        }
      }
      if (count === winLength) return true;
    }
  }
  
  // Check diagonals (top-left to bottom-right)
  for (let row = 0; row <= gridSize - winLength; row++) {
    for (let col = 0; col <= gridSize - winLength; col++) {
      let count = 0;
      for (let i = 0; i < winLength; i++) {
        if (grid[(row + i) * gridSize + (col + i)].isSpotted) {
          count++;
        }
      }
      if (count === winLength) return true;
    }
  }
  
  // Check diagonals (top-right to bottom-left)
  for (let row = 0; row <= gridSize - winLength; row++) {
    for (let col = winLength - 1; col < gridSize; col++) {
      let count = 0;
      for (let i = 0; i < winLength; i++) {
        if (grid[(row + i) * gridSize + (col - i)].isSpotted) {
          count++;
        }
      }
      if (count === winLength) return true;
    }
  }
  
  return false;
};

export const useGameStore = create<GameState>((set, get) => ({
  // Initial state
  currentGrid: [],
  gameMode: 'standard',
  isGameWon: false,
  gameStartTime: null,
  
  // Settings
  soundEnabled: true,
  hapticEnabled: true,
  goreLevel: 'extreme',
  
  // Stats
  stats: {
    gamesPlayed: 0,
    gamesWon: 0,
    totalScore: 0,
    bestStreak: 0,
    currentStreak: 0,
    photosUploaded: 0
  },
  
  // Actions
  startNewGame: () => {
    const { goreLevel } = get();
    const newGrid = generateBingoGrid(goreLevel);
    
    set({
      currentGrid: newGrid,
      isGameWon: false,
      gameStartTime: new Date()
    });
  },
  
  toggleTile: (position: number) => {
    const { currentGrid, isGameWon } = get();
    
    if (isGameWon) return;
    
    const newGrid = currentGrid.map(cell => 
      cell.position === position 
        ? { ...cell, isSpotted: !cell.isSpotted }
        : cell
    );
    
    set({ currentGrid: newGrid });
    
    // Check for win after updating grid
    const gameWon = get().checkWinCondition();
    if (gameWon) {
      set({ isGameWon: true });
      get().completeGame(true);
    }
  },
  
  checkWinCondition: () => {
    const { currentGrid, gameMode } = get();
    return checkWin(currentGrid, gameMode);
  },
  
  setGameMode: (mode: 'standard' | 'savage') => {
    set({ gameMode: mode });
  },
  
  setSoundEnabled: (enabled: boolean) => {
    set({ soundEnabled: enabled });
    get().saveSettings();
  },
  
  setHapticEnabled: (enabled: boolean) => {
    set({ hapticEnabled: enabled });
    get().saveSettings();
  },
  
  setGoreLevel: (level: GoreLevel) => {
    // Force extreme mode - other levels are disabled
    set({ goreLevel: 'extreme' });
    get().saveSettings();
  },
  
  incrementPhotosUploaded: () => {
    const { stats } = get();
    set({
      stats: {
        ...stats,
        photosUploaded: stats.photosUploaded + 1
      }
    });
  },
  
  completeGame: (won: boolean) => {
    const { stats, gameStartTime } = get();
    const gameEndTime = new Date();
    const gameDuration = gameStartTime 
      ? gameEndTime.getTime() - gameStartTime.getTime()
      : 0;
    
    const gameScore = won ? Math.max(1000 - Math.floor(gameDuration / 1000), 100) : 0;
    
    const newStreak = won ? stats.currentStreak + 1 : 0;
    const newBestStreak = Math.max(stats.bestStreak, newStreak);
    
    set({
      stats: {
        ...stats,
        gamesPlayed: stats.gamesPlayed + 1,
        gamesWon: won ? stats.gamesWon + 1 : stats.gamesWon,
        totalScore: stats.totalScore + gameScore,
        currentStreak: newStreak,
        bestStreak: newBestStreak
      }
    });
  },

  loadSettings: async () => {
    try {
      const settingsData = await AsyncStorage.getItem('game_settings');
      if (settingsData) {
        const settings = JSON.parse(settingsData);
        set({
          soundEnabled: settings.soundEnabled ?? true,
          hapticEnabled: settings.hapticEnabled ?? true,
          goreLevel: settings.goreLevel ?? 'extreme',
        });
        console.log('✅ Settings loaded from storage');
      }
    } catch (error) {
      console.warn('⚠️ Failed to load settings:', error);
    }
  },

  saveSettings: async () => {
    try {
      const { soundEnabled, hapticEnabled, goreLevel } = get();
      const settings = {
        soundEnabled,
        hapticEnabled,
        goreLevel,
      };
      await AsyncStorage.setItem('game_settings', JSON.stringify(settings));
      console.log('💾 Settings saved to storage');
    } catch (error) {
      console.warn('⚠️ Failed to save settings:', error);
    }
  }
}));