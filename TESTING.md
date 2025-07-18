# Testing Guide

This project includes comprehensive testing for the consent dialog functionality and camera capture flow.

## Test Setup

### Dependencies
- Jest - Unit testing framework
- React Native Testing Library - Component testing utilities
- Playwright - E2E testing framework
- Sentry - Error tracking and monitoring (with mocked implementation for tests)

### Running Tests

```bash
# Run all unit tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e

# Run E2E tests with UI
npm run test:e2e:ui

# Run E2E tests in headed mode
npm run test:e2e:headed
```

## Test Structure

### Unit Tests

#### ConsentDialog Component (`src/components/__tests__/ConsentDialog.test.tsx`)
- **Rendering Tests**: Verifies that the dialog renders correctly when visible/hidden
- **Accessibility Tests**: Ensures proper accessibility roles and labels
- **Button Callbacks**: Tests that buttons call the correct callbacks with appropriate parameters
- **Backdrop Interaction**: Tests that clicking the backdrop dismisses the dialog
- **Modal Behavior**: Tests that the modal's onRequestClose handler works correctly

#### CameraCapture Component (`src/components/Camera/__tests__/CameraCapture.test.tsx`)
- **Permission Handling**: Tests camera permission request flow
- **Consent Dialog Integration**: Tests that consent dialog appears before camera access
- **Camera Controls**: Tests cancel, flip, and capture button functionality
- **Photo Upload Flow**: Tests successful and failed photo upload scenarios
- **Error Handling**: Tests graceful error handling for various failure scenarios

### Integration Tests

#### VictoryScreen (`src/screens/__tests__/VictoryScreen.test.tsx`)
- **Consent Dialog Integration**: Tests that share functionality requires consent
- **Share Handler Blocking**: Verifies that share handlers are not called without consent
- **Victory Stats Display**: Tests that victory statistics are rendered correctly
- **Error Handling**: Tests graceful handling of consent dialog errors

### E2E Tests

#### Camera Capture Flow (`e2e/camera-capture.spec.ts`)
- **Consent Dialog Flow**: Tests the complete consent dialog interaction
- **Camera Access**: Tests camera permission and access flow
- **Photo Capture**: Tests the complete photo capture and upload process
- **Error Scenarios**: Tests handling of upload failures and permission denials
- **Session Persistence**: Tests that consent choice persists across sessions

## Key Testing Scenarios

### 1. Consent Dialog Workflow
- User sees consent dialog before camera access
- User can accept or deny consent
- Consent choice affects subsequent camera access
- Error handling for consent dialog failures

### 2. Camera Capture Flow
- Camera permissions are requested properly
- Camera interface loads after consent
- Photo capture triggers upload process
- Success/failure feedback is shown appropriately

### 3. Victory Screen Share Integration
- Share button triggers consent dialog
- Share functionality is blocked without consent
- Victory stats are displayed correctly
- Error handling for share failures

## Test Configuration

### Jest Configuration (`jest.config.js`)
- Uses React Native preset for proper module resolution
- Configures TypeScript and JSX transformation
- Sets up module mapping for absolute imports
- Excludes E2E tests from unit test runs

### Playwright Configuration (`playwright.config.ts`)
- Configures mobile device testing (iPhone 14, Galaxy S9+)
- Sets up web server for testing
- Configures test reporting and artifacts
- Sets appropriate timeouts and retry strategies

## Mocking Strategy

### Global Mocks (`jest.setup.js`)
- React Native components and APIs
- Expo modules (Camera, Haptics, Clipboard)
- External services (Sentry, Instagram API, Cloudinary)
- Theme and styling utilities

### Component-Specific Mocks
- Camera permissions and functionality
- Network requests and responses
- Alert and notification systems
- File system operations

## Best Practices

1. **Isolation**: Each test is isolated and doesn't depend on others
2. **Mocking**: External dependencies are properly mocked
3. **Accessibility**: Tests include accessibility verification
4. **Error Handling**: Both success and failure scenarios are tested
5. **Real User Flows**: E2E tests simulate actual user interactions
6. **Performance**: Tests are optimized for speed and reliability

## Troubleshooting

### Common Issues
- **Module Resolution**: Ensure all imports use proper paths
- **TypeScript Errors**: Check that all types are properly defined
- **Async Operations**: Use proper async/await patterns in tests
- **Mock Conflicts**: Ensure mocks don't interfere with each other

### Debugging Tips
- Use `npm run test:watch` for faster development cycles
- Add `console.log` statements in tests for debugging
- Use `--verbose` flag for detailed test output
- Check browser developer tools for E2E test issues
