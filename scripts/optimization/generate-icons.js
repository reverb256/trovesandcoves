
// Simple icon generation for development
// In production, you'd typically use a proper icon generator tool

const fs = require('fs');
const path = require('path');

// Basic ICO file structure for 16x16 favicon
const icoHeader = Buffer.from([
  0x00, 0x00, // Reserved
  0x01, 0x00, // Type: ICO
  0x01, 0x00, // Number of images
  0x10, 0x00, // Width: 16
  0x10, 0x00, // Height: 16
  0x00, 0x00, // Color count
  0x00, 0x00, // Reserved
  0x01, 0x00, // Color planes
  0x20, 0x00, // Bits per pixel
  0x84, 0x00, 0x00, 0x00, // Image size
  0x16, 0x00, 0x00, 0x00  // Image offset
]);

// Create a simple 16x16 favicon data (simplified)
const faviconData = Buffer.alloc(132); // ICO header + minimal image data
icoHeader.copy(faviconData, 0);

// Write the favicon
fs.writeFileSync(path.join(__dirname, 'client/public/favicon.ico'), faviconData);

console.log('Basic favicon.ico created. For production, please use a proper icon generator tool with your SVG.');
console.log('You can use online tools like https://realfavicongenerator.net/ with the favicon.svg file.');
