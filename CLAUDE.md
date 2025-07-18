# CLAUDE.md - Dead Ahead: Roadkill Bingo

## Project Overview
Dead Ahead: Roadkill Bingo is a React Native/Expo mobile game where players spot bizarre roadside sights during road trips using a 5×5 bingo grid. The game combines dark British humor with interactive gameplay, featuring a camera integration for "Snap-a-Roadkill" photo sharing and leaderboards.

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

### Development Tools
- **Context7-mcp** for looking up up-to-date documentation for various libraries and frameworks

## Project Structure

```
/
├── app/                    # Expo Router file-based routing
│   ├── (tabs)/            # Tab navigator structure
│   │   ├── _layout.tsx    # Tab navigation configuration
│   │   ├── index.tsx      # Home screen (currently template)
│   │   └── explore.tsx    # Explore screen (currently template)
│   ├── _layout.tsx        # Root layout with navigation theme
│   └── +not-found.tsx     # 404 screen
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── ui/           # Platform-specific UI components
│   │   └── [various themed components]
│   ├── constants/         # Theme colors and constants
│   ├── data/
│   │   └── tiles.ts      # Game tiles data (33 tiles with categories/rarity)
│   ├── hooks/            # Custom React hooks
│   ├── stores/
│   │   └── gameStore.ts  # Zustand store for game state
│   ├── styles/           # (empty - using Unistyles)
│   └── unistyles.ts      # Unistyles theme configuration
├── assets/
│   └── images/           # Game tile images (30+ PNG files)
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
  - ROADKILL (11 tiles) - dark humor content
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

# Build for production
npx expo build        # Production builds (requires EAS)
```

## Current Development Status

### Implemented
- ✅ Project scaffolding with Expo Router
- ✅ Zustand game store with complete game logic
- ✅ Comprehensive tile system with 33 game tiles
- ✅ Unistyles theming system
- ✅ Win condition algorithms (3-in-a-row, 4-in-a-row)
- ✅ Settings system (sound, haptics, dark humor filter)
- ✅ Game statistics tracking
- ✅ All game assets (tile images)
- ✅ Camera integration for photo capture
- ✅ Instagram API integration for photo sharing
- ✅ Consent dialog system for user privacy
- ✅ Bottom navigation across all screens
- ✅ Victory screen with animations and sharing
- ✅ Photo gallery and cloud storage integration

### TODO (Per PDR.md)
- 🚧 Replace template screens with actual game UI
- 🚧 Implement 5×5 bingo grid component
- 🚧 Build leaderboard with image upload
- 🚧 Implement sound effects and haptic feedback
- 🚧 Create settings screen
- 🚧 Add card gallery for previous games
- 🚧 Add game tutorial/onboarding screens
- 🚧 Implement user statistics and achievements display

## Key Configuration Files

### `app.json`
- Bundle IDs: `com.anonymous.deadaheadbingo`
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
- 30+ PNG tile images (dead animals, vehicles, roadside items)
- App icons and splash screens
- Logo assets (`dead_ahead_logo.png`, `free_range_logo_square.jpg`)

### Notable Dependencies
- **expo-camera**: For roadkill photo capture
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

- **File-based routing**: Screens go in `app/` directory
- **Component organization**: Reusable components in `src/components/`
- **Store pattern**: Zustand store handles all game state management
- **Theme system**: Unistyles provides responsive, platform-aware styling
- **Asset management**: Images bundled via `require()` statements

## PDR Reference
See `PDR.md` for complete product requirements, game rules, content categories, and development milestones. The technical implementation closely follows the PDR specifications with modern React Native/Expo architecture.

---

*This file serves as the primary reference for understanding the Dead Ahead: Roadkill Bingo codebase architecture, development setup, and current implementation status.*