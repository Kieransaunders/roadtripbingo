# 📸 Camera Integration Setup Guide

## ✅ What's Already Implemented

### Core Components Created:
- **CameraCapture.tsx** - Full camera component with photo capture
- **PhotoGallery.tsx** - Local gallery to view uploaded photos  
- **cloudinary.ts** - Image hosting service integration
- **instagramAPI.ts** - n8n workflow and Instagram integration

### Complete Workflow:
1. **Take Photo** → expo-camera captures photo
2. **Upload to Cloudinary** → Gets hosted URL with .jpg extension
3. **Post to n8n** → Triggers Instagram posting workflow
4. **Save to Gallery** → Stores photo locally with metadata
5. **Auto-open Instagram** → Opens @deadaheadroadkill account in browser

## 🔧 Setup Requirements

### 1. Cloudinary Configuration (✅ COMPLETED)
The Cloudinary config has been set up in `src/services/cloudinary.ts`:
- **Cloud Name**: `dxuq6a1mt`
- **Upload Preset**: `2`
- **URL**: `https://api.cloudinary.com/v1_1/dxuq6a1mt/image/upload`

### 2. n8n Workflow (✅ READY)
- **Webhook URL**: `https://n8n.iconnectit.co.uk/webhook-test/instagram-post`
- **Access Token**: Already configured in `instagramAPI.ts`
- **Expected payload**: `{ image_url, description, access_token }`

### 3. Instagram Account (✅ READY)
- **Account**: https://www.instagram.com/deadaheadroadkill
- **Auto-opens**: After successful photo upload

## 🚀 How to Use

### Option 1: Integration with Bingo Tiles
```tsx
import { CameraCapture } from '../components/Camera/CameraCapture';

// In your bingo tile component:
const [showCamera, setShowCamera] = useState(false);

const handleSnapTheSplat = () => {
  setShowCamera(true);
};

// In render:
{showCamera && (
  <CameraCapture
    onPhotoTaken={(uri) => {
      console.log('Photo taken:', uri);
      setShowCamera(false);
      // Mark tile as spotted, add bonus points, etc.
    }}
    onClose={() => setShowCamera(false)}
    tileContext={{
      tileName: tile.name,
      gameMode: 'Standard'
    }}
  />
)}
```

### Option 2: Standalone Camera Screen
```tsx
import { CameraCapture } from '../components/Camera/CameraCapture';

// Add to navigation:
<Stack.Screen 
  name="camera" 
  component={CameraCapture}
  options={{ headerShown: false }}
/>
```

### Option 3: Photo Gallery Access
```tsx
import { PhotoGallery } from '../components/Camera/PhotoGallery';

// Show gallery:
<PhotoGallery onClose={() => setShowGallery(false)} />
```

## 📋 Complete User Flow

1. **User taps "Snap the Splat"** on a bingo tile
2. **Camera opens** with full-screen interface
3. **User takes photo** with capture button
4. **Photo uploads to Cloudinary** (gets hosted URL)
5. **n8n workflow triggers** Instagram post
6. **Photo saves to local gallery** with metadata
7. **Instagram opens automatically** to @deadaheadroadkill
8. **Success message shows** with post ID
9. **User can view gallery** to see all uploaded photos

## 🔍 Error Handling

The implementation includes comprehensive error handling:
- **Camera permissions** - Requests access gracefully
- **Upload failures** - Retry option with clear error messages
- **Network issues** - Informative alerts with troubleshooting
- **Instagram API errors** - Fallback to manual sharing

## 📱 Platform Support

- **iOS**: Full expo-camera support
- **Android**: Full expo-camera support  
- **Web**: Falls back to file input (for development)

## 🎯 Next Steps

1. **Add camera to bingo tiles** - Integrate CameraCapture component
2. **Test upload flow** - Verify Cloudinary → n8n → Instagram
3. **Add gallery navigation** - Create menu option for PhotoGallery
4. **Enhance descriptions** - Customize Instagram posts per tile

## 🐛 Troubleshooting

### Camera Not Working?
- Check expo-camera permissions in app settings
- Ensure device has camera access enabled

### Upload Failing?
- Verify internet connection
- Check Cloudinary settings and upload preset
- Confirm n8n webhook URL is accessible

### Instagram Not Opening?
- Ensure device can open web URLs
- Check if Instagram account exists and is public

---

**The camera integration is complete and ready for testing! 📸🎉**