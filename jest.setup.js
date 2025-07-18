// Setup for React Native Testing Library
// Note: extend-expect is deprecated in newer versions

// Mock React Native components
jest.mock('react-native', () => {
  // Mock DevMenu module to avoid TurboModuleRegistry error
  const mockDevMenu = {
    show: jest.fn(),
    hide: jest.fn(),
    reload: jest.fn(),
  };
  
  // Mock TurboModuleRegistry to avoid DevMenu error
  const mockTurboModuleRegistry = {
    getEnforcing: jest.fn().mockImplementation((name) => {
      if (name === 'DevMenu') {
        return mockDevMenu;
      }
      throw new Error(`Cannot find module '${name}'`);
    }),
    get: jest.fn().mockImplementation((name) => {
      if (name === 'DevMenu') {
        return mockDevMenu;
      }
      // Return a mock for feature flags
      if (name === 'NativeReactNativeFeatureFlags') {
        return {
          commonTestFlag: jest.fn(() => false),
          allowRecursiveCommitsWithSynchronousMountOnAndroid: jest.fn(() => false),
          allowCollapsableChildren: jest.fn(() => true),
          allowReturnEmptyStringOnClipboard: jest.fn(() => true),
          enableAccessibilityProvider: jest.fn(() => false),
          enableEventEmitterRetentionDuringGesturesOnAndroid: jest.fn(() => false),
          enableGranularScrollViewStateUpdatesAndroid: jest.fn(() => false),
          enableMicrotasks: jest.fn(() => false),
          enableSpannableBuildingUnification: jest.fn(() => false),
          enableSynchronousStateUpdates: jest.fn(() => false),
          enableUIConsistency: jest.fn(() => false),
          fetchImagesInViewPreload: jest.fn(() => false),
          fixIncorrectScrollViewStateUpdateOnAndroid: jest.fn(() => false),
          fixMappingOfEventPrioritiesBetweenFabricAndReact: jest.fn(() => false),
          fixMissedFabricStateUpdate: jest.fn(() => false),
          forceBatchingMountItemsOnAndroid: jest.fn(() => false),
          fuseboxEnabledDebug: jest.fn(() => false),
          fuseboxEnabledRelease: jest.fn(() => false),
          initEagerTurboModulesOnNativeModulesQueueAndroid: jest.fn(() => false),
          lazyAnimationCallbacks: jest.fn(() => false),
          loadVectorDrawablesOnImages: jest.fn(() => false),
          setAndroidLayoutDirection: jest.fn(() => true),
          traceTurboModulePromiseRejectionsOnAndroid: jest.fn(() => false),
          useFabricInterop: jest.fn(() => false),
          useImmediateExecutorInAndroidBridgeless: jest.fn(() => false),
          useModernRuntimeScheduler: jest.fn(() => false),
          useNativeViewConfigsInBridgelessMode: jest.fn(() => false),
          useNewReactImageViewBackgroundDrawing: jest.fn(() => false),
          useOptimisedViewPreallocationOnAndroid: jest.fn(() => false),
          useOptimizedEventBatchingOnAndroid: jest.fn(() => false),
          useRuntimeShadowNodeReferenceUpdate: jest.fn(() => false),
          useTurboModuleInterop: jest.fn(() => false),
          useTurboModules: jest.fn(() => false),
        };
      }
      return null;
    }),
  };
  
  return {
    Alert: {
      alert: jest.fn(),
    },
    Dimensions: {
      get: jest.fn(() => ({ width: 375, height: 667 })),
    },
    Platform: {
      OS: 'ios',
      select: jest.fn((obj) => obj.ios),
    },
    TurboModuleRegistry: mockTurboModuleRegistry,
    StyleSheet: {
      create: jest.fn((styles) => styles),
      flatten: jest.fn((styles) => styles),
      compose: jest.fn((styles) => styles),
    },
    View: 'View',
    Text: 'Text',
    Modal: 'Modal',
    TouchableOpacity: 'TouchableOpacity',
    TouchableWithoutFeedback: 'TouchableWithoutFeedback',
    ActivityIndicator: 'ActivityIndicator',
    ScrollView: 'ScrollView',
    SafeAreaView: 'SafeAreaView',
    FlatList: 'FlatList',
    Image: 'Image',
    Button: 'Button',
    TextInput: 'TextInput',
    StatusBar: 'StatusBar',
    KeyboardAvoidingView: 'KeyboardAvoidingView',
    Animated: {
      View: 'Animated.View',
      Text: 'Animated.Text',
      ScrollView: 'Animated.ScrollView',
      timing: jest.fn(),
      spring: jest.fn(),
      decay: jest.fn(),
      sequence: jest.fn(),
      parallel: jest.fn(),
      delay: jest.fn(),
      stagger: jest.fn(),
      Value: jest.fn(() => ({
        setValue: jest.fn(),
        addListener: jest.fn(),
        removeListener: jest.fn(),
        removeAllListeners: jest.fn(),
        stopAnimation: jest.fn(),
        resetAnimation: jest.fn(),
        interpolate: jest.fn(() => ({
          setValue: jest.fn(),
          addListener: jest.fn(),
          removeListener: jest.fn(),
          removeAllListeners: jest.fn(),
          stopAnimation: jest.fn(),
          resetAnimation: jest.fn(),
        })),
      })),
    },
    Easing: {
      linear: jest.fn(),
      ease: jest.fn(),
      quad: jest.fn(),
      cubic: jest.fn(),
      poly: jest.fn(),
      sin: jest.fn(),
      circle: jest.fn(),
      exp: jest.fn(),
      elastic: jest.fn(),
      back: jest.fn(),
      bounce: jest.fn(),
      bezier: jest.fn(),
      in: jest.fn(),
      out: jest.fn(),
      inOut: jest.fn(),
    },
  };
});

// Mock expo modules
jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(),
  notificationAsync: jest.fn(),
  NotificationFeedbackType: {
    Success: 'success',
    Error: 'error',
  },
  ImpactFeedbackStyle: {
    Light: 'light',
    Medium: 'medium',
    Heavy: 'heavy',
  },
}));

jest.mock('expo-clipboard', () => ({
  setStringAsync: jest.fn(),
}));

jest.mock('expo-camera', () => ({
  CameraView: 'CameraView',
  CameraType: 'back',
  useCameraPermissions: jest.fn(() => [
    { granted: true },
    jest.fn()
  ]),
}));

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: jest.fn(() => ({ top: 0, bottom: 0, left: 0, right: 0 })),
}));

jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

jest.mock('react-native-gesture-handler', () => ({}));

jest.mock('@joe111/neo-ui', () => ({
  Button: 'Button',
  ThemedText: 'ThemedText',
  Box: 'Box',
}));

jest.mock('react-native-unistyles', () => ({
  StyleSheet: {
    create: jest.fn((styles) => styles),
  },
}));

// Mock Sentry
jest.mock('@sentry/react-native', () => ({
  captureException: jest.fn(),
  startSpan: jest.fn((options, callback) => callback()),
}));

// Mock services
jest.mock('./src/services/instagramAPI', () => ({
  openInstagramAccount: jest.fn(),
  postToInstagram: jest.fn(),
  generateGameDescription: jest.fn(),
}));

jest.mock('./src/services/cloudinary', () => ({
  uploadImageToCloudinary: jest.fn(),
}));

jest.mock('./src/components/Camera/PhotoGallery', () => ({
  savePhotoToGallery: jest.fn(),
}));

// Mock theme hook
jest.mock('./src/hooks/useThemeColor', () => ({
  useThemeColor: jest.fn(() => '#000000'),
}));

// Mock DevMenu to avoid TurboModuleRegistry errors
jest.mock('react-native/src/private/devmenu/DevMenu', () => ({
  show: jest.fn(),
  hide: jest.fn(),
  reload: jest.fn(),
}));

// Mock TurboModuleRegistry
jest.mock('react-native/Libraries/TurboModule/TurboModuleRegistry', () => ({
  getEnforcing: jest.fn().mockImplementation((name) => {
    if (name === 'DevMenu') {
      return {
        show: jest.fn(),
        hide: jest.fn(),
        reload: jest.fn(),
      };
    }
    throw new Error(`Cannot find module '${name}'`);
  }),
}));

// Global test setup
global.console = {
  ...console,
  warn: jest.fn(),
  error: jest.fn(),
  log: jest.fn(),
};
