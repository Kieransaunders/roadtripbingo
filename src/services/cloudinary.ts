// Cloudinary Configuration for Dead Ahead: Roadkill Bingo
// 
// Setup Instructions:
// 1. Create account at https://cloudinary.com
// 2. Get your Cloud Name, API Key, and API Secret from dashboard
// 3. Create an unsigned upload preset named 'roadkill_preset'
// 4. Replace YOUR_CLOUD_NAME with your actual cloud name

export const CLOUDINARY_CONFIG = {
  CLOUD_NAME: 'dxuq6a1mt',
  UPLOAD_PRESET: 'roadkill_preset',
  UPLOAD_URL: 'https://api.cloudinary.com/v1_1/dxuq6a1mt/image/upload',
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
}

export const uploadImageToCloudinary = async (
  imageUri: string, 
  filename?: string
): Promise<string> => {
  try {
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
      CLOUDINARY_CONFIG.UPLOAD_URL.replace('YOUR_CLOUD_NAME', CLOUDINARY_CONFIG.CLOUD_NAME),
      {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    const data: CloudinaryResponse = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to upload to Cloudinary');
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
  2
  return `https://res.cloudinary.com/${CLOUDINARY_CONFIG.CLOUD_NAME}/image/upload/${transformString}${publicId}`;
};yes