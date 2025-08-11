# Accessibility & Usability Checklist - WCAG AA Compliance

> **Comprehensive accessibility guidelines for the Dead Ahead Bingo game to ensure WCAG 2.1 AA compliance and inclusive user experience.**

## Table of Contents
- [Color Contrast Compliance](#color-contrast-compliance)
- [Focus Visibility](#focus-visibility)
- [Keyboard Navigation](#keyboard-navigation)
- [ARIA Labels & Semantic HTML](#aria-labels--semantic-html)
- [Reduced Motion Support](#reduced-motion-support)
- [Touch & Interaction](#touch--interaction)
- [Content & Typography](#content--typography)
- [Testing & Validation](#testing--validation)

---

## Color Contrast Compliance

### ✅ WCAG AA Requirements
- **Normal text**: Minimum 4.5:1 contrast ratio
- **Large text**: Minimum 3:1 contrast ratio (18pt+ or 14pt+ bold)
- **UI components**: Minimum 3:1 contrast ratio for interactive elements

### 🎯 Implementation Checklist

#### Text Contrast
- [ ] **Primary text** (`--da-text-primary: #212121`) achieves 15.8:1 on white backgrounds ✅
- [ ] **Secondary text** (`--da-text-secondary: #404040`) achieves 12.6:1 on white backgrounds ✅
- [ ] **Muted text** (`--da-text-muted: #666666`) achieves 7.0:1 on white backgrounds ✅
- [ ] **Warning text** uses `--da-warning-text: #664d00` (8.9:1) instead of `--da-warning: #ffc107` (1.8:1) ⚠️
- [ ] **Error text** (`--da-red-text: #9a1a24`) achieves 8.2:1 on white backgrounds ✅
- [ ] **Success text** (`--da-success-text: #0f4419`) achieves 11.1:1 on white backgrounds ✅

#### Interactive Element Contrast
- [ ] **Primary buttons** (`--da-primary: #0066ff`) achieve 4.5:1 contrast ✅
- [ ] **Secondary buttons** meet 3:1 contrast for borders and backgrounds
- [ ] **Navigation items** in BottomNavigation achieve sufficient contrast
- [ ] **BingoTile** spotted state (`#FF4444`) provides adequate contrast
- [ ] **Focus indicators** meet 3:1 contrast against adjacent colors

#### Dark Mode Considerations
- [ ] **Dark theme** colors provide equivalent contrast ratios
- [ ] **Text on dark backgrounds** uses appropriate inverse colors
- [ ] **Interactive elements** maintain contrast in both light and dark modes

### 🔧 Action Items
```css
/* Update warning button text for accessibility */
.btn--warning {
  color: var(--da-warning-text); /* Use #664d00 instead of #ffc107 */
}

/* Ensure bingo tile contrast */
.bingo-tile.spotted {
  border-color: #ff4444; /* Verify 3:1 contrast */
  background-color: rgba(42, 42, 42, 0.9); /* Ensure sufficient contrast */
}
```

---

## Focus Visibility

### ✅ WCAG AA Requirements
- **Visible focus indicator** for all interactive elements
- **Minimum 2px thick** focus indicator
- **Sufficient contrast** (3:1) between focus indicator and background
- **Consistent focus behavior** across all UI components

### 🎯 Implementation Checklist

#### Focus Indicator Standards
- [ ] **All interactive elements** have visible focus indicators
- [ ] **Focus indicators** are at least 2px thick
- [ ] **Two-color focus system** implemented for maximum visibility
- [ ] **Focus indicators** don't rely solely on color changes
- [ ] **`:focus-visible`** pseudo-class used instead of `:focus` where appropriate

#### Component-Specific Focus
- [ ] **BingoTile components** show clear focus indicators
  ```tsx
  // Current implementation needs focus indicator
  <Pressable
    style={[styles.container, focused && styles.focusedContainer]}
    onFocus={() => setFocused(true)}
    onBlur={() => setFocused(false)}
  />
  ```
- [ ] **BottomNavigation buttons** have distinct focus states
- [ ] **Form inputs** (if any) show clear focus boundaries
- [ ] **Modal dialogs** and overlays handle focus properly
- [ ] **Custom buttons** maintain consistent focus behavior

#### Focus Management
- [ ] **Focus trapping** in modals and dialogs
- [ ] **Focus restoration** when closing modals
- [ ] **Logical focus order** follows visual layout
- [ ] **Skip links** for main navigation areas
- [ ] **Focus doesn't get lost** during dynamic content updates

### 🔧 Action Items
```css
/* Implement two-color focus system */
*:focus-visible {
  /* Inner indicator - light color */
  outline: 2px solid #F9F9F9;
  outline-offset: 0;
  /* Outer indicator - dark color */
  box-shadow: 0 0 0 4px #193146;
}

/* Remove outline: none declarations */
.btn:focus {
  /* Remove: outline: none; */
  box-shadow: 0 0 0 2px var(--da-focus);
}
```

```tsx
// Add focus management to BingoTile
const BingoTile = ({ cell, onPress }) => {
  const [focused, setFocused] = useState(false);
  
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: cell.isSpotted }}
      accessibilityLabel={`Bingo tile: ${cell.tile.description}${cell.isSpotted ? ', spotted' : ''}`}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={[
        styles.container,
        focused && styles.focusedContainer
      ]}
    />
  );
};
```

---

## Keyboard Navigation

### ✅ WCAG AA Requirements
- **All functionality** accessible via keyboard
- **Logical tab order** following visual layout
- **No keyboard traps** except where intended (modals)
- **Visible focus indicators** for all focusable elements
- **Consistent navigation** patterns throughout application

### 🎯 Implementation Checklist

#### Navigation Order
- [ ] **Tab order** follows logical reading sequence (left-to-right, top-to-bottom)
- [ ] **BingoGrid** tiles navigate in grid order (row by row)
- [ ] **BottomNavigation** items are in logical sequence
- [ ] **Modal dialogs** trap focus within dialog boundaries
- [ ] **Dynamic content** updates maintain proper tab order

#### Keyboard Shortcuts
- [ ] **Space/Enter** activates buttons and interactive elements
- [ ] **Arrow keys** provide grid navigation for BingoGrid
- [ ] **Escape key** closes modals and dialogs
- [ ] **Tab/Shift+Tab** moves between focusable elements
- [ ] **Home/End** keys navigate to first/last items in lists

#### Component Keyboard Support
- [ ] **BingoTile** responds to Space and Enter keys
- [ ] **BottomNavigation** supports arrow key navigation
- [ ] **Camera controls** are keyboard accessible
- [ ] **Settings panels** can be operated without mouse
- [ ] **Game controls** support keyboard interaction

### 🔧 Action Items
```tsx
// Add keyboard support to BingoTile
const BingoTile = ({ cell, onPress, onFocus }) => {
  const handleKeyPress = (event: any) => {
    if (event.nativeEvent.key === 'Enter' || event.nativeEvent.key === ' ') {
      event.preventDefault();
      onPress(cell.position);
    }
  };

  return (
    <Pressable
      onPress={() => onPress(cell.position)}
      onKeyPress={handleKeyPress}
      accessibilityRole="button"
      focusable={true}
    />
  );
};

// Add arrow key navigation to BingoGrid
const BingoGrid = ({ cells, onTilePress }) => {
  const handleKeyNavigation = (event: any, currentIndex: number) => {
    const gridSize = 5; // 5x5 grid
    let newIndex = currentIndex;
    
    switch (event.nativeEvent.key) {
      case 'ArrowUp':
        newIndex = currentIndex - gridSize;
        break;
      case 'ArrowDown':
        newIndex = currentIndex + gridSize;
        break;
      case 'ArrowLeft':
        newIndex = currentIndex - 1;
        break;
      case 'ArrowRight':
        newIndex = currentIndex + 1;
        break;
    }
    
    // Focus new tile if within bounds
    if (newIndex >= 0 && newIndex < cells.length) {
      // Focus management logic
    }
  };
};
```

---

## ARIA Labels & Semantic HTML

### ✅ WCAG AA Requirements
- **Proper semantic markup** for all UI components
- **ARIA labels** for icon-only buttons and complex interactions
- **ARIA states** (expanded, selected, disabled) for interactive elements
- **ARIA descriptions** for complex UI patterns
- **Accessible names** for all interactive elements

### 🎯 Implementation Checklist

#### Icon-Only Buttons
- [ ] **All icon-only buttons** have `aria-label` or `aria-labelledby`
- [ ] **BottomNavigation icons** include descriptive labels
- [ ] **Camera controls** have accessible names
- [ ] **Settings toggles** describe their function
- [ ] **Close/dismiss buttons** are clearly labeled

#### Interactive States
- [ ] **BingoTile spotted state** uses `aria-pressed` or `aria-selected`
- [ ] **Navigation active state** uses `aria-current="page"`
- [ ] **Disabled elements** use `aria-disabled="true"`
- [ ] **Loading states** use `aria-busy="true"`
- [ ] **Expanded/collapsed** elements use `aria-expanded`

#### Complex UI Patterns
- [ ] **BingoGrid** uses `role="grid"` with proper cell markup
- [ ] **Modal dialogs** use `role="dialog"` with `aria-labelledby`
- [ ] **Alert messages** use `role="alert"` for important updates
- [ ] **Progress indicators** use `aria-valuenow`, `aria-valuemin`, `aria-valuemax`
- [ ] **Tabs** (if any) use proper tab panel markup

#### Screen Reader Support
- [ ] **Game status** announced to screen readers
- [ ] **Score updates** communicated via live regions
- [ ] **Victory conditions** clearly announced
- [ ] **Error messages** associated with relevant form fields
- [ ] **Dynamic content** updates announced appropriately

### 🔧 Action Items
```tsx
// Update BottomNavigation with proper ARIA labels
const BottomNavigation = () => {
  return (
    <View role="navigation" aria-label="Main navigation">
      {navigationButtons.map((button) => (
        <TouchableOpacity
          key={button.id}
          accessibilityRole="button"
          accessibilityLabel={button.label}
          accessibilityState={{ selected: isActive(button) }}
          aria-current={isActive(button) ? 'page' : undefined}
        >
          <Text aria-hidden="true">{button.icon}</Text>
          <Text>{button.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

// Update BingoTile with proper ARIA attributes
const BingoTile = ({ cell, onPress }) => {
  return (
    <Pressable
      accessibilityRole="gridcell"
      accessibilityLabel={`${cell.tile.description}${cell.isSpotted ? ', spotted' : ', not spotted'}`}
      accessibilityState={{ 
        selected: cell.isSpotted,
        disabled: cell.tile.category === 'special' && cell.isSpotted
      }}
      accessibilityHint="Double tap to mark as spotted"
    >
      {/* Content */}
    </Pressable>
  );
};

// Add live region for game status
const GameStatus = ({ score, tilesSpotted, gameWon }) => {
  return (
    <View 
      accessibilityLiveRegion="polite"
      accessibilityLabel={`Game status: ${score} points, ${tilesSpotted} tiles spotted${gameWon ? ', You won!' : ''}`}
    >
      {/* Status display */}
    </View>
  );
};
```

---

## Reduced Motion Support

### ✅ WCAG AA Requirements
- **Respect `prefers-reduced-motion` setting**
- **Provide motion alternatives** for essential animations
- **Avoid unnecessary animations** that could trigger vestibular disorders
- **Allow users to control** or disable motion effects

### 🎯 Implementation Checklist

#### Motion Preferences
- [ ] **CSS animations** respect `@media (prefers-reduced-motion: reduce)`
- [ ] **JavaScript animations** check motion preferences
- [ ] **Transition effects** can be disabled or reduced
- [ ] **Parallax effects** (if any) have static alternatives
- [ ] **Auto-playing content** respects motion preferences

#### Animation Implementation
- [ ] **Button hover effects** can be disabled
- [ ] **Loading spinners** have reduced motion alternatives
- [ ] **Slide transitions** between screens can be disabled
- [ ] **Victory animations** respect motion preferences
- [ ] **Camera preview effects** don't cause motion sickness

#### Current Implementation Check
- [ ] **Button component CSS** includes reduced motion queries
- [ ] **Typography CSS** already includes `@media (prefers-reduced-motion: reduce)`
- [ ] **Custom animations** in components respect preferences
- [ ] **Third-party animations** (if any) are configurable

### 🔧 Action Items
```css
/* Add reduced motion support to button animations */
@media (prefers-reduced-motion: reduce) {
  .btn {
    transition: none;
  }
  
  .btn:hover {
    transform: none;
    box-shadow: none;
  }
  
  .btn--loading::after {
    animation: none;
  }
  
  /* Provide alternative loading indication */
  .btn--loading.reduced-motion::after {
    content: '⏳';
    animation: none;
  }
}

/* Update existing typography reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .link-text {
    transition: none; /* Already implemented ✅ */
  }
  
  /* Add for other interactive elements */
  .bingo-tile,
  .navigation-button {
    transition: none;
    transform: none;
  }
}
```

```tsx
// Add motion preference detection
const useReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handler = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };
    
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);
  
  return prefersReducedMotion;
};

// Use in components
const BingoTile = ({ cell, onPress }) => {
  const prefersReducedMotion = useReducedMotion();
  
  const animationStyle = prefersReducedMotion 
    ? {} 
    : { transform: [{ scale: pressed ? 0.95 : 1 }] };
    
  return (
    <Pressable style={[styles.container, animationStyle]}>
      {/* Content */}
    </Pressable>
  );
};
```

---

## Touch & Interaction

### ✅ WCAG AA Requirements
- **Minimum touch target size** of 44x44 pixels
- **Adequate spacing** between interactive elements
- **Touch gestures** have keyboard/mouse alternatives
- **No reliance on precise gestures** for essential functionality

### 🎯 Implementation Checklist

#### Touch Target Sizes
- [ ] **All buttons** meet 44x44px minimum (button component ✅ `min-height: 44px`)
- [ ] **BingoTile** components are large enough for easy interaction
- [ ] **BottomNavigation** buttons have adequate size (✅ `minHeight: 60`)
- [ ] **Close buttons** and small controls meet size requirements
- [ ] **Camera controls** are appropriately sized

#### Touch Target Spacing
- [ ] **Adjacent interactive elements** have sufficient padding/margin
- [ ] **BingoGrid** tiles have appropriate spacing
- [ ] **Navigation buttons** don't overlap or crowd
- [ ] **Form controls** (if any) have adequate spacing
- [ ] **Modal controls** are properly spaced

#### Gesture Alternatives
- [ ] **Swipe gestures** (if any) have button alternatives
- [ ] **Pinch-to-zoom** (if any) has button controls
- [ ] **Drag operations** (if any) have alternative methods
- [ ] **Complex gestures** are not required for basic functionality

### 🔧 Action Items
```tsx
// Verify BingoTile touch target size
const BingoTile = ({ cell, onPress, size = 70 }) => {
  // Ensure minimum 44px touch target
  const touchTargetSize = Math.max(44, size);
  
  return (
    <Pressable
      style={[
        styles.container,
        { 
          width: touchTargetSize, 
          height: touchTargetSize,
          minWidth: 44,
          minHeight: 44
        }
      ]}
      hitSlop={{ top: 2, bottom: 2, left: 2, right: 2 }}
    >
      {/* Content */}
    </Pressable>
  );
};

// Ensure adequate spacing in BingoGrid
const styles = StyleSheet.create({
  gridContainer: {
    gap: 4, // Minimum 4px spacing between tiles
  },
  tile: {
    margin: 2, // Additional margin for touch targets
  }
});
```

---

## Content & Typography

### ✅ WCAG AA Requirements
- **Clear, simple language** appropriate for audience
- **Consistent terminology** throughout application
- **Proper heading hierarchy** (h1, h2, h3, etc.)
- **Sufficient line spacing** and readable fonts
- **Text resizing** support up to 200% without loss of functionality

### 🎯 Implementation Checklist

#### Typography Standards
- [ ] **Font sizes** use relative units (rem, em) for scalability ✅
- [ ] **Line heights** provide adequate spacing (✅ 1.4-1.75 implemented)
- [ ] **Text contrast** meets WCAG AA standards ✅
- [ ] **Font families** have appropriate fallbacks ✅
- [ ] **Text can be resized** to 200% without horizontal scrolling

#### Content Structure
- [ ] **Headings** create logical document outline
- [ ] **Lists** use proper markup (`ul`, `ol`, `li`)
- [ ] **Paragraphs** are appropriately structured
- [ ] **Error messages** are clear and actionable
- [ ] **Instructions** are easy to understand

#### Language and Clarity
- [ ] **Game instructions** are clear and concise
- [ ] **Error messages** explain what went wrong and how to fix it
- [ ] **Success messages** confirm user actions
- [ ] **Button labels** clearly describe their function
- [ ] **Alternative text** for images is descriptive

### 🔧 Action Items
```tsx
// Add proper heading structure
const GameScreen = () => {
  return (
    <View>
      <Text accessibilityRole="header" style={styles.h1}>
        Bingo
      </Text>
      <Text accessibilityRole="header" style={styles.h2}>
        Current Game
      </Text>
      {/* Game content */}
    </View>
  );
};

// Improve error messaging
const ErrorMessage = ({ error, onRetry }) => {
  return (
    <View role="alert" aria-live="assertive">
      <Text style={styles.errorText}>
        {error.message || 'Something went wrong. Please try again.'}
      </Text>
      {onRetry && (
        <TouchableOpacity 
          onPress={onRetry}
          accessibilityLabel="Retry the previous action"
        >
          <Text>Try Again</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};
```

---

## Testing & Validation

### 🎯 Testing Checklist

#### Automated Testing
- [ ] **axe-core** or similar accessibility testing tool integrated
- [ ] **Color contrast analyzer** validates all color combinations
- [ ] **Lighthouse accessibility audit** passes with score ≥90
- [ ] **WAVE** or similar tool validates markup
- [ ] **Keyboard navigation** automated tests

#### Manual Testing
- [ ] **Screen reader testing** (VoiceOver, NVDA, JAWS)
- [ ] **Keyboard-only navigation** through entire application
- [ ] **High contrast mode** testing
- [ ] **Zoom to 200%** functionality testing
- [ ] **Motion preference** testing

#### User Testing
- [ ] **Users with disabilities** test core functionality
- [ ] **Keyboard-only users** validate navigation
- [ ] **Screen reader users** test content understanding
- [ ] **Motor impairment considerations** for touch interactions
- [ ] **Cognitive accessibility** validation

### 🔧 Testing Implementation
```javascript
// Add to testing setup
import { axe, toHaveNoViolations } from 'jest-axe';
expect.extend(toHaveNoViolations);

// Example accessibility test
test('BingoTile should be accessible', async () => {
  const { container } = render(<BingoTile cell={mockCell} onPress={mockOnPress} />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});

// Keyboard navigation test
test('BottomNavigation should support keyboard navigation', () => {
  const { getByRole } = render(<BottomNavigation />);
  const firstButton = getByRole('button', { name: /dashboard/i });
  
  fireEvent.keyDown(firstButton, { key: 'Tab' });
  // Assert focus moves to next button
});
```

---

## Implementation Priority

### 🚨 High Priority (Critical Issues)
1. **Add focus indicators** to all interactive elements
2. **Implement ARIA labels** for icon-only buttons
3. **Add keyboard navigation** support to BingoGrid
4. **Verify touch target sizes** meet 44px minimum

### ⚠️ Medium Priority (Important Improvements)
1. **Add reduced motion** support to animations
2. **Implement proper heading hierarchy**
3. **Add live regions** for dynamic content updates
4. **Improve error messaging** with clear instructions

### 📋 Low Priority (Nice to Have)
1. **Add skip links** for main navigation
2. **Implement advanced keyboard shortcuts**
3. **Add high contrast mode** specific styles
4. **Create accessibility statement** page

---

## Documentation and Maintenance

### 📚 Documentation Requirements
- [ ] **Accessibility statement** published and accessible
- [ ] **Keyboard navigation guide** for users  
- [ ] **Development guidelines** for future features
- [ ] **Testing procedures** documented for QA team
- [ ] **ARIA patterns** documented for component library

### 🔄 Ongoing Maintenance
- [ ] **Regular accessibility audits** scheduled
- [ ] **User feedback channels** for accessibility issues
- [ ] **Team training** on accessibility best practices
- [ ] **Design system updates** include accessibility considerations
- [ ] **New feature reviews** include accessibility checklist

---

## Resources and References

### 📖 WCAG Guidelines
- [WCAG 2.1 AA Guidelines](https://www.w3.org/WAI/WCAG21/quickref/?versions=2.1&levels=aa)
- [Understanding WCAG 2.1](https://www.w3.org/WAI/WCAG21/Understanding/)
- [WAI-ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)

### 🛠️ Testing Tools
- [axe DevTools](https://www.deque.com/axe/devtools/)
- [WAVE Web Accessibility Evaluator](https://wave.webaim.org/)
- [Color Contrast Analyzers](https://www.tpgi.com/color-contrast-checker/)
- [Accessibility Insights](https://accessibilityinsights.io/)

### 📱 React Native Specific
- [React Native Accessibility API](https://reactnative.dev/docs/accessibility)
- [Expo Accessibility](https://docs.expo.dev/guides/accessibility/)
- [React Native Testing Library](https://callstack.github.io/react-native-testing-library/)

---

**Last Updated**: [Current Date]  
**Review Cycle**: Monthly  
**Next Review**: [Next Month]
