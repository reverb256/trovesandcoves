/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { VitePWA } from 'vite-plugin-pwa';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  base: process.env.NODE_ENV === 'production' ? '/' : '/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: { enabled: true },
      manifest: {
        name: 'Troves & Coves - Mystical Crystal Jewelry Winnipeg',
        short_name: 'Troves & Coves',
        description: 'Sacred crystal jewelry & healing gemstone talismans in Winnipeg. Divine wire-wrapped pendants for spiritual transformation.',
        theme_color: '#3A8E8B', // Robin's luxury turquoise
        background_color: '#ffffff', // Pure white background
        display: 'standalone',
        orientation: 'portrait-primary',
        start_url: '/',
        scope: '/',
        lang: 'en',
        categories: ['shopping', 'jewelry'],
        icons: [
          {
            src: 'favicon.ico',
            sizes: '64x64 32x32 24x24 16x16',
            type: 'image/x-icon'
          },
          {
            src: 'favicon-16x16.png',
            sizes: '16x16',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'favicon-32x32.png',
            sizes: '32x32',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'apple-touch-icon.png',
            sizes: '180x180',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'android-chrome-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: 'android-chrome-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: 'og-image.jpg',
            sizes: '1200x630',
            type: 'image/jpeg',
            purpose: 'any'
          }
        ],
        shortcuts: [
          {
            name: 'Shop All Products',
            short_name: 'Shop',
            description: 'Browse our crystal jewelry collection',
            url: '/products',
            icons: [{ src: 'android-chrome-192x192.png', sizes: '192x192' }]
          },
          {
            name: 'Crystal Necklaces',
            short_name: 'Necklaces',
            description: 'Shop our sacred wire-wrapped pendants',
            url: '/products/crystal-necklaces',
            icons: [{ src: 'android-chrome-192x192.png', sizes: '192x192' }]
          },
          {
            name: 'Contact Us',
            short_name: 'Contact',
            description: 'Get in touch with us',
            url: '/contact',
            icons: [{ src: 'android-chrome-192x192.png', sizes: '192x192' }]
          }
        ]
      },
      workbox: {
        // Ensure CSS and JS are updated promptly
        runtimeCaching: [
          {
            // CSS files - use NetworkFirst for freshness
            urlPattern: /\.css$/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'css-cache',
              expiration: {
                maxEntries: 20,
                maxAgeSeconds: 24 * 60 * 60 // 24 hours
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            // JS files - StaleWhileRevalidate for performance
            urlPattern: /\.js$/i,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'js-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 7 * 24 * 60 * 60 // 7 days
              }
            }
          },
          {
            // Images - CacheFirst for performance
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|avif)$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'image-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 30 * 24 * 60 * 60 // 30 days
              }
            }
          }
        ],
        // Navigate requests - NetworkFirst for fresh content
        navigateFallback: null,
        // Cleanup outdated caches
        cleanupOutdatedCaches: true,
        // Don't cache HTTP errors
        navigateFallbackDenylist: [/^\/api/],
      }
    }),
    // Bundle analyzer - generates stats.html in build output
    visualizer({
      open: false,
      gzipSize: true,
      brotliSize: true,
      filename: 'stats.html',
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
    sourcemap: process.env.NODE_ENV === 'development' ? true : false,
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          animations: ['framer-motion']
        }
      }
    }
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./client/src/test-setup.ts'],
    coverage: {
      provider: 'v8'
    }
  }
});
