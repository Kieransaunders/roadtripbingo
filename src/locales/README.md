# Localization (i18n) Structure

This directory contains localization files for the Dead Ahead: Roadkill Bingo app. Currently, the app uses hardcoded strings from `src/constants/Strings.ts`, but this structure is prepared for future internationalization support.

## Current Structure

```
src/locales/
├── en/
│   └── common.json       # English strings (default)
└── README.md            # This file
```

## Future i18n Support

When multilingual support is needed, consider implementing:

### Recommended Libraries
- **expo-localization**: For device locale detection
- **react-i18next**: Popular i18n library for React Native
- **react-native-localize**: Alternative localization library

### Planned Structure
```
src/locales/
├── en/
│   ├── common.json       # Common UI strings
│   ├── game.json         # Game-specific strings
│   └── errors.json       # Error messages
├── es/
│   ├── common.json       # Spanish translations
│   ├── game.json
│   └── errors.json
└── fr/
    ├── common.json       # French translations
    ├── game.json
    └── errors.json
```

## Implementation Notes

### Instagram Consent Strings
The Instagram consent dialog strings are particularly important for compliance:
- `consent.title`: "Consent Required"
- `consent.message`: "By sharing this image, you consent to it being posted on our Instagram. Note: Images may be graphic."
- `consent.understand`: "I Understand"
- `consent.cancel`: "Cancel"

### Accessibility Labels
All accessibility labels are included in the `a11y` objects for proper screen reader support across languages.

### Permission Strings
Camera and photo permission strings are stored here but currently used in `app.json`. Future implementation should dynamically load these based on device locale.

## Migration Path

1. **Install i18n library**: `npm install react-i18next expo-localization`
2. **Setup i18n configuration**: Create `src/i18n/index.ts`
3. **Replace Strings.ts**: Update components to use i18n hooks
4. **Add language selection**: Implement language picker in settings
5. **Add new locales**: Create additional language files as needed

## Testing Localization

When implementing i18n:
1. Test with different device locales
2. Verify text doesn't overflow in UI components
3. Test right-to-left (RTL) languages if supported
4. Ensure all user-facing strings are translated
5. Test accessibility with screen readers in different languages

## Compliance Notes

- Instagram consent must be clear and understandable in all supported languages
- Camera permissions must be properly localized for app store approval
- Error messages should be user-friendly across all locales
