# Troubleshooting Guide

## Common Issues and Solutions

---

## Deployment Issues

### GitHub Actions Failing

**Problem**: GitHub Actions workflow fails to deploy

**Symptoms:**

- Red X on commits in GitHub
- Deployment workflow shows errors
- Site not updating after push

**Solutions:**

1. **Check Build Locally:**

```bash
npm run build
```

2. **Review Error Logs:**
   - Go to repository → Actions tab
   - Click on failed workflow run
   - Expand failed steps to see errors

3. **Check Node Version:**

```bash
node --version  # Should be 18+ or 20
```

4. **Clean Install:**

```bash
rm -rf node_modules package-lock.json
npm install
```

### GitHub Pages Not Loading

**Problem**: GitHub Pages site shows 404 or doesn't load

**Symptoms:**

- 404 error on GitHub Pages URL
- Old version still showing
- CSS/JS not loading

**Solutions:**

1. **Check Pages Settings:**
   - Repository → Settings → Pages
   - Source must be "GitHub Actions"

2. **Check Branch:**
   - Ensure you're pushing to the correct branch (`main`)

3. **Wait for Deployment:**
   - GitHub Pages can take 1-5 minutes to deploy

4. **Hard Refresh:**
   - Clear browser cache (Ctrl+F5 or Cmd+Shift+R)

### Custom Domain Not Working

**Problem**: Custom domain shows errors or doesn't load

**Symptoms:**

- DNS_PROBE_FINISHED_NXDOMAIN
- "Server not found" error
- SSL certificate error

**Solutions:**

1. **Verify DNS Records:**

```bash
dig yourdomain.com
dig www.yourdomain.com
```

2. **Check CNAME File:**
   - Ensure `CNAME` file exists in repository root
   - Contains only the domain name

3. **Wait for Propagation:**
   - DNS changes can take 24-48 hours

4. **Check SSL Status:**
   - GitHub Pages → Settings → Pages
   - Wait for "Enforce HTTPS" to become available

---

## Development Issues

### Local Development Server Won't Start

**Problem**: `npm run dev` fails to start

**Symptoms:**

- Port already in use errors
- Module not found errors
- TypeScript compilation errors

**Solutions:**

1. **Port Conflict:**

```bash
# Find and kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Or use a different port in server/index.ts
```

2. **Clean Install:**

```bash
rm -rf node_modules package-lock.json
npm install
```

3. **Check Node Version:**

```bash
node --version  # Should be 18+ or 20
npm --version
```

4. **Environment Variables:**

```bash
# Create .env file if missing
cp .env.example .env
```

### TypeScript Errors

**Problem**: TypeScript compilation fails

**Symptoms:**

- Red underlines in IDE
- Build fails with type errors
- `npm run check` shows errors

**Solutions:**

1. **Update Dependencies:**

```bash
npm update
```

2. **Restart Language Server:**
   - VS Code: Ctrl+Shift+P → "TypeScript: Restart TS Server"

3. **Clear TypeScript Cache:**

```bash
rm -rf .tsbuildinfo
```

4. **Fix Type Errors:**
   - Read error messages carefully
   - Add proper type annotations
   - Import missing types

---

## Runtime Issues

### Site Loads Slowly

**Problem**: Site has long loading times

**Symptoms:**

- Long initial load
- Images not loading
- Poor Lighthouse scores

**Solutions:**

1. **Bundle Analysis:**

```bash
npm run build:analyze
# Opens stats.html with bundle visualization
```

2. **Image Optimization:**
   - Use WebP format
   - Compress images
   - Use responsive images

3. **Check Network:**
   - Open browser DevTools → Network tab
   - Look for large files
   - Check slow requests

4. **Service Worker:**
   - Ensure service worker is registered
   - Check cache is working

### Cart Not Persisting

**Problem**: Shopping cart loses items

**Symptoms:**

- Cart empties on page refresh
- Items not saving
- Session errors

**Solutions:**

1. **Check LocalStorage:**
   - Open DevTools → Application → Local Storage
   - Verify cart data exists
   - Check for errors in Console

2. **Browser Compatibility:**
   - Ensure browser supports localStorage
   - Check private/incognito mode settings

3. **Clear Cache:**
   - Clear browser cache and localStorage
   - Reload the page

---

## Build Issues

### Build Fails

**Problem**: `npm run build` fails

**Symptoms:**

- Build stops with errors
- Output files not created
- Vite errors

**Solutions:**

1. **Check Error Messages:**
   - Read the full error output
   - Fix specific errors mentioned

2. **Clean Build:**

```bash
rm -rf dist
npm run build
```

3. **Check Disk Space:**

```bash
df -h
# Ensure sufficient disk space
```

4. **Update Dependencies:**

```bash
npm update
npm run build
```

### Sitemap Not Generated

**Problem**: Sitemap is missing or outdated

**Solutions:**

1. **Regenerate Sitemap:**

```bash
npm run generate-sitemap
```

2. **Check Script:**
   - Verify `scripts/generate-sitemap.ts` exists
   - Check for errors in the script

3. **Verify Build:**

```bash
npm run build
# Sitemap is generated as part of build
```

---

## Browser Issues

### Site Not Loading in Specific Browser

**Problem**: Site works in some browsers but not others

**Symptoms:**

- JavaScript errors
- Styling issues
- Features not working

**Solutions:**

1. **Clear Cache:**
   - Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
   - Clear browser cache

2. **Disable Extensions:**
   - Test in incognito/private mode
   - Disable ad blockers

3. **Check Browser Support:**
   - Ensure browser supports ES2020+
   - Update browser to latest version

4. **Check Console Errors:**
   - Open DevTools → Console
   - Fix any JavaScript errors

### Mobile Display Issues

**Problem**: Site doesn't display correctly on mobile

**Symptoms:**

- Layout broken on mobile
- Touch interactions not working
- Text too small/large

**Solutions:**

1. **Test Responsive Design:**
   - Use browser DevTools device simulation
   - Test on actual devices

2. **Viewport Meta Tag:**
   - Ensure `<meta name="viewport">` is present
   - Check in `index.html`

3. **Touch Targets:**
   - Ensure buttons are 44px+ for touch
   - Check padding and spacing

---

## Getting Additional Help

### Self-Diagnosis Steps

1. **Check Browser Console** for JavaScript errors
2. **Check Network Tab** for failed requests
3. **Test Locally** before reporting issues
4. **Create Minimal Reproduction** of the problem

### Reporting Issues

When creating an issue, include:

```markdown
## Bug Report

**Environment:**

- Browser: [Chrome 120, Firefox 115, etc.]
- OS: [Windows 11, macOS 14, Ubuntu 22.04]
- Node.js: [20.10.0]
- npm: [10.2.4]

**Steps to Reproduce:**

1. Go to...
2. Click on...
3. See error...

**Expected Behavior:**
What should happen

**Actual Behavior:**
What actually happens

**Screenshots:**
If applicable

**Console Errors:**
```

Paste any error messages from browser console

```

**Additional Context:**
Any other relevant information
```

### Quick Diagnostic Commands

```bash
# Check all systems
npm run check                    # TypeScript
npm run build                    # Build process
npm run test                     # Run tests
git status                       # Repository state

# Clear everything and restart
rm -rf node_modules dist
npm install
npm run dev
```

### Emergency Recovery

If nothing else works:

1. **Revert Changes:**

```bash
git log --oneline -5
git revert HEAD
```

2. **Fresh Clone:**

```bash
cd ..
git clone https://github.com/reverb256/trovesandcoves.git trovesandcoves-new
cd trovesandcoves-new
npm install
npm run dev
```

3. **Report Issue:**
   - Create detailed GitHub issue
   - Include all diagnostic information

---

## Contact Support

- **GitHub Issues**: [Create New Issue](https://github.com/reverb256/trovesandcoves/issues/new)
- **Email**: support@trovesandcoves.ca
- **Response Time**: Within 24 hours

---

**Still having issues?** Create a detailed issue report and we'll help you resolve it!

**Last Updated**: 2026-03-13
