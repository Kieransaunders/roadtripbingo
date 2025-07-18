import React from 'react';
import {
  Modal,
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  TouchableWithoutFeedback,
  Platform,
} from 'react-native';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';
import { useThemeColor } from '@/src/hooks/useThemeColor';
import { Strings } from '@/src/constants/Strings';

interface ConsentDialogProps {
  visible: boolean;
  onClose: () => void;
  onConsent: (consent: boolean) => void;
}

export function ConsentDialog({ visible, onClose, onConsent }: ConsentDialogProps) {
  console.log('🔍 ConsentDialog rendering with visible:', visible);
  
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const tintColor = useThemeColor({}, 'tint');
  
  // Calculate contrasting text color for the primary button
  const getContrastingTextColor = (bgColor: string) => {
    // Simple contrast calculation - if the background is light, use dark text
    // This is a basic implementation, you could use a more sophisticated one
    const hex = bgColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128 ? '#000' : '#fff';
  };
  
  const handleUnderstand = () => {
    console.log('🔍 ConsentDialog - handleUnderstand called');
    onConsent(true);
    onClose();
  };

  const handleCancel = () => {
    console.log('🔍 ConsentDialog - handleCancel called');
    onConsent(false);
    onClose();
  };

  const handleBackdropPress = () => {
    handleCancel();
  };

  if (!visible) {
    console.log('🔍 ConsentDialog - not visible, returning null');
    return null;
  }

  console.log('🔍 ConsentDialog - rendering modal with visible=true');

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleCancel}
      accessible={true}
      accessibilityLabel={Strings.consent.a11y.dialog}
      presentationStyle="overFullScreen"
      statusBarTranslucent={true}
    >
      <TouchableWithoutFeedback onPress={handleBackdropPress} testID={Strings.consent.a11y.backdrop}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback onPress={() => {}}>
            <ThemedView style={[styles.dialog, { backgroundColor }]}>
              <View style={styles.content}>
                <ThemedText 
                  type="subtitle" 
                  style={styles.title}
                  accessible={true}
                  accessibilityRole="header"
                >
                  {Strings.consent.title}
                </ThemedText>
                
                <ThemedText 
                  style={styles.message}
                  accessible={true}
                  accessibilityLabel={Strings.consent.a11y.message}
                >
                  {Strings.consent.message}
                </ThemedText>
                
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={[styles.button, styles.primaryButton, { backgroundColor: '#FF4444' }]}
                    onPress={handleUnderstand}
                    accessible={true}
                    accessibilityLabel={Strings.consent.a11y.understandButton}
                    accessibilityRole="button"
                    accessibilityHint={Strings.consent.a11y.understandHint}
                  >
                    <ThemedText 
                      style={[styles.buttonText, { color: '#FFFFFF' }]}
                    >
                      {Strings.consent.understand}
                    </ThemedText>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[styles.button, styles.secondaryButton]}
                    onPress={handleCancel}
                    accessible={true}
                    accessibilityLabel={Strings.consent.a11y.cancelButton}
                    accessibilityRole="button"
                    accessibilityHint={Strings.consent.a11y.cancelHint}
                  >
                    <ThemedText style={[styles.buttonText, { color: textColor }]}>
                      {Strings.consent.cancel}
                    </ThemedText>
                  </TouchableOpacity>
                </View>
              </View>
            </ThemedView>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}


const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    zIndex: 9999,
  },
  dialog: {
    borderRadius: 12,
    maxWidth: Math.min(width - 40, 400),
    width: '100%',
    maxHeight: height * 0.8,
    elevation: 10,
    zIndex: 10000,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    ...(Platform.OS === 'ios' && {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
    }),
  },
  content: {
    padding: 24,
  },
  title: {
    marginBottom: 16,
    textAlign: 'center',
  },
  message: {
    lineHeight: 22,
    marginBottom: 24,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  primaryButton: {
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
