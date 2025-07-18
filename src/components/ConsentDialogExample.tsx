import React from 'react';
import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';
import { useConsentDialog } from '@/src/hooks/useConsentDialog';
import { useThemeColor } from '@/src/hooks/useThemeColor';

/**
 * Example component demonstrating how to use the ConsentDialog
 * 
 * To use this in your app:
 * 1. Wrap your app with ConsentDialogProvider
 * 2. Use the useConsentDialog hook to get the showConsentDialog function
 * 3. Call showConsentDialog() and await the result
 */
export function ConsentDialogExample() {
  const { showConsentDialog } = useConsentDialog();
  const tintColor = useThemeColor({}, 'tint');

  const handleShareImage = async () => {
    try {
      // Show the consent dialog and await the user's choice
      const userConsented = await showConsentDialog();
      
      if (userConsented) {
        // User consented - proceed with sharing
        Alert.alert(
          'Success',
          'User consented! You can now proceed with posting to Instagram.',
          [{ text: 'OK' }]
        );
        
        // Here you would implement your actual Instagram sharing logic
        console.log('Proceeding with Instagram post...');
      } else {
        // User cancelled or declined
        Alert.alert(
          'Cancelled',
          'User declined to share the image.',
          [{ text: 'OK' }]
        );
        console.log('User declined consent');
      }
    } catch (error) {
      console.error('Error showing consent dialog:', error);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        ConsentDialog Example
      </ThemedText>
      
      <ThemedText style={styles.description}>
        This example shows how to use the ConsentDialog component to get user consent 
        before posting images to Instagram.
      </ThemedText>
      
      <TouchableOpacity
        style={[styles.button, { backgroundColor: tintColor }]}
        onPress={handleShareImage}
        accessible={true}
        accessibilityLabel="Share image to Instagram"
        accessibilityRole="button"
        accessibilityHint="Tap to show consent dialog before sharing"
      >
        <ThemedText style={styles.buttonText} lightColor="#fff" darkColor="#fff">
          Share Image to Instagram
        </ThemedText>
      </TouchableOpacity>
      
      <View style={styles.usageContainer}>
        <ThemedText type="defaultSemiBold" style={styles.usageTitle}>
          Usage:
        </ThemedText>
        <ThemedText style={styles.usageText}>
          1. Wrap your app with ConsentDialogProvider{'\n'}
          2. Use useConsentDialog() hook{'\n'}
          3. Call showConsentDialog() and await result{'\n'}
          4. Handle the boolean response
        </ThemedText>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    textAlign: 'center',
    marginBottom: 20,
  },
  description: {
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
  },
  button: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 40,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  usageContainer: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  usageTitle: {
    marginBottom: 8,
  },
  usageText: {
    lineHeight: 20,
    fontFamily: 'monospace',
  },
});
