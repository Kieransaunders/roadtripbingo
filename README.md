# Dead Ahead: Roadkill Bingo 🎯

Welcome to Dead Ahead: Roadkill Bingo, a unique mobile game built with React Native and Expo! Spot bizarre roadside sights during road trips using a 5x5 bingo grid, combining dark British humor with interactive gameplay.

## Project Overview

Dead Ahead: Roadkill Bingo is a mobile game where players identify various roadside "roadkill" and other quirky sights to complete bingo patterns. The game features a camera integration for "Snap-a-Roadkill" photo sharing and leaderboards.

## Key Technical Stack

*   **Framework:** Expo SDK 53 with React Native 0.79.5
*   **Architecture:** React Native New Architecture enabled
*   **Language:** TypeScript (strict mode)
*   **Navigation:** Expo Router (file-based)
*   **State Management:** Zustand
*   **Styling:** React Native Unistyles 3.0 (theming and responsive styling)
*   **UI Components:** Neo UI
*   **Animations:** React Native Reanimated 3.17
*   **Camera:** Expo Camera with photo capture and gallery integration
*   **Cloud Storage:** Cloudinary for image hosting and processing
*   **Privacy:** Built-in consent dialog system for user privacy protection

## Instagram Integration & Consent

⚠️ **Important: Instagram Consent Requirement**

This app includes a "Snap the Splat" camera feature that allows users to take photos and optionally share them to Instagram. **User consent is required** before any image can be posted to Instagram.

### How It Works

1. **Photo Capture**: Users take photos using the in-app camera
2. **Consent Dialog**: Before sharing to Instagram, users must explicitly consent via a dialog
3. **Consent Message**: "By sharing this image, you consent to it being posted on our Instagram. Note: Images may be graphic."
4. **User Choice**: Users can either consent ("I Understand") or cancel the sharing

### Technical Implementation

- **Consent Dialog**: Located in `/src/components/ConsentDialog.tsx`
- **Camera Integration**: Uses Expo Camera with automatic consent flow
- **Instagram API**: Photos are posted via Instagram Basic Display API
- **Privacy**: No photos are shared without explicit user consent
- **Bottom Navigation**: Persistent navigation across all screens
- **Victory Screen**: Animated victory screen with sharing capabilities

### Current Features

✅ **Fully Implemented:**
- Camera photo capture with permission handling
- Consent dialog system for Instagram sharing
- Bottom navigation across all screens
- Victory screen with animations and sharing
- Photo gallery and cloud storage integration
- User consent management and privacy protection

### Setup Requirements

- Instagram Basic Display API credentials
- Facebook/Instagram long-lived access tokens (refresh every 60 days)
- Proper permission handling for camera and media library access

For detailed Instagram setup instructions, see [CAMERA_INSTAGRAM_SETUP.md](./CAMERA_INSTAGRAM_SETUP.md).

## Get Started

1.  **Install dependencies**

    ```bash
    npm install
    ```

2.  **Start the app**

    ```bash
    npx expo start
    ```

    In the output, you'll find options to open the app in a:
    *   [development build](https://docs.expo.dev/develop/development-builds/introduction/)
    *   [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
    *   [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
    *   [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

    You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Learn More

To learn more about developing your project with Expo, look at the following resources:

*   [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
*   [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the Community

Join our community of developers creating universal apps.

*   [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
*   [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.