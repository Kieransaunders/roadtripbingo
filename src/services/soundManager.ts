import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';
import { useGameStore } from '../stores/gameStore';

// Blood splatter sound files - using only the two specified sounds
const BLOOD_SPLATTER_SOUNDS = [
  require('../../assets/sounds/CarthenBlood.mp3'),
  require('../../assets/sounds/blood-splatter.mp3'),
];

export class SoundManager {
  private static instance: SoundManager;
  private loadedSounds: { [key: string]: Audio.Sound } = {};

  private constructor() {
    this.initializeAudio();
  }

  public static getInstance(): SoundManager {
    if (!SoundManager.instance) {
      SoundManager.instance = new SoundManager();
    }
    return SoundManager.instance;
  }

  private async initializeAudio() {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        staysActiveInBackground: false,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });
      console.log('🔊 Audio initialized successfully');
    } catch (error) {
      console.warn('⚠️ Audio initialization failed:', error);
    }
  }

  private isAudioEnabled(): boolean {
    // Get settings from store instead of internal state
    return useGameStore.getState().soundEnabled;
  }

  private isHapticEnabled(): boolean {
    return useGameStore.getState().hapticEnabled;
  }

  private async loadSound(soundPath: any, key: string): Promise<Audio.Sound | null> {
    try {
      if (this.loadedSounds[key]) {
        return this.loadedSounds[key];
      }

      const { sound } = await Audio.Sound.createAsync(soundPath, {
        shouldPlay: false,
        isLooping: false,
        volume: 0.7,
      });

      this.loadedSounds[key] = sound;
      console.log(`🎵 Loaded sound: ${key}`);
      return sound;
    } catch (error) {
      console.warn(`⚠️ Failed to load sound ${key}:`, error);
      return null;
    }
  }

  public async playBloodSplatterSound(): Promise<void> {
    if (!this.isAudioEnabled()) {
      console.log('🔇 Audio disabled, skipping sound');
      return;
    }

    try {
      // Pick a random blood splatter sound from expanded collection
      const randomIndex = Math.floor(Math.random() * BLOOD_SPLATTER_SOUNDS.length);
      const soundPath = BLOOD_SPLATTER_SOUNDS[randomIndex];
      const soundKey = `blood_splatter_${randomIndex}`;

      // Load the sound if not already loaded
      const sound = await this.loadSound(soundPath, soundKey);
      
      if (sound) {
        // Reset to beginning if already played
        await sound.setPositionAsync(0);
        
        // Play the sound
        await sound.playAsync();
        console.log(`🩸 Playing blood splatter sound #${randomIndex} (${BLOOD_SPLATTER_SOUNDS.length} total)`);
        
        // Add haptic feedback for enhanced effect (if enabled)
        if (this.isHapticEnabled()) {
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }
      }
    } catch (error) {
      console.warn('⚠️ Failed to play blood splatter sound:', error);
    }
  }



  public async playTileSpottedSound(): Promise<void> {
    // For now, use the same blood splatter sound
    await this.playBloodSplatterSound();
  }

  public isAudioReady(): boolean {
    return this.isAudioEnabled();
  }

  // Clean up loaded sounds when needed
  public async unloadAllSounds(): Promise<void> {
    try {
      const unloadPromises = Object.values(this.loadedSounds).map(sound => 
        sound.unloadAsync()
      );
      
      await Promise.all(unloadPromises);
      this.loadedSounds = {};
      console.log('🧹 All sounds unloaded');
    } catch (error) {
      console.warn('⚠️ Error unloading sounds:', error);
    }
  }

}

// Export singleton instance
export const soundManager = SoundManager.getInstance();