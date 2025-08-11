/**
 * Centralized strings for the Road Trip Bingo app
 * This file contains all user-facing text to support future internationalization (i18n)
 * 
 * TODO: Replace with proper i18n library like react-i18next or expo-localization
 * when multilingual support is required
 */

export const Strings = {
  // Consent Dialog
  consent: {
    title: 'Consent Required',
    message: 'By sharing this image, you consent to it being posted on our Instagram.',
    understand: 'I Understand',
    cancel: 'Cancel',
    // Accessibility labels
    a11y: {
      dialog: 'Consent dialog',
      backdrop: 'consent-dialog-backdrop',
      header: 'Consent Required',
      message: 'Consent message',
      understandButton: 'I understand and consent',
      understandHint: 'Tap to consent to posting the image on Instagram',
      cancelButton: 'Cancel',
      cancelHint: 'Tap to cancel and not post the image',
    },
  },

  // Camera permissions (used in app.json)
  permissions: {
    camera: 'Allow Road Trip Bingo to access your camera to capture photos for the leaderboard.',
    photos: 'Allow Road Trip Bingo to save your photos to your device.',
    savePhotos: 'Allow Road Trip Bingo to save photos to your photo library.',
  },

  // Common UI elements
  common: {
    loading: 'Loading...',
    error: 'Error',
    retry: 'Retry',
    close: 'Close',
    save: 'Save',
    delete: 'Delete',
    confirm: 'Confirm',
    cancel: 'Cancel',
  },

  // Camera strings
  camera: {
    permissions: {
      title: 'We need your permission to show the camera',
      message: 'This app needs access to camera to take photos and share memories',
      grant: 'Grant Permission',
    },
    controls: {
      capture: '📸 Snap & Share!',
      flip: 'Flip',
      cancel: 'Cancel',
    },
    states: {
      uploading: 'Uploading...',
      processing: 'Processing...',
    },
  },

  // Game-specific strings
  game: {
    title: 'Road Trip Bingo',
    captureMemories: 'Snap & Share',
    photoGallery: 'Trophy Gallery',
    leaderboard: 'Leaderboard',
    settings: 'Settings',
  },

  // Instagram integration
  instagram: {
    posting: 'Posting to Instagram...',
    success: 'Successfully posted to Instagram!',
    error: 'Failed to post to Instagram',
    consentRequired: 'Consent required to share to Instagram',
  },

  // Error messages
  errors: {
    cameraPermission: 'Camera permission is required to take photos',
    photoSaveError: 'Failed to save photo to gallery',
    networkError: 'Network error. Please check your connection.',
    genericError: 'Something went wrong. Please try again.',
  },
};

// Type definitions for TypeScript support
export type StringKeys = keyof typeof Strings;
export type ConsentStringKeys = keyof typeof Strings.consent;
export type GameStringKeys = keyof typeof Strings.game;
export type InstagramStringKeys = keyof typeof Strings.instagram;
export type ErrorStringKeys = keyof typeof Strings.errors;

// Helper function to get nested strings (for future i18n library integration)
export function getString(key: string): string {
  const keys = key.split('.');
  let value: any = Strings;
  
  for (const k of keys) {
    value = value[k];
    if (value === undefined) {
      console.warn(`String key "${key}" not found`);
      return key; // Return key as fallback
    }
  }
  
  return value;
}
