import React, { useEffect } from 'react';
import { View, ScrollView, StatusBar, StyleSheet, Alert, Platform, Linking } from 'react-native';
import { router } from 'expo-router';
import * as Sentry from '@sentry/react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, Text, IconButton, Switch, Button, Surface, Divider, List, useTheme } from 'react-native-paper';
import { IconSymbol } from '../components/ui/IconSymbol';
import { useGameStore, GoreLevel } from '../stores/gameStore';
import { soundManager } from '../services/soundManager';
import { BottomNavigation } from '../components/BottomNavigation';

interface SettingSectionProps {
  title: string;
  children: React.ReactNode;
}

const SettingSection: React.FC<SettingSectionProps> = ({ title, children }) => {
  return (
    <Card style={styles.section} mode="contained">
      <Card.Content>
        <Text variant="headlineSmall" style={styles.sectionTitle}>{title}</Text>
        {children}
      </Card.Content>
    </Card>
  );
};

interface ToggleSettingProps {
  title: string;
  description: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}

const ToggleSetting: React.FC<ToggleSettingProps> = ({ title, description, value, onValueChange }) => {
  return (
    <List.Item
      title={title}
      description={description}
      titleStyle={styles.toggleTitle}
      descriptionStyle={styles.toggleDescription}
      right={() => (
        <Switch
          value={value}
          onValueChange={onValueChange}
        />
      )}
      style={styles.toggleSetting}
    />
  );
};

interface RadioOptionProps {
  title: string;
  description: string;
  selected: boolean;
  onPress: () => void;
}

const RadioOption: React.FC<RadioOptionProps> = ({ title, description, selected, onPress }) => {
  const theme = useTheme();
  
  return (
    <List.Item
      title={title}
      description={description}
      onPress={onPress}
      left={() => (
        <List.Icon 
          icon={selected ? 'radiobox-marked' : 'radiobox-blank'} 
          color={selected ? theme.colors.primary : theme.colors.outline}
        />
      )}
      titleStyle={styles.radioTitle}
      descriptionStyle={styles.radioDescription}
      style={[
        styles.radioOption,
        selected && { backgroundColor: theme.colors.primaryContainer }
      ]}
    />
  );
};

interface InfoItemProps {
  icon: string;
  text: string;
}

const InfoItem: React.FC<InfoItemProps> = ({ icon, text }) => {
  const theme = useTheme();
  
  return (
    <List.Item
      title={text}
      left={() => (
        <IconSymbol 
          name={icon as any} 
          size={20} 
          color={theme.colors.onSurfaceVariant}
          style={styles.infoIcon}
        />
      )}
      titleStyle={styles.infoText}
      titleNumberOfLines={3}
    />
  );
};

interface LinkItemProps {
  icon: string;
  text: string;
  url: string;
}

const LinkItem: React.FC<LinkItemProps> = ({ icon, text, url }) => {
  const theme = useTheme();
  
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
    <List.Item
      title={text}
      onPress={handlePress}
      left={() => (
        <IconSymbol 
          name={icon as any} 
          size={20} 
          color={theme.colors.secondary}
          style={styles.infoIcon}
        />
      )}
      right={() => <List.Icon icon="open-in-new" />}
      titleStyle={styles.linkText}
      titleNumberOfLines={3}
      style={styles.linkItem}
    />
  );
};

export const SettingsScreen: React.FC = () => {

  // Get settings from game store
  const {
    soundEnabled,
    hapticEnabled,
    goreLevel: _goreLevel,
    longRoadTripEnabled,
    setSoundEnabled,
    setHapticEnabled,
    setGoreLevel: _setGoreLevel,
    setLongRoadTripEnabled,
    loadSettings
  } = useGameStore();

  // Load settings on component mount
  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  const handleBack = () => {
    try {
      if (router.canGoBack()) {
        router.back();
      } else {
        // Fallback to dashboard if no back history
        router.replace('/');
      }
    } catch (error) {
      console.warn('Navigation error:', error);
      Sentry.captureException(error);
      // Force navigation to dashboard
      try {
        router.replace('/');
      } catch (fallbackError) {
        console.error('Fallback navigation also failed:', fallbackError);
        Sentry.captureException(fallbackError);
      }
    }
  };

  const handleGoreLevelChange = async (level: GoreLevel) => {
    console.log('🎮 Gore level change attempted:', level);
    
    try {
      // Play creepy monster sound when they try to change mode 👹
      console.log('🔊 Playing creepy sound...');
      await soundManager.playCreepySound();
      console.log('✅ Creepy sound played successfully');
    } catch (error) {
      console.error('❌ Failed to play creepy sound:', error);
    }
    
    // Show the message for ANY click on gore level options
    const message = 'Extreme mode is baked in. Like roadkill on hot tarmac.';
    
    try {
      // Use React Native Alert for all platforms for consistent experience
      console.log('📱 Showing alert dialog...');
      Alert.alert(
        '🩸 Extreme Mode Only',
        message,
        [
          { 
            text: 'Got It!', 
            style: 'default',
            onPress: () => console.log('✅ User dismissed gore level dialog')
          }
        ]
      );
    } catch (error) {
      console.error('❌ Failed to show dialog:', error);
      // Fallback to console log
      console.log('🩸 Extreme Mode Only:', message);
    }
    
    // Always keep it on extreme regardless of what they clicked
    console.log('🔒 Keeping gore level locked to extreme');
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
        <Text variant="headlineMedium" style={styles.title}>Settings</Text>
        <View style={styles.placeholder} />
      </Surface>

      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Game Mode */}
        <SettingSection title="Game Mode">
          <View style={styles.toggleContainer}>
            <ToggleSetting
              title="Long Road Trip"
              description="4-in-a-row win condition for extended gameplay"
              value={longRoadTripEnabled}
              onValueChange={setLongRoadTripEnabled}
            />
          </View>
        </SettingSection>

        {/* Audio & Haptics */}
        <SettingSection title="Audio & Haptics">
          <View style={styles.toggleContainer}>
            <ToggleSetting
              title="Sound Effects"
              description="Splats, thuds, and victory sounds"
              value={soundEnabled}
              onValueChange={setSoundEnabled}
            />
            <ToggleSetting
              title="Haptic Feedback"
              description="Vibration on tile marks and wins"
              value={hapticEnabled}
              onValueChange={setHapticEnabled}
            />
          </View>
        </SettingSection>

        {/* Gore Level */}
        <SettingSection title="Gore Level">
          <Text variant="bodyMedium" style={styles.goreLevelDescription}>
            Extreme mode is the only way to experience true roadkill chaos
          </Text>
          <View style={styles.radioContainer}>
            <RadioOption
              title="Mild"
              description="For cowards who can't handle the truth"
              selected={false}
              onPress={() => handleGoreLevelChange('mild')}
            />
            <RadioOption
              title="Moderate"
              description="Still too tame for roadkill reality"
              selected={false}
              onPress={() => handleGoreLevelChange('moderate')}
            />
            <RadioOption
              title="Extreme"
              description="Full horror experience - the only way"
              selected={true}
              onPress={() => handleGoreLevelChange('extreme')}
            />
          </View>
        </SettingSection>

        {/* About */}
        <SettingSection title="About">
          <View style={styles.aboutContainer}>
            <InfoItem icon="gamecontroller.fill" text="Dead Ahead: Roadkill Bingo" />
            <InfoItem icon="info.circle.fill" text="Version 1.0.0" />
            <InfoItem icon="exclamationmark.triangle.fill" text="Rated 12+ for crude humor" />
            <InfoItem icon="target" text={`Get ${longRoadTripEnabled ? '4' : '3'} in a row to win • Free Range center tile always marked`} />
            
            <Card style={styles.conservationSection} mode="outlined">
              <Card.Content>
                <Text variant="bodyMedium" style={styles.conservationText}>
                  Dead Ahead is a cheeky road-trip bingo game — but real roads aren't so funny for wildlife. Thousands of animals are killed every week, and spotting them can help conservation efforts.
                </Text>
                
                <Text variant="titleMedium" style={styles.conservationHeading}>Want to help?</Text>
                <Text variant="bodyMedium" style={styles.conservationText}>
                  Log your sightings with the Mammals on Roads app by the People's Trust for Endangered Species. Every report helps track wildlife populations and improve road safety.
                </Text>
              </Card.Content>
            </Card>
              
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
            </View>
        </SettingSection>
      </ScrollView>
      
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
  placeholder: {
    width: 44,
    height: 44,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  scrollContent: {
    paddingBottom: 100, // Add space for bottom navigation
  },
  section: {
    marginBottom: 16,
    marginHorizontal: 0,
  },
  sectionTitle: {
    color: 'white',
    marginBottom: 16,
  },
  toggleContainer: {
    gap: 16,
  },
  toggleSetting: {
    paddingVertical: 8,
  },
  toggleTitle: {
    color: 'white',
    fontWeight: '600',
  },
  toggleDescription: {
    color: '#888',
  },
  goreLevelDescription: {
    fontSize: 14,
    color: '#888',
    marginBottom: 16,
    lineHeight: 20,
  },
  radioContainer: {
    gap: 12,
  },
  radioOption: {
    marginVertical: 4,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  radioContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#666',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonSelected: {
    borderColor: 'white',
  },
  radioButtonInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'white',
  },
  radioText: {
    flex: 1,
  },
  radioTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ccc',
    marginBottom: 2,
  },
  radioTitleSelected: {
    color: 'white',
  },
  radioDescription: {
    fontSize: 14,
    color: '#888',
  },
  radioDescriptionSelected: {
    color: '#ddd',
  },
  radioOptionDisabled: {
    opacity: 0.4,
  },
  radioButtonDisabled: {
    borderColor: '#444',
  },
  radioTitleDisabled: {
    color: '#666',
  },
  radioDescriptionDisabled: {
    color: '#555',
  },
  aboutContainer: {
    gap: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoIcon: {
    marginRight: 12,
    width: 20,
  },
  infoText: {
    fontSize: 14,
    color: '#ccc',
    flex: 1,
    lineHeight: 20,
  },
  conservationSection: {
    marginTop: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#444',
  },
  conservationText: {
    fontSize: 14,
    color: '#ccc',
    lineHeight: 20,
    marginBottom: 12,
  },
  conservationHeading: {
    fontSize: 16,
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
  linkText: {
    fontSize: 14,
    color: '#FFD700',
    flex: 1,
    lineHeight: 20,
  },
  externalIcon: {
    fontSize: 16,
    color: '#888',
    marginLeft: 8,
  },
});
