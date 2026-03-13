import { test, expect } from '@playwright/test';

/**
 * Debug tests for comparing local vs production colors.
 * Requires: npm run dev (local server on port 5000)
 * Run with: npm run test:e2e:debug
 */

test.describe('Color Debug - Production vs Local', () => {
  const productionUrl = 'https://trovesandcoves.ca';
  const localUrl = 'http://localhost:5000';

  test('compare computed colors of gem elements', async ({ page }) => {
    const results: Record<string, any> = {};
    
    for (const [name, url] of [['Production', productionUrl], ['Local', localUrl]]) {
      await page.goto(url);
      await page.waitForLoadState('networkidle');
      
      const gemData = await page.evaluate(() => {
        const svg = document.querySelector('svg');
        if (!svg) return null;
        
        const path = svg.querySelector('path');
        if (!path) return null;
        
        const computedStyle = window.getComputedStyle(path);
        const fillStyle = computedStyle.fill;
        const strokeStyle = computedStyle.stroke;
        
        // Get gradient defs
        const defs = svg.querySelector('defs');
        const radialGradient = defs?.querySelector('radialGradient');
        
        return {
          fill: fillStyle,
          stroke: strokeStyle,
          strokeWidth: computedStyle.strokeWidth,
          gradientId: radialGradient?.id,
          gradientStops: radialGradient ? Array.from(radialGradient.querySelectorAll('stop')).map(s => ({
            offset: s.getAttribute('offset'),
            color: s.getAttribute('stop-color'),
            opacity: s.getAttribute('stop-opacity')
          })) : null
        };
      });
      
      results[name] = gemData;
    }
    
    console.log('COLOR COMPARISON:');
    console.log(JSON.stringify(results, null, 2));
    
    // Check if they're the same
    if (results.Production?.gradientStops?.[0]?.color !== results.Local?.gradientStops?.[0]?.color) {
      console.log('DIFFERENCE DETECTED IN GRADIENT COLOR!');
    }
  });

  test('screenshot visual comparison of gem only', async ({ page }) => {
    // Production
    await page.goto(productionUrl);
    const prodGem = page.locator('svg').first();
    await prodGem.screenshot({ path: 'playwright-report/prod-gem.png' });
    
    // Local  
    await page.goto(localUrl);
    const localGem = page.locator('svg').first();
    await localGem.screenshot({ path: 'playwright-report/local-gem.png' });
  });

  test('check hex color values in DOM', async ({ page }) => {
    for (const [name, url] of [['Production', productionUrl], ['Local', localUrl]]) {
      await page.goto(url);
      await page.waitForLoadState('networkidle');
      
      const colors = await page.evaluate(() => {
        const h1 = document.querySelector('h1');
        const trovesSpan = h1?.querySelector('span');
        const svg = document.querySelector('svg');
        const path = svg?.querySelector('path');
        
        return {
          trovesColor: trovesSpan ? window.getComputedStyle(trovesSpan).color : null,
          gemStroke: path ? window.getComputedStyle(path).stroke : null,
          gemFill: path ? window.getComputedStyle(path).fill : null,
        };
      });
      
      console.log(`${name} Colors:`, colors);
    }
  });
});
