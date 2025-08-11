import { router } from 'expo-router';
import React from 'react';
import { Alert, Dimensions, Linking, ScrollView, StatusBar, StyleSheet, View } from 'react-native';
import {
  Card,
  IconButton,
  List,
  Surface,
  Text,
  useTheme
} from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { IconSymbol } from '../components/ui/IconSymbol';
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
      case 'trophy-room':
        router.push('/trophy-room');
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
            ROAD TRIP
          </Text>
          <Text variant="displayMedium" style={[styles.subtitle, { color: theme.colors.secondary }]}>
            Bingo
          </Text>
          <Text variant="bodyLarge" style={[styles.tagline, { color: theme.colors.onSurfaceVariant }]}>
            &quot;See it. Spot it. Shout it. Win front seat privileges by spotting 3 tiles in a row!&quot;
          </Text>
          
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
            title="Snap & Share!"
            subtitle="Use camera to validate finds"
            onPress={() => handleMenuPress('camera')}
          />
          
          <MenuCard
            icon="trophy"
            title="Trophy Room"
            subtitle="View your achievements"
            onPress={() => handleMenuPress('trophy-room')}
          />
          
          <MenuCard
            icon="gear"
            title="Settings"
            subtitle="Country settings & sound options"
            onPress={() => handleMenuPress('settings')}
          />
        </View>


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
});
