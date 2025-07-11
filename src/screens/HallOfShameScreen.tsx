import React from 'react';
import { View, TouchableOpacity, ScrollView, StatusBar, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText, ThemedView, Box } from '@joe111/neo-ui';

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
      <ThemedText style={[styles.statValue, { color }]}>{value}</ThemedText>
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

  const handleBack = () => {
    router.back();
  };

  const handleRefresh = () => {
    // TODO: Implement refresh logic
    console.log('Refreshing stats...');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />
      
      {/* Header */}
      <Box style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <ThemedText style={styles.backIcon}>‹</ThemedText>
        </TouchableOpacity>
        <ThemedText style={styles.title}>Hall of Shame</ThemedText>
        <TouchableOpacity onPress={handleRefresh} style={styles.refreshButton}>
          <ThemedText style={styles.refreshIcon}>↻</ThemedText>
        </TouchableOpacity>
      </Box>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Road Trip Stats */}
        <StatCard title="Road Trip Stats">
          <View style={styles.statRow}>
            <StatItem value="8" label="Games" color="white" />
            <StatItem value="7" label="Wins" color="#4CAF50" />
            <StatItem value="87.5%" label="Win Rate" color="#2196F3" />
          </View>
        </StatCard>

        {/* Scoring */}
        <StatCard title="Scoring">
          <View style={styles.statRow}>
            <StatItem value="590" label="Total Score" color="#FFD700" />
            <StatItem value="74" label="Avg Score" color="#9C27B0" />
            <StatItem value="0" label="Photos" color="#FF4444" />
          </View>
        </StatCard>

        {/* Streaks */}
        <StatCard title="Streaks">
          <View style={styles.statRow}>
            <StatItem value="4" label="Best Streak" color="#FF9800" />
            <StatItem value="4" label="Current" color="#00BCD4" />
            <StatItem value="0:03" label="Best Time" color="#E91E63" />
          </View>
        </StatCard>

        {/* Achievements */}
        <StatCard title="Achievements">
          <View style={styles.achievementsContainer}>
            <Achievement
              title="First Blood"
              description="Win your first game"
              icon="🏆"
              completed={true}
            />
            <Achievement
              title="Shutterbug"
              description="Take 10 photos"
              icon="📷"
              completed={false}
            />
            <Achievement
              title="Winning Streak"
              description="Win 5 games in a row"
              icon="💧"
              completed={false}
            />
          </View>
        </StatCard>
      </ScrollView>
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
  content: {
    flex: 1,
    paddingHorizontal: 20,
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
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
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
});
