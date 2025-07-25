# Dead Ahead Bingo - Design System Integration Guide

> **Quick Start Guide** for implementing the design system in your Dead Ahead Bingo project

---

## 📁 Files Included

- `DEAD_AHEAD_STYLE_GUIDE.md` - Complete design system documentation
- `style-guide.css` - Downloadable CSS with all design tokens and components  
- `INTEGRATION_GUIDE.md` - This quick setup guide

---

## 🚀 Quick Setup

### 1. Copy Files to Your Project

```bash
# Copy the CSS file to your assets
cp style-guide.css src/assets/styles/

# Or for web projects
cp style-guide.css public/styles/
```

### 2. Import in Your Main App File

#### For React Native (Unistyles)
```typescript
// app/_layout.tsx or App.tsx
import { StyleSheet } from 'react-native-unistyles';

const designTokens = {
  themes: {
    light: {
      colors: {
        background: '#FFFFFF',
        text: '#212121',
        primary: '#0066ff',
        red: '#FF4444',
        secondary: '#FFD700',
        cardBackground: '#F5F5F5',
      },
      fonts: {
        xs: 12, sm: 14, md: 16, lg: 18, xl: 20, xxl: 24,
      },
      spacing: {
        xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32,
      }
    },
    dark: {
      colors: {
        background: '#1A1A1A',
        text: '#FFFFFF',
        primary: '#0066ff',
        red: '#FF4444',
        secondary: '#FFD700',
        cardBackground: '#2A2A2A',
      },
      fonts: {
        xs: 12, sm: 14, md: 16, lg: 18, xl: 20, xxl: 24,
      },
      spacing: {
        xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32,
      }
    }
  },
  breakpoints: {
    xs: 0, sm: 375, md: 414, lg: 768, xl: 1024,
  }
};

StyleSheet.configure({
  themes: designTokens.themes,
  breakpoints: designTokens.breakpoints,
  settings: { adaptiveThemes: true }
});
```

#### For Web Projects
```html
<!-- In your HTML head -->
<link rel="stylesheet" href="/styles/style-guide.css">
```

```css
/* Or in your main CSS file */
@import url('./styles/style-guide.css');
```

---

## 🎨 Using Design Tokens

### React Native Component Example
```typescript
import { createStyleSheet, useStyles } from 'react-native-unistyles';

const GameButton = ({ title, onPress, variant = 'primary' }) => {
  const { styles, theme } = useStyles(stylesheet);
  
  return (
    <TouchableOpacity
      style={[styles.button, styles[`button_${variant}`]]}
      onPress={onPress}
    >
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};

const stylesheet = createStyleSheet((theme) => ({
  button: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.md,
    borderRadius: theme.spacing.sm,
    minHeight: 44, // WCAG compliance
  },
  button_primary: {
    backgroundColor: theme.colors.primary,
  },
  button_secondary: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: theme.fonts.md,
    fontWeight: '600',
    textAlign: 'center',
  },
}));
```

### Web Component Example
```jsx
// Using utility classes
const GameCard = ({ title, children, onClick }) => (
  <div className="card card--interactive p-4 mb-4" onClick={onClick}>
    <h3 className="h3-subsection mb-3">{title}</h3>
    <div className="body-default text-secondary">
      {children}
    </div>
  </div>
);

// Using CSS custom properties directly
const CustomButton = ({ children }) => (
  <button style={{
    backgroundColor: 'var(--da-primary)',
    color: 'var(--da-text-inverse)',
    padding: 'var(--space-3) var(--space-5)',
    borderRadius: 'var(--space-2)',
    border: 'none',
    fontSize: 'var(--font-size-base)',
    fontWeight: 'var(--font-weight-semibold)',
    minHeight: 'var(--touch-target-min)',
    cursor: 'pointer',
  }}>
    {children}
  </button>
);
```

---

## 🎯 Component Usage Examples

### Button Variants
```jsx
// Primary action
<button className="btn btn--primary">Start Game</button>

// Secondary action
<button className="btn btn--secondary">Settings</button>

// Small button
<button className="btn btn--primary btn--small">Skip</button>

// Icon button
<button className="btn btn--icon btn--primary">
  <span className="btn__icon">🎮</span>
</button>
```

### Cards and Layout
```jsx
<div className="container">
  <div className="grid grid-cols-2 gap-4">
    <div className="card card--elevated">
      <div className="card__header">
        <h3 className="card__title">Game Stats</h3>
        <p className="card__subtitle">Your progress</p>
      </div>
      <div className="card__content">
        <p className="body-default">Games played: 12</p>
      </div>
    </div>
  </div>
</div>
```

### Bingo Grid
```jsx
<div className="bingo-grid">
  <div className="bingo-tile">
    <span className="bingo-tile-text">Dead deer</span>
  </div>
  <div className="bingo-tile bingo-tile--spotted">
    <span className="bingo-tile-text">Roadkill</span>
  </div>
  <div className="bingo-tile bingo-tile--free">
    <span className="bingo-tile-text">FREE</span>
  </div>
</div>
```

---

## ♿ Accessibility Checklist

### Required Implementation
- [ ] All interactive elements meet 44×44px minimum touch targets
- [ ] Focus indicators are visible and high contrast
- [ ] Color contrast ratios exceed 4.5:1 for normal text
- [ ] ARIA labels on icon-only buttons
- [ ] Proper heading hierarchy (h1, h2, h3, etc.)
- [ ] Screen reader support with semantic HTML

### Testing Commands
```bash
# Install accessibility testing tools
npm install --save-dev @testing-library/react-native jest-axe

# Run accessibility tests
npm run test:a11y

# Visual regression testing
npx percy exec -- npm run test:visual
```

---

## 🌙 Dark Mode Implementation

### Automatic Dark Mode
```css
/* Already included in style-guide.css */
@media (prefers-color-scheme: dark) {
  :root {
    --da-bg: var(--da-bg-dark);
    --da-text-primary: var(--da-text-primary-dark);
    /* Other dark mode overrides */
  }
}
```

### Manual Dark Mode Toggle
```jsx
const App = () => {
  const [isDark, setIsDark] = useState(false);
  
  useEffect(() => {
    document.documentElement.setAttribute(
      'data-theme', 
      isDark ? 'dark' : 'light'
    );
  }, [isDark]);
  
  return (
    <div>
      <button onClick={() => setIsDark(!isDark)}>
        Toggle Dark Mode
      </button>
      {/* Your app content */}
    </div>
  );
};
```

---

## 📱 Responsive Design

### Breakpoints Available
- `xs`: 0px (mobile)
- `sm`: 375px (larger mobile)
- `md`: 414px (mobile landscape)
- `lg`: 768px (tablet)
- `xl`: 1024px (desktop)

### Usage Examples
```css
/* Responsive grid classes */
.grid-cols-1        /* 1 column on all screens */
.grid-md-2         /* 2 columns on tablet+ */
.grid-lg-4         /* 4 columns on desktop+ */

/* Responsive spacing */
.container         /* Responsive padding */
.p-4              /* Fixed padding */
```

---

## 🔧 Customization

### Updating Colors
```css
/* Override in your own CSS file */
:root {
  --da-primary: #your-brand-color;
  --da-red: #your-red-color;
  /* Other customizations */
}
```

### Adding New Components
Follow the existing pattern:
```css
.my-component {
  background-color: var(--da-surface-1);
  padding: var(--space-4);
  border-radius: var(--space-2);
  /* Use design tokens, not hardcoded values */
}
```

---

## 🚨 Common Mistakes to Avoid

1. **Don't use hardcoded colors** - Always use CSS custom properties
2. **Don't skip touch target sizes** - Minimum 44×44px for accessibility
3. **Don't forget focus indicators** - Essential for keyboard navigation
4. **Don't mix spacing systems** - Stick to the 8-point scale
5. **Don't ignore responsive breakpoints** - Test on multiple screen sizes

---

## 📊 Performance Considerations

### CSS File Size
- **Uncompressed**: ~67KB
- **Gzipped**: ~12KB (estimated)
- **Components**: Tree-shakeable utility classes

### Optimization Tips
```bash
# Remove unused CSS (PostCSS + PurgeCSS)
npm install --save-dev @fullhuman/postcss-purgecss

# Optimize images and fonts
# Use font-display: swap (already included)
# Compress custom fonts before serving
```

---

## 🆘 Support & Troubleshooting

### Common Issues
1. **Fonts not loading**: Check file paths in CSS
2. **Colors not updating**: Ensure CSS custom properties are supported
3. **Layout issues**: Verify flexbox/grid browser support
4. **Touch targets too small**: Use `.touch-target` class

### Getting Help
- Review the complete style guide: `DEAD_AHEAD_STYLE_GUIDE.md`
- Check existing component examples in the CSS file
- Validate accessibility with browser dev tools
- Test responsive design with device emulation

---

## 🚨 Common Mistakes to Avoid

### 1. StyleSheet Syntax Errors
```javascript
// ❌ WRONG - Double closing parentheses
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})); // This will cause syntax error

// ✅ CORRECT - Single closing parenthesis
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
}); // Proper syntax
```

### 2. Paper UI Theme Implementation
```javascript
// ✅ RECOMMENDED - Use Paper UI with custom theme
import { useTheme } from 'react-native-paper';

const MyComponent = () => {
  const theme = useTheme();
  
  return (
    <Card style={{ backgroundColor: theme.colors.surface }}>
      <Text style={{ color: theme.colors.onSurface }}>Content</Text>
    </Card>
  );
};

// ❌ AVOID - Custom components when Paper UI works
// Only create custom components when absolutely necessary
```

### 3. Theme Property Duplicates
```javascript
// ❌ WRONG - Duplicate properties in theme
const theme = {
  colors: {
    primary: '#FF0000',
    onSurface: '#FFFFFF',
    onSurface: '#000000', // Duplicate - will cause TS error
  }
};

// ✅ CORRECT - No duplicates
const theme = {
  colors: {
    primary: '#FF0000',
    onSurface: '#FFFFFF',
  }
};
```

### 4. Unistyles vs StyleSheet Confusion
```javascript
// ❌ WRONG - Mixing Unistyles and StyleSheet syntax
import { StyleSheet } from 'react-native';
const styles = StyleSheet.create((theme) => ({ // Theme param not supported
  container: {
    backgroundColor: theme.colors.primary, // Will error
  },
}));

// ✅ CORRECT - Use Paper UI theming instead
import { StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';

const Component = () => {
  const theme = useTheme();
  
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.primary }]}>
      {/* Content */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
```

---

## 🔧 Troubleshooting Guide

### Build Errors

**SyntaxError: Missing semicolon**
- Check for `}));` instead of `});` in StyleSheet.create
- Ensure all object properties have commas
- Verify proper bracket matching

**TypeScript: Object literal cannot have multiple properties**
- Remove duplicate property names in theme objects
- Check for copy-paste errors in theme definitions

**Module not found errors**
- Ensure all imports are correct
- Check file paths and extensions
- Verify dependencies are installed

### Theme Not Applying

**Colors not showing:**
1. Verify PaperProvider wraps your app
2. Check theme is passed to PaperProvider
3. Use `useTheme()` hook to access colors
4. Ensure components use `theme.colors.propertyName`

**Typography not working:**
1. Check font files are loaded properly
2. Verify font names match exactly
3. Use Paper's Text component with variants

### Performance Issues

**Slow rendering:**
- Use Paper UI components instead of custom ones
- Leverage theme caching
- Avoid inline styles with theme access

---

## ✅ Quick Validation Checklist

Before deploying, ensure:
- [ ] No syntax errors (`});` not `}));`)
- [ ] No duplicate theme properties
- [ ] Paper UI components used where possible
- [ ] Theme colors accessed via `useTheme()` hook
- [ ] Design tokens are used consistently
- [ ] All interactive elements have focus indicators
- [ ] Touch targets meet WCAG guidelines
- [ ] Color contrast ratios are compliant
- [ ] Responsive breakpoints work correctly
- [ ] Dark mode functions properly
- [ ] Performance impact is acceptable

---

## 📝 Implementation Lessons Learned

### Paper UI vs Custom Components
**✅ Use Paper UI when:**
- Standard Material Design components work
- You need built-in accessibility
- Consistent theming is important
- Rapid development is needed

**⚠️ Use Custom Components when:**
- Specific game UI elements needed
- Unique animations required
- Paper UI limitations encountered

### Best Practices Summary
1. **Always use Paper UI first** - customize with themes
2. **Check syntax carefully** - `StyleSheet.create({})` not `()`
3. **Use useTheme() hook** - don't hardcode colors
4. **Test thoroughly** - check TypeScript compilation
5. **Follow Material Design** - leverage Paper's patterns

---

**🎮 Ready to build amazing Dead Ahead Bingo interfaces!**

For detailed information, refer to the complete `DEAD_AHEAD_STYLE_GUIDE.md` documentation.

## 📞 Quick Support Reference

**Common Commands:**
```bash
# Check for syntax errors
npx tsc --noEmit --skipLibCheck

# Start development server
npx expo start

# Check for lint issues
npm run lint

# Reset if things break
npx expo start --clear
```
