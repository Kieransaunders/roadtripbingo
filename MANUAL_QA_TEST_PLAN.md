# Manual QA Test Plan - Victory Share & Camera Flow

## iOS Testing

### Test Device Setup
```bash
# Start iOS simulator
npm run ios
# or
expo run:ios
```

### Victory Share Flow - iOS
1. **Test Steps:**
   - Complete a game to reach VictoryScreen
   - Tap "📸 Share Victory" button
   - Verify ConsentDialog appears with correct wording
   - Test "Cancel" button - should return to VictoryScreen
   - Test "I Understand" button - should show share options
   - Test backdrop tap - should act as cancel

2. **Expected Results:**
   - ✅ Modal appears with "Consent Required" title
   - ✅ Message: "By sharing this image, you consent to it being posted on our Instagram. Note: Images may be graphic."
   - ✅ Cancel returns to safe state (VictoryScreen)
   - ✅ No crashes or broken states

### Camera Flow - iOS
1. **Test Steps (Permission Granted):**
   - Navigate to game screen
   - Tap on a tile that triggers camera
   - Verify ConsentDialog appears
   - Test "Cancel" - should return to game
   - Test "I Understand" - should show camera interface
   - Test camera controls: "📸 Snap the Splat!", "Cancel", "Flip"
   - Test actual photo capture

2. **Test Steps (Permission Denied):**
   - Deny camera permissions in iOS settings
   - Navigate to camera trigger
   - Verify permission request message appears
   - Test "Grant Permission" button

3. **Expected Results:**
   - ✅ ConsentDialog appears before camera access
   - ✅ Camera interface shows properly with all controls
   - ✅ Permission denied shows proper message
   - ✅ Cancel returns to safe state
   - ✅ Photo capture works end-to-end

## Android Testing

### Test Device Setup
```bash
# Start Android emulator or connect device
npm run android
# or
expo run:android
```

### Victory Share Flow - Android
1. **Test Steps:** (Same as iOS)
   - Complete a game to reach VictoryScreen
   - Tap "📸 Share Victory" button
   - Verify ConsentDialog appears with correct wording
   - Test "Cancel" button - should return to VictoryScreen
   - Test "I Understand" button - should show share options
   - Test backdrop tap - should act as cancel

2. **Expected Results:**
   - ✅ Modal appears with "Consent Required" title
   - ✅ Message: "By sharing this image, you consent to it being posted on our Instagram. Note: Images may be graphic."
   - ✅ Cancel returns to safe state (VictoryScreen)
   - ✅ No crashes or broken states

### Camera Flow - Android
1. **Test Steps (Permission Granted):**
   - Navigate to game screen
   - Tap on a tile that triggers camera
   - Verify ConsentDialog appears
   - Test "Cancel" - should return to game
   - Test "I Understand" - should show camera interface
   - Test camera controls: "📸 Snap the Splat!", "Cancel", "Flip"
   - Test actual photo capture

2. **Test Steps (Permission Denied):**
   - Deny camera permissions in Android settings
   - Navigate to camera trigger
   - Verify permission request message appears
   - Test "Grant Permission" button

3. **Expected Results:**
   - ✅ ConsentDialog appears before camera access
   - ✅ Camera interface shows properly with all controls
   - ✅ Permission denied shows proper message
   - ✅ Cancel returns to safe state
   - ✅ Photo capture works end-to-end

## Cross-Platform Testing

### Test Consistency
- [ ] Modal appearance consistent across iOS/Android
- [ ] Button behavior identical on both platforms
- [ ] Permission handling works on both platforms
- [ ] Error messages are consistent
- [ ] Safe state behavior is identical

### Performance Testing
- [ ] Modal animations smooth on both platforms
- [ ] Camera loads quickly without delays
- [ ] No memory leaks during repeated camera access
- [ ] App remains responsive during photo upload

## Automated Test Validation

Run existing tests to validate functionality:

```bash
# Run unit tests
npm test

# Run E2E tests
npm run test:e2e

# Run specific camera tests
npm test -- --testNamePattern="Camera"
```

## Test Results Summary

### ✅ Confirmed Working:
1. **Modal wording matches spec** - ConsentDialog shows proper message
2. **Cancel returns to safe state** - Both flows handle cancellation properly
3. **Permission handling** - Camera properly requests permissions
4. **Error handling** - Graceful error handling implemented
5. **Session consent** - Consent remembered within session

### 🔍 Areas for Manual Verification:
1. **iOS camera permissions** - Test actual device permissions
2. **Android camera permissions** - Test actual device permissions
3. **Photo upload flow** - Test end-to-end photo capture and upload
4. **Instagram integration** - Test opening Instagram account
5. **Network error handling** - Test with poor/no internet connection

### 📱 Device-Specific Testing:
- Test on various iOS devices (iPhone SE, iPhone 15, iPad)
- Test on various Android devices (different manufacturers)
- Test on different screen sizes and orientations
- Test with different iOS/Android versions
