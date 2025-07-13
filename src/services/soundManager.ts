import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';
import { useGameStore } from '../stores/gameStore';

// Blood splatter sound files
const BLOOD_SPLATTER_SOUNDS = [
  require('../../assets/sounds/7pfq4f9e1ih-blood-splatter-sfx-0.mp3'),
  require('../../assets/sounds/k7bv7sdrxp-blood-splatter-sfx-3.mp3'),
  require('../../assets/sounds/ua8hkb5lkxh-blood-splatter-sfx-4.mp3'),
  require('../../assets/sounds/11L-blood_splatter-1752416609721.mp3'),
  require('../../assets/sounds/11L-blood_splatter-1752416613586.mp3'),
  require('../../assets/sounds/11L-blood_splatter-1752416618592.mp3'),
  require('../../assets/sounds/11L-blood_splatter-1752416623370.mp3'),
];

// Additional themed sounds (removed roadkill car sound - file deleted)

// Fallback sounds - car noise then blood splatter (epic combination!)
const FALLBACK_SOUNDS = [
  require('../../assets/sounds/11L-car_noise_then_blood-1752416885709.mp3'),
  require('../../assets/sounds/11L-car_noise_then_blood-1752416900607.mp3'),
];

const CREEPY_SOUNDS = [
  require('../../assets/sounds/11L-deeply_creepy_monste-1752416684885.mp3'),
];

const ELECTRIC_SOUNDS = [
  require('../../assets/sounds/11L-Whirring_Electric_Bu-1752416732720.mp3'),
  require('../../assets/sounds/11L-Whirring_Electric_Bu-1752416739126.mp3'),
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


  public async playCreepySound(): Promise<void> {
    if (!this.isAudioEnabled()) return;

    try {
      const randomIndex = Math.floor(Math.random() * CREEPY_SOUNDS.length);
      const soundPath = CREEPY_SOUNDS[randomIndex];
      const soundKey = `creepy_${randomIndex}`;

      const sound = await this.loadSound(soundPath, soundKey);
      
      if (sound) {
        await sound.setPositionAsync(0);
        await sound.playAsync();
        console.log(`👻 Playing creepy sound #${randomIndex}`);
        if (this.isHapticEnabled()) {
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        }
      }
    } catch (error) {
      console.warn('⚠️ Failed to play creepy sound:', error);
    }
  }

  public async playElectricSound(): Promise<void> {
    if (!this.isAudioEnabled()) return;

    try {
      const randomIndex = Math.floor(Math.random() * ELECTRIC_SOUNDS.length);
      const soundPath = ELECTRIC_SOUNDS[randomIndex];
      const soundKey = `electric_${randomIndex}`;

      const sound = await this.loadSound(soundPath, soundKey);
      
      if (sound) {
        await sound.setPositionAsync(0);
        await sound.playAsync();
        console.log(`⚡ Playing electric sound #${randomIndex}`);
        if (this.isHapticEnabled()) {
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
      }
    } catch (error) {
      console.warn('⚠️ Failed to play electric sound:', error);
      // Fallback to car noise + blood sound
      await this.playFallbackSound();
    }
  }

  public async playFallbackSound(): Promise<void> {
    if (!this.isAudioEnabled()) return;

    try {
      const randomIndex = Math.floor(Math.random() * FALLBACK_SOUNDS.length);
      const soundPath = FALLBACK_SOUNDS[randomIndex];
      const soundKey = `fallback_${randomIndex}`;

      const sound = await this.loadSound(soundPath, soundKey);
      
      if (sound) {
        await sound.setPositionAsync(0);
        await sound.playAsync();
        console.log(`🚗💥 Playing fallback car+blood sound #${randomIndex}`);
        if (this.isHapticEnabled()) {
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        }
      }
    } catch (error) {
      console.warn('⚠️ Failed to play fallback sound:', error);
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

  // Play random blood splatter with intensity variation
  public async playBloodSplatterWithIntensity(intensity: 'light' | 'medium' | 'heavy' = 'medium'): Promise<void> {
    const volumeMap = {
      light: 0.3,
      medium: 0.7,
      heavy: 1.0,
    };

    const hapticMap = {
      light: Haptics.ImpactFeedbackStyle.Light,
      medium: Haptics.ImpactFeedbackStyle.Medium,
      heavy: Haptics.ImpactFeedbackStyle.Heavy,
    };

    if (!this.isAudioEnabled()) return;

    try {
      const randomIndex = Math.floor(Math.random() * BLOOD_SPLATTER_SOUNDS.length);
      const soundPath = BLOOD_SPLATTER_SOUNDS[randomIndex];
      const soundKey = `blood_splatter_${randomIndex}`;

      const sound = await this.loadSound(soundPath, soundKey);
      
      if (sound) {
        await sound.setVolumeAsync(volumeMap[intensity]);
        await sound.setPositionAsync(0);
        await sound.playAsync();
        
        if (this.isHapticEnabled()) {
          await Haptics.impactAsync(hapticMap[intensity]);
        }
        console.log(`🩸 Playing ${intensity} blood splatter sound #${randomIndex}`);
      }
    } catch (error) {
      console.warn('⚠️ Failed to play blood splatter with intensity:', error);
    }
  }
}

// Export singleton instance
export const soundManager = SoundManager.getInstance();