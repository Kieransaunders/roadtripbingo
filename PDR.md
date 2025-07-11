# Product Definition Report (PDR)

**App Name:** Dead Ahead: Roadkill Bingo  
**Platform:** React Native (Expo + New Architecture)  
**Prepared by:** Kieran Saunders  
**Date:** 11 July 2025  

---

## 🎯 1. Project Summary

Dead Ahead: Roadkill Bingo is a darkly comic, real-world spotting game for road trips. Players use a 5×5 bingo grid filled with bizarre and gruesome roadside sights. Tapping tiles marks them as spotted, and the first player to complete a row shouts "Roadkill Bingo!" The app includes a Snap-a-Roadkill feature with camera support and an optional leaderboard to share sightings with other players.

The game blends absurd British humour, cartoon violence, and travel boredom relief in a fast, fun experience.

---

## 📱 2. Screens & UX Components

### 2.1 Home Screen
- **Components:**
  - App Logo (SVG or image)
  - Buttons:
    - Start New Game
    - How to Play
    - My Cards
    - Settings

### 2.2 Game Screen
- **Components:**
  - 5x5 Bingo Grid
    - Each tile shows an image and an optional label
    - Centre tile is always "Free Range" and pre-marked
    - Tap = "spotted" state (e.g., grayed or blood-splattered effect)
  - Bingo Status Tracker
    - Checks for 3-in-a-row (or 4 in Savage Mode)
  - Buttons:
    - Call Roadkill Bingo! (validates win)
    - Snap a Roadkill (opens camera and uploads to leaderboard)

### 2.3 Victory Screen
- "You won!" message
- Animation: confetti or red splatter
- Options:
  - Start New Game
  - Share Screenshot
  - Return Home

### 2.4 Card Gallery
- List of previous bingo cards:
  - Completed or in-progress
  - Each shows tiles marked vs unmarked
- Options:
  - Replay This Card
  - Generate New Card

### 2.5 Leaderboard Screen
- Feed of uploaded Snap-a-Roadkill photos
- Each item includes:
  - Thumbnail
  - Caption
  - Time of upload
  - (Optional): likes, voting, or comment emoji

---

## 🎮 3. Game Logic

### Card Generation
- 5x5 layout (25 items per game)
- Randomly pulled from a pool of ~40–50 tiles
- Tiles can be tagged by rarity
- Centre tile = "Dead Centre – Mystery Splat" (always pre-marked)

### Game Modes
- **Standard** = 3-in-a-row
- **Savage** = 4-in-a-row

### Win Validation
- Local tile state tracks user's tapped/marked tiles
- Checks each row, column, diagonal for win condition

---

## 🎨 4. Visual & Art Assets

### Style
- Retro-grunge cartoon
- Heavy outlines, muted blood tones
- Cartoon gore and exaggerated features

### Tile States
- **Normal** (full colour)
- **Spotted** (grayed out or splattered with red overlay)
- **Centre** = fixed "Free Range" art

### Assets
- Pre-supplied tile images (PNG/WebP) hosted via CDN or bundled
- 40+ unique roadkill/roadside items

---

## 🔊 5. Sound & Feedback (MVP Optional)

- **Tile tap:** squelch sound
- **Victory:** horn blast + "Bingo!" voice
- **Toggle:** via Settings

---

## ⚙️ 6. Settings

### Toggle switches:
- **Sound:** On/Off
- **Dark Humour Mode:** filters out graphic content
- **Game Mode:** Standard (3) vs Savage (4 in a row)

---

## 🧠 7. Advanced Features

### Snap a Roadkill
- Uses expo-camera to take a picture
- Uploads image to Firebase or Supabase
- Metadata: time, caption (auto or user input), location (optional)
- Stores entry in Firestore / Supabase DB for public leaderboard

### Leaderboard
- Firebase or Supabase DB stores:
  - image URL
  - caption
  - timestamp
- Leaderboard UI displays reverse-chronological feed
- Optional voting/emoji reactions in v2

---

## 🔧 8. Technical Stack

| Layer | Tool / Stack |
|-------|-------------|
| Core Framework | Expo SDK 53, React Native 0.78+, TypeScript |
| Styling | Unistyles 3.0, Neo UI, Expo Router |
| State | Zustand (or React Context if simpler) |
| Image Upload | Firebase Storage or Supabase Buckets |
| DB | Firestore / Supabase |
| Auth (optional) | Firebase Auth / Magic Link (in v2) |
| Camera | expo-camera |
| UI Animation | React Native Reanimated |
| Dev Tools | Claude + Cursor for codegen |
| Storage | AsyncStorage for local state tracking |
| Deployment | Expo EAS Build |

---

## 🧪 9. Milestones

| Milestone | Description | ETA |
|-----------|-------------|-----|
| ✅ PDR Complete | Finalise scope and tech decisions | July 2025 |
| 🎨 UI Design | Layout + tile states | Mid-July 2025 |
| 🚧 MVP Dev Start | Game logic, tile tap, basic UI | Late July 2025 |
| 📸 Snap + Upload | Camera + image upload to leaderboard | August 2025 |
| 🧪 Test Build | Expo EAS internal test + feedback | August 2025 |
| 🚀 MVP Launch | App Store & Play Store | September 2025 |

---

## ✅ 10. MVP Completion Criteria

- [ ] Bingo card generation and tap-to-mark interaction
- [ ] Snap-a-Roadkill working with upload
- [ ] Leaderboard with feed of photos
- [ ] Win condition and victory screen
- [ ] Sound toggle and humour filter
- [ ] Minimum 40 tile assets integrated
- [ ] Works offline for basic game loop

---

## 📋 11. Game Content Pool

### Roadkill Categories
1. **Classic Roadkill**
   - Dead badger, rabbit, hedgehog
   - Deer antlers, fox, bird
   - Turkey, cat, squirrel

2. **Roadside Oddities**
   - Broken down car, oil spill
   - Mattress, lost shoe, dentures
   - Burrito, takeout container

3. **Vehicles & People**
   - School bus, hazmat truck
   - Person peeing in bush
   - Road rage argument

4. **Infrastructure**
   - Tire tracks/skid marks
   - Traffic cone in tree
   - Layby rest stop

### Rarity System
- **Common** (60%): Basic roadkill, litter
- **Uncommon** (30%): Specific vehicles, human activities  
- **Rare** (10%): Bizarre combinations, perfect timing shots

---

*This PDR serves as the foundation for development and can be updated as features evolve during the MVP phase.*