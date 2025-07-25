import React from 'react';
import { View, TouchableOpacity, FlatList, StatusBar, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText, Box } from '@joe111/neo-ui';
import { PhotoGallery } from '../components/Camera/PhotoGallery';
import { useGameStore } from '../stores/gameStore';
import { BottomNavigation } from '../components/BottomNavigation';

interface StatCardProps {
  title: string;
  children: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({ title, children }) => {
  return (
    <Box style={styles.statCard}>
      <ThemedText style={styles.statCardTitle}>{title}</ThemedText>
      {children}
    </Box>
  );
};

interface StatItemProps {
  value: string;
  label: string;
  color?: string;
}

const StatItem: React.FC<StatItemProps> = ({ value, label, color = 'white' }) => {
  return (
    <Box style={styles.statItem}>
      <ThemedText 
        style={[styles.statValue, { color }]}
        numberOfLines={1}
        adjustsFontSizeToFit
      >
        {value}
      </ThemedText>
      <ThemedText style={styles.statLabel}>{label}</ThemedText>
    </Box>
  );
};

interface AchievementProps {
  title: string;
  description: string;
  icon: string;
  completed: boolean;
}

const Achievement: React.FC<AchievementProps> = ({ title, description, icon, completed }) => {
  return (
    <Box style={[styles.achievementCard, completed ? styles.achievementCompleted : styles.achievementLocked]}>
      <Box style={styles.achievementContent}>
        <Box style={[styles.achievementIcon, completed ? styles.achievementIconCompleted : styles.achievementIconLocked]}>
          <ThemedText style={styles.achievementIconText}>{icon}</ThemedText>
        </Box>
        <Box style={styles.achievementText}>
          <ThemedText style={[styles.achievementTitle, { color: completed ? 'white' : '#666' }]}>{title}</ThemedText>
          <ThemedText style={[styles.achievementDescription, { color: completed ? '#ccc' : '#555' }]}>{description}</ThemedText>
        </Box>
        {completed && (
          <Box style={styles.checkmark}>
            <ThemedText style={styles.checkmarkText}>✓</ThemedText>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export const HallOfShameScreen: React.FC = () => {
  const { stats, achievements } = useGameStore();

  const handleBack = () => {
    router.back();
  };

  const handleRefresh = () => {
    // TODO: Implement refresh logic
    console.log('Refreshing stats...');
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
              <View style={styles.scoreExplanation}>
                <ThemedText style={styles.scoreExplanationTitle}>
                  ⏱️ It's a Race Against Time!
                </ThemedText>
                <ThemedText style={styles.scoreExplanationText}>
                  🏆 <ThemedText style={styles.scoreHighlight}>1000 points</ThemedText> base score minus 1 point per second
                </ThemedText>
                <ThemedText style={styles.scoreExplanationText}>
                  ⚡ Minimum <ThemedText style={styles.scoreHighlight}>100 points</ThemedText> for any win (15+ min) • <ThemedText style={styles.scoreHighlight}>0 points</ThemedText> for abandoned games
                </ThemedText>
              </View>
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
          <View style={styles.galleryContainer}>
            <View style={styles.galleryHeader}>
              <ThemedText style={styles.galleryTitle}>📸 Photo Gallery</ThemedText>
            </View>
            <PhotoGallery />
          </View>
        );
    }
    return null;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <ThemedText style={styles.backIcon}>‹</ThemedText>
        </TouchableOpacity>
        <ThemedText style={styles.title}>Hall of Shame</ThemedText>
        <TouchableOpacity onPress={handleRefresh} style={styles.refreshButton}>
          <ThemedText style={styles.refreshIcon}>↻</ThemedText>
        </TouchableOpacity>
      </View>

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
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  refreshButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FF4444',
    justifyContent: 'center',
    alignItems: 'center',
  },
  refreshIcon: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
  },
  flatListContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 100, // Add space for bottom navigation
  },
  statCard: {
    backgroundColor: '#2a2a4a',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
  },
  statCardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
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
    paddingHorizontal: 4,
    paddingVertical: 8,
    justifyContent: 'center',
    minHeight: 60,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
    textAlign: 'center',
    lineHeight: 34,
  },
  statLabel: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    flexWrap: 'wrap',
  },
  scoreExplanation: {
    backgroundColor: '#333',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  scoreExplanationTitle: {
    fontSize: 15,
    color: '#FF4444',
    fontWeight: 'bold',
    textAlign: 'left',
    marginBottom: 8,
  },
  scoreExplanationText: {
    fontSize: 13,
    color: '#ccc',
    marginBottom: 4,
    lineHeight: 18,
  },
  scoreHighlight: {
    color: '#FFD700',
    fontWeight: 'bold',
  },
  achievementsContainer: {
    gap: 12,
  },
  achievementCard: {
    borderRadius: 8,
    padding: 16,
  },
  achievementCompleted: {
    backgroundColor: '#4CAF50',
  },
  achievementLocked: {
    backgroundColor: '#333',
  },
  achievementContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  achievementIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  achievementIconCompleted: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  achievementIconLocked: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  achievementIconText: {
    fontSize: 18,
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
  galleryHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#444',
  },
  galleryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
});
