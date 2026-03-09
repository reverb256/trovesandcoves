import { test, expect } from '@playwright/test';

test.describe('Positioning Debug - Local vs Production', () => {
  const productionUrl = 'https://reverb256.github.io/trovesandcoves/';
  const localUrl = 'http://localhost:5000';

  test('compare gem and text positioning', async ({ page }) => {
    // Production
    await page.goto(productionUrl);
    await page.waitForLoadState('networkidle');
    
    const h1Prod = await page.locator('h1').boundingBox();
    const gemProd = await page.locator('svg').first().boundingBox();
    const trovesTextProd = await page.locator('h1 span').first().boundingBox();
    
    console.log('PRODUCTION:', {
      h1: h1Prod,
      gem: gemProd,
      trovesText: trovesTextProd,
      gemRelativeToTroves: gemProd && trovesTextProd ? {
        x: gemProd.x - trovesTextProd.x,
        y: gemProd.y - trovesTextProd.y
      } : null
    });

    // Local
    await page.goto(localUrl);
    await page.waitForLoadState('networkidle');
    
    const h1Local = await page.locator('h1').boundingBox();
    const gemLocal = await page.locator('svg').first().boundingBox();
    const trovesTextLocal = await page.locator('h1 span').first().boundingBox();
    
    console.log('LOCAL:', {
      h1: h1Local,
      gem: gemLocal,
      trovesText: trovesTextLocal,
      gemRelativeToTroves: gemLocal && trovesTextLocal ? {
        x: gemLocal.x - trovesTextLocal.x,
        y: gemLocal.y - trovesTextLocal.y
      } : null
    });
  });

  test('check viewport and container sizes', async ({ page }) => {
    for (const [name, url] of [['Production', productionUrl], ['Local', localUrl]]) {
      await page.goto(url);
      await page.waitForLoadState('networkidle');
      
      const viewportInfo = await page.evaluate(() => ({
        viewportWidth: window.innerWidth,
        viewportHeight: window.innerHeight,
        documentWidth: document.documentElement.scrollWidth,
        documentHeight: document.documentElement.scrollHeight
      }));
      
      const heroSection = await page.locator('section').first();
      const heroBox = await heroSection.boundingBox();
      
      console.log(`${name}:`, {
        viewport: viewportInfo,
        heroSection: heroBox
      });
    }
  });

  test('check transform values on gem container', async ({ page }) => {
    for (const [name, url] of [['Production', productionUrl], ['Local', localUrl]]) {
      await page.goto(url);
      await page.waitForLoadState('networkidle');
      
      const gemInfo = await page.evaluate(() => {
        const svg = document.querySelector('svg');
        if (!svg) return null;
        
        let current = svg as Element;
        let depth = 0;
        const transforms: string[] = [];
        
        while (current && depth < 10) {
          const styles = window.getComputedStyle(current);
          const transform = styles.transform;
          if (transform && transform !== 'none') {
            transforms.push(`depth${depth}: ${transform}`);
          }
          
          current = current.parentElement as Element;
          depth++;
        }
        
        return {
          svgBox: (svg as SVGElement).getBoundingClientRect(),
          parentClasses: svg.parentElement?.className,
          parentTransform: svg.parentElement ? window.getComputedStyle(svg.parentElement).transform : null,
          transforms
        };
      });
      
      console.log(`${name} Gem Info:`, JSON.stringify(gemInfo, null, 2));
    }
  });
});
