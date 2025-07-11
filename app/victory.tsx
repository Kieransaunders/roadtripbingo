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
    router.replace('/');
  };

  return (
    <VictoryScreen 
      onPlayAgain={handlePlayAgain}
      onBackToDashboard={handleBackToDashboard}
    />
  );
}
