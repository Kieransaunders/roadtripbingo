import React, { useEffect } from 'react';
import { View, TouchableOpacity, ScrollView, StatusBar, Switch, StyleSheet, Alert, Platform } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText, ThemedView, Box } from '@joe111/neo-ui';
import { useGameStore, GoreLevel } from '../stores/gameStore';
import { soundManager } from '../services/soundManager';

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

export const SettingsScreen: React.FC = () => {

  // Get settings from game store
  const {
    soundEnabled,
    hapticEnabled,
    goreLevel,
    setSoundEnabled,
    setHapticEnabled,
    setGoreLevel,
    loadSettings
  } = useGameStore();

  // Load settings on component mount
  useEffect(() => {
    loadSettings();
  }, []);

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
      // Force navigation to dashboard
      router.replace('/');
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

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
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
            <InfoItem icon="🎯" text="Get 3 in a row to win • Free Range center tile always marked" />
          </View>
        </SettingSection>
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
  placeholder: {
    width: 44,
    height: 44,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
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
});
