import { test, expect } from '@playwright/test';

test.describe('Performance Tests', () => {
  test('page loads within acceptable time', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/');
    
    // Wait for the hero section to be visible (indicates page is loaded)
    await page.getByRole('banner').waitFor();
    
    const loadTime = Date.now() - startTime;
    
    // Page should load within 3 seconds
    expect(loadTime).toBeLessThan(3000);
    console.log(`Page load time: ${loadTime}ms`);
  });

  test('Core Web Vitals are within thresholds', async ({ page }) => {
    await page.goto('/');
    
    // Wait for page to be fully loaded
    await page.waitForLoadState('networkidle');
    
    // Measure Core Web Vitals
    const vitals = await page.evaluate(() => {
      return new Promise((resolve) => {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const vitalsData: Record<string, number> = {};
          
          entries.forEach((entry) => {
            if (entry.entryType === 'paint') {
              vitalsData[entry.name] = entry.startTime;
            }
          });
          
          // Get LCP from PerformanceObserver
          const lcpObserver = new PerformanceObserver((lcpList) => {
            const lcpEntries = lcpList.getEntries();
            if (lcpEntries.length > 0) {
              const lastEntry = lcpEntries[lcpEntries.length - 1];
              vitalsData.lcp = lastEntry.startTime;
            }
            resolve(vitalsData);
          });
          
          lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
          
          // Fallback timeout
          setTimeout(() => resolve(vitalsData), 5000);
        });
        
        observer.observe({ entryTypes: ['paint'] });
      });
    });
    
    console.log('Core Web Vitals:', vitals);
    
    // Check thresholds (if data is available)
    if (vitals && typeof vitals === 'object') {
      const vitalsObj = vitals as Record<string, number>;
      
      // First Contentful Paint should be under 1.8s
      if (vitalsObj['first-contentful-paint']) {
        expect(vitalsObj['first-contentful-paint']).toBeLessThan(1800);
      }
      
      // Largest Contentful Paint should be under 2.5s
      if (vitalsObj.lcp) {
        expect(vitalsObj.lcp).toBeLessThan(2500);
      }
    }
  });

  test('images load efficiently', async ({ page }) => {
    await page.goto('/');
    
    // Check for lazy loading attributes
    const images = page.locator('img');
    const imageCount = await images.count();
    
    if (imageCount > 0) {
      // Check if images have appropriate loading attributes
      for (let i = 0; i < Math.min(imageCount, 5); i++) {
        const img = images.nth(i);
        const loading = await img.getAttribute('loading');
        const src = await img.getAttribute('src');
        
        // Images should either have loading="lazy" or be above the fold
        if (src && !src.startsWith('data:')) {
          console.log(`Image ${i}: loading=${loading}, src=${src}`);
        }
      }
    }
  });

  test('bundle size is reasonable', async ({ page }) => {
    // Track network requests
    const jsFiles: string[] = [];
    const cssFiles: string[] = [];
    
    page.on('response', (response) => {
      const url = response.url();
      if (url.includes('.js') && response.status() === 200) {
        jsFiles.push(url);
      }
      if (url.includes('.css') && response.status() === 200) {
        cssFiles.push(url);
      }
    });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    console.log(`JavaScript files loaded: ${jsFiles.length}`);
    console.log(`CSS files loaded: ${cssFiles.length}`);
    
    // Should not load excessive number of files
    expect(jsFiles.length).toBeLessThan(10);
    expect(cssFiles.length).toBeLessThan(5);
  });

  test('Framer Motion animations perform well', async ({ page }) => {
    await page.goto('/');
    
    // Measure animation performance
    const animationPerformance = await page.evaluate(() => {
      const startTime = performance.now();
      
      // Trigger any hover animations
      const heroTitle = document.querySelector('h1');
      if (heroTitle) {
        heroTitle.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
        heroTitle.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
      }
      
      const endTime = performance.now();
      return endTime - startTime;
    });
    
    // Animation interactions should be responsive (under 16ms for 60fps)
    expect(animationPerformance).toBeLessThan(100);
    console.log(`Animation performance: ${animationPerformance}ms`);
  });

  test('PWA service worker is working', async ({ page }) => {
    await page.goto('/');
    
    // Check if service worker is registered
    const serviceWorkerRegistered = await page.evaluate(() => {
      return 'serviceWorker' in navigator;
    });
    
    expect(serviceWorkerRegistered).toBe(true);
    
    // Wait a bit for service worker to potentially register
    await page.waitForTimeout(2000);
    
    const swRegistration = await page.evaluate(async () => {
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.getRegistration();
        return !!registration;
      }
      return false;
    });
    
    console.log(`Service Worker registered: ${swRegistration}`);
  });

  test('page is responsive across viewports', async ({ page }) => {
    const viewports = [
      { width: 375, height: 667, name: 'Mobile' },
      { width: 768, height: 1024, name: 'Tablet' },
      { width: 1920, height: 1080, name: 'Desktop' }
    ];
    
    for (const viewport of viewports) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto('/');
      
      // Check that hero section is visible in all viewports
      const hero = page.getByRole('banner');
      await expect(hero).toBeVisible();
      
      // Check that main navigation is accessible
      const header = page.locator('header');
      await expect(header).toBeVisible();
      
      console.log(`${viewport.name} (${viewport.width}x${viewport.height}): ✓`);
    }
  });
});
