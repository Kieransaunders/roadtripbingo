import React from 'react';
import { StatusBar, Dimensions, View, ScrollView, Platform, Alert, Linking, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { 
  IconButton, 
  Surface, 
  List, 
  useTheme, 
  Text, 
  Card
} from 'react-native-paper';
import { IconSymbol } from '../components/ui/IconSymbol';
import { useConsentDialog } from '../hooks/useConsentDialog';
// import { BottomNavigation } from '../components/BottomNavigation';

const { width: screenWidth } = Dimensions.get('window');

// Modern SF Symbol/Material Design icons
const MenuIcons = {
  car: 'car',
  camera: 'camera.fill', 
  trophy: 'trophy.fill',
  gear: 'gearshape.fill',
} as const;

interface MenuCardProps {
  icon: keyof typeof MenuIcons;
  title: string;
  subtitle: string;
  onPress: () => void;
}

const MenuCard: React.FC<MenuCardProps> = ({ icon, title, subtitle, onPress }) => {
  const theme = useTheme();
  
  return (
    <Card mode="elevated" onPress={onPress} style={styles.menuCard}>
      <Card.Content style={styles.menuCardContent}>
        <Surface style={[styles.iconContainer, { backgroundColor: theme.colors.primary }]} elevation={2}>
          <IconSymbol 
            name={MenuIcons[icon]} 
            size={32} 
            color={theme.colors.onPrimary}
          />
        </Surface>
        <View style={styles.textContainer}>
          <Text variant="titleMedium" style={[styles.menuTitle, { color: theme.colors.onSurface }]}>
            {title}
          </Text>
          <Text variant="bodyMedium" style={[styles.menuSubtitle, { color: theme.colors.onSurfaceVariant }]}>
            {subtitle}
          </Text>
        </View>
        <IconButton icon="chevron-right" size={20} iconColor={theme.colors.onSurfaceVariant} />
      </Card.Content>
    </Card>
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

  const theme = useTheme();
  
  return (
    <List.Item
      title={text}
      onPress={handlePress}
      left={() => (
        <IconSymbol 
          name={icon as any} 
          size={20} 
          color={theme.colors.secondary}
          style={styles.linkIcon}
        />
      )}
      right={() => <List.Icon icon="open-in-new" />}
      titleStyle={[styles.linkText, { color: 'white' }]}
      titleNumberOfLines={3}
      style={[styles.linkItem, { 
        backgroundColor: theme.colors.surfaceVariant,
        borderColor: theme.colors.outline 
      }]}
    />
  );
};

export const DashboardScreen: React.FC = () => {
  const theme = useTheme();
  
  const insets = useSafeAreaInsets();

  // const { showConsentDialog } = useConsentDialog();

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
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.background} />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text variant="displayLarge" style={[styles.mainTitle, { color: theme.colors.primary }]}>
            DEAD AHEAD
          </Text>
          <Text variant="displayMedium" style={[styles.subtitle, { color: theme.colors.secondary }]}>
            Roadkill Bingo
          </Text>
          <Text variant="bodyLarge" style={[styles.tagline, { color: theme.colors.onSurfaceVariant }]}>
            &quot;See it. Spot it. Shout it. Win shotgun or throw up trying.&quot;
          </Text>
          
          {/* Disclaimer - Top of Fold */}
          <Card mode="outlined" style={styles.topDisclaimer}>
            <Card.Content>
              <View style={styles.disclaimerContainer}>
                <Surface 
                  style={[styles.ratingCircle, { backgroundColor: theme.colors.primary }]} 
                  elevation={1}
                >
                  <Text style={[styles.ratingText, { color: theme.colors.onPrimary }]}>
                    12+
                  </Text>
                </Surface>
                <Text variant="bodyMedium" style={[styles.disclaimerText, { color: theme.colors.onSurfaceVariant }]}>
                  Rated 12+ for crude humor and mild violence
                </Text>
              </View>
              <Text variant="bodySmall" style={[styles.disclaimerSubtext, { color: theme.colors.onSurfaceVariant }]}>
                No animals were harmed in the making of this game... By Us!
              </Text>
            </Card.Content>
          </Card>
        </View>

        {/* Menu Cards */}
        <View style={styles.menuContainer}>
          <MenuCard
            icon="car"
            title="Play Game"
            subtitle="Practice your spotting skills"
            onPress={() => handleMenuPress('game')}
          />
          
          <MenuCard
            icon="camera"
            title="Snap the Splat!"
            subtitle="Use camera to validate finds"
            onPress={() => handleMenuPress('camera')}
          />
          
          <MenuCard
            icon="trophy"
            title="Hall of Shame"
            subtitle="View your achievements"
            onPress={() => handleMenuPress('hall-of-shame')}
          />
          
          <MenuCard
            icon="gear"
            title="Settings"
            subtitle="Gore level & sound options"
            onPress={() => handleMenuPress('settings')}
          />
        </View>

        {/* Conservation Section */}
        <Card mode="contained" style={styles.conservationContainer}>
          <Card.Title 
            title="Help Real Wildlife" 
            titleStyle={[styles.conservationTitle, { color: theme.colors.secondary }]}
            left={(props) => <IconButton {...props} icon="heart" iconColor="#FF4444" />}
          />
          <Card.Content>
            <Text variant="bodyMedium" style={[styles.conservationText, { color: theme.colors.onSurfaceVariant }]}>
              Dead Ahead is a cheeky road-trip bingo game — but real roads aren&apos;t so funny for wildlife. Thousands of animals are killed every week, and spotting them can help conservation efforts.
            </Text>
            
            <Text variant="titleMedium" style={[styles.conservationHeading, { color: theme.colors.secondary }]}>
              Want to help?
            </Text>
            <Text variant="bodyMedium" style={[styles.conservationText, { color: theme.colors.onSurfaceVariant }]}>
              Log your sightings with the Mammals on Roads app by the People's Trust for Endangered Species. Every report helps track wildlife populations and improve road safety.
            </Text>
            
            <View style={styles.linksContainer}>
              <LinkItem 
                icon="iphone" 
                text="App Store: PTES Mammals on Roads" 
                url="https://apps.apple.com/gb/app/ptes-mammals-on-roads/id446109227"
              />
              <LinkItem 
                icon="androidrobot" 
                text="Google Play: Mammals on Roads" 
                url="https://play.google.com/store/apps/details?id=org.ptes.mammalsonroads.v2&hl=en&gl=US&pli=1"
              />
              <LinkItem 
                icon="globe" 
                text="To find out more about PTES' wider conservation work, visit www.ptes.org" 
                url="https://www.ptes.org"
              />
            </View>
          </Card.Content>
        </Card>

      </ScrollView>
      
      {/* <BottomNavigation /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 48,
    justifyContent: 'flex-start',
  },
  mainTitle: {
    textAlign: 'center',
    fontWeight: 'bold',
  },
  subtitle: {
    marginTop: 8,
    textAlign: 'center',
    fontWeight: '600',
  },
  tagline: {
    textAlign: 'center',
    marginTop: 24,
    paddingHorizontal: 24,
  },
  topDisclaimer: {
    marginTop: 24,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 80,
  },
  menuContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  menuCard: {
    marginBottom: 16,
  },
  menuCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: screenWidth * 0.12,
    height: screenWidth * 0.12,
    borderRadius: screenWidth * 0.06,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  menuTitle: {
    fontWeight: '600',
    fontSize: 18,
  },
  menuSubtitle: {
    fontSize: 14,
  },
  disclaimerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  disclaimerText: {
    fontSize: 12,
  },
  disclaimerSubtext: {
    fontSize: 12,
    textAlign: 'center',
  },
  conservationContainer: {
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 10,
  },
  conservationTitle: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  conservationText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  conservationHeading: {
    fontSize: 16,
    fontWeight: 'bold',
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
    borderRadius: 8,
    borderWidth: 1,
  },
  linkIcon: {
    marginRight: 12,
    width: 20,
  },
  linkText: {
    fontSize: 14,
    flex: 1,
    lineHeight: 20,
  },
  externalIcon: {
    fontSize: 16,
    marginLeft: 8,
  },
});
