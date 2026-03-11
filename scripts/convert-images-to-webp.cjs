#!/usr/bin/env node
/**
 * Convert PNG images to WebP format with quality optimization
 * Reduces image size by 60-80% while maintaining visual quality
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const JEWELRY_DIR = path.join(__dirname, '../client/public/images/jewelry');
const QUALITY = 85; // WebP quality (0-100), 85 is a good balance

async function convertToWebP(filePath) {
  const ext = path.extname(filePath);
  if (ext.toLowerCase() !== '.png' && ext.toLowerCase() !== '.jpg' && ext.toLowerCase() !== '.jpeg') {
    return { skipped: true, file: filePath };
  }

  const webpPath = filePath.replace(/\.(png|jpg|jpeg)$/i, '.webp');

  // Skip if WebP already exists and is newer
  if (fs.existsSync(webpPath)) {
    const originalStat = fs.statSync(filePath);
    const webpStat = fs.statSync(webpPath);
    if (webpStat.mtime > originalStat.mtime) {
      return { exists: true, file: filePath };
    }
  }

  try {
    await sharp(filePath)
      .webp({ quality: QUALITY, nearLossless: false })
      .toFile(webpPath);

    const originalSize = fs.statSync(filePath).size;
    const webpSize = fs.statSync(webpPath).size;
    const savings = ((1 - webpSize / originalSize) * 100).toFixed(1);

    return {
      converted: true,
      file: filePath,
      originalSize: (originalSize / 1024).toFixed(0) + ' KB',
      webpSize: (webpSize / 1024).toFixed(0) + ' KB',
      savings: savings + '%'
    };
  } catch (error) {
    return { error: true, file: filePath, message: error.message };
  }
}

async function main() {
  console.log('🖼️  Converting product images to WebP...\n');

  const files = fs.readdirSync(JEWELRY_DIR)
    .filter(f => /\.(png|jpg|jpeg)$/i.test(f))
    .map(f => path.join(JEWELRY_DIR, f));

  const results = await Promise.all(files.map(convertToWebP));

  const converted = results.filter(r => r.converted);
  const exists = results.filter(r => r.exists);
  const errors = results.filter(r => r.error);
  const skipped = results.filter(r => r.skipped);

  console.log(`✅ Converted: ${converted.length}`);
  converted.forEach(r => {
    console.log(`   ${path.basename(r.file)}`);
    console.log(`   ${r.originalSize} → ${r.webpSize} (${r.savings} savings)\n`);
  });

  if (exists.length > 0) {
    console.log(`✓ Already exists: ${exists.length}`);
  }

  if (errors.length > 0) {
    console.log(`❌ Errors: ${errors.length}`);
    errors.forEach(r => {
      console.log(`   ${path.basename(r.file)}: ${r.message}`);
    });
  }

  const totalOriginalSize = files.reduce((sum, f) => sum + fs.statSync(f).size, 0);
  const webpFiles = files.map(f => f.replace(/\.(png|jpg|jpeg)$/i, '.webp'));
  const totalWebpSize = webpFiles.reduce((sum, f) => {
    return sum + (fs.existsSync(f) ? fs.statSync(f).size : 0);
  }, 0);

  console.log(`\n📊 Total size: ${(totalOriginalSize / 1024 / 1024).toFixed(2)} MB → ${(totalWebpSize / 1024 / 1024).toFixed(2)} MB`);
  console.log(`   Savings: ${((1 - totalWebpSize / totalOriginalSize) * 100).toFixed(1)}%`);
}

main().catch(console.error);
