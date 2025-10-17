import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function createFavicon() {
  try {
    // Create a simple but visible rocket icon for favicon.ico
    const svgIcon = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32">
      <defs>
        <linearGradient id="rocket-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#FF6B35"/>
          <stop offset="100%" style="stop-color:#4A90E2"/>
        </linearGradient>
      </defs>
      
      <!-- Background circle -->
      <circle cx="16" cy="16" r="15" fill="#F8F9FA"/>
      
      <!-- Rocket body -->
      <path d="M12 8 L20 12 L18 20 L20 26 L16 28 L12 26 L14 20 L12 12 Z" 
            fill="url(#rocket-grad)" stroke="#2C3E50" stroke-width="1"/>
      
      <!-- Rocket window -->
      <circle cx="16" cy="16" r="3" fill="#FFFFFF" stroke="#2C3E50"/>
      
      <!-- Flames -->
      <path d="M14 28 L16 30 L18 28 L16 32 Z" fill="#FF4444"/>
    </svg>`;
    
    // Convert to ICO format (16x16 for compatibility)
    await sharp(Buffer.from(svgIcon))
      .resize(16, 16)
      .png()
      .toFile(path.join(__dirname, 'public', 'favicon.ico'));
    
    console.log('Simple favicon.ico created successfully!');
    
  } catch (error) {
    console.error('Error creating favicon:', error);
  }
}

createFavicon();