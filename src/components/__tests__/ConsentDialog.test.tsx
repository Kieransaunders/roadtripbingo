import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react-native';
import { ConsentDialog } from '../ConsentDialog';

// Mock the hooks
jest.mock('@/src/hooks/useThemeColor', () => ({
  useThemeColor: jest.fn(() => '#000000'),
}));

describe('ConsentDialog', () => {
  const mockOnClose = jest.fn();
  const mockOnConsent = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders correctly when visible', () => {
      render(
        <ConsentDialog
          visible={true}
          onClose={mockOnClose}
          onConsent={mockOnConsent}
        />
      );

      expect(screen.getByText('Consent Required')).toBeTruthy();
      expect(screen.getByText(/By sharing this image/)).toBeTruthy();
      expect(screen.getByText('I Understand')).toBeTruthy();
      expect(screen.getByText('Cancel')).toBeTruthy();
    });

    it('does not render when not visible', () => {
      render(
        <ConsentDialog
          visible={false}
          onClose={mockOnClose}
          onConsent={mockOnConsent}
        />
      );

      // In test environment, Modal might still render content even when not visible
      // We'll check that the Modal has visible=false instead
      const modal = screen.getByLabelText('Consent dialog');
      expect(modal.props.visible).toBe(false);
    });

    it('has correct accessibility properties', () => {
      render(
        <ConsentDialog
          visible={true}
          onClose={mockOnClose}
          onConsent={mockOnConsent}
        />
      );

      const dialog = screen.getByLabelText('Consent dialog');
      expect(dialog).toBeTruthy();
      // Modal doesn't support accessibilityRole="dialog" in React Native
      // expect(dialog.props.accessibilityRole).toBe('dialog');

      const title = screen.getByText('Consent Required');
      expect(title.props.accessibilityRole).toBe('header');

      const understandButton = screen.getByLabelText('I understand and consent');
      expect(understandButton.props.accessibilityRole).toBe('button');
      expect(understandButton.props.accessibilityHint).toBe('Tap to consent to posting the image on Instagram');

      const cancelButton = screen.getByLabelText('Cancel');
      expect(cancelButton.props.accessibilityRole).toBe('button');
      expect(cancelButton.props.accessibilityHint).toBe('Tap to cancel and not post the image');
    });
  });

  describe('Button Callbacks', () => {
    it('calls onConsent with true and onClose when "I Understand" is pressed', () => {
      render(
        <ConsentDialog
          visible={true}
          onClose={mockOnClose}
          onConsent={mockOnConsent}
        />
      );

      const understandButton = screen.getByText('I Understand');
      fireEvent.press(understandButton);

      expect(mockOnConsent).toHaveBeenCalledWith(true);
      expect(mockOnClose).toHaveBeenCalled();
    });

    it('calls onConsent with false and onClose when "Cancel" is pressed', () => {
      render(
        <ConsentDialog
          visible={true}
          onClose={mockOnClose}
          onConsent={mockOnConsent}
        />
      );

      const cancelButton = screen.getByText('Cancel');
      fireEvent.press(cancelButton);

      expect(mockOnConsent).toHaveBeenCalledWith(false);
      expect(mockOnClose).toHaveBeenCalled();
    });

    it('calls onConsent with false and onClose when backdrop is pressed', () => {
      render(
        <ConsentDialog
          visible={true}
          onClose={mockOnClose}
          onConsent={mockOnConsent}
        />
      );

      // Find the backdrop (outer TouchableWithoutFeedback)
      const backdrop = screen.getByTestId('consent-dialog-backdrop');
      fireEvent.press(backdrop);

      expect(mockOnConsent).toHaveBeenCalledWith(false);
      expect(mockOnClose).toHaveBeenCalled();
    });

    it('calls onConsent with false when Modal onRequestClose is triggered', () => {
      render(
        <ConsentDialog
          visible={true}
          onClose={mockOnClose}
          onConsent={mockOnConsent}
        />
      );

      const modal = screen.getByLabelText('Consent dialog');
      fireEvent(modal, 'requestClose');

      expect(mockOnConsent).toHaveBeenCalledWith(false);
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  describe('Content', () => {
    it('displays the correct consent message', () => {
      render(
        <ConsentDialog
          visible={true}
          onClose={mockOnClose}
          onConsent={mockOnConsent}
        />
      );

      expect(screen.getByText('By sharing this image, you consent to it being posted on our Instagram. Note: Images may be graphic.')).toBeTruthy();
    });

    it('displays the correct title', () => {
      render(
        <ConsentDialog
          visible={true}
          onClose={mockOnClose}
          onConsent={mockOnConsent}
        />
      );

      expect(screen.getByText('Consent Required')).toBeTruthy();
    });
  });
});
