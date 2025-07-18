import '@/src/unistyles';
import { VictoryScreen } from '@/src/screens/VictoryScreen';
import { useGameStore } from '@/src/stores/gameStore';
import { router } from 'expo-router';

export default function Victory() {
  const { startNewGame } = useGameStore();

  const handlePlayAgain = () => {
    startNewGame();
    router.replace('/game');
  };

  const handleBackToDashboard = () => {
    // Reset the game state when going back to dashboard
    // This ensures a fresh game when the user plays again
    startNewGame();
    router.replace('/');
  };

  return (
    <VictoryScreen 
      onPlayAgain={handlePlayAgain}
      onBackToDashboard={handleBackToDashboard}
    />
  );
}
