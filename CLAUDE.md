# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# Road Trip Bingo

## Project Overview
Road Trip Bingo is a React Native/Expo mobile game where players spot interesting roadside sights during road trips using a 5×5 bingo grid. The game combines fun gameplay with interactive camera integration for photo sharing and leaderboards.

## Key Technical Stack

### Core Framework
- **Expo SDK 53** with React Native 0.79.5
- **React Native New Architecture** enabled (`newArchEnabled: true`)
- **TypeScript** with strict mode enabled
- **Expo Router** for file-based navigation

### State Management & Styling
- **Zustand** for global state management (game state, settings, stats)
- **React Native Unistyles 3.0** for theming and responsive styling
- **Neo UI** component library for enhanced UI components
- **React Native Reanimated 3.17** for animations

### Development Tools
- **Babel** with Unistyles and Reanimated plugins
- **ESLint** with Expo configuration
- **React Query** for data fetching and caching
- **Jest** for unit testing with React Native Testing Library
- **Playwright** for end-to-end testing
- **Context7-mcp** for looking up up-to-date documentation for various libraries and frameworks

## Project Structure

```
/
├── app/                    # Expo Router file-based routing
│   ├── _layout.tsx        # Root layout with navigation theme
│   ├── index.tsx          # Dashboard screen (main menu)
│   ├── game.tsx           # Game screen with 5x5 bingo grid
│   ├── settings.tsx       # Settings screen
│   ├── camera.tsx         # Camera screen for photo capture
│   ├── trophy-room.tsx    # Trophy gallery/photo collection screen
│   ├── victory.tsx        # Victory screen with animations
│   └── +not-found.tsx     # 404 screen
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── ui/           # Platform-specific UI components
│   │   ├── Camera/       # Camera-related components
│   │   └── [various themed components]
│   ├── constants/         # Theme colors and constants
│   ├── data/
│   │   └── tiles.ts      # Game tiles data (33 tiles with categories/rarity)
│   ├── hooks/            # Custom React hooks
│   ├── locales/          # Internationalization files
│   ├── screens/          # Screen components (used by app/ routes)
│   ├── stores/
│   │   └── gameStore.ts  # Zustand store for game state
│   ├── styles/           # (empty - using Unistyles)
│   └── unistyles.ts      # Unistyles theme configuration
├── assets/
│   └── images/           # Game tile images (40+ WebP files, optimized)
├── android/              # Android-specific configuration
├── ios/                  # iOS-specific configuration
└── [config files]
```

## Game Architecture

### Core Game Logic (`src/stores/gameStore.ts`)
- **BingoCell Interface**: Represents each tile with position, spotted state, and tile data
- **GameState Interface**: Complete game state including grid, settings, stats
- **Win Conditions**: 
  - Standard mode: 3-in-a-row
  - Savage mode: 5-in-a-row
  - Checks rows, columns, and diagonals
- **Grid Generation**: 5×5 grid with center "Free Range" tile always spotted

### Tile System (`src/data/tiles.ts`)
- **33 unique tiles** across 6 categories:
  - SIGHTINGS (11 tiles) - interesting roadside observations
  - VEHICLES (7 tiles) - cars, trucks, trailers
  - ROADSIDE (7 tiles) - litter, lost items
  - PEOPLE (3 tiles) - human activities
  - INFRASTRUCTURE (4 tiles) - road features
  - SPECIAL (1 tile) - center "Free Range" tile
- **Rarity system**: Common (60%), Uncommon (30%), Rare (10%)
- **Dark humor filter**: Optional content filtering for sensitive tiles

### Theme System (`src/unistyles.ts`)
- Light/Dark theme support with adaptive switching
- Color scheme: Red (#FF4444) primary, Gold (#FFD700) secondary
- Responsive breakpoints (xs, sm, md, lg, xl)
- Platform-specific styling capabilities

## Development Commands

```bash
# Start development server
npm start
npx expo start

# Platform-specific builds
npm run android        # Android development build
npm run ios           # iOS development build
npm run web           # Web development build

# Development tools
npm run lint          # ESLint code checking
npm run reset-project # Reset to blank Expo template

# Testing
npm run test          # Run Jest unit tests
npm run test:watch    # Run Jest in watch mode
npm run test:coverage # Run tests with coverage report
npm run test:e2e      # Run Playwright end-to-end tests
npm run test:e2e:ui   # Run Playwright tests with UI
npm run test:e2e:headed # Run Playwright tests in headed mode

# Build for production
npx expo build        # Production builds (requires EAS)
```

## Current Development Status

### Implemented
- ✅ Project scaffolding with Expo Router
- ✅ Zustand game store with complete game logic
- ✅ Comprehensive tile system with 33 game tiles
- ✅ Unistyles theming system
- ✅ Win condition algorithms (3-in-a-row, 5-in-a-row)
- ✅ Settings system (sound, haptics, content filter)
- ✅ Game statistics tracking and achievements system
- ✅ All game assets (tile images optimized to WebP)
- ✅ Camera integration for photo capture
- ✅ Instagram API integration for photo sharing
- ✅ Consent dialog system for user privacy
- ✅ All game screens implemented (Dashboard, Game, Settings, Camera, Trophy Room, Victory)
- ✅ 5×5 bingo grid component with interactive tiles
- ✅ Victory screen with animations and sharing
- ✅ Photo gallery and cloud storage integration
- ✅ Testing setup with Jest and Playwright
- ✅ Internationalization support

### TODO (Per PDR.md)
- 🚧 Sound effects and haptic feedback implementation
- 🚧 Leaderboard with cloud sync
- 🚧 Game tutorial/onboarding screens
- 🚧 Enhanced achievement system display
- 🚧 Statistics dashboard improvements

## Key Configuration Files

### `app.json`
- Bundle IDs: `uk.co.iconnectit.roadtripbingo`
- New Architecture enabled
- Portrait orientation only
- Expo Router and Splash Screen plugins

### `babel.config.js`
- Unistyles plugin with `src` root
- Reanimated plugin for animations
- Expo preset configuration

### `tsconfig.json`
- Strict TypeScript mode
- Path aliases: `@/*` maps to project root
- Expo TypeScript base configuration

## Assets & Resources

### Game Assets (`assets/images/`)
- 40+ WebP tile images (animals, vehicles, roadside items) - optimized for 80%+ size reduction
- App icons and splash screens (PNG format for compatibility)
- Logo assets (`road_trip_bingo_logo.webp`, `free_range_logo_square.jpg`)

### Notable Dependencies
- **expo-camera**: For photo capture
- **expo-haptics**: Tactile feedback
- **expo-image**: Optimized image loading
- **react-native-gesture-handler**: Touch interactions
- **react-native-webview**: Web content display

## Development Tips

1. **Game State**: Use `useGameStore()` hook to access/modify game state
2. **Theming**: Import and use Unistyles for consistent styling
3. **Assets**: All tile images are already imported in `tiles.ts`
4. **Navigation**: Use Expo Router file-based routing in `app/` directory
5. **Platform Support**: Project supports iOS, Android, and web simultaneously

## Architecture Notes

- **File-based routing**: Screens go in `app/` directory with corresponding components in `src/screens/`
- **Component organization**: Reusable components in `src/components/` with platform-specific UI components in `src/components/ui/`
- **Store pattern**: Zustand store handles all game state management with AsyncStorage persistence
- **Theme system**: Unistyles provides responsive, platform-aware styling with light/dark theme support
- **Asset management**: Images bundled via `require()` statements, optimized with WebP format for 80%+ size reduction
- **Testing**: Component tests in `__tests__` directories, Jest configuration for React Native, Playwright for E2E tests
- **Navigation**: Bottom tab navigation with consistent routing across all screens

## PDR Reference
See `PDR.md` for complete product requirements, game rules, content categories, and development milestones. The technical implementation closely follows the PDR specifications with modern React Native/Expo architecture.

---

*This file serves as the primary reference for understanding the Road Trip Bingo codebase architecture, development setup, and current implementation status.*