import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the SVG file
const svgPath = path.join(__dirname, 'public', 'favicon-hd.svg');
const svgBuffer = fs.readFileSync(svgPath);

// Generate different sizes for favicon
const sizes = [16, 32, 48, 64, 128, 256];

async function generateFavicons() {
  try {
    // Generate PNG versions
    for (const size of sizes) {
      await sharp(svgBuffer)
        .png()
        .resize(size, size)
        .toFile(path.join(__dirname, 'public', `favicon-${size}x${size}.png`));
      
      console.log(`Generated favicon-${size}x${size}.png`);
    }

    // Generate main favicon.png (32x32)
    await sharp(svgBuffer)
      .png()
      .resize(32, 32)
      .toFile(path.join(__dirname, 'public', 'favicon.png'));
    
    console.log('Generated favicon.png');

    // Generate favicon.ico (16x16 for compatibility)
    await sharp(svgBuffer)
      .png()
      .resize(16, 16)
      .toFile(path.join(__dirname, 'public', 'favicon.ico'));
    
    console.log('Generated favicon.ico');

    console.log('All favicons generated successfully!');
  } catch (error) {
    console.error('Error generating favicons:', error);
  }
}

generateFavicons();