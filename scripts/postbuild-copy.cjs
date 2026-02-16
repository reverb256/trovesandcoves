/**
 * Postbuild script to ensure CNAME and index.html are present in the GitHub Pages output directory.
 * This fixes 404 errors on custom domains.
 */

const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = path.join(__dirname, '..', 'dist', 'public');

// Ensure the built React app's index.html exists in the output directory
const reactBuildIndex = path.join(OUTPUT_DIR, 'index.html');
if (!fs.existsSync(reactBuildIndex)) {
  console.error('Error: index.html not found in build output directory!');
  console.log('Available files in output directory:');
  if (fs.existsSync(OUTPUT_DIR)) {
    fs.readdirSync(OUTPUT_DIR).forEach(file => {
      console.log(`  - ${file}`);
    });
  } else {
    console.log('Output directory does not exist!');
  }
  process.exit(1);
}

// Add CNAME file for GitHub Pages custom domain
const cnameFile = path.join(OUTPUT_DIR, 'CNAME');
fs.writeFileSync(cnameFile, 'trovesandcoves.ca\n');
console.log('✅ Created CNAME file for trovesandcoves.ca');

// Add 404.html for SPA routing
const html404File = path.join(OUTPUT_DIR, '404.html');
fs.copyFileSync(reactBuildIndex, html404File);
console.log('✅ Created 404.html for SPA routing');

console.log('🚀 Build output ready for GitHub Pages deployment!');
