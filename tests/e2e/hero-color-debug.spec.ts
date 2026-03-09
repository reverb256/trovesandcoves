import { test, expect } from '@playwright/test';

test.describe('Hero Color Debug - Production vs Local', () => {
  const productionUrl = 'https://reverb256.github.io/trovesandcoves/';
  const localUrl = 'http://localhost:5000';

  test('get all SVGs and their gradients from Hero section', async ({ page }) => {
    for (const [name, url] of [['Production', productionUrl], ['Local', localUrl]]) {
      await page.goto(url);
      await page.waitForLoadState('networkidle');
      
      const heroSvgs = await page.evaluate(() => {
        const section = document.querySelector('section');
        if (!section) return null;
        
        const svgs = Array.from(section.querySelectorAll('svg'));
        return svgs.map((svg, index) => {
          const defs = svg.querySelector('defs');
          const radial = defs?.querySelector('radialGradient[id]');
          const path = svg.querySelector('path');
          
          return {
            index,
            viewBox: svg.getAttribute('viewBox'),
            width: svg.getAttribute('width'),
            height: svg.getAttribute('height'),
            gradientId: radial?.id,
            gradientStops: radial ? Array.from(radial.querySelectorAll('stop')).map(s => ({
              offset: s.getAttribute('offset'),
              color: s.getAttribute('stop-color'),
              opacity: s.getAttribute('stop-opacity')
            })) : null,
            pathFill: path?.getAttribute('fill'),
            pathStroke: path?.getAttribute('stroke'),
            computedStroke: path ? window.getComputedStyle(path).stroke : null,
            computedFill: path ? window.getComputedStyle(path).fill : null
          };
        });
      });
      
      console.log(`${name} Hero SVGs:`, JSON.stringify(heroSvgs, null, 2));
    }
  });

  test('compare Hero TROVES text color', async ({ page }) => {
    for (const [name, url] of [['Production', productionUrl], ['Local', localUrl]]) {
      await page.goto(url);
      await page.waitForLoadState('networkidle');
      
      const trovesInfo = await page.evaluate(() => {
        const h1 = document.querySelector('h1');
        const firstSpan = h1?.querySelector('span');
        
        if (!firstSpan) return null;
        
        const styles = window.getComputedStyle(firstSpan);
        return {
          text: firstSpan.textContent,
          color: styles.color,
          colorAsRgb: styles.color,
          fontFamily: styles.fontFamily
        };
      });
      
      console.log(`${name} TROVES:`, trovesInfo);
    }
  });

  test('full page screenshots for visual comparison', async ({ page }) => {
    // Set consistent viewport
    await page.setViewportSize({ width: 1280, height: 720 });
    
    // Production
    await page.goto(productionUrl);
    await page.waitForLoadState('networkidle');
    await page.screenshot({ 
      path: 'playwright-report/prod-hero-full.png',
      fullPage: false 
    });
    
    // Local
    await page.goto(localUrl);
    await page.waitForLoadState('networkidle');
    await page.screenshot({ 
      path: 'playwright-report/local-hero-full.png',
      fullPage: false 
    });
  });
});
