// Instagram API integration via Make.com workflow
// Posts images to @roadtripbingo Instagram account

import { Linking } from 'react-native';

export interface InstagramPostData {
  image_url: string;
  description?: string;
}

export interface InstagramPostResponse {
  success: boolean;
  message?: string;
  post_id?: string;
  error?: string;
}

// Make.com webhook URL for Instagram posting (production)
const MAKE_WEBHOOK_URL = 'https://hook.eu1.make.com/h1astzskynhes770v6a1mp8b4wsgvyrf';

// Test webhook URL to verify it's working
export const testWebhookConnection = async () => {
  try {
    const testUrl = `${MAKE_WEBHOOK_URL}?secret=roadtripbingo&image_url=https://httpbin.org/image/jpeg&caption=Test connection`;
    const response = await fetch(testUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log('🔗 Webhook test response:', response.status, response.statusText);
    return response.ok;
  } catch (error) {
    console.error('❌ Webhook test failed:', error);
    return false;
  }
};


export const postToInstagram = async (
  imageUrl: string,
  customDescription?: string
): Promise<InstagramPostResponse> => {
  try {
    // Short caption for Instagram
    const shortCaption = "Road Trip Bingo - Spot the sights!";
    
    // Longer social message for description
    const defaultDescription = `🎯 Road Trip Bingo sight spotted! 📸 

See it. Spot it. Shout BINGO! The ultimate road trip game! 🎯

#roadtrip #bingo #travel #sightseeing #roadtripbingo #adventure #explore #familyfun`;

    const caption = encodeURIComponent(shortCaption);
    const description = encodeURIComponent(customDescription || defaultDescription);
    const postUrl = `${MAKE_WEBHOOK_URL}?secret=roadtripbingo&image_url=${encodeURIComponent(imageUrl)}&caption=${caption}&description=${description}`;

    console.log('📤 Posting to Instagram via Make.com...', { 
      imageUrl, 
      webhookUrl: MAKE_WEBHOOK_URL,
      caption: shortCaption,
      description: customDescription || defaultDescription
    });

    const response = await fetch(postUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('📤 Make.com response status:', response.status, response.statusText);
    
    // Get the response text first to check if it's valid JSON
    const responseText = await response.text();
    console.log('📤 Make.com response text:', responseText);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}${responseText ? ` - ${responseText}` : ''}`);
    }

    // Try to parse JSON only if we have content
    let result: InstagramPostResponse;
    if (responseText.trim()) {
      try {
        result = JSON.parse(responseText);
        console.log('📤 Make.com response data:', result);
      } catch (parseError) {
        console.log('📤 Make.com returned plain text response (not JSON):', responseText);
        // For Make.com, if it's not JSON, assume success with plain text response
        result = {
          success: true,
          message: responseText || 'Webhook completed successfully',
          post_id: 'unknown'
        };
      }
    } else {
      // If response is empty, assume success (some webhooks return empty 200 responses)
      result = {
        success: true,
        message: 'Webhook completed successfully (empty response)',
        post_id: 'unknown'
      };
    }

    if (result.success) {
      console.log('✅ Successfully posted to Instagram:', result.post_id || 'success');
      return result;
    } else {
      throw new Error(result.message || result.error || 'Unknown error from Instagram API');
    }
    
  } catch (error) {
    console.error('❌ Instagram posting error:', error);
    throw new Error(`Failed to post to Instagram: ${error instanceof Error ? error.message : String(error)}`);
  }
};

// Helper function to open Instagram account in browser
export const openInstagramAccount = async (): Promise<boolean> => {
  try {
    const instagramUrl = 'https://www.instagram.com/roadtripbingo';
    
    const canOpen = await Linking.canOpenURL(instagramUrl);
    
    if (canOpen) {
      await Linking.openURL(instagramUrl);
      console.log('📱 Opened Instagram account in browser');
      return true;
    } else {
      console.warn('⚠️ Cannot open Instagram URL');
      return false;
    }
  } catch (error) {
    console.error('❌ Error opening Instagram:', error);
    return false;
  }
};

// Generate dynamic descriptions based on game context
export const generateGameDescription = (context?: {
  tileName?: string;
  gameMode?: string;
  location?: { lat: number; lng: number };
}): string => {
  const { tileName, gameMode, location } = context || {};
  
  let description = `🎯 Road Trip Bingo sight spotted! 📸\n\n`;
  
  if (tileName) {
    description += `Spotted: ${tileName}\n`;
  }
  
  if (gameMode) {
    description += `Game Mode: ${gameMode}\n`;
  }
  
  if (location) {
    description += `📍 Location: ${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}\n`;
  }
  
  description += `\nSee it. Spot it. Shout BINGO! The ultimate road trip game! 🎯\n\n`;
  description += `#roadtrip #bingo #travel #sightseeing #roadtripbingo #adventure #explore #familyfun`;
  
  if (tileName) {
    description += ` #${tileName.toLowerCase().replace(/\s+/g, '')}`;
  }
  
  return description;
};

// Generate short caption for Instagram posts
export const generateShortCaption = (tileName?: string): string => {
  if (tileName) {
    return `Road Trip Bingo: ${tileName} spotted!`;
  }
  return "Road Trip Bingo - Spot the sights!";
};