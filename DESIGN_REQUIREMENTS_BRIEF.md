# Dead Ahead: Menu Design Requirements Brief

## Overview
This brief outlines the design inputs and requirements for the "Dead Ahead" menu system based on analysis of the existing codebase, screenshots, and project documentation.

## 1. Core Design Attributes

### Color Palette
- **Primary Background**: `#1a1a2e` (dark navy-purple base)
- **Secondary Background**: `#2a2a4a` (lighter card surfaces)  
- **Tertiary Background**: `#3a3a5a` (interactive elements)
- **Primary Red Accent**: `#FF4444` (main branding red - close to specified #E0202F)
- **Secondary Gold Accent**: `#FFD700` (complementary highlight color)
- **Text Primary**: `#FFFFFF` (white text)
- **Text Secondary**: `#CCCCCC` (light grey body text)
- **Text Disabled/Subtle**: `#888888` (muted grey)
- **Border/Outline**: `#666666` (medium grey borders)

### Dark Theme Implementation
- Current background uses `#1a1a2e` instead of specified `#0D0D0F` - consider updating for consistency
- Primary red is `#FF4444` (slightly brighter than specified `#E0202F`)
- Well-established grey hierarchy: `#2A2A2A` → `#888` → `#666` → `#333`

## 2. Typography System

### Current Implementation
- **Primary Font**: System default (iOS/Android native)
- **Available Custom Font**: SpaceMono-Regular.ttf (currently loaded but underutilized)
- **Responsive Font Scaling**: Implemented via unistyles with screen-width-based scaling

### Recommended Typography Hierarchy
- **Headings**: Implement "Bebas Neue" for main titles and navigation headers
- **Body Text**: Implement "Inter" for general content and menu items
- **Current Fallback**: Continue using system fonts where custom fonts unavailable

### Font Sizes (Current Implementation)
```typescript
const fontSizes = {
  xs: 12px (scaled),      // Small text, disclaimers
  sm: 14px (scaled),      // Body text, subtitles  
  md: 16px (scaled),      // Default text
  lg: 18px (scaled),      // Section headers
  xl: 20px (scaled),      // Card titles
  xxl: 24px (scaled),     // Page headers
  huge: 32px (scaled),    // Main titles
  massive: 40px (scaled), // Hero titles
  gigantic: 48px (scaled) // App name/logo
}
```

## 3. Iconography Style

### Current Approach
- **Primary**: Unicode emoji icons (🚗, 📷, 🏆, ⚙️)
- **Secondary**: React Native Paper icons for UI elements
- **Style**: Simple, high-contrast symbols

### Recommended Iconography
- **Game Theme**: Cartoon-style, bold outlines consistent with "retro-grunge cartoon" aesthetic
- **Color Treatment**: Primary red (#FF4444) backgrounds with white icons
- **Size**: Responsive based on screen width (currently 12% of screen width)

## 4. Button Shapes & Interactive Elements

### Current Implementation
- **Shape**: Rounded rectangles with 8px border radius
- **Cards**: Material Design-style elevated cards with subtle shadows
- **Active States**: Red border (`#FF4444`) for selected/active items
- **Size**: Responsive button sizing based on screen dimensions

### Button Styles
```typescript
// Primary Menu Cards
borderRadius: 8px
backgroundColor: Card surfaces (#2a2a4a)
elevation: 2-3 (Material Design shadow)
padding: 16px margins

// Icon Containers  
borderRadius: 50% (circular)
backgroundColor: #FF4444
size: 12% of screen width
```

## 5. Layout & Spacing System

### Grid System
- **Bingo Grid**: 5x5 layout with 1px margins between tiles
- **Menu Layout**: Vertical stack with 16px gaps
- **Container Padding**: 20px horizontal margins
- **Card Spacing**: 16px vertical spacing between elements

### Responsive Behavior
- Font scaling based on screen width (375px base)
- Icon sizes scale with screen dimensions
- Adaptive layouts for different screen sizes

## 6. Visual Effects & States

### Game Tile States
- **Normal**: Full opacity with transparent border
- **Spotted**: 50% opacity with red border (`#FF4444`)
- **Special (FREE)**: Gold badge (`#FFD700`) with black text
- **Overlay**: Red circular checkmark for spotted tiles

### Interactive Feedback
- **Material Design**: Elevation changes on interaction
- **Sound Integration**: Contextual audio feedback per tile category
- **Haptic**: Touch feedback implementation ready

## 7. Current Screen Implementations

### Dashboard/Home Screen
- Hero section with app title and tagline
- Card-based menu navigation
- Age rating disclaimer
- Conservation information section
- Scroll-based layout with bottom navigation consideration

### Game Screen  
- 5x5 bingo grid with responsive tile sizing
- Status tracking for win conditions
- Camera integration for "Snap the Splat" feature

## 8. Technical Implementation Notes

### Styling Framework
- **React Native Unistyles 3.0**: Theme-based responsive styling
- **React Native Paper**: Material Design components
- **Adaptive Themes**: Automatic light/dark mode switching
- **TypeScript**: Strict typing for all style definitions

### Asset Management
- Image assets stored in `/assets/images/`
- Screenshot references available in `/assets/Screenshots/`
- Icon assets integrated into platform-specific app bundles

## 9. Recommendations for Consistency

### Immediate Updates Needed
1. **Background Color**: Update from `#1a1a2e` to specified `#0D0D0F`
2. **Primary Red**: Adjust from `#FF4444` to specified `#E0202F`
3. **Typography**: Implement Bebas Neue and Inter font families
4. **Icon System**: Develop consistent iconography style guide

### Design Principles to Maintain
- **High Contrast**: Ensure accessibility with dark theme
- **Responsive Design**: Maintain scaling across device sizes  
- **Material Design**: Continue elevation and card-based layouts
- **Game Aesthetic**: Balance professional UI with dark humor theme

## 10. File References

### Key Design Files
- `/src/unistyles.ts` - Theme configuration
- `/src/constants/Colors.ts` - Color definitions  
- `/src/screens/DashboardScreen.tsx` - Main menu implementation
- `/src/components/BingoTile.tsx` - Game tile styling
- `/app/_layout.tsx` - App-wide theme setup

### Asset Locations
- Screenshots: `/assets/Screenshots/`
- App Icons: `/assets/images/`
- Fonts: `/assets/fonts/SpaceMono-Regular.ttf`

---

**Document Version**: 1.0  
**Last Updated**: July 2025  
**Purpose**: Foundation reference for Dead Ahead menu design implementation
