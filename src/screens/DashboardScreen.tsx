import React from 'react';
import { View, TouchableOpacity, StatusBar, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText, ThemedView, Box } from '@joe111/neo-ui';

// Icons (using simple Unicode symbols for now - can be replaced with proper icon library)
const MenuIcons = {
  car: '🚗',
  camera: '📷', 
  trophy: '🏆',
  settings: '⚙️',
};

interface MenuCardProps {
  icon: string;
  title: string;
  subtitle: string;
  onPress: () => void;
}

const MenuCard: React.FC<MenuCardProps> = ({ icon, title, subtitle, onPress }) => {
  return (
    <TouchableOpacity style={styles.menuCard} onPress={onPress} activeOpacity={0.8}>
      <Box style={styles.menuCardContent}>
        <Box style={styles.iconContainer}>
          <ThemedText style={styles.iconText}>{icon}</ThemedText>
        </Box>
        <Box style={styles.textContainer}>
          <ThemedText style={styles.menuTitle}>{title}</ThemedText>
          <ThemedText style={styles.menuSubtitle}>{subtitle}</ThemedText>
        </Box>
        <Box style={styles.chevronContainer}>
          <ThemedText style={styles.chevron}>›</ThemedText>
        </Box>
      </Box>
    </TouchableOpacity>
  );
};

export const DashboardScreen: React.FC = () => {

  const handleMenuPress = (screen: string) => {
    switch (screen) {
      case 'game':
        router.push('/game');
        break;
      case 'camera':
        router.push('/camera');
        break;
      case 'hall-of-shame':
        router.push('/hall-of-shame');
        break;
      case 'settings':
        router.push('/settings');
        break;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />
      
      {/* Header */}
      <Box style={styles.header}>
        <ThemedText style={styles.mainTitle}>DEAD AHEAD</ThemedText>
        <ThemedText style={styles.subtitle}>Roadkill Bingo</ThemedText>
        <ThemedText style={styles.tagline}>
          "See it. Spot it. Shout it. Win shotgun or throw up trying."
        </ThemedText>
      </Box>

      {/* Menu Cards */}
      <Box style={styles.menuContainer}>
        <MenuCard
          icon={MenuIcons.car}
          title="Solo Road Trip"
          subtitle="Practice your spotting skills"
          onPress={() => handleMenuPress('game')}
        />
        
        <MenuCard
          icon={MenuIcons.camera}
          title="Snap the Splat!"
          subtitle="Use camera to validate finds"
          onPress={() => handleMenuPress('camera')}
        />
        
        <MenuCard
          icon={MenuIcons.trophy}
          title="Hall of Shame"
          subtitle="View your achievements"
          onPress={() => handleMenuPress('hall-of-shame')}
        />
        
        <MenuCard
          icon={MenuIcons.settings}
          title="Settings"
          subtitle="Gore level & sound options"
          onPress={() => handleMenuPress('settings')}
        />
      </Box>

      {/* Footer Disclaimer */}
      <Box style={styles.footer}>
        <Box style={styles.disclaimerContainer}>
          <Box style={styles.ratingBadge}>
            <ThemedText style={styles.ratingText}>12+</ThemedText>
          </Box>
          <ThemedText style={styles.disclaimerText}>
            Rated 12+ for crude humor and mild violence
          </ThemedText>
        </Box>
        <ThemedText style={styles.disclaimerSubtext}>
          No animals were harmed in the making of this game
        </ThemedText>
      </Box>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 60,
  },
  mainTitle: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FF4444',
    letterSpacing: 2,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 28,
    color: '#FFD700',
    marginTop: 8,
    textAlign: 'center',
  },
  tagline: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginTop: 20,
    paddingHorizontal: 20,
    lineHeight: 22,
  },
  menuContainer: {
    flex: 1,
    paddingHorizontal: 20,
    gap: 16,
  },
  menuCard: {
    backgroundColor: '#2a2a4a',
    borderRadius: 12,
    overflow: 'hidden',
  },
  menuCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FF4444',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  iconText: {
    fontSize: 24,
    color: 'white',
  },
  textContainer: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: 'white',
    marginBottom: 4,
  },
  menuSubtitle: {
    fontSize: 14,
    color: '#888',
  },
  chevronContainer: {
    justifyContent: 'center',
  },
  chevron: {
    fontSize: 24,
    color: '#666',
    fontWeight: '300',
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    alignItems: 'center',
  },
  disclaimerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingBadge: {
    backgroundColor: '#FF4444',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 8,
  },
  ratingText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  disclaimerText: {
    fontSize: 12,
    color: '#888',
  },
  disclaimerSubtext: {
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
  },
});
