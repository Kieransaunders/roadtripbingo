// Cloudinary Configuration for Dead Ahead: Roadkill Bingo
// 
// Setup Instructions:
// 1. Create account at https://cloudinary.com
// 2. Get your Cloud Name, API Key, and API Secret from dashboard
// 3. Create an unsigned upload preset named 'roadkill_preset'
// 4. Replace YOUR_CLOUD_NAME with your actual cloud name

export const CLOUDINARY_CONFIG = {
  CLOUD_NAME: 'dxuq6a1mt',
  UPLOAD_PRESET: 'roadkill_preset', // Try alternatives if this fails: 'ml_default', 'unsigned', 'default', or just remove upload_preset
  UPLOAD_URL: 'https://api.cloudinary.com/v1_1/dxuq6a1mt/image/upload',
};

// Instagram aspect ratio requirements: 4:5 to 1.91:1
const INSTAGRAM_MIN_ASPECT_RATIO = 4/5; // 0.8 (portrait)
const INSTAGRAM_MAX_ASPECT_RATIO = 1.91; // 1.91 (landscape)

// Helper function to get Instagram-compliant image URL with aspect ratio correction
export const getInstagramCompliantImageUrl = (
  publicId: string,
  originalWidth: number,
  originalHeight: number
): string => {
  const originalAspectRatio = originalWidth / originalHeight;
  
  // Use simpler, more universal transformations for better compatibility
  let transformations = [
    'q_80',         // Fixed quality 80% for predictable results
    'f_jpg',        // JPEG format
    'w_1080',       // Max width 1080px
    'c_limit'       // Don't upscale if image is smaller
  ];
  
  // Check if image needs aspect ratio correction
  if (originalAspectRatio < INSTAGRAM_MIN_ASPECT_RATIO) {
    // Too tall (portrait), crop to 4:5 ratio
    transformations = ['w_1080', 'h_1350', 'c_fill', 'g_center', 'q_80', 'f_jpg'];
    console.log('📐 Cropping image to 4:5 aspect ratio (1080x1350)');
  } else if (originalAspectRatio > INSTAGRAM_MAX_ASPECT_RATIO) {
    // Too wide (landscape), crop to 1.91:1 ratio
    transformations = ['w_1080', 'h_566', 'c_fill', 'g_center', 'q_80', 'f_jpg'];
    console.log('📐 Cropping image to 1.91:1 aspect ratio (1080x566)');
  } else {
    console.log('📐 Image aspect ratio is compliant, optimizing size and quality');
  }
  
  const transformString = transformations.join(',');
  return `https://res.cloudinary.com/${CLOUDINARY_CONFIG.CLOUD_NAME}/image/upload/${transformString}/${publicId}`;
};

// Alternative function to get a simple, Buffer-compatible URL
export const getBufferCompatibleImageUrl = (
  publicId: string,
  originalWidth: number,
  originalHeight: number
): string => {
  const originalAspectRatio = originalWidth / originalHeight;
  
  // Always enforce proper aspect ratio for Instagram compliance
  let url: string;
  
  if (originalAspectRatio < INSTAGRAM_MIN_ASPECT_RATIO) {
    // Very tall image - crop to 4:5 portrait
    url = `https://res.cloudinary.com/${CLOUDINARY_CONFIG.CLOUD_NAME}/image/upload/w_800,h_1000,c_fill,g_center,q_70/${publicId}`;
    console.log('📸 Using 4:5 portrait crop for tall image');
  } else if (originalAspectRatio > INSTAGRAM_MAX_ASPECT_RATIO) {
    // Very wide image - crop to 1.91:1 landscape
    url = `https://res.cloudinary.com/${CLOUDINARY_CONFIG.CLOUD_NAME}/image/upload/w_800,h_419,c_fill,g_center,q_70/${publicId}`;
    console.log('📸 Using 1.91:1 landscape crop for wide image');
  } else {
    // Aspect ratio is compliant, but crop to square for safety
    url = `https://res.cloudinary.com/${CLOUDINARY_CONFIG.CLOUD_NAME}/image/upload/w_800,h_800,c_fill,g_center,q_70/${publicId}`;
    console.log('📸 Using 1:1 square crop for guaranteed Instagram compliance');
  }
  
  console.log('📸 Buffer-compatible URL:', url);
  return url;
};

// Fallback function that returns raw Cloudinary URL without transformations
export const getRawCloudinaryUrl = (
  publicId: string,
  version?: string
): string => {
  const versionString = version ? `v${version}/` : '';
  const rawUrl = `https://res.cloudinary.com/${CLOUDINARY_CONFIG.CLOUD_NAME}/image/upload/${versionString}${publicId}`;
  
  console.log('📸 Using raw Cloudinary URL:', rawUrl);
  return rawUrl;
};

// Alternative upload function that tries different presets and ensures Instagram compliance
export const uploadImageToCloudinaryWithFallback = async (
  imageUri: string, 
  filename?: string
): Promise<string> => {
  const presetsToTry = ['roadkill_preset', 'ml_default', 'unsigned', 'default'];
  
  for (const preset of presetsToTry) {
    try {
      console.log(`🔄 Trying upload preset: ${preset}`);
      
      const formData = new FormData();
      
      formData.append('file', {
        uri: imageUri,
        type: 'image/jpeg',
        name: filename || `roadkill_${Date.now()}.jpg`,
      } as any);
      
      formData.append('upload_preset', preset);
      formData.append('tags', 'roadkill,deadahead,bingo');
      formData.append('folder', 'roadkill-bingo');

      const response = await fetch(CLOUDINARY_CONFIG.UPLOAD_URL, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const data: CloudinaryResponse = await response.json();
      
      if (response.ok) {
        console.log(`✅ Upload successful with preset: ${preset}`);
        console.log('✅ Original image dimensions:', data.width, 'x', data.height);
        console.log('✅ Original aspect ratio:', (data.width / data.height).toFixed(2));
        
        // Get Buffer-compatible URL (simpler transformations)
        const bufferUrl = getBufferCompatibleImageUrl(data.public_id, data.width, data.height);
        console.log('✅ Buffer-compatible URL:', bufferUrl);
        
        // Also log the raw URL as a fallback option
        const rawUrl = getRawCloudinaryUrl(data.public_id, data.version?.toString());
        console.log('📋 Raw URL fallback:', rawUrl);
        
        return bufferUrl;
      } else {
        console.log(`❌ Upload failed with preset ${preset}:`, data.error?.message);
      }
    } catch (error) {
      console.log(`❌ Error with preset ${preset}:`, error.message);
    }
  }
  
  throw new Error('All upload presets failed. Please check your Cloudinary configuration.');
};

export interface CloudinaryResponse {
  public_id: string;
  version: number;
  signature: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  created_at: string;
  tags: string[];
  bytes: number;
  type: string;
  etag: string;
  placeholder: boolean;
  url: string;
  secure_url: string;
  access_mode: string;
  original_filename: string;
  error?: {
    message: string;
  };
}

export const uploadImageToCloudinary = async (
  imageUri: string, 
  filename?: string
): Promise<string> => {
  try {
    console.log('🔄 Starting Cloudinary upload...');
    console.log('🔄 Image URI:', imageUri);
    console.log('🔄 Upload preset:', CLOUDINARY_CONFIG.UPLOAD_PRESET);
    console.log('🔄 Cloud name:', CLOUDINARY_CONFIG.CLOUD_NAME);
    console.log('🔄 Upload URL:', CLOUDINARY_CONFIG.UPLOAD_URL);
    
    const formData = new FormData();
    
    formData.append('file', {
      uri: imageUri,
      type: 'image/jpeg',
      name: filename || `roadkill_${Date.now()}.jpg`,
    } as any);
    
    formData.append('upload_preset', CLOUDINARY_CONFIG.UPLOAD_PRESET);
    formData.append('tags', 'roadkill,deadahead,bingo');
    formData.append('folder', 'roadkill-bingo');

    const response = await fetch(
      CLOUDINARY_CONFIG.UPLOAD_URL,
      {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    console.log('🔄 Cloudinary response status:', response.status, response.statusText);
    
    const data: CloudinaryResponse = await response.json();
    console.log('🔄 Cloudinary response data:', data);
    
    if (!response.ok) {
      console.error('❌ Cloudinary upload failed:', data);
      throw new Error(data.error?.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    console.log('✅ Image uploaded to Cloudinary:', data.secure_url);
    return data.secure_url;
    
  } catch (error) {
    console.error('❌ Cloudinary upload error:', error);
    throw new Error(`Failed to upload image: ${error.message}`);
  }
};

// Helper function to get optimized image URLs
export const getOptimizedImageUrl = (
  publicId: string,
  options: {
    width?: number;
    height?: number;
    quality?: 'auto' | number;
    format?: 'auto' | 'jpg' | 'png' | 'webp';
  } = {}
): string => {
  const { width, height, quality = 'auto', format = 'auto' } = options;
  
  let transformations = [];
  
  if (width) transformations.push(`w_${width}`);
  if (height) transformations.push(`h_${height}`);
  if (quality) transformations.push(`q_${quality}`);
  if (format) transformations.push(`f_${format}`);
  
  const transformString = transformations.length > 0 ? transformations.join(',') + '/' : '';
  
  return `https://res.cloudinary.com/${CLOUDINARY_CONFIG.CLOUD_NAME}/image/upload/${transformString}${publicId}`;
};