#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

// Product mapping based on current image analysis
const productCategories = {
  lepidolite: [
    'lepidolite-necklace-1.png',
    'lepidolite-flower-front-1.png', 
    'lepidolite-flower-side-1.png',
    'lepidolite-flower-flat-1.png',
    'lepidolite-flower-hand-1.png',
    'lepidolite-wire-detail-1.png'
  ],
  citrine: [
    'citrine-necklace-set-1.png',
    'citrine-pearl-set-full-1.png',
    'citrine-pearl-detail-1.png', 
    'citrine-pearl-choker-1.png',
    'citrine-pearl-pendant-1.png',
    'citrine-flower-detail-1.png'
  ],
  goldEnamel: [
    'gold-enamel-flower-1.png',
    'gold-enamel-flower-2.png',
    'gold-enamel-full-chain-1.png',
    'gold-enamel-chain-detail-1.png'
  ],
  lapisLeather: [
    'lapis-leather-flower-display-1.png',
    'lapis-leather-flower-close-1.png',
    'lapis-leather-pendant-detail-1.png',
    'lapis-leather-center-flower-1.png',
    'lapis-leather-full-layout-1.png',
    'lapis-leather-worn-1.png',
    'lapis-leather-worn-close-1.png'
  ],
  lapisOnyx: [
    'lapis-onyx-smoky-flower-display-1.png',
    'lapis-onyx-smoky-frame-full-1.png',
    'lapis-onyx-smoky-frame-close-1.png',
    'lapis-onyx-smoky-pendant-detail-1.png',
    'lapis-onyx-smoky-pendant-side-1.png',
    'lapis-onyx-smoky-full-length-1.png'
  ],
  lapisHematite: [
    'lapis-smoky-pendant-detail-1.png',
    'lapis-smoky-frame-display-1.png',
    'lapis-smoky-frame-side-1.png',
    'lapis-smoky-close-pendant-1.png',
    'lapis-smoky-pendant-angle-1.png',
    'lapis-smoky-full-length-1.png'
  ],
  lapisLazuli: [
    'lapis-black-cord-1.png',
    'lapis-worn-detail-1.png'
  ],
  roseQuartz: [
    'rose-quartz-pendant-1.png',
    'rose-quartz-worn-1.png'
  ],
  unassigned: [
    'authentic-lapis-pendant-1.png',
    'authentic-rose-quartz-1.png',
    'gold-chain-crystal-1.png'
  ]
};

function calculateFileHash(filePath) {
  const buffer = fs.readFileSync(filePath);
  return crypto.createHash('md5').update(buffer).digest('hex');
}

function getImageSize(filePath) {
  const stats = fs.statSync(filePath);
  return stats.size;
}

function scoreHeroCandidate(filename, size) {
  let score = 0;
  
  const preferredNames = ['display', 'full', 'layout', 'set'];
  const avoidNames = ['detail', 'close', 'worn', 'angle'];
  
  preferredNames.forEach(keyword => {
    if (filename.toLowerCase().includes(keyword)) score += 2;
  });
  
  avoidNames.forEach(keyword => {
    if (filename.toLowerCase().includes(keyword)) score -= 1;
  });
  
  const sizeMB = size / (1024 * 1024);
  if (sizeMB > 2.0) score += 2;
  else if (sizeMB > 1.5) score += 1;
  
  return score;
}

function runDeduplicationAudit() {
  const jewelryDir = 'client/public/images/jewelry';
  const files = fs.readdirSync(jewelryDir).filter(f => f.endsWith('.png'));
  
  console.log('COMPREHENSIVE IMAGE DEDUPLICATION AUDIT');
  console.log('========================================');
  
  const hashMap = new Map();
  const duplicates = [];
  
  files.forEach(file => {
    const filePath = path.join(jewelryDir, file);
    const hash = calculateFileHash(filePath);
    const size = getImageSize(filePath);
    
    if (hashMap.has(hash)) {
      duplicates.push({ original: hashMap.get(hash), duplicate: file });
    } else {
      hashMap.set(hash, { file, size });
    }
  });
  
  console.log(`\nDUPLICATE ANALYSIS:`);
  console.log(`Total images: ${files.length}`);
  console.log(`Exact duplicates found: ${duplicates.length}`);
  
  if (duplicates.length > 0) {
    console.log('\nEXACT DUPLICATES TO REMOVE:');
    duplicates.forEach(dup => {
      console.log(`  - ${dup.duplicate} (duplicate of ${dup.original.file})`);
    });
  }
  
  console.log(`\nPRODUCT ORGANIZATION:`);
  Object.entries(productCategories).forEach(([product, imageList]) => {
    console.log(`\n${product.toUpperCase()}:`);
    
    const existingImages = imageList.filter(img => files.includes(img));
    const missingImages = imageList.filter(img => !files.includes(img));
    
    console.log(`  Assigned: ${existingImages.length} images`);
    if (missingImages.length > 0) {
      console.log(`  Missing: ${missingImages.join(', ')}`);
    }
    
    if (existingImages.length > 0) {
      const heroScores = existingImages.map(img => {
        const filePath = path.join(jewelryDir, img);
        const size = getImageSize(filePath);
        const score = scoreHeroCandidate(img, size);
        return { image: img, score, size: (size / (1024 * 1024)).toFixed(1) + 'MB' };
      }).sort((a, b) => b.score - a.score);
      
      console.log(`  Recommended hero: ${heroScores[0].image} (score: ${heroScores[0].score}, ${heroScores[0].size})`);
    }
  });
  
  const allAssigned = Object.values(productCategories).flat();
  const unassignedImages = files.filter(img => !allAssigned.includes(img));
  
  if (unassignedImages.length > 0) {
    console.log(`\nUNASSIGNED IMAGES (${unassignedImages.length}):`);
    unassignedImages.forEach(img => {
      const filePath = path.join(jewelryDir, img);
      const size = (getImageSize(filePath) / (1024 * 1024)).toFixed(1);
      console.log(`  - ${img} (${size}MB)`);
    });
  }
  
  const totalSize = files.reduce((sum, file) => {
    return sum + getImageSize(path.join(jewelryDir, file));
  }, 0);
  
  console.log(`\nSTORAGE OPTIMIZATION:`);
  console.log(`Total storage: ${(totalSize / (1024 * 1024)).toFixed(1)}MB`);
  console.log(`Average per image: ${(totalSize / files.length / (1024 * 1024)).toFixed(1)}MB`);
  
  const largeFiles = files.map(file => {
    const filePath = path.join(jewelryDir, file);
    const size = getImageSize(filePath);
    return { file, size };
  }).filter(f => f.size > 3 * 1024 * 1024)
    .sort((a, b) => b.size - a.size);
  
  if (largeFiles.length > 0) {
    console.log(`\nLARGE FILES (>3MB) - Consider optimization:`);
    largeFiles.forEach(f => {
      console.log(`  - ${f.file}: ${(f.size / (1024 * 1024)).toFixed(1)}MB`);
    });
  }
  
  if (duplicates.length > 0) {
    console.log(`\nRECOMMENDED CLEANUP COMMANDS:`);
    duplicates.forEach(dup => {
      console.log(`rm client/public/images/jewelry/${dup.duplicate}`);
    });
  }
  
  console.log(`\nAUDIT COMPLETE`);
  console.log(`Products with complete image sets: ${Object.entries(productCategories).filter(([_, imgs]) => imgs.every(i => files.includes(i))).length}`);
  console.log(`Total authentic images properly organized: ${allAssigned.filter(i => files.includes(i)).length}`);
  
  return {
    totalImages: files.length,
    duplicates: duplicates.length,
    unassigned: unassignedImages.length,
    totalSizeMB: (totalSize / (1024 * 1024)).toFixed(1)
  };
}

runDeduplicationAudit();