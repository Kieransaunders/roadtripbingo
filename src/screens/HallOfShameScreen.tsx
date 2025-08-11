import React from 'react';
import { View, FlatList, StatusBar, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, Text, IconButton, Chip, Button, Surface, Divider, useTheme } from 'react-native-paper';
import { IconSymbol } from '../components/ui/IconSymbol';
import { PhotoGallery } from '../components/Camera/PhotoGallery';
import { useGameStore } from '../stores/gameStore';
import { BottomNavigation } from '../components/BottomNavigation';

// Map emoji achievement icons to modern icons
const achievementIconMap: Record<string, string> = {
  '🏆': 'trophy.fill',
  '📷': 'camera.fill',
  '💧': 'heart.fill', // Using heart for "blood" metaphor
  '🎮': 'gamecontroller.fill',
  '⚡': 'heart.fill', // Using heart for energy/speed
  '💎': 'checkmark.circle.fill', // Using checkmark for perfection
};

interface StatCardProps {
  title: string;
  children: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({ title, children }) => {
  return (
    <Card style={styles.statCard} mode="contained">
      <Card.Content>
        <Text variant="headlineSmall" style={styles.statCardTitle}>{title}</Text>
        {children}
      </Card.Content>
    </Card>
  );
};

interface StatItemProps {
  value: string;
  label: string;
  color?: string;
}

const StatItem: React.FC<StatItemProps> = ({ value, label, color = 'white' }) => {
  return (
    <Surface style={styles.statItem} elevation={1}>
      <Text 
        variant="headlineSmall"
        style={[styles.statValue, { color }]}
        numberOfLines={1}
      >
        {value}
      </Text>
      <Text variant="bodyMedium" style={styles.statLabel}>{label}</Text>
    </Surface>
  );
};

interface AchievementProps {
  title: string;
  description: string;
  icon: string;
  completed: boolean;
}

const Achievement: React.FC<AchievementProps> = ({ title, description, icon, completed }) => {
  const theme = useTheme();
  
  return (
    <Card 
      style={[styles.achievementCard, { 
        backgroundColor: completed ? theme.colors.primaryContainer : theme.colors.surfaceDisabled 
      }]}
      mode="contained"
    >
      <Card.Content style={styles.achievementContent}>
        <Surface 
          style={[styles.achievementIcon, {
            backgroundColor: completed ? theme.colors.primary : theme.colors.surfaceVariant
          }]}
          elevation={2}
        >
          <IconSymbol 
            name={(achievementIconMap[icon] || icon) as any} 
            size={24} 
            color={completed ? theme.colors.onPrimary : theme.colors.onSurfaceVariant}
          />
        </Surface>
        <View style={styles.achievementText}>
          <Text 
            variant="titleMedium" 
            style={{ color: completed ? theme.colors.onPrimaryContainer : theme.colors.onSurfaceDisabled }}
          >
            {title}
          </Text>
          <Text 
            variant="bodyMedium" 
            style={{ color: completed ? theme.colors.onPrimaryContainer : theme.colors.onSurfaceDisabled }}
          >
            {description}
          </Text>
        </View>
        {completed && (
          <Chip icon="check" mode="flat" compact>
            Done
          </Chip>
        )}
      </Card.Content>
    </Card>
  );
};

export const PhotoGalleryScreen: React.FC = () => {
  const { stats, achievements, loadSettings, checkAchievements } = useGameStore();

  const handleBack = () => {
    router.back();
  };

  const handleRefresh = async () => {
    console.log('🔄 Refreshing Hall of Shame stats...');
    try {
      // Reload all data from storage
      await loadSettings();
      
      // Check for any new achievements that might have been unlocked
      checkAchievements();
      
      console.log('✅ Hall of Shame refreshed successfully');
    } catch (error) {
      console.error('❌ Failed to refresh Hall of Shame:', error);
    }
  };

  // Format time display
  const formatTime = (milliseconds: number): string => {
    if (milliseconds === Infinity) return "--:--";
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Calculate win rate
  const winRate = stats.gamesPlayed > 0 ? Math.round((stats.gamesWon / stats.gamesPlayed) * 100) : 0;

  // Create data array for FlatList
  const screenData = [
    { id: 'road-trip-stats', type: 'stat-card', title: 'Road Trip Stats' },
    { id: 'scoring', type: 'stat-card', title: 'Scoring' },
    { id: 'streaks', type: 'stat-card', title: 'Streaks' },
    { id: 'achievements', type: 'stat-card', title: 'Achievements' },
    { id: 'photo-gallery', type: 'photo-gallery', title: 'Photo Gallery' },
  ];

  const renderItem = ({ item }: { item: any }) => {
    switch (item.type) {
      case 'stat-card':
        if (item.id === 'road-trip-stats') {
          return (
            <StatCard title="Road Trip Stats">
              <View style={styles.statRow}>
                <StatItem value={stats.gamesPlayed.toString()} label="Games" color="white" />
                <StatItem value={stats.gamesWon.toString()} label="Wins" color="#4CAF50" />
                <StatItem value={`${winRate}%`} label="Win Rate" color="#2196F3" />
              </View>
            </StatCard>
          );
        } else if (item.id === 'scoring') {
          return (
            <StatCard title="Scoring">
              <Card style={styles.scoreExplanation} mode="outlined">
                <Card.Content>
                  <View style={styles.scoreExplanationHeader}>
                    <IconSymbol name="clock.fill" size={18} color="#FF4444" />
                    <Text variant="titleMedium" style={styles.scoreExplanationTitle}>
                      It's a Race Against Time!
                    </Text>
                  </View>
                  <View style={styles.scoreExplanationItem}>
                    <IconSymbol name="trophy.fill" size={16} color="#FFD700" />
                    <Text variant="bodyMedium" style={styles.scoreExplanationText}>
                      <Text style={styles.scoreHighlight}>1000 points</Text> base score minus 1 point per second
                    </Text>
                  </View>
                  <View style={styles.scoreExplanationItem}>
                    <IconSymbol name="bolt.fill" size={16} color="#FF9800" />
                    <Text variant="bodyMedium" style={styles.scoreExplanationText}>
                      Minimum <Text style={styles.scoreHighlight}>100 points</Text> for any win (15+ min) • <Text style={styles.scoreHighlight}>0 points</Text> for abandoned games
                    </Text>
                  </View>
                </Card.Content>
              </Card>
              <View style={styles.statRow}>
                <StatItem value={stats.totalScore.toLocaleString()} label="Total Score" color="#FFD700" />
                <StatItem value={stats.gamesPlayed > 0 ? Math.round(stats.totalScore / stats.gamesPlayed).toString() : "0"} label="Avg Score" color="#9C27B0" />
                <StatItem value={stats.photosUploaded.toString()} label="Photos" color="#FF4444" />
              </View>
            </StatCard>
          );
        } else if (item.id === 'streaks') {
          return (
            <StatCard title="Streaks">
              <View style={styles.statRow}>
                <StatItem value={stats.bestStreak.toString()} label="Best Streak" color="#FF9800" />
                <StatItem value={stats.currentStreak.toString()} label="Current" color="#00BCD4" />
                <StatItem value={formatTime(stats.fastestTime)} label="Best Time" color="#E91E63" />
              </View>
            </StatCard>
          );
        } else if (item.id === 'achievements') {
          return (
            <StatCard title="Achievements">
              <View style={styles.achievementsContainer}>
                {Object.values(achievements).map((achievement) => (
                  <Achievement
                    key={achievement.id}
                    title={achievement.title}
                    description={achievement.description}
                    icon={achievement.icon}
                    completed={achievement.unlocked}
                  />
                ))}
              </View>
            </StatCard>
          );
        }
        break;
      case 'photo-gallery':
        return (
          <Card style={styles.galleryContainer} mode="contained">
            <PhotoGallery />
          </Card>
        );
    }
    return null;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />
      
      {/* Header */}
      <Surface style={styles.header} elevation={2}>
        <IconButton 
          icon="arrow-left" 
          size={24}
          onPress={handleBack}
          style={styles.backButton}
          iconColor="white"
        />
        <Text variant="headlineMedium" style={styles.title}>Hall of Shame</Text>
        <IconButton 
          icon="refresh" 
          size={24}
          onPress={handleRefresh}
          style={styles.refreshButton}
          iconColor="white"
        />
      </Surface>

      <FlatList
        data={screenData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.flatListContent}
      />
      
      <BottomNavigation />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#2a2a4a',
  },
  backButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  title: {
    color: 'white',
    textAlign: 'center',
  },
  refreshButton: {
    backgroundColor: '#FF4444',
  },
  flatListContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 100, // Add space for bottom navigation
  },
  statCard: {
    marginBottom: 16,
    marginHorizontal: 0,
  },
  statCardTitle: {
    color: 'white',
    marginBottom: 16,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
    margin: 4,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    minHeight: 80,
    justifyContent: 'center',
  },
  statValue: {
    fontWeight: 'bold',
    marginBottom: 4,
    textAlign: 'center',
    lineHeight: 34,
  },
  statLabel: {
    color: '#888',
    textAlign: 'center',
  },
  scoreExplanation: {
    marginBottom: 16,
  },
  scoreExplanationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  scoreExplanationTitle: {
    fontSize: 15,
    color: '#FF4444',
    fontWeight: 'bold',
    flex: 1,
  },
  scoreExplanationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  scoreExplanationText: {
    fontSize: 13,
    color: '#ccc',
    lineHeight: 18,
    flex: 1,
  },
  scoreHighlight: {
    color: '#FFD700',
    fontWeight: 'bold',
  },
  achievementsContainer: {
    gap: 12,
  },
  achievementCard: {
    marginBottom: 12,
  },
  achievementContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  achievementIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  achievementText: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  achievementDescription: {
    fontSize: 14,
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  galleryContainer: {
    backgroundColor: '#2a2a4a',
    borderRadius: 12,
    marginBottom: 20,
    overflow: 'hidden',
  },
});
