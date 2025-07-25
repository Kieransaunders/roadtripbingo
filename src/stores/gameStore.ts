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
  fastestTime: number; // in milliseconds
  highestCompletion: number; // percentage
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: Date;
  progress: number; // 0-100 percentage
  target: number; // target value to unlock
}

export interface AchievementProgress {
  [key: string]: Achievement;
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
  longRoadTripEnabled: boolean;
  
  // Stats
  stats: GameStats;
  
  // Achievements
  achievements: AchievementProgress;
  
  // Actions
  startNewGame: () => void;
  toggleTile: (position: number) => void;
  checkWinCondition: () => boolean;
  setGameMode: (mode: 'standard' | 'savage') => void;
  setSoundEnabled: (enabled: boolean) => void;
  setHapticEnabled: (enabled: boolean) => void;
  setGoreLevel: (level: GoreLevel) => void;
  setLongRoadTripEnabled: (enabled: boolean) => void;
  incrementPhotosUploaded: () => void;
  completeGame: (won: boolean) => void;
  loadSettings: () => Promise<void>;
  saveSettings: () => Promise<void>;
  
  // Achievement Actions
  checkAchievements: () => Achievement[];
  unlockAchievement: (achievementId: string) => void;
  getAchievementProgress: (achievementId: string) => Achievement | null;
}

const generateBingoGrid = (goreLevel: GoreLevel): BingoCell[] => {
  const grid: BingoCell[] = [];
  const randomTiles = getRandomTiles(15, true); // 15 random tiles + 1 free range = 16 total
  
  // Middle positions in 4x4 grid: 5, 6, 9, 10
  const middlePositions = [5, 6, 9, 10];
  const freeRangePosition = middlePositions[Math.floor(Math.random() * middlePositions.length)];
  
  for (let i = 0; i < 16; i++) {
    if (i === freeRangePosition) {
      // Middle tile - Free Range (always spotted)
      grid.push({
        tile: FREE_RANGE_TILE,
        isSpotted: true,
        position: i
      });
    } else {
      const tileIndex = i > freeRangePosition ? i - 1 : i;
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
  const gridSize = 4;
  
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

// Default achievements
const createDefaultAchievements = (): AchievementProgress => ({
  'first-blood': {
    id: 'first-blood',
    title: 'First Blood',
    description: 'Win your first game',
    icon: '🏆',
    unlocked: false,
    progress: 0,
    target: 1,
  },
  'shutterbug': {
    id: 'shutterbug',
    title: 'Shutterbug',
    description: 'Take 10 photos',
    icon: '📷',
    unlocked: false,
    progress: 0,
    target: 10,
  },
  'winning-streak': {
    id: 'winning-streak',
    title: 'Winning Streak',
    description: 'Win 5 games in a row',
    icon: '💧',
    unlocked: false,
    progress: 0,
    target: 5,
  },
  'roadkill-spotter': {
    id: 'roadkill-spotter',
    title: 'Roadkill Spotter',
    description: 'Play 10 games',
    icon: '🎮',
    unlocked: false,
    progress: 0,
    target: 10,
  },
  'speed-demon': {
    id: 'speed-demon',
    title: 'Speed Demon',
    description: 'Win a game in under 30 seconds',
    icon: '⚡',
    unlocked: false,
    progress: 0,
    target: 30000, // 30 seconds in milliseconds
  },
  'perfectionist': {
    id: 'perfectionist',
    title: 'Perfectionist',
    description: 'Complete 100% of tiles in a game',
    icon: '💎',
    unlocked: false,
    progress: 0,
    target: 100,
  },
});

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
  longRoadTripEnabled: false,
  
  // Stats
  stats: {
    gamesPlayed: 0,
    gamesWon: 0,
    totalScore: 0,
    bestStreak: 0,
    currentStreak: 0,
    photosUploaded: 0,
    fastestTime: Infinity,
    highestCompletion: 0
  },
  
  // Achievements
  achievements: createDefaultAchievements(),
  
  // Actions
  startNewGame: () => {
    const { goreLevel, longRoadTripEnabled, gameStartTime } = get();
    
    // If there was a previous game in progress, count it as abandoned
    if (gameStartTime && !get().isGameWon) {
      console.log('📊 Previous game abandoned, updating stats...');
      get().completeGame(false); // This will count as a game played but not won
    }
    
    const newGrid = generateBingoGrid(goreLevel);
    
    set({
      currentGrid: newGrid,
      isGameWon: false,
      gameStartTime: new Date(),
      gameMode: longRoadTripEnabled ? 'savage' : 'standard'
    });
    
    console.log('🎮 New game started!');
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
  
  setLongRoadTripEnabled: (enabled: boolean) => {
    set({ 
      longRoadTripEnabled: enabled,
      gameMode: enabled ? 'savage' : 'standard'
    });
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
    
    // Check for achievements after updating photo count
    get().checkAchievements();
    
    // Save updated stats
    get().saveSettings();
  },
  
  completeGame: (won: boolean) => {
    const { stats, gameStartTime, currentGrid } = get();
    const gameEndTime = new Date();
    const gameDuration = gameStartTime 
      ? gameEndTime.getTime() - gameStartTime.getTime()
      : 0;
    
    const gameScore = won ? Math.max(1000 - Math.floor(gameDuration / 1000), 100) : 0;
    
    const newStreak = won ? stats.currentStreak + 1 : 0;
    const newBestStreak = Math.max(stats.bestStreak, newStreak);
    
    // Calculate completion percentage
    const spottedCount = currentGrid.filter(cell => cell.isSpotted).length;
    const completionPercentage = Math.round((spottedCount / currentGrid.length) * 100);
    
    // Update fastest time if this was a win
    const newFastestTime = won && gameDuration < stats.fastestTime ? gameDuration : stats.fastestTime;
    const newHighestCompletion = Math.max(stats.highestCompletion, completionPercentage);
    
    set({
      stats: {
        ...stats,
        gamesPlayed: stats.gamesPlayed + 1,
        gamesWon: won ? stats.gamesWon + 1 : stats.gamesWon,
        totalScore: stats.totalScore + gameScore,
        currentStreak: newStreak,
        bestStreak: newBestStreak,
        fastestTime: newFastestTime,
        highestCompletion: newHighestCompletion
      }
    });
    
    // Check for achievements after updating stats
    get().checkAchievements();
    
    // Save updated stats and achievements
    get().saveSettings();
  },

  loadSettings: async () => {
    try {
      const settingsData = await AsyncStorage.getItem('game_settings');
      const achievementsData = await AsyncStorage.getItem('game_achievements');
      const statsData = await AsyncStorage.getItem('game_stats');
      
      if (settingsData) {
        const settings = JSON.parse(settingsData);
        const longRoadTripEnabled = settings.longRoadTripEnabled ?? false;
        set({
          soundEnabled: settings.soundEnabled ?? true,
          hapticEnabled: settings.hapticEnabled ?? true,
          goreLevel: settings.goreLevel ?? 'extreme',
          longRoadTripEnabled,
          gameMode: longRoadTripEnabled ? 'savage' : 'standard'
        });
        console.log('✅ Settings loaded from storage');
      }
      
      if (achievementsData) {
        const achievements = JSON.parse(achievementsData);
        set({ achievements });
        console.log('✅ Achievements loaded from storage');
      }
      
      if (statsData) {
        const stats = JSON.parse(statsData);
        set({ stats });
        console.log('✅ Stats loaded from storage');
      }
    } catch (error) {
      console.warn('⚠️ Failed to load settings:', error);
    }
  },

  saveSettings: async () => {
    try {
      const { soundEnabled, hapticEnabled, goreLevel, longRoadTripEnabled, achievements, stats } = get();
      
      const settings = {
        soundEnabled,
        hapticEnabled,
        goreLevel,
        longRoadTripEnabled,
      };
      
      await AsyncStorage.setItem('game_settings', JSON.stringify(settings));
      await AsyncStorage.setItem('game_achievements', JSON.stringify(achievements));
      await AsyncStorage.setItem('game_stats', JSON.stringify(stats));
      
      console.log('💾 Settings, achievements, and stats saved to storage');
    } catch (error) {
      console.warn('⚠️ Failed to save settings:', error);
    }
  },

  // Achievement Actions
  checkAchievements: () => {
    const { stats, achievements } = get();
    const newlyUnlocked: Achievement[] = [];
    const updatedAchievements = { ...achievements };

    // Check each achievement
    Object.keys(updatedAchievements).forEach(key => {
      const achievement = updatedAchievements[key];
      if (achievement.unlocked) return; // Skip already unlocked achievements

      let progress = 0;
      let shouldUnlock = false;

      switch (achievement.id) {
        case 'first-blood':
          progress = Math.min(stats.gamesWon, achievement.target);
          shouldUnlock = stats.gamesWon >= achievement.target;
          break;
        case 'shutterbug':
          progress = Math.min(stats.photosUploaded, achievement.target);
          shouldUnlock = stats.photosUploaded >= achievement.target;
          break;
        case 'winning-streak':
          progress = Math.min(stats.currentStreak, achievement.target);
          shouldUnlock = stats.currentStreak >= achievement.target;
          break;
        case 'roadkill-spotter':
          progress = Math.min(stats.gamesPlayed, achievement.target);
          shouldUnlock = stats.gamesPlayed >= achievement.target;
          break;
        case 'speed-demon':
          progress = stats.fastestTime < achievement.target ? achievement.target : 0;
          shouldUnlock = stats.fastestTime < achievement.target && stats.fastestTime !== Infinity;
          break;
        case 'perfectionist':
          progress = Math.min(stats.highestCompletion, achievement.target);
          shouldUnlock = stats.highestCompletion >= achievement.target;
          break;
      }

      // Update progress
      updatedAchievements[key] = {
        ...achievement,
        progress: Math.round((progress / achievement.target) * 100)
      };

      // Check if should unlock
      if (shouldUnlock && !achievement.unlocked) {
        updatedAchievements[key] = {
          ...updatedAchievements[key],
          unlocked: true,
          unlockedAt: new Date()
        };
        newlyUnlocked.push(updatedAchievements[key]);
      }
    });

    // Update achievements in state
    set({ achievements: updatedAchievements });

    return newlyUnlocked;
  },

  unlockAchievement: (achievementId: string) => {
    const { achievements } = get();
    const achievement = achievements[achievementId];
    
    if (achievement && !achievement.unlocked) {
      set({
        achievements: {
          ...achievements,
          [achievementId]: {
            ...achievement,
            unlocked: true,
            unlockedAt: new Date(),
            progress: 100
          }
        }
      });
    }
  },

  getAchievementProgress: (achievementId: string) => {
    const { achievements } = get();
    return achievements[achievementId] || null;
  }
}));