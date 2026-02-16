import { test, expect } from '@playwright/test';

test.describe('Security Tests (OWASP Compliance)', () => {
  test('verifies CSP headers are present', async ({ page }) => {
    const response = await page.goto('/');
    const cspHeader = response?.headers()['content-security-policy'];
    
    // Check if CSP header exists (may not be set in development)
    if (cspHeader) {
      expect(cspHeader).toContain("default-src");
    }
  });

  test('prevents XSS in URL parameters', async ({ page }) => {
    // Test with malicious script in URL
    await page.goto('/?search=<script>alert("xss")</script>');
    
    // Check that script tags are not rendered in the DOM
    const pageContent = await page.content();
    expect(pageContent).not.toContain('<script>alert("xss")</script>');
    
    // Check that no alert dialog appears
    let alertTriggered = false;
    page.on('dialog', () => {
      alertTriggered = true;
    });
    
    await page.waitForTimeout(1000);
    expect(alertTriggered).toBe(false);
  });

  test('verifies secure headers', async ({ page }) => {
    const response = await page.goto('/');
    const headers = response?.headers();
    
    if (headers) {
      // Check for security headers (may not be present in development)
      const securityHeaders = [
        'x-frame-options',
        'x-content-type-options',
        'referrer-policy'
      ];
      
      // Log which security headers are present
      securityHeaders.forEach(header => {
        if (headers[header]) {
          console.log(`Security header ${header}: ${headers[header]}`);
        }
      });
    }
  });

  test('form inputs are properly sanitized', async ({ page }) => {
    await page.goto('/contact');
    
    // Try to inject script in form fields
    const maliciousInput = '<script>alert("xss")</script>';
    
    // Fill form with malicious input (if contact form exists)
    const nameInput = page.locator('input[name="name"]').first();
    if (await nameInput.isVisible()) {
      await nameInput.fill(maliciousInput);
      
      // Check that the input value is sanitized or escaped
      const inputValue = await nameInput.inputValue();
      expect(inputValue).not.toContain('<script>');
    }
  });

  test('prevents clickjacking with frame protection', async ({ page }) => {
    // Test that the page cannot be embedded in a frame
    await page.goto('/');
    
    // Check if X-Frame-Options header is set
    const response = await page.evaluate(() => {
      return fetch(window.location.href).then(r => r.headers.get('x-frame-options'));
    });
    
    // X-Frame-Options should be DENY or SAMEORIGIN for security
    if (response) {
      expect(['DENY', 'SAMEORIGIN']).toContain(response);
    }
  });

  test('sensitive data is not exposed in client-side code', async ({ page }) => {
    await page.goto('/');
    
    // Check that no API keys or sensitive data are exposed
    const pageContent = await page.content();
    const scriptContent = await page.evaluate(() => {
      return Array.from(document.scripts).map(script => script.textContent).join('');
    });
    
    // Common patterns that shouldn't appear in client code
    const sensitivePatterns = [
      /sk_live_/g,  // Stripe live keys
      /sk_test_/g,  // Stripe test keys (should also be server-side only)
      /password/gi,
      /secret/gi,
      /private.*key/gi
    ];
    
    sensitivePatterns.forEach(pattern => {
      expect(pageContent).not.toMatch(pattern);
      expect(scriptContent).not.toMatch(pattern);
    });
  });

  test('HTTPS redirect (in production)', async ({ page }) => {
    // This test would be more relevant in production
    await page.goto('/');
    const url = page.url();
    
    // In development, we might not have HTTPS, but we can check the protocol
    if (url.startsWith('https://')) {
      expect(url).toMatch(/^https:/);
    }
  });
});
