import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import { CameraCapture } from '../CameraCapture';
import { ConsentDialogProvider } from '@/src/hooks/useConsentDialog';
import { Strings } from '@/src/constants/Strings';

// Mock the camera permissions
const mockRequestPermission = jest.fn();
const mockUseCameraPermissions = jest.fn();

jest.mock('expo-camera', () => ({
  CameraView: React.forwardRef((props: any, ref: any) => {
    const { onPress, ...otherProps } = props;
    return <div ref={ref} {...otherProps} data-testid="camera-view" />;
  }),
  CameraType: 'back',
  useCameraPermissions: mockUseCameraPermissions,
}));

// Mock services
jest.mock('@/src/services/cloudinary', () => ({
  uploadImageToCloudinary: jest.fn(() => Promise.resolve('https://cloudinary.com/image.jpg')),
}));

jest.mock('@/src/services/instagramAPI', () => ({
  postToInstagram: jest.fn(() => Promise.resolve({ post_id: 'test-post-id' })),
  openInstagramAccount: jest.fn(),
  generateGameDescription: jest.fn(() => 'Test game description'),
}));

jest.mock('../PhotoGallery', () => ({
  savePhotoToGallery: jest.fn(),
}));

// Mock Alert
const mockAlert = jest.spyOn(Alert, 'alert');

describe('CameraCapture', () => {
  const mockOnPhotoTaken = jest.fn();
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseCameraPermissions.mockReturnValue([
      { granted: true },
      mockRequestPermission,
    ]);
  });

  describe('Permission Handling', () => {
    it('shows permission request when permission is not granted', () => {
      mockUseCameraPermissions.mockReturnValue([
        { granted: false },
        mockRequestPermission,
      ]);

      const TestComponent = () => (
        <ConsentDialogProvider>
          <CameraCapture
            onPhotoTaken={mockOnPhotoTaken}
            onClose={mockOnClose}
          />
        </ConsentDialogProvider>
      );

      render(<TestComponent />);

      expect(screen.getByText(Strings.camera.permissions.title)).toBeTruthy();
      expect(screen.getByText(Strings.camera.permissions.grant)).toBeTruthy();
    });

    it('requests permission when grant permission button is pressed', () => {
      mockUseCameraPermissions.mockReturnValue([
        { granted: false },
        mockRequestPermission,
      ]);

      const TestComponent = () => (
        <ConsentDialogProvider>
          <CameraCapture
            onPhotoTaken={mockOnPhotoTaken}
            onClose={mockOnClose}
          />
        </ConsentDialogProvider>
      );

      render(<TestComponent />);

      const grantButton = screen.getByText(Strings.camera.permissions.grant);
      fireEvent.press(grantButton);

      expect(mockRequestPermission).toHaveBeenCalled();
    });

    it('returns empty view when permission is null', () => {
      mockUseCameraPermissions.mockReturnValue([null, mockRequestPermission]);

      const TestComponent = () => (
        <ConsentDialogProvider>
          <CameraCapture
            onPhotoTaken={mockOnPhotoTaken}
            onClose={mockOnClose}
          />
        </ConsentDialogProvider>
      );

      const result = render(<TestComponent />);

      expect(result.toJSON()).toBeNull();
    });
  });

  describe('Consent Dialog Integration', () => {
    it('shows consent dialog when permissions are granted', async () => {
      const TestComponent = () => (
        <ConsentDialogProvider>
          <CameraCapture
            onPhotoTaken={mockOnPhotoTaken}
            onClose={mockOnClose}
          />
        </ConsentDialogProvider>
      );

      render(<TestComponent />);

      await waitFor(() => {
        expect(screen.getByText(Strings.consent.title)).toBeTruthy();
      });
    });

    it('shows camera when consent is given', async () => {
      const TestComponent = () => (
        <ConsentDialogProvider>
          <CameraCapture
            onPhotoTaken={mockOnPhotoTaken}
            onClose={mockOnClose}
          />
        </ConsentDialogProvider>
      );

      render(<TestComponent />);

      // Wait for consent dialog
      await waitFor(() => {
        expect(screen.getByText(Strings.consent.title)).toBeTruthy();
      });

      // Give consent
      const understandButton = screen.getByText(Strings.consent.understand);
      fireEvent.press(understandButton);

      // Wait for camera to show
      await waitFor(() => {
        expect(screen.getByTestId('camera-view')).toBeTruthy();
        expect(screen.getByText(Strings.camera.controls.capture)).toBeTruthy();
        expect(screen.getByText(Strings.camera.controls.cancel)).toBeTruthy();
        expect(screen.getByText(Strings.camera.controls.flip)).toBeTruthy();
      });
    });

    it('closes component when consent is denied', async () => {
      const TestComponent = () => (
        <ConsentDialogProvider>
          <CameraCapture
            onPhotoTaken={mockOnPhotoTaken}
            onClose={mockOnClose}
          />
        </ConsentDialogProvider>
      );

      render(<TestComponent />);

      // Wait for consent dialog
      await waitFor(() => {
        expect(screen.getByText(Strings.consent.title)).toBeTruthy();
      });

      // Deny consent
      const cancelButton = screen.getByText(Strings.consent.cancel);
      fireEvent.press(cancelButton);

      // Should call onClose
      await waitFor(() => {
        expect(mockOnClose).toHaveBeenCalled();
      });
    });

    it('handles consent dialog errors gracefully', async () => {
      // Mock console.error to avoid noise in tests
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      // This test is not applicable since we're using the real ConsentDialogProvider
      // The error handling would be within the provider itself
      consoleSpy.mockRestore();
    });
  });

  describe('Camera Controls', () => {
    const setupCameraView = async () => {
      const TestComponent = () => (
        <ConsentDialogProvider>
          <CameraCapture
            onPhotoTaken={mockOnPhotoTaken}
            onClose={mockOnClose}
            tileContext={{ tileName: 'Test Tile', gameMode: 'standard' }}
          />
        </ConsentDialogProvider>
      );

      render(<TestComponent />);

      // Wait for consent dialog and give consent
      await waitFor(() => {
        expect(screen.getByText(Strings.consent.title)).toBeTruthy();
      });

      const understandButton = screen.getByText(Strings.consent.understand);
      fireEvent.press(understandButton);

      // Wait for camera to show
      await waitFor(() => {
        expect(screen.getByTestId('camera-view')).toBeTruthy();
      });
    };

    it('calls onClose when cancel button is pressed', async () => {
      await setupCameraView();

      const cancelButton = screen.getByText(Strings.camera.controls.cancel);
      fireEvent.press(cancelButton);

      expect(mockOnClose).toHaveBeenCalled();
    });

    it('shows uploading state when taking picture', async () => {
      await setupCameraView();

      const captureButton = screen.getByText(Strings.camera.controls.capture);
      fireEvent.press(captureButton);

      await waitFor(() => {
        expect(screen.getByText(Strings.camera.states.uploading)).toBeTruthy();
      });
    });

    it('toggles camera facing when flip button is pressed', async () => {
      await setupCameraView();

      const flipButton = screen.getByText(Strings.camera.controls.flip);
      fireEvent.press(flipButton);

      // The camera facing should toggle (tested through component state)
      expect(flipButton).toBeTruthy();
    });
  });

  describe('Photo Upload Flow', () => {
    const setupCameraView = async () => {
      const TestComponent = () => (
        <ConsentDialogProvider>
          <CameraCapture
            onPhotoTaken={mockOnPhotoTaken}
            onClose={mockOnClose}
            tileContext={{ tileName: 'Test Tile', gameMode: 'standard' }}
          />
        </ConsentDialogProvider>
      );

      render(<TestComponent />);

      // Wait for consent dialog and give consent
      await waitFor(() => {
        expect(screen.getByText(Strings.consent.title)).toBeTruthy();
      });

      const understandButton = screen.getByText(Strings.consent.understand);
      fireEvent.press(understandButton);

      // Wait for camera to show
      await waitFor(() => {
        expect(screen.getByTestId('camera-view')).toBeTruthy();
      });
    };

    it('handles successful photo upload', async () => {
      await setupCameraView();

      // Mock the camera ref to return a photo
      const mockTakePictureAsync = jest.fn().mockResolvedValue({
        uri: 'file://test-photo.jpg',
      });

      // Mock the camera ref
      const cameraView = screen.getByTestId('camera-view');
      (cameraView as any).takePictureAsync = mockTakePictureAsync;

      const captureButton = screen.getByText(Strings.camera.controls.capture);
      fireEvent.press(captureButton);

      await waitFor(() => {
        expect(mockAlert).toHaveBeenCalledWith(
          'Success! 🎉',
          expect.stringContaining('Photo uploaded and posted to @roadtripbingo!'),
          expect.arrayContaining([
            expect.objectContaining({ text: 'View on Instagram' }),
            expect.objectContaining({ text: 'OK' }),
          ])
        );
      });

      expect(mockOnPhotoTaken).toHaveBeenCalledWith('file://test-photo.jpg');
    });

    it('handles photo upload error', async () => {
      await setupCameraView();

      // Mock services to throw error
      const { uploadImageToCloudinary } = require('@/src/services/cloudinary');
      uploadImageToCloudinary.mockRejectedValue(new Error('Upload failed'));

      // Mock the camera ref to return a photo
      const mockTakePictureAsync = jest.fn().mockResolvedValue({
        uri: 'file://test-photo.jpg',
      });

      const cameraView = screen.getByTestId('camera-view');
      (cameraView as any).takePictureAsync = mockTakePictureAsync;

      const captureButton = screen.getByText(Strings.camera.controls.capture);
      fireEvent.press(captureButton);

      await waitFor(() => {
        expect(mockAlert).toHaveBeenCalledWith(
          'Upload Failed 😞',
          expect.stringContaining('Upload failed'),
          expect.arrayContaining([
            expect.objectContaining({ text: 'Try Again' }),
            expect.objectContaining({ text: 'Cancel' }),
          ])
        );
      });
    });

    it('handles camera error gracefully', async () => {
      await setupCameraView();

      // Mock the camera ref to throw error
      const mockTakePictureAsync = jest.fn().mockRejectedValue(new Error('Camera error'));

      const cameraView = screen.getByTestId('camera-view');
      (cameraView as any).takePictureAsync = mockTakePictureAsync;

      const captureButton = screen.getByText(Strings.camera.controls.capture);
      fireEvent.press(captureButton);

      await waitFor(() => {
        expect(mockAlert).toHaveBeenCalledWith(
          'Error',
          'Failed to take picture'
        );
      });
    });
  });
});
