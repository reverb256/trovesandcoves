/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: '/trovesandcoves/',
  plugins: [
    react(),
    runtimeErrorOverlay(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: { enabled: true },
      manifest: {
        name: 'Troves & Coves - Mystical Crystal Jewelry',
        short_name: 'Troves & Coves',
        description: 'Sacred crystal jewelry & healing gemstone talismans in Winnipeg',
        theme_color: '#2dd4bf',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          {
            src: 'favicon.ico',
            sizes: '64x64 32x32 24x24 16x16',
            type: 'image/x-icon'
          }
        ]
      }
    }),
    ...(process.env.NODE_ENV !== "production" &&
    process.env.REPL_ID !== undefined
      ? [
          await import("@replit/vite-plugin-cartographer").then((m) =>
            m.cartographer(),
          ),
        ]
      : []),
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
    sourcemap: true,
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
