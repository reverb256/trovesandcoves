#!/usr/bin/env node

/**
 * GitHub Pages Build Script for Troves and Coves
 * Optimizes the static build for GitHub Pages deployment with Cloudflare orchestration
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🚀 Building Troves and Coves for GitHub Pages...');

// Clean previous builds
if (fs.existsSync('docs')) {
  fs.rmSync('docs', { recursive: true, force: true });
}

// Build the static site
console.log('📦 Building static assets...');
execSync('vite build --outDir docs --base /', { stdio: 'inherit' });

// Create CNAME file for custom domain
console.log('🌐 Setting up custom domain...');
fs.writeFileSync('docs/CNAME', 'trovesandcoves.ca');

// Create .nojekyll to bypass Jekyll processing
fs.writeFileSync('docs/.nojekyll', '');

// Generate robots.txt for SEO
const robotsTxt = `User-agent: *
Allow: /

Sitemap: https://trovesandcoves.ca/sitemap.xml`;
fs.writeFileSync('docs/robots.txt', robotsTxt);

// Create sitemap.xml
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://trovesandcoves.ca/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://trovesandcoves.ca/products</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://trovesandcoves.ca/about</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://trovesandcoves.ca/contact</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <priority>0.7</priority>
  </url>
</urlset>`;
fs.writeFileSync('docs/sitemap.xml', sitemap);

// Create _headers file for Cloudflare optimization
const headers = `/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()

/*.js
  Cache-Control: public, max-age=31536000, immutable

/*.css
  Cache-Control: public, max-age=31536000, immutable

/*.png
  Cache-Control: public, max-age=31536000

/*.jpg
  Cache-Control: public, max-age=31536000

/*.webp
  Cache-Control: public, max-age=31536000

/api/*
  Cache-Control: no-cache`;
fs.writeFileSync('docs/_headers', headers);

// Copy Cloudflare Worker configuration
if (fs.existsSync('cloudflare-fallback-config.js')) {
  fs.copyFileSync('cloudflare-fallback-config.js', 'docs/_worker.js');
}

console.log('✅ GitHub Pages build complete!');
console.log('📁 Build output: /docs');
console.log('🌍 Domain: trovesandcoves.ca');
console.log('⚡ Cloudflare orchestration configured');