// Instagram API integration via n8n workflow
// Posts images to @deadaheadroadkill Instagram account

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

// n8n webhook URL for Instagram posting
const N8N_WEBHOOK_URL = 'https://n8n.iconnectit.co.uk/webhook/instagram-post';


export const postToInstagram = async (
  imageUrl: string,
  customDescription?: string
): Promise<InstagramPostResponse> => {
  try {
    const defaultDescription = `🚨 Roadkill spotted! 📸 

Shared from Dead Ahead: Roadkill Bingo mobile game 🎯

See it. Spot it. Shout it. Win shotgun or throw up trying! 🤢

#roadkill #wildlifesafety #roadsafety #deadahead #roadkillbingo #wildlife #awareness #roadsafetyfirst`;

    const postData: InstagramPostData = {
      image_url: imageUrl,
      description: customDescription || defaultDescription
    };

    console.log('📤 Posting to Instagram via n8n...', { 
      imageUrl, 
      webhookUrl: N8N_WEBHOOK_URL,
      postData 
    });

    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postData)
    });

    console.log('📤 n8n response status:', response.status, response.statusText);
    
    const result: InstagramPostResponse = await response.json();
    console.log('📤 n8n response data:', result);
    
    if (!response.ok) {
      throw new Error(result.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    if (result.success) {
      console.log('✅ Successfully posted to Instagram:', result.post_id);
      return result;
    } else {
      throw new Error(result.message || result.error || 'Unknown error from Instagram API');
    }
    
  } catch (error) {
    console.error('❌ Instagram posting error:', error);
    throw new Error(`Failed to post to Instagram: ${error.message}`);
  }
};

// Helper function to open Instagram account in browser
export const openInstagramAccount = async (): Promise<boolean> => {
  try {
    const { Linking } = await import('react-native');
    const instagramUrl = 'https://www.instagram.com/deadaheadroadkill';
    
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
  
  let description = `🚨 Roadkill spotted! 📸\n\n`;
  
  if (tileName) {
    description += `Spotted: ${tileName}\n`;
  }
  
  if (gameMode) {
    description += `Game Mode: ${gameMode}\n`;
  }
  
  if (location) {
    description += `📍 Location: ${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}\n`;
  }
  
  description += `\nShared from Dead Ahead: Roadkill Bingo 🎯\n`;
  description += `See it. Spot it. Shout it. Win shotgun or throw up trying! 🤢\n\n`;
  description += `#roadkill #wildlifesafety #roadsafety #deadahead #roadkillbingo`;
  
  if (tileName) {
    description += ` #${tileName.toLowerCase().replace(/\s+/g, '')}`;
  }
  
  return description;
};