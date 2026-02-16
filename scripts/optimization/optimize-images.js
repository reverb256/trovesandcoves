#!/usr/bin/env node

/**
 * Image Optimization Script
 * Optimizes images for web delivery with WebP conversion and compression
 */

import { readdir, stat, mkdir } from 'fs/promises';
import { join, extname, basename } from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

const CONFIG = {
  inputDir: 'client/public/images',
  outputDir: 'client/public/images/optimized',
  quality: 85,
  maxWidth: 1200,
  formats: ['webp', 'jpg'],
  extensions: ['.jpg', '.jpeg', '.png', '.gif']
};

async function ensureDirectory(dir) {
  try {
    await mkdir(dir, { recursive: true });
  } catch (error) {
    if (error.code !== 'EEXIST') throw error;
  }
}

async function isImageFile(filePath) {
  const ext = extname(filePath).toLowerCase();
  return CONFIG.extensions.includes(ext);
}

async function getImageFiles(dir) {
  const files = [];
  
  try {
    const entries = await readdir(dir);
    
    for (const entry of entries) {
      const fullPath = join(dir, entry);
      const stats = await stat(fullPath);
      
      if (stats.isDirectory()) {
        const subFiles = await getImageFiles(fullPath);
        files.push(...subFiles);
      } else if (await isImageFile(fullPath)) {
        files.push(fullPath);
      }
    }
  } catch (error) {
    console.warn(`Warning: Could not read directory ${dir}:`, error.message);
  }
  
  return files;
}

async function optimizeImage(inputPath, outputDir) {
  const filename = basename(inputPath, extname(inputPath));
  const relativePath = inputPath.replace(CONFIG.inputDir, '').replace(/^\//, '');
  const outputSubdir = join(outputDir, relativePath.replace(basename(relativePath), ''));
  
  await ensureDirectory(outputSubdir);
  
  const outputs = [];
  
  for (const format of CONFIG.formats) {
    const outputPath = join(outputSubdir, `${filename}.${format}`);
    
    try {
      let command;
      
      if (format === 'webp') {
        command = `cwebp -q ${CONFIG.quality} -resize ${CONFIG.maxWidth} 0 "${inputPath}" -o "${outputPath}"`;
      } else {
        command = `convert "${inputPath}" -quality ${CONFIG.quality} -resize ${CONFIG.maxWidth}x "${outputPath}"`;
      }
      
      await execAsync(command);
      outputs.push(outputPath);
      console.log(`✓ Optimized: ${relativePath} → ${format}`);
      
    } catch (error) {
      console.warn(`⚠ Failed to optimize ${inputPath} to ${format}:`, error.message);
    }
  }
  
  return outputs;
}

async function checkDependencies() {
  const dependencies = [
    { command: 'cwebp', package: 'webp' },
    { command: 'convert', package: 'imagemagick' }
  ];
  
  for (const { command, package: pkg } of dependencies) {
    try {
      await execAsync(`which ${command}`);
    } catch (error) {
      console.error(`❌ Missing dependency: ${command}`);
      console.log(`Install with: brew install ${pkg} (macOS) or apt-get install ${pkg} (Ubuntu)`);
      process.exit(1);
    }
  }
}

async function generateSrcSet(imagePath) {
  const filename = basename(imagePath, extname(imagePath));
  const sizes = [320, 640, 960, 1200];
  const srcset = [];
  
  for (const size of sizes) {
    srcset.push(`/images/optimized/${filename}-${size}w.webp ${size}w`);
  }
  
  return srcset.join(', ');
}

async function main() {
  console.log('🖼️  Starting image optimization...\n');
  
  // Check dependencies
  await checkDependencies();
  
  // Ensure output directory exists
  await ensureDirectory(CONFIG.outputDir);
  
  // Get all image files
  const imageFiles = await getImageFiles(CONFIG.inputDir);
  
  if (imageFiles.length === 0) {
    console.log('No images found to optimize.');
    return;
  }
  
  console.log(`Found ${imageFiles.length} images to optimize:\n`);
  
  // Optimize each image
  let successCount = 0;
  for (const imagePath of imageFiles) {
    try {
      await optimizeImage(imagePath, CONFIG.outputDir);
      successCount++;
    } catch (error) {
      console.error(`❌ Failed to optimize ${imagePath}:`, error.message);
    }
  }
  
  console.log(`\n✅ Optimization complete! ${successCount}/${imageFiles.length} images optimized.`);
  
  // Generate sample usage
  console.log('\n📝 Sample usage in React:');
  console.log(`
import { LazyImage } from '@/components/LazyImage';

<LazyImage
  src="/images/optimized/crystal-pendant.jpg"
  srcSet="/images/optimized/crystal-pendant.webp"
  alt="Wire wrapped crystal pendant"
  width={400}
  height={300}
  loading="lazy"
/>
  `);
}

// Handle CLI arguments
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log(`
Image Optimization Script

Usage: node scripts/optimization/optimize-images.js [options]

Options:
  --help, -h     Show this help message
  --quality, -q  Set image quality (default: ${CONFIG.quality})
  --width, -w    Set max width (default: ${CONFIG.maxWidth})

Examples:
  node scripts/optimization/optimize-images.js
  node scripts/optimization/optimize-images.js --quality 90 --width 1600
  `);
  process.exit(0);
}

// Parse command line arguments
const qualityIndex = process.argv.findIndex(arg => arg === '--quality' || arg === '-q');
if (qualityIndex !== -1 && process.argv[qualityIndex + 1]) {
  CONFIG.quality = parseInt(process.argv[qualityIndex + 1]);
}

const widthIndex = process.argv.findIndex(arg => arg === '--width' || arg === '-w');
if (widthIndex !== -1 && process.argv[widthIndex + 1]) {
  CONFIG.maxWidth = parseInt(process.argv[widthIndex + 1]);
}

// Run the optimization
main().catch(error => {
  console.error('❌ Optimization failed:', error.message);
  process.exit(1);
});
