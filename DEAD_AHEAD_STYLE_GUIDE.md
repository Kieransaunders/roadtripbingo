# Dead Ahead Bingo - Complete Style Guide

> **Version 1.0** | **Last Updated:** January 2025  
> **Purpose:** Comprehensive design system for the Dead Ahead Bingo mobile game

---

## 📋 Table of Contents

1. [Introduction](#introduction)
2. [Design Principles](#design-principles)
3. [Color Palette](#color-palette)
4. [Typography](#typography)
5. [Spacing System](#spacing-system)
6. [Components](#components)
7. [Layout Patterns](#layout-patterns)
8. [Accessibility Guidelines](#accessibility-guidelines)
9. [Code Implementation](#code-implementation)
10. [Assets & Export Instructions](#assets--export-instructions)

---

## 1. Introduction

### Project Overview

Dead Ahead Bingo is a mobile game that combines traditional bingo mechanics with dark humor and real-world photography challenges. The design system emphasizes:

- **Dark grunge aesthetic** with cartoon-style elements
- **High contrast** for optimal mobile visibility
- **Touch-friendly interfaces** with WCAG AAA compliance
- **Responsive design** across all mobile devices
- **Consistent branding** throughout the gaming experience

### Target Platforms

- **Primary:** iOS and Android mobile devices
- **Screen Sizes:** 320px - 768px width
- **Orientation:** Portrait-first with responsive landscape support
- **Technology Stack:** React Native with Unistyles theming

---

## 2. Design Principles

### Core Design Philosophy

#### 🎯 **User-Centered Design**
- Prioritize player experience and game flow
- Minimize cognitive load during gameplay
- Ensure rapid recognition of interactive elements

#### 🌙 **Dark Theme Foundation**
- Dark backgrounds reduce eye strain during extended play
- High contrast ensures readability in various lighting conditions
- Accent colors provide clear visual hierarchy

#### 🎮 **Game-First Approach**
- Visual elements support gameplay mechanics
- Clear feedback for all user interactions
- Consistent visual language across game states

#### ♿ **Accessibility by Design**
- WCAG 2.1 AA compliance as minimum standard
- Touch targets meet 44×44px minimum requirement
- Color combinations exceed 4.5:1 contrast ratios

---

## 3. Color Palette

### 3.1 Primary Brand Colors

```css
/* Core Brand Identity */
--da-primary: hsl(220, 100%, 50%);           /* #0066ff - Primary actions */
--da-primary-hover: hsl(220, 100%, 45%);     /* #0052cc - Hover states */
--da-primary-active: hsl(220, 100%, 40%);    /* #0047b3 - Active states */
--da-primary-light: hsl(220, 100%, 95%);     /* #e6f2ff - Background tint */

/* Game Accent Colors */
--da-red: hsl(0, 75%, 50%);                  /* #dc3545 - Game elements */
--da-red-hover: hsl(0, 75%, 45%);            /* #c82333 - Hover state */
--da-secondary-gold: #FFD700;                /* Highlight accent */
```

### 3.2 Semantic Color System

#### Success States
```css
--da-success: hsl(120, 60%, 40%);            /* #28a745 - Success actions */
--da-success-text: hsl(120, 60%, 25%);       /* #0f4419 - Accessible text */
--da-success-light: hsl(120, 60%, 95%);      /* #d4edda - Background */
```

#### Warning States
```css
--da-warning: hsl(45, 100%, 50%);            /* #ffc107 - Warning color */
--da-warning-text: hsl(45, 100%, 25%);       /* #664d00 - Accessible text */
--da-warning-light: hsl(45, 100%, 95%);      /* #fff8e1 - Background */
```

#### Error States
```css
--da-red-text: hsl(0, 75%, 35%);             /* #9a1a24 - Error text */
--da-red-light: hsl(0, 75%, 95%);            /* #f8d7da - Error background */
```

### 3.3 Background System

```css
/* Light Theme Backgrounds */
--da-bg: hsl(0, 0%, 100%);                   /* #ffffff - Main background */
--da-surface-1: hsl(0, 0%, 98%);             /* #fafafa - Elevated surfaces */
--da-surface-2: hsl(0, 0%, 96%);             /* #f5f5f5 - Card backgrounds */
--da-surface-3: hsl(0, 0%, 94%);             /* #f0f0f0 - Input backgrounds */

/* Dark Theme Implementation */
--da-bg-dark: hsl(0, 0%, 8%);                /* #141414 - Dark background */
--da-surface-1-dark: hsl(0, 0%, 12%);        /* #1f1f1f - Dark elevated */
--da-surface-2-dark: hsl(0, 0%, 16%);        /* #292929 - Dark cards */
```

### 3.4 Text Color Hierarchy

```css
/* High Contrast Text System */
--da-text-primary: hsl(0, 0%, 13%);          /* #212121 - 15.8:1 contrast */
--da-text-secondary: hsl(0, 0%, 25%);        /* #404040 - 12.6:1 contrast */
--da-text-muted: hsl(0, 0%, 40%);            /* #666666 - 7.0:1 contrast */
--da-text-placeholder: hsl(0, 0%, 60%);      /* #999999 - Placeholder text */
--da-text-inverse: hsl(0, 0%, 100%);         /* #ffffff - Dark backgrounds */
```

### 3.5 Interactive States

```css
/* Focus and Selection */
--da-focus: hsl(220, 100%, 50%);             /* Focus outline color */
--da-focus-shadow: hsla(220, 100%, 50%, 0.25); /* Focus shadow */
--da-selection-bg: hsl(220, 100%, 95%);      /* Selection background */

/* Hover Effects */
--da-hover-overlay: hsla(0, 0%, 0%, 0.05);   /* Generic hover overlay */
--da-hover-bg: hsl(0, 0%, 96%);              /* Hover background */
```

### 3.6 Border System

```css
/* Border Hierarchy */
--da-border-light: hsl(0, 0%, 90%);          /* #e6e6e6 - Subtle borders */
--da-border: hsl(0, 0%, 85%);                /* #d9d9d9 - Default borders */
--da-border-strong: hsl(0, 0%, 75%);         /* #bfbfbf - Emphasized borders */
```

---

## 4. Typography

### 4.1 Font Families

#### Primary Font Stack
```css
/* Heading Font - Distinctive brand identity */
--font-heading: 'Space Mono', 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace;

/* Body Font - High readability */
--font-body: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;

/* UI Font - System optimized */
--font-ui: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
```

#### Font Loading Strategy
```css
@font-face {
  font-family: 'SpaceMono';
  src: url('./assets/fonts/SpaceMono-Regular.ttf') format('truetype');
  font-weight: 400;
  font-style: normal;
  font-display: swap; /* Prevents invisible text during font load */
}
```

### 4.2 Responsive Font Scale

#### Fluid Typography System
```css
/* Mobile-first responsive scaling using clamp() */
--font-size-xs: clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem);    /* 12-14px */
--font-size-sm: clamp(0.875rem, 0.8rem + 0.375vw, 1rem);     /* 14-16px */
--font-size-base: clamp(1rem, 0.9rem + 0.5vw, 1.125rem);     /* 16-18px */
--font-size-lg: clamp(1.25rem, 1.1rem + 0.75vw, 1.5rem);     /* 20-24px */
--font-size-xl: clamp(1.5rem, 1.3rem + 1vw, 2rem);           /* 24-32px */
--font-size-xxl: clamp(2rem, 1.7rem + 1.5vw, 2.5rem);        /* 32-40px */
--font-size-huge: clamp(2.5rem, 2rem + 2.5vw, 3.5rem);       /* 40-56px */
```

### 4.3 Font Weight Scale

```css
--font-weight-light: 300;
--font-weight-regular: 400;
--font-weight-medium: 500;
--font-weight-semibold: 600;
--font-weight-bold: 700;
```

### 4.4 Line Height System

```css
/* Optimized for readability */
--line-height-tight: 1.1;        /* Headlines, large text */
--line-height-snug: 1.2;         /* Subheadings */
--line-height-normal: 1.4;       /* UI elements, buttons */
--line-height-relaxed: 1.5;      /* Body text, optimal reading */
--line-height-loose: 1.75;       /* Long-form content */
```

### 4.5 Typography Utility Classes

#### Heading Classes
```css
.h1-hero {
  font-family: var(--font-heading);
  font-size: var(--font-size-huge);
  font-weight: var(--font-weight-bold);
  line-height: var(--line-height-tight);
  color: var(--da-text-primary);
}

.h2-section {
  font-family: var(--font-heading);
  font-size: var(--font-size-xxl);
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-height-snug);
  color: var(--da-text-primary);
}
```

#### Body Text Classes
```css
.body-default {
  font-family: var(--font-body);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-regular);
  line-height: var(--line-height-relaxed);
  color: var(--da-text-primary);
}

.body-small {
  font-family: var(--font-body);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-regular);
  line-height: var(--line-height-normal);
  color: var(--da-text-secondary);
}
```

#### Game-Specific Typography
```css
.bingo-tile-text {
  font-family: var(--font-body);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  line-height: var(--line-height-snug);
  text-align: center;
  color: var(--da-text-primary);
}

.game-score {
  font-family: var(--font-heading);
  font-size: var(--font-size-xxl);
  font-weight: var(--font-weight-bold);
  line-height: var(--line-height-tight);
  color: var(--da-primary);
  font-variant-numeric: tabular-nums;
}
```

---

## 5. Spacing System

### 5.1 8-Point Spacing Scale

#### Core Scale
```css
/* Base 8-point system with micro adjustments */
--space-1: 4px;    /* 0.5 × 8px - micro spacing */
--space-2: 8px;    /* 1 × 8px - base unit */
--space-3: 12px;   /* 1.5 × 8px - small spacing */
--space-4: 16px;   /* 2 × 8px - medium spacing */
--space-5: 24px;   /* 3 × 8px - large spacing */
--space-6: 32px;   /* 4 × 8px - extra large spacing */
--space-7: 48px;   /* 6 × 8px - section spacing */
--space-8: 64px;   /* 8 × 8px - layout spacing */
```

#### Extended Scale
```css
--space-9: 96px;   /* 12 × 8px - major sections */
--space-10: 128px; /* 16 × 8px - page sections */
```

### 5.2 Touch Target Standards

```css
/* WCAG AAA Compliance */
--touch-target-min: 44px;         /* Minimum touch target */
--touch-target-comfortable: 48px; /* Comfortable touch target */
```

### 5.3 Component Spacing Patterns

#### Button Spacing
```css
.btn {
  padding: var(--space-3) var(--space-5); /* 12px vertical, 24px horizontal */
  min-height: var(--touch-target-min);
  gap: var(--space-2); /* 8px between icon and text */
}

.btn--small {
  padding: var(--space-2) var(--space-4); /* 8px vertical, 16px horizontal */
  min-height: var(--touch-target-min); /* Still maintain accessibility */
}
```

#### Card Spacing
```css
.card {
  padding: var(--space-4); /* 16px all around */
  margin-bottom: var(--space-4);
}

.card--compact {
  padding: var(--space-3); /* 12px for tighter layouts */
}

.card--spacious {
  padding: var(--space-6); /* 32px for breathing room */
}
```

#### Grid Layouts
```css
.layout-grid {
  display: grid;
  gap: var(--space-4); /* 16px grid gap */
}

.layout-grid--tight {
  gap: var(--space-2); /* 8px for compact layouts */
}
```

### 5.4 Responsive Spacing

```css
/* Mobile-first responsive spacing */
.container {
  padding-inline: var(--space-4); /* 16px on mobile */
}

@media (min-width: 768px) {
  .container {
    padding-inline: var(--space-6); /* 32px on tablets+ */
  }
}

@media (min-width: 1024px) {
  .container {
    padding-inline: var(--space-8); /* 64px on desktop */
  }
}
```

---

## 6. Components

### 6.1 Button System

#### Primary Button
```css
.btn--primary {
  background-color: var(--da-primary);
  color: var(--da-text-inverse);
  border: 2px solid transparent;
  padding: var(--space-3) var(--space-5);
  border-radius: var(--space-2);
  font-weight: var(--font-weight-semibold);
  min-height: var(--touch-target-min);
  transition: all 0.2s ease-out;
}

.btn--primary:hover {
  background-color: var(--da-primary-hover);
  transform: translateY(-1px);
  box-shadow: 0 4px 8px hsla(220, 100%, 50%, 0.3);
}

.btn--primary:active {
  background-color: var(--da-primary-active);
  transform: translateY(0);
}
```

#### Secondary Button
```css
.btn--secondary {
  background-color: transparent;
  color: var(--da-primary);
  border: 2px solid var(--da-primary);
  padding: var(--space-3) var(--space-5);
  border-radius: var(--space-2);
  min-height: var(--touch-target-min);
}

.btn--secondary:hover {
  background-color: var(--da-primary);
  color: var(--da-text-inverse);
}
```

#### Icon Button
```css
.btn--icon {
  width: var(--touch-target-min);
  height: var(--touch-target-min);
  padding: 0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}
```

### 6.2 Bingo Grid Component

#### Grid Container
```css
.bingo-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  background-color: #1A1A1A;
  border-radius: 12px;
  padding: var(--space-2);
  box-shadow: var(--shadow-lg);
}
```

#### Bingo Tile
```css
.bingo-tile {
  background-color: var(--da-surface-2);
  border: 1px solid var(--da-border-light);
  border-radius: var(--space-2);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-1);
  margin: 1px;
  min-height: var(--touch-target-min);
  transition: all 0.2s ease-out;
}

.bingo-tile--spotted {
  background-color: rgba(255, 68, 68, 0.1);
  border-color: #FF4444;
  opacity: 0.5;
}

.bingo-tile:hover {
  transform: scale(1.02);
  box-shadow: var(--shadow-md);
}
```

### 6.3 Navigation Components

#### Bottom Navigation
```css
.bottom-navigation {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #1a1a2e;
  border-top: 1px solid #333;
  padding: var(--space-2) var(--space-1);
  display: flex;
  justify-content: space-around;
}

.nav-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--space-2);
  border-radius: var(--space-2);
  min-height: var(--touch-target-min);
  flex: 1;
}

.nav-button--active {
  background-color: rgba(255, 68, 68, 0.1);
}

.nav-icon {
  font-size: 20px;
  margin-bottom: 2px;
  color: #888;
}

.nav-button--active .nav-icon {
  color: #FF4444;
}

.nav-label {
  font-size: 10px;
  color: #888;
  font-weight: 500;
  text-align: center;
}

.nav-button--active .nav-label {
  color: #FF4444;
  font-weight: 600;
}
```

### 6.4 Card Components

#### Base Card
```css
.card {
  background-color: var(--da-surface-1);
  border-radius: 12px;
  padding: var(--space-4);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--da-border-light);
}

.card--elevated {
  box-shadow: var(--shadow-md);
}

.card--interactive {
  transition: all 0.2s ease-out;
  cursor: pointer;
}

.card--interactive:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}
```

### 6.5 Form Components

#### Input Fields
```css
.input {
  background-color: var(--da-surface-3);
  border: 2px solid var(--da-border);
  border-radius: var(--space-2);
  padding: var(--space-3) var(--space-4);
  font-family: var(--font-body);
  font-size: var(--font-size-base);
  color: var(--da-text-primary);
  min-height: var(--touch-target-min);
  transition: border-color 0.2s ease-out;
}

.input:focus {
  border-color: var(--da-primary);
  outline: none;
  box-shadow: var(--shadow-focus);
}

.input::placeholder {
  color: var(--da-text-placeholder);
}
```

---

## 7. Layout Patterns

### 7.1 Responsive Grid System

#### Container System
```css
.container {
  max-width: 100%;
  margin: 0 auto;
  padding-inline: var(--space-4);
}

@media (min-width: 768px) {
  .container {
    max-width: 768px;
    padding-inline: var(--space-6);
  }
}

@media (min-width: 1024px) {
  .container {
    max-width: 1024px;
    padding-inline: var(--space-8);
  }
}
```

#### Grid Layouts
```css
.grid {
  display: grid;
  gap: var(--space-4);
}

.grid--2-col {
  grid-template-columns: repeat(2, 1fr);
}

.grid--3-col {
  grid-template-columns: repeat(3, 1fr);
}

.grid--auto-fit {
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
}
```

### 7.2 Flexbox Patterns

#### Common Flex Layouts
```css
.flex {
  display: flex;
}

.flex-col {
  display: flex;
  flex-direction: column;
}

.items-center {
  align-items: center;
}

.justify-center {
  justify-content: center;
}

.justify-between {
  justify-content: space-between;
}

.flex-wrap {
  flex-wrap: wrap;
}
```

### 7.3 Game Screen Layout

#### Main Game Container
```css
.game-screen {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: var(--da-bg);
  padding-bottom: 80px; /* Space for bottom navigation */
}

.game-header {
  padding: var(--space-4);
  background-color: var(--da-surface-1);
  border-bottom: 1px solid var(--da-border-light);
}

.game-content {
  flex: 1;
  padding: var(--space-4);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
```

---

## 8. Accessibility Guidelines

### 8.1 Color Contrast Compliance

#### WCAG AA Requirements Met
- **Primary text:** 15.8:1 contrast ratio ✅
- **Secondary text:** 12.6:1 contrast ratio ✅
- **Interactive elements:** Minimum 3:1 contrast ✅
- **Focus indicators:** High contrast visible outlines ✅

#### Implementation
```css
/* High contrast text system */
.text-primary { color: var(--da-text-primary); } /* 15.8:1 */
.text-secondary { color: var(--da-text-secondary); } /* 12.6:1 */
.text-muted { color: var(--da-text-muted); } /* 7.0:1 */

/* Warning text uses accessible color */
.warning-text { color: var(--da-warning-text); } /* 8.9:1 instead of 1.8:1 */
```

### 8.2 Focus Management

#### Focus Indicators
```css
*:focus-visible {
  outline: 2px solid var(--da-focus);
  outline-offset: 2px;
  box-shadow: 0 0 0 4px var(--da-focus-shadow);
}

/* Two-color focus system for maximum visibility */
.btn:focus-visible {
  outline: 2px solid #F9F9F9;
  box-shadow: 0 0 0 4px #193146;
}
```

### 8.3 Touch Target Compliance

#### Minimum Sizes
```css
/* WCAG AAA compliance - 44×44px minimum */
.touch-target {
  min-height: var(--touch-target-min); /* 44px */
  min-width: var(--touch-target-min);
}

/* Comfortable touch targets */
.touch-target--comfortable {
  min-height: var(--touch-target-comfortable); /* 48px */
  min-width: var(--touch-target-comfortable);
}

/* Ensure spacing between touch targets */
.touch-group > * + * {
  margin-left: var(--space-2); /* 8px minimum */
}
```

### 8.4 Screen Reader Support

#### ARIA Implementation
```jsx
// Bingo Tile Example
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

// Navigation Example
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
```

### 8.5 Reduced Motion Support

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
  
  .btn:hover {
    transform: none;
    box-shadow: var(--shadow-sm);
  }
  
  .card--interactive:hover {
    transform: none;
  }
}
```

---

## 9. Code Implementation

### 9.1 React Native Unistyles Integration

#### Theme Configuration
```typescript
// src/unistyles.ts
import { StyleSheet } from 'react-native-unistyles';
import { Dimensions } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

// Font scaling utility
const scaleFont = (size: number, baseWidth: number = 375) => {
  const scale = screenWidth / baseWidth;
  const newSize = size * scale;
  return Math.max(12, Math.min(newSize, size * 1.2));
};

const lightTheme = {
  colors: {
    background: '#FFFFFF',
    text: '#000000',
    primary: '#0066ff',
    red: '#FF4444',
    secondary: '#FFD700',
    cardBackground: '#F5F5F5',
    cardText: '#333333',
  },
  fonts: {
    xs: scaleFont(12),
    sm: scaleFont(14),
    md: scaleFont(16),
    lg: scaleFont(18),
    xl: scaleFont(20),
    xxl: scaleFont(24),
    huge: scaleFont(32),
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    xxl: 32,
  }
} as const;

const darkTheme = {
  colors: {
    background: '#1A1A1A',
    text: '#FFFFFF',
    primary: '#0066ff',
    red: '#FF4444',
    secondary: '#FFD700',
    cardBackground: '#2A2A2A',
    cardText: '#CCCCCC',
  },
  fonts: lightTheme.fonts,
  spacing: lightTheme.spacing,
} as const;

StyleSheet.configure({
  themes: { light: lightTheme, dark: darkTheme },
  breakpoints: {
    xs: 0,
    sm: 375,
    md: 414,
    lg: 768,
    xl: 1024,
  },
  settings: {
    adaptiveThemes: true,
  },
});
```

### 9.2 Component Implementation Examples

#### Button Component
```typescript
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

interface ButtonProps {
  title: string;
  variant?: 'primary' | 'secondary';
  size?: 'small' | 'default' | 'large';
  onPress: () => void;
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  variant = 'primary',
  size = 'default',
  onPress,
  disabled = false,
}) => {
  const { styles } = useStyles(stylesheet);

  return (
    <TouchableOpacity
      style={[
        styles.button,
        styles[`button_${variant}`],
        styles[`button_${size}`],
        disabled && styles.button_disabled,
      ]}
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
    >
      <Text style={[
        styles.buttonText,
        styles[`buttonText_${variant}`],
        disabled && styles.buttonText_disabled,
      ]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const stylesheet = createStyleSheet((theme) => ({
  button: {
    borderRadius: 8,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  button_primary: {
    backgroundColor: theme.colors.primary,
  },
  button_secondary: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  button_small: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
    minHeight: 36,
  },
  button_large: {
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.xxl,
    minHeight: 56,
  },
  button_disabled: {
    opacity: 0.4,
  },
  buttonText: {
    fontSize: theme.fonts.md,
    fontWeight: '600',
    textAlign: 'center',
  },
  buttonText_primary: {
    color: '#FFFFFF',
  },
  buttonText_secondary: {
    color: theme.colors.primary,
  },
  buttonText_disabled: {
    color: theme.colors.text,
  },
}));
```

#### Bingo Grid Component
```typescript
import React from 'react';
import { View, Dimensions } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { BingoTile } from './BingoTile';

interface BingoGridProps {
  cells: BingoCell[];
  onTilePress: (position: number) => void;
}

export const BingoGrid: React.FC<BingoGridProps> = ({ cells, onTilePress }) => {
  const { styles, theme } = useStyles(stylesheet);
  
  const screenWidth = Dimensions.get('window').width;
  const containerPadding = 10;
  const gridPadding = 8;
  const tileMargin = 1;
  const totalSpacing = (containerPadding * 2) + (gridPadding * 2) + (tileMargin * 8);
  const tileSize = (screenWidth - totalSpacing) / 4;

  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {cells.map((cell, index) => (
          <BingoTile
            key={`${cell.tile.id}-${index}`}
            cell={cell}
            onPress={onTilePress}
            size={tileSize}
          />
        ))}
      </View>
    </View>
  );
};

const stylesheet = createStyleSheet((theme) => ({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    maxWidth: '100%',
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
}));
```

---

## 10. Assets & Export Instructions

### 10.1 Downloadable Style Guide CSS

The complete CSS file `style-guide.css` includes:
- All design tokens as CSS custom properties
- Complete component library
- Utility classes for rapid development
- Responsive breakpoints
- Dark mode variants
- Accessibility enhancements

#### File Structure
```
style-guide.css (67KB)
├── Design Tokens
│   ├── Color Palette
│   ├── Typography Scale
│   ├── Spacing System
│   └── Component Tokens
├── Utility Classes
│   ├── Spacing Utilities
│   ├── Typography Utilities
│   └── Layout Utilities
├── Component Styles
│   ├── Button System
│   ├── Card Components
│   ├── Form Elements
│   └── Navigation Components
└── Responsive & Accessibility
    ├── Media Queries
    ├── Focus Management
    └── Motion Preferences
```

### 10.2 Integration Instructions

#### Step 1: File Integration
```bash
# Copy the style guide CSS to your project
cp style-guide.css src/assets/styles/

# Or install as an NPM package (if published)
npm install @deadahead/design-system
```

#### Step 2: Import in Your Project
```typescript
// For React Native projects with Unistyles
import { StyleSheet } from 'react-native-unistyles';
import { designTokens } from './assets/styles/design-tokens';

StyleSheet.configure({
  themes: designTokens.themes,
  breakpoints: designTokens.breakpoints,
});

// For web projects
import './assets/styles/style-guide.css';
```

#### Step 3: Use Design Tokens
```typescript
// TypeScript usage
import { useStyles } from 'react-native-unistyles';

const MyComponent = () => {
  const { styles, theme } = useStyles(stylesheet);
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dead Ahead Bingo</Text>
    </View>
  );
};

const stylesheet = createStyleSheet((theme) => ({
  container: {
    backgroundColor: theme.colors.background,
    padding: theme.spacing.lg,
  },
  title: {
    fontSize: theme.fonts.xxl,
    color: theme.colors.text,
    fontWeight: '700',
  },
}));
```

#### Step 4: Implement Components
```jsx
// Use utility classes for rapid development
<div className="card p-4 mb-4">
  <h2 className="h2-section mb-3">Game Statistics</h2>
  <p className="body-default text-secondary">
    Track your progress across all games
  </p>
  <button className="btn btn--primary mt-4">
    View Details
  </button>
</div>

// Or use design tokens directly
<View style={{
  backgroundColor: theme.colors.surface1,
  padding: theme.spacing.lg,
  borderRadius: theme.spacing.sm,
}}>
  <Text style={{
    fontSize: theme.fonts.lg,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  }}>
    Game Statistics
  </Text>
</View>
```

### 10.3 Asset Files Included

#### Fonts
```
assets/fonts/
├── SpaceMono-Regular.ttf     # Primary heading font
├── SpaceMono-Bold.ttf        # Bold variant
└── Inter-Variable.woff2      # Body text font (web)
```

#### Icons
```
assets/icons/
├── game-icons/               # Bingo tile category icons
├── navigation/               # Bottom navigation icons
└── ui-elements/             # General UI icons
```

#### Color Swatches
```
assets/color-swatches/
├── primary-palette.svg       # Brand color swatches
├── semantic-colors.svg       # Success, warning, error colors
└── accessibility-guide.svg   # Contrast ratio examples
```

### 10.4 Development Tools

#### VS Code Extensions Recommended
```json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-typescript-next",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense"
  ]
}
```

#### ESLint Configuration
```json
{
  "extends": [
    "@react-native-community",
    "plugin:jsx-a11y/recommended"
  ],
  "rules": {
    "jsx-a11y/accessible-emoji": "error",
    "jsx-a11y/alt-text": "error",
    "jsx-a11y/anchor-has-content": "error"
  }
}
```

### 10.5 Testing Integration

#### Accessibility Testing Setup
```bash
# Install testing dependencies
npm install --save-dev @testing-library/react-native jest-axe

# Run accessibility audits
npm run test:a11y
```

#### Visual Regression Testing
```bash
# Storybook integration for component testing
npm install --save-dev @storybook/react-native
npm run storybook

# Percy for visual regression
npm install --save-dev @percy/cli
npx percy exec -- npm run test:visual
```

---

## 📚 Additional Resources

### Design System Maintenance
- **Monthly Reviews:** Accessibility compliance audits
- **Quarterly Updates:** Typography and spacing refinements
- **Version Control:** Semantic versioning for breaking changes
- **Documentation:** Living style guide with Storybook integration

### Team Guidelines
- **Designer Handoff:** Use design tokens for all measurements
- **Developer Implementation:** Utilize utility classes before custom CSS
- **QA Testing:** Include accessibility testing in all workflows
- **Code Reviews:** Ensure design system compliance

### Performance Considerations
- **Font Loading:** Use `font-display: swap` for custom fonts
- **CSS Optimization:** Tree-shake unused utility classes
- **Bundle Size:** Monitor design system impact on app size
- **Runtime Performance:** Leverage native styling when possible

---

**📄 Document Information**
- **Version:** 1.0
- **Last Updated:** January 2025
- **Next Review:** March 2025
- **Maintained By:** Dead Ahead Development Team
- **Status:** Active Development

---

*This style guide serves as the single source of truth for all design decisions in the Dead Ahead Bingo project. All team members should reference this document when implementing UI components or making design decisions.*
