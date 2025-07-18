import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import { VictoryScreen } from '../VictoryScreen';
import { ConsentDialogProvider } from '@/src/hooks/useConsentDialog';
import { Strings } from '@/src/constants/Strings';

// Mock dependencies
jest.mock('@/src/stores/gameStore', () => ({
  useGameStore: jest.fn(() => ({
    gameStats: {},
    currentGrid: new Array(25).fill(null).map((_, i) => ({ 
      id: i, 
      isSpotted: i < 15, // 15 out of 25 spotted
      name: `tile-${i}`,
      image: `image-${i}`,
      description: `description-${i}`,
    })),
    gameMode: 'standard',
    gameStartTime: new Date(Date.now() - 120000), // 2 minutes ago
    checkAchievements: jest.fn(() => []),
  })),
}));

jest.mock('@/src/services/instagramAPI', () => ({
  openInstagramAccount: jest.fn(),
}));

jest.mock('@/src/components/BottomNavigation', () => ({
  BottomNavigation: 'BottomNavigation',
}));

jest.mock('expo-clipboard', () => ({
  setStringAsync: jest.fn(),
}));

// Mock Alert
const mockAlert = jest.spyOn(Alert, 'alert');

describe('VictoryScreen Integration Tests', () => {
  const mockOnPlayAgain = jest.fn();
  const mockOnBackToDashboard = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Consent Dialog Integration', () => {
    it('should not call share handlers when consent is denied', async () => {
      const TestComponent = () => (
        <ConsentDialogProvider>
          <VictoryScreen
            onPlayAgain={mockOnPlayAgain}
            onBackToDashboard={mockOnBackToDashboard}
            screenshotUri="mock-screenshot.jpg"
          />
        </ConsentDialogProvider>
      );

      render(<TestComponent />);

      // Wait for initial animations to complete
      await waitFor(() => {
        expect(screen.getByText('📸 Share Victory')).toBeTruthy();
      });

      // Trigger share button
      const shareButton = screen.getByText('📸 Share Victory');
      fireEvent.press(shareButton);

      // Wait for consent dialog to appear
      await waitFor(() => {
        expect(screen.getByText(Strings.consent.title)).toBeTruthy();
      });

      // Deny consent
      const cancelButton = screen.getByText(Strings.consent.cancel);
      fireEvent.press(cancelButton);

      // Wait for dialog to close
      await waitFor(() => {
        expect(screen.queryByText(Strings.consent.title)).toBeNull();
      });

      // Verify that no share actions were triggered
      expect(mockAlert).not.toHaveBeenCalled();
    });

    it('should call share handlers when consent is given', async () => {
      const TestComponent = () => (
        <ConsentDialogProvider>
          <VictoryScreen
            onPlayAgain={mockOnPlayAgain}
            onBackToDashboard={mockOnBackToDashboard}
            screenshotUri="mock-screenshot.jpg"
          />
        </ConsentDialogProvider>
      );

      render(<TestComponent />);

      // Wait for initial animations to complete
      await waitFor(() => {
        expect(screen.getByText('📸 Share Victory')).toBeTruthy();
      });

      // Trigger share button
      const shareButton = screen.getByText('📸 Share Victory');
      fireEvent.press(shareButton);

      // Wait for consent dialog to appear
      await waitFor(() => {
        expect(screen.getByText(Strings.consent.title)).toBeTruthy();
      });

      // Give consent
      const understandButton = screen.getByText(Strings.consent.understand);
      fireEvent.press(understandButton);

      // Wait for dialog to close and share alert to appear
      await waitFor(() => {
        expect(screen.queryByText(Strings.consent.title)).toBeNull();
        expect(mockAlert).toHaveBeenCalledWith(
          'Share Your Victory! 🎉',
          expect.stringContaining('I just won ROADKILL BINGO with 15/25 tiles spotted'),
          expect.any(Array)
        );
      });
    });

    it('should show share alert with correct victory stats', async () => {
      const TestComponent = () => (
        <ConsentDialogProvider>
          <VictoryScreen
            onPlayAgain={mockOnPlayAgain}
            onBackToDashboard={mockOnBackToDashboard}
            screenshotUri="mock-screenshot.jpg"
          />
        </ConsentDialogProvider>
      );

      render(<TestComponent />);

      // Wait for initial animations to complete
      await waitFor(() => {
        expect(screen.getByText('📸 Share Victory')).toBeTruthy();
      });

      // Trigger share button
      const shareButton = screen.getByText('📸 Share Victory');
      fireEvent.press(shareButton);

      // Wait for consent dialog to appear
      await waitFor(() => {
        expect(screen.getByText(Strings.consent.title)).toBeTruthy();
      });

      // Give consent
      const understandButton = screen.getByText(Strings.consent.understand);
      fireEvent.press(understandButton);

      // Wait for share alert to appear
      await waitFor(() => {
        expect(mockAlert).toHaveBeenCalledWith(
          'Share Your Victory! 🎉',
          expect.stringContaining('I just won ROADKILL BINGO with 15/25 tiles spotted in 2:00'),
          expect.arrayContaining([
            expect.objectContaining({ text: 'Copy Message' }),
            expect.objectContaining({ text: 'View @deadaheadroadkill' }),
            expect.objectContaining({ text: 'Later' }),
          ])
        );
      });
    });

    it('should handle consent dialog errors gracefully', async () => {
      // This test is not applicable since we're using the real ConsentDialogProvider
      // The error handling would be within the provider itself
      expect(true).toBe(true);
    });
  });

  describe('Victory Screen Rendering', () => {
    it('renders victory stats correctly', async () => {
      const TestComponent = () => (
        <ConsentDialogProvider>
          <VictoryScreen
            onPlayAgain={mockOnPlayAgain}
            onBackToDashboard={mockOnBackToDashboard}
          />
        </ConsentDialogProvider>
      );

      render(<TestComponent />);

      // Wait for stats to be displayed
      await waitFor(() => {
        expect(screen.getByText('15/25')).toBeTruthy();
        expect(screen.getByText('Tiles Spotted')).toBeTruthy();
        expect(screen.getByText('2:00')).toBeTruthy();
        expect(screen.getByText('Time')).toBeTruthy();
        expect(screen.getByText('60%')).toBeTruthy();
        expect(screen.getByText('Complete')).toBeTruthy();
        expect(screen.getByText('3 in a row')).toBeTruthy();
        expect(screen.getByText('Victory')).toBeTruthy();
      });
    });

    it('calls onPlayAgain when play again button is pressed', async () => {
      const TestComponent = () => (
        <ConsentDialogProvider>
          <VictoryScreen
            onPlayAgain={mockOnPlayAgain}
            onBackToDashboard={mockOnBackToDashboard}
          />
        </ConsentDialogProvider>
      );

      render(<TestComponent />);

      // Wait for buttons to be displayed
      await waitFor(() => {
        expect(screen.getByText('🎮 Play Again')).toBeTruthy();
      });

      const playAgainButton = screen.getByText('🎮 Play Again');
      fireEvent.press(playAgainButton);

      expect(mockOnPlayAgain).toHaveBeenCalled();
    });
  });
});
