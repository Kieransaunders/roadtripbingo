import React, { useEffect } from 'react';
import { View, TouchableOpacity, ScrollView, StatusBar, Switch, StyleSheet, Alert, Platform, Linking } from 'react-native';
import { router } from 'expo-router';
import * as Sentry from '@sentry/react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText, Box } from '@joe111/neo-ui';
import { useGameStore, GoreLevel } from '../stores/gameStore';
import { soundManager } from '../services/soundManager';
import { BottomNavigation } from '../components/BottomNavigation';

interface SettingSectionProps {
  title: string;
  children: React.ReactNode;
}

const SettingSection: React.FC<SettingSectionProps> = ({ title, children }) => {
  return (
    <Box style={styles.section}>
      <ThemedText style={styles.sectionTitle}>{title}</ThemedText>
      {children}
    </Box>
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
    <Box style={styles.toggleSetting}>
      <Box style={styles.toggleContent}>
        <ThemedText style={styles.toggleTitle}>{title}</ThemedText>
        <ThemedText style={styles.toggleDescription}>{description}</ThemedText>
      </Box>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: '#333', true: '#FF4444' }}
        thumbColor={value ? '#fff' : '#666'}
      />
    </Box>
  );
};

interface RadioOptionProps {
  title: string;
  description: string;
  selected: boolean;
  onPress: () => void;
}

const RadioOption: React.FC<RadioOptionProps> = ({ title, description, selected, onPress }) => {
  const isDisabled = description.includes('DISABLED');
  
  return (
    <TouchableOpacity 
      style={[
        styles.radioOption, 
        selected && styles.radioOptionSelected,
        isDisabled && styles.radioOptionDisabled
      ]} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Box style={styles.radioContent}>
        <Box style={[
          styles.radioButton, 
          selected && styles.radioButtonSelected,
          isDisabled && styles.radioButtonDisabled
        ]}>
          {selected && <Box style={styles.radioButtonInner} />}
        </Box>
        <Box style={styles.radioText}>
          <ThemedText style={[
            styles.radioTitle, 
            selected && styles.radioTitleSelected,
            isDisabled && styles.radioTitleDisabled
          ]}>{title}</ThemedText>
          <ThemedText style={[
            styles.radioDescription, 
            selected && styles.radioDescriptionSelected,
            isDisabled && styles.radioDescriptionDisabled
          ]}>{description}</ThemedText>
        </Box>
      </Box>
    </TouchableOpacity>
  );
};

interface InfoItemProps {
  icon: string;
  text: string;
}

const InfoItem: React.FC<InfoItemProps> = ({ icon, text }) => {
  return (
    <Box style={styles.infoItem}>
      <ThemedText style={styles.infoIcon}>{icon}</ThemedText>
      <ThemedText style={styles.infoText}>{text}</ThemedText>
    </Box>
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
      <ThemedText style={styles.infoIcon}>{icon}</ThemedText>
      <ThemedText style={styles.linkText}>{text}</ThemedText>
      <ThemedText style={styles.externalIcon}>↗</ThemedText>
    </TouchableOpacity>
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
    // Play creepy monster sound when they try to change mode 👹
    await soundManager.playCreepySound();
    
    // Show the message for ANY click on gore level options
    const message = 'Extreme mode is baked in. Like roadkill on hot tarmac.';
    
    if (Platform.OS === 'web') {
      // Use browser alert for web
      window.alert(`🩸 Extreme Mode Only\n\n${message}`);
    } else {
      // Use React Native Alert for mobile
      Alert.alert(
        '🩸 Extreme Mode Only',
        message,
        [{ text: 'Got It!', style: 'default' }]
      );
    }
    // Always keep it on extreme regardless of what they clicked
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />
      
      {/* Header */}
      <Box style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <ThemedText style={styles.backIcon}>‹</ThemedText>
        </TouchableOpacity>
        <ThemedText style={styles.title}>Settings</ThemedText>
        <View style={styles.placeholder} />
      </Box>

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
          <ThemedText style={styles.goreLevelDescription}>
            Extreme mode is the only way to experience true roadkill chaos
          </ThemedText>
          <View style={styles.radioContainer}>
            <RadioOption
              title="Mild"
              description="For cowards • DISABLED"
              selected={false}
              onPress={() => handleGoreLevelChange('mild')}
            />
            <RadioOption
              title="Moderate"
              description="Still too tame • DISABLED"
              selected={false}
              onPress={() => handleGoreLevelChange('moderate')}
            />
            <RadioOption
              title="Extreme"
              description="Full horror experience • LOCKED"
              selected={true}
              onPress={() => {}} // No action needed - already locked to extreme
            />
          </View>
        </SettingSection>

        {/* About */}
        <SettingSection title="About">
          <View style={styles.aboutContainer}>
            <InfoItem icon="🎮" text="Dead Ahead: Roadkill Bingo" />
            <InfoItem icon="ℹ️" text="Version 1.0.0" />
            <InfoItem icon="⚠️" text="Rated 12+ for crude humor" />
            <InfoItem icon="🎯" text={`Get ${longRoadTripEnabled ? '4' : '3'} in a row to win • Free Range center tile always marked`} />
            
            <View style={styles.conservationSection}>
              <ThemedText style={styles.conservationText}>
                Dead Ahead is a cheeky road-trip bingo game — but real roads aren't so funny for wildlife. Thousands of animals are killed every week, and spotting them can help conservation efforts.
              </ThemedText>
              
              <ThemedText style={styles.conservationHeading}>Want to help?</ThemedText>
              <ThemedText style={styles.conservationText}>
                Log your sightings with the Mammals on Roads app by the People's Trust for Endangered Species. Every report helps track wildlife populations and improve road safety.
              </ThemedText>
              
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
    backgroundColor: '#2a2a4a',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 16,
  },
  toggleContainer: {
    gap: 16,
  },
  toggleSetting: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  toggleContent: {
    flex: 1,
    marginRight: 16,
  },
  toggleTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginBottom: 4,
  },
  toggleDescription: {
    fontSize: 14,
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
    borderRadius: 8,
    padding: 16,
    backgroundColor: '#3a3a5a',
  },
  radioOptionSelected: {
    backgroundColor: '#FF4444',
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
    fontSize: 16,
    marginRight: 12,
    width: 20,
    textAlign: 'center',
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
