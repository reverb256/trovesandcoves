# Troves & Coves - Cart Architecture Migration

## Current State

- Original React site uses wouter routing with API-based cart
- Astro migration in progress with static product data
- CartDrawer and store.tsx reference @shared/types (already exists)

## Migration Strategy

1. **Short-term**: localStorage-based cart (no API dependency)
2. **Long-term**: Connect to Cloudflare Worker cart API

## Key Components to Fix

1. Header.astro - Replace wouter with Astro links, keep React islands for interactivity
2. CartDrawer.tsx - Remove wouter, use window.location or Astro.navigate
3. store.tsx - Replace API calls with localStorage operations
4. useCart.ts - Simplify to work with localStorage

## Status

- Footer.astro: ✅ Complete
- Header.astro: ⏳ In progress
- Cart system: ⏳ Needs localStorage implementation
