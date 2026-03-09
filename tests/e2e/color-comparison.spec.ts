import { test, expect } from '@playwright/test';

test.describe('Color Comparison - Local vs Production', () => {
  const productionUrl = 'https://reverb256.github.io/trovesandcoves/';
  const localUrl = 'http://localhost:5000';

  test('compare hero gem colors', async ({ page }) => {
    // Test production first
    await page.goto(productionUrl);
    await page.waitForLoadState('networkidle');
    
    const prodGem = page.locator('svg').first();
    const prodGemColors = await prodGem.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return {
        display: styles.display,
        visibility: styles.visibility,
        opacity: styles.opacity,
      };
    });

    // Test local
    await page.goto(localUrl);
    await page.waitForLoadState('networkidle');
    
    const localGem = page.locator('svg').first();
    const localGemColors = await localGem.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return {
        display: styles.display,
        visibility: styles.visibility,
        opacity: styles.opacity,
      };
    });

    console.log('Production Gem:', prodGemColors);
    console.log('Local Gem:', localGemColors);
  });

  test('check CSS variables in production', async ({ page }) => {
    await page.goto(productionUrl);
    await page.waitForLoadState('networkidle');

    const bodyStyles = await page.evaluate(() => {
      const body = document.body;
      const computed = window.getComputedStyle(body);
      const rootStyles = getComputedStyle(document.documentElement);
      
      return {
        bodyBg: computed.backgroundColor,
        bodyColor: computed.color,
        cssVars: {
          skullTurquoise: rootStyles.getPropertyValue('--skull-turquoise'),
          goldMedium: rootStyles.getPropertyValue('--gold-medium'),
          accentVibrant: rootStyles.getPropertyValue('--accent-vibrant'),
        }
      };
    });

    console.log('Production styles:', JSON.stringify(bodyStyles, null, 2));
  });

  test('screenshot comparison', async ({ page }) => {
    // Production
    await page.goto(productionUrl);
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: 'playwright-report/production-hero.png', fullPage: false });

    // Local
    await page.goto(localUrl);
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: 'playwright-report/local-hero.png', fullPage: false });
  });

  test('check for gradient definitions', async ({ page }) => {
    await page.goto(productionUrl);
    
    const hasGradient = await page.evaluate(() => {
      const svgs = document.querySelectorAll('svg defs');
      return {
        svgCount: document.querySelectorAll('svg').length,
        defCount: svgs.length,
        gradients: Array.from(svgs).map(svg => {
          const radial = svg.querySelector('radialGradient[id]');
          const linear = svg.querySelector('linearGradient[id]');
          return {
            radialId: radial?.id,
            radialStops: radial ? Array.from(radial.querySelectorAll('stop')).map(stop => ({
              offset: stop.getAttribute('offset'),
              color: stop.getAttribute('stop-color'),
              opacity: stop.getAttribute('stop-opacity')
            })) : null,
            linearId: linear?.id
          };
        })
      };
    });

    console.log('Production Gradients:', JSON.stringify(hasGradient, null, 2));
  });
});
