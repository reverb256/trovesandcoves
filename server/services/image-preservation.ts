import fetch from 'node-fetch';
import { createWriteStream, createReadStream, unlinkSync, writeFileSync, readFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { promisify } from 'util';
import { pipeline } from 'stream';

const streamPipeline = promisify(pipeline);

interface ImagePreservationResult {
  originalUrl: string;
  preservedUrl: string;
  uploadedAt: Date;
  expiresAt?: Date;
  provider: string;
}

export class ImagePreservationService {
  private tempDir = './tmp/image-cache';
  
  constructor() {
    this.ensureDirectories();
  }

  private ensureDirectories() {
    // Create temp directory
    if (!existsSync(this.tempDir)) {
      mkdirSync(this.tempDir, { recursive: true });
    }
    
    // Create uploads directory for local storage
    const uploadsDir = './uploads/preserved-images';
    if (!existsSync(uploadsDir)) {
      mkdirSync(uploadsDir, { recursive: true });
    }
  }

  /**
   * Preserves an ephemeral image URL by uploading to a permanent hosting service
   */
  async preserveImage(ephemeralUrl: string): Promise<ImagePreservationResult> {
    try {
      // Download the image to temporary storage
      const tempFilePath = await this.downloadImage(ephemeralUrl);
      
      // Upload to permanent hosting
      const preservedUrl = await this.uploadToHosting(tempFilePath);
      
      // Clean up temporary file
      this.cleanupTempFile(tempFilePath);
      
      return {
        originalUrl: ephemeralUrl,
        preservedUrl,
        uploadedAt: new Date(),
        provider: 'imgur-anonymous'
      };
    } catch (error) {
      console.error('Failed to preserve image:', error);
      throw new Error(`Image preservation failed: ${error.message}`);
    }
  }

  /**
   * Downloads image from URL to temporary file
   */
  private async downloadImage(url: string): Promise<string> {
    try {
      // Ensure directories exist before download
      this.ensureDirectories();
      
      console.log('Downloading image from:', url);
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to download image: ${response.statusText}`);
      }

      const fileName = `image_${Date.now()}_${Math.random().toString(36).substr(2, 9)}.png`;
      const tempFilePath = join(this.tempDir, fileName);
      
      console.log('Saving to:', tempFilePath);
      
      // Get the response as array buffer and write to file
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      
      writeFileSync(tempFilePath, buffer);
      
      // Verify file was created
      if (!existsSync(tempFilePath)) {
        throw new Error(`File was not created at: ${tempFilePath}`);
      }
      
      console.log('Image downloaded successfully to:', tempFilePath);
      return tempFilePath;
    } catch (error: any) {
      console.error('Download error:', error);
      throw error;
    }
  }

  /**
   * Uploads image to Imgur using anonymous upload (no API key required)
   */
  private async uploadToHosting(filePath: string): Promise<string> {
    try {
      // Read file as base64
      const imageBuffer = readFileSync(filePath);
      const base64Image = imageBuffer.toString('base64');

      // Upload to Imgur anonymously
      const response = await fetch('https://api.imgur.com/3/image', {
        method: 'POST',
        headers: {
          'Authorization': 'Client-ID 546c25a59c58ad7', // Public anonymous client ID
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          image: base64Image,
          type: 'base64'
        })
      });

      if (!response.ok) {
        throw new Error(`Imgur upload failed: ${response.statusText}`);
      }

      const result = await response.json();
      if (!result.success) {
        throw new Error('Imgur upload unsuccessful');
      }

      return result.data.link;
    } catch (imgurError) {
      console.warn('Imgur upload failed, trying alternative hosting:', imgurError.message);
      
      // Fallback to alternative hosting services
      return await this.uploadToAlternativeHosting(filePath);
    }
  }

  /**
   * Alternative hosting using free services that don't require registration
   */
  private async uploadToAlternativeHosting(filePath: string): Promise<string> {
    try {
      // Try PostImages.org (no registration required)
      const imageBuffer = require('fs').readFileSync(filePath);
      const FormData = require('form-data');
      const form = new FormData();
      
      form.append('upload', imageBuffer, {
        filename: 'image.png',
        contentType: 'image/png'
      });

      const response = await fetch('https://postimages.org/json/rr', {
        method: 'POST',
        body: form
      });

      if (response.ok) {
        const result = await response.json();
        if (result.status === 'OK' && result.url) {
          return result.url;
        }
      }
    } catch (error) {
      console.warn('PostImages upload failed:', error.message);
    }

    // Final fallback: Save locally and serve from our server
    return await this.saveLocally(filePath);
  }

  /**
   * Final fallback: Save image locally and serve from our server
   */
  private async saveLocally(tempFilePath: string): Promise<string> {
    const uploadsDir = './uploads/preserved-images';
    
    try {
      require('fs').mkdirSync(uploadsDir, { recursive: true });
    } catch (error) {
      // Directory already exists
    }

    const fileName = `preserved_${Date.now()}_${Math.random().toString(36).substr(2, 9)}.png`;
    const permanentPath = join(uploadsDir, fileName);
    
    // Copy file to permanent location
    require('fs').copyFileSync(tempFilePath, permanentPath);
    
    // Return URL that our server can serve
    return `/uploads/preserved-images/${fileName}`;
  }

  /**
   * Clean up temporary files
   */
  private cleanupTempFile(filePath: string): void {
    try {
      unlinkSync(filePath);
    } catch (error) {
      console.warn('Failed to cleanup temp file:', error.message);
    }
  }

  /**
   * Batch preserve multiple images
   */
  async preserveImages(urls: string[]): Promise<ImagePreservationResult[]> {
    const results = await Promise.allSettled(
      urls.map(url => this.preserveImage(url))
    );

    return results.map((result, index) => {
      if (result.status === 'fulfilled') {
        return result.value;
      } else {
        console.error(`Failed to preserve image ${urls[index]}:`, result.reason);
        // Return a fallback result
        return {
          originalUrl: urls[index],
          preservedUrl: urls[index], // Keep original as fallback
          uploadedAt: new Date(),
          provider: 'fallback'
        };
      }
    });
  }
}

export const imagePreservationService = new ImagePreservationService();