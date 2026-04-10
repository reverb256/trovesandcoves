#!/usr/bin/env node
/**
 * Generate missing favicon PNG files from the SVG source
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const PUBLIC_DIR = path.join(__dirname, '../client/public');
const SVG_SOURCE = path.join(PUBLIC_DIR, 'favicon.svg');

// Sizes to generate
const SIZES = [
  { name: 'favicon-16x16.png', size: 16 },
  { name: 'favicon-32x32.png', size: 32 },
  { name: 'apple-touch-icon.png', size: 180 },
  { name: 'android-chrome-192x192.png', size: 192 },
  { name: 'android-chrome-512x512.png', size: 512 },
];

async function generateIcons() {
  console.log('🎨 Generating missing favicon files from SVG...\n');

  if (!fs.existsSync(SVG_SOURCE)) {
    console.error('❌ favicon.svg not found');
    process.exit(1);
  }

  for (const { name, size } of SIZES) {
    const outputPath = path.join(PUBLIC_DIR, name);

    // Skip if already exists
    if (fs.existsSync(outputPath)) {
      console.log(`✓ ${name} already exists`);
      continue;
    }

    try {
      await sharp(SVG_SOURCE).resize(size, size).png().toFile(outputPath);
      console.log(`✅ Generated ${name} (${size}x${size})`);
    } catch (error) {
      console.error(`❌ Failed to generate ${name}:`, error.message);
    }
  }

  console.log('\n✨ Icon generation complete!');
}

generateIcons().catch(console.error);
