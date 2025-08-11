# Camera to Instagram Feature Setup

## Overview
The road trip Bingo app includes a "Snap the find" camera feature that allows users to take photos of finds and automatically post them to our Instagram. This document covers the setup and token refresh process for the Instagram integration.

## Facebook/Instagram Token Refresh

### Postman Collection for Token Refresh

Here's a ready-to-import Postman Collection JSON for refreshing your long‑lived Facebook/Instagram user token using the `/oauth/access_token` endpoint:

```json
{
  "info": {
    "name": "FB Long-Lived Token Refresh",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Refresh Long-Lived Token",
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "https://graph.facebook.com/v19.0/oauth/access_token?grant_type=fb_exchange_token&client_id={{app_id}}&client_secret={{app_secret}}&fb_exchange_token={{current_token}}",
          "host": ["https://graph.facebook.com"],
          "path": ["v19.0","oauth","access_token"],
          "query": [
            { "key": "grant_type", "value": "fb_exchange_token" },
            { "key": "client_id", "value": "{{app_id}}" },
            { "key": "client_secret", "value": "{{app_secret}}" },
            { "key": "fb_exchange_token", "value": "{{current_token}}" }
          ]
        }
      },
      "response": []
    }
  ],
  "variable": [
    { "key": "app_id", "value": "" },
    { "key": "app_secret", "value": "" },
    { "key": "current_token", "value": "" }
  ]
}
```

### ✅ How to use:

1. **Copy the JSON above.**
2. **In Postman:**
   - Go to File → Import → paste it under Raw text.
3. **The collection will appear with a request named "Refresh Long-Lived Token".**
4. **Fill in the Environment variables:**
   - `app_id` → Your Facebook App ID
   - `app_secret` → Your Facebook App Secret
   - `current_token` → Your current long-lived user token
5. **Click Send to get a new 60-day token.**

### 👉 The response will look like:

```json
{
  "access_token": "EAARnewLongLivedToken...",
  "token_type": "bearer",
  "expires_in": 5183943
}
```

## Camera Feature Integration

### How It Works

1. **Photo Capture**: Users take photos using the in-app camera
2. **Auto-Save**: Photos are automatically saved to both device gallery and app gallery
3. **Instagram Sharing**: Users can optionally share photos to Instagram via the workflow
4. **Gallery Management**: Photos are stored locally and can be viewed in the Hall of Shame screen

### Technical Implementation

- **Camera Component**: `/app/camera.tsx`
- **Photo Gallery**: `/src/components/Camera/PhotoGallery.tsx`
- **Instagram API**: `/src/services/instagramAPI.ts`
- **Cloudinary Service**: `/src/services/cloudinary.ts`

### Workflow Process

1. User takes photo with "Snap" camera
2. Photo is uploaded to Cloudinary
3. Post description is generated
4. Photo is posted to Instagram via n8n webhook
5. Photo is saved to local gallery for viewing

## Token Management

Long-lived Instagram tokens expire every 60 days. Use the Postman collection above to refresh tokens before they expire. For automated token refresh, consider setting up an n8n workflow that runs monthly to refresh tokens automatically.

## Dependencies

- Expo Camera
- Expo Media Library
- Cloudinary SDK
- Instagram Basic Display API
- n8n webhook for Instagram posting

---

*For technical support or questions about the Instagram integration, refer to the main CLAUDE.md file or contact the development team.*