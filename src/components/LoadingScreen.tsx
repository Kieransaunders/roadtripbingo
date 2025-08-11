import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { Typography } from './design-system';

export const LoadingScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Typography variant="displayMedium" color="accent" align="center" style={styles.title}>
        ROAD TRIP
      </Typography>
      <Typography variant="headlineMedium" align="center" style={styles.subtitle}>
        Bingo
      </Typography>
      <ActivityIndicator size="large" color="#FF4444" style={styles.spinner} />
    </View>
  );
};

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    marginBottom: 8,
    letterSpacing: 2,
  },
  subtitle: {
    color: '#FFD700',
    marginBottom: 40,
  },
  spinner: {
    marginTop: 20,
  },
}));
