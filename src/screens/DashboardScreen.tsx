import React from 'react';
import { TouchableOpacity, StatusBar, Dimensions, View, Text, ScrollView, Platform, Alert, Linking } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native-unistyles';
import { useConsentDialog } from '../hooks/useConsentDialog';
// import { BottomNavigation } from '../components/BottomNavigation';

const { width: screenWidth } = Dimensions.get('window');

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
      <View style={styles.menuCardContent}>
        <View style={styles.iconContainer}>
          <Text style={styles.iconText}>{icon}</Text>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.menuTitle}>{title}</Text>
          <Text style={styles.menuSubtitle}>{subtitle}</Text>
        </View>
        <View style={styles.chevronContainer}>
          <Text style={styles.chevron}>›</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

interface LinkItemProps {
  icon: string;
  text: string;
  url: string;
}

const LinkItem: React.FC<LinkItemProps> = ({ icon, text, url }) => {
  const handlePress = async () => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Error', 'Unable to open link');
      }
    } catch (error) {
      console.error('Error opening link:', error);
      Alert.alert('Error', 'Unable to open link');
    }
  };

  return (
    <TouchableOpacity style={styles.linkItem} onPress={handlePress} activeOpacity={0.7}>
      <Text style={styles.linkIcon}>{icon}</Text>
      <Text style={styles.linkText}>{text}</Text>
      <Text style={styles.externalIcon}>↗</Text>
    </TouchableOpacity>
  );
};

export const DashboardScreen: React.FC = () => {
  let insets;
  try {
    insets = useSafeAreaInsets();
  } catch (error) {
    // Fallback if SafeAreaProvider is not available
    insets = { top: Platform.OS === 'ios' ? 44 : 24 };
  }

  const { showConsentDialog } = useConsentDialog();

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
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.mainTitle}>DEAD AHEAD</Text>
          <Text style={styles.subtitle}>Roadkill Bingo</Text>
          <Text style={styles.tagline}>
            &quot;See it. Spot it. Shout it. Win shotgun or throw up trying.&quot;
          </Text>
          
          {/* Disclaimer - Top of Fold */}
          <View style={styles.topDisclaimer}>
            <View style={styles.disclaimerContainer}>
              <View style={styles.ratingBadge}>
                <Text style={styles.ratingText}>12+</Text>
              </View>
              <Text style={styles.disclaimerText}>
                Rated 12+ for crude humor and mild violence
              </Text>
            </View>
            <Text style={styles.disclaimerSubtext}>
              No animals were harmed in the making of this game... By Us!
            </Text>
          </View>
        </View>

        {/* Menu Cards */}
        <View style={styles.menuContainer}>
          <MenuCard
            icon={MenuIcons.car}
            title="Play Game"
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
        </View>

        {/* Conservation Section */}
        <View style={styles.conservationContainer}>
          <Text style={styles.conservationTitle}>Help Real Wildlife</Text>
          <Text style={styles.conservationText}>
            Dead Ahead is a cheeky road-trip bingo game — but real roads aren't so funny for wildlife. Thousands of animals are killed every week, and spotting them can help conservation efforts.
          </Text>
          
          <Text style={styles.conservationHeading}>Want to help?</Text>
          <Text style={styles.conservationText}>
            Log your sightings with the Mammals on Roads app by the People's Trust for Endangered Species. Every report helps track wildlife populations and improve road safety.
          </Text>
          
          <View style={styles.linksContainer}>
            <LinkItem 
              icon="📱" 
              text="App Store: PTES Mammals on Roads" 
              url="https://apps.apple.com/gb/app/ptes-mammals-on-roads/id446109227"
            />
            <LinkItem 
              icon="🤖" 
              text="Google Play: Mammals on Roads" 
              url="https://play.google.com/store/apps/details?id=org.ptes.mammalsonroads.v2&hl=en&gl=US&pli=1"
            />
            <LinkItem 
              icon="🌐" 
              text="To find out more about PTES' wider conservation work, visit www.ptes.org" 
              url="https://www.ptes.org"
            />
          </View>
        </View>

      </ScrollView>
      
      {/* <BottomNavigation /> */}
    </View>
  );
};

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 30, // Reduced padding for better spacing
    paddingBottom: 40,
    justifyContent: 'flex-start', // Align to top instead of center
  },
  mainTitle: {
    fontSize: theme.fonts.gigantic,
    fontWeight: 'bold',
    color: '#FF4444',
    letterSpacing: screenWidth * 0.005, // Responsive letter spacing
    textAlign: 'center',
  },
  subtitle: {
    fontSize: theme.fonts.huge,
    color: '#FFD700',
    marginTop: 8,
    textAlign: 'center',
  },
  tagline: {
    fontSize: theme.fonts.md,
    color: '#888',
    textAlign: 'center',
    marginTop: 20,
    paddingHorizontal: 20,
    lineHeight: theme.fonts.md * 1.4, // Responsive line height
  },
  topDisclaimer: {
    alignItems: 'center',
    marginTop: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 80, // Add padding for bottom navigation
  },
  menuContainer: {
    paddingHorizontal: 20,
    gap: 16,
    paddingBottom: 20, // Add space above footer
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
    width: screenWidth * 0.15, // Responsive icon size
    height: screenWidth * 0.15,
    borderRadius: screenWidth * 0.075,
    backgroundColor: '#FF4444',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  iconText: {
    fontSize: theme.fonts.xxl,
    color: 'white',
  },
  textContainer: {
    flex: 1,
  },
  menuTitle: {
    fontSize: theme.fonts.xl,
    fontWeight: '600',
    color: 'white',
    marginBottom: 4,
  },
  menuSubtitle: {
    fontSize: theme.fonts.sm,
    color: '#888',
  },
  chevronContainer: {
    justifyContent: 'center',
  },
  chevron: {
    fontSize: theme.fonts.xxl,
    color: '#666',
    fontWeight: '300',
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
    fontSize: theme.fonts.xs,
    fontWeight: 'bold',
  },
  disclaimerText: {
    fontSize: theme.fonts.xs,
    color: '#888',
  },
  disclaimerSubtext: {
    fontSize: theme.fonts.xs,
    color: '#888',
    textAlign: 'center',
  },
  conservationContainer: {
    backgroundColor: '#2a2a4a',
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 10,
  },
  conservationTitle: {
    fontSize: theme.fonts.xl,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 12,
    textAlign: 'center',
  },
  conservationText: {
    fontSize: theme.fonts.sm,
    color: '#ccc',
    lineHeight: theme.fonts.sm * 1.4,
    marginBottom: 12,
  },
  conservationHeading: {
    fontSize: theme.fonts.md,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 8,
    marginTop: 4,
  },
  linksContainer: {
    marginTop: 8,
    gap: 8,
  },
  linkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#3a3a5a',
    borderRadius: 8,
  },
  linkIcon: {
    fontSize: theme.fonts.md,
    marginRight: 12,
    width: 20,
    textAlign: 'center',
  },
  linkText: {
    fontSize: theme.fonts.sm,
    color: '#FFD700',
    flex: 1,
    lineHeight: theme.fonts.sm * 1.4,
  },
  externalIcon: {
    fontSize: theme.fonts.md,
    color: '#888',
    marginLeft: 8,
  },
}));
