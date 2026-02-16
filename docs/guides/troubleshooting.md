# Troubleshooting Guide

## 🔧 Common Issues and Solutions

### Deployment Issues

#### GitHub Actions Failing

**Problem**: GitHub Actions workflow fails to deploy

**Symptoms**:
- Red X on commits in GitHub
- Deployment workflow shows errors
- Site not updating after push

**Solutions**:
1. **Check Secrets**: Ensure all required secrets are set
   ```bash
   # Required secrets in GitHub repository settings:
   CLOUDFLARE_API_TOKEN
   CLOUDFLARE_ACCOUNT_ID
   ```

2. **Verify Build**: Test build locally
   ```bash
   npm run build:frontend
   npm run build:cloudflare
   ```

3. **Check Logs**: Review Actions tab for specific error messages

4. **Node Version**: Ensure using Node.js 18+ in workflow

#### Cloudflare Worker Deployment Fails

**Problem**: Worker deployment fails or returns errors

**Symptoms**:
- API endpoints return 500 errors
- Worker not found messages
- KV namespace errors

**Solutions**:
1. **Verify Wrangler Setup**:
   ```bash
   wrangler whoami
   wrangler auth list
   ```

2. **Check Configuration**:
   ```bash
   # Validate cloudflare.toml
   wrangler validate
   ```

3. **Test Locally**:
   ```bash
   npm run cf:dev
   ```

4. **Check KV Namespaces**:
   ```bash
   wrangler kv:namespace list
   ```

#### GitHub Pages Not Loading

**Problem**: GitHub Pages site shows 404 or doesn't load

**Symptoms**:
- 404 error on GitHub Pages URL
- Old version still showing
- CSS/JS not loading

**Solutions**:
1. **Check Pages Settings**: Repository → Settings → Pages
2. **Source**: Must be "GitHub Actions"
3. **Custom Domain**: Verify DNS configuration
4. **Force Refresh**: Clear browser cache (Ctrl+F5)

### Runtime Issues

#### API Rate Limiting

**Problem**: API returns 429 errors or redirects to fallback

**Symptoms**:
- Cart not working
- Search returning static results
- "Daily limit reached" messages

**Solutions**:
1. **Expected Behavior**: Free tier has 100k requests/day limit
2. **Automatic Fallback**: Site gracefully falls back to GitHub Pages
3. **Wait**: Limit resets at midnight UTC
4. **Monitor Usage**: Check Cloudflare dashboard

#### Slow Loading Times

**Problem**: Site loads slowly or times out

**Symptoms**:
- Long loading times
- Images not loading
- API timeouts

**Solutions**:
1. **Check CDN**: Cloudflare should cache static assets
2. **Image Optimization**: Run `npm run optimize:images`
3. **Bundle Analysis**: Run `npm run analyze:bundle`
4. **Service Worker**: Ensure SW is installed for caching

#### Cart Not Persisting

**Problem**: Shopping cart loses items

**Symptoms**:
- Cart empties on page refresh
- Items not saving
- Session errors

**Solutions**:
1. **Session ID**: Check browser local storage for session ID
2. **24-Hour TTL**: Sessions expire after 24 hours
3. **Incognito Mode**: Private browsing may not persist sessions
4. **Cookies Enabled**: Ensure cookies/local storage enabled

### Development Issues

#### Local Development Server Won't Start

**Problem**: `npm run dev` fails to start

**Symptoms**:
- Port already in use errors
- Module not found errors
- TypeScript compilation errors

**Solutions**:
1. **Port Conflict**:
   ```bash
   # Kill process on port 3000
   lsof -ti:3000 | xargs kill -9
   ```

2. **Clean Install**:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **Check Node Version**:
   ```bash
   node --version  # Should be 18+
   npm --version   # Should be 8+
   ```

4. **Environment Variables**:
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your values
   ```

#### TypeScript Errors

**Problem**: TypeScript compilation fails

**Symptoms**:
- Red underlines in IDE
- Build fails with type errors
- `npm run check` shows errors

**Solutions**:
1. **Update Dependencies**:
   ```bash
   npm update
   ```

2. **Clear TypeScript Cache**:
   ```bash
   # Delete TypeScript cache
   rm -rf .tsbuildinfo
   ```

3. **Restart Language Server**: In VS Code, Ctrl+Shift+P → "TypeScript: Restart TS Server"

4. **Check Types**: Ensure all imported modules have types

#### Database Connection Issues

**Problem**: Local database connection fails

**Symptoms**:
- Database connection errors
- Drizzle schema errors
- SQL query failures

**Solutions**:
1. **Check Connection String**: Verify DATABASE_URL in .env
2. **Database Running**: Ensure PostgreSQL is running locally
3. **Schema Sync**:
   ```bash
   npm run db:push
   ```

### Browser Issues

#### Site Not Loading in Specific Browser

**Problem**: Site works in some browsers but not others

**Symptoms**:
- JavaScript errors
- Styling issues
- Features not working

**Solutions**:
1. **Clear Cache**: Hard refresh (Ctrl+Shift+R)
2. **Disable Extensions**: Test in incognito/private mode
3. **Browser Compatibility**: Check if browser supports modern JavaScript
4. **Console Errors**: Check browser developer tools

#### Mobile Display Issues

**Problem**: Site doesn't display correctly on mobile

**Symptoms**:
- Layout broken on mobile
- Touch interactions not working
- Text too small/large

**Solutions**:
1. **Responsive Design**: Should auto-adapt to screen size
2. **Viewport Meta Tag**: Check if present in HTML head
3. **Touch Targets**: Ensure buttons are touch-friendly
4. **Test Multiple Devices**: Use browser dev tools device simulation

### Performance Issues

#### High Bundle Size

**Problem**: JavaScript bundle is too large

**Symptoms**:
- Slow initial load
- Poor Lighthouse scores
- Mobile performance issues

**Solutions**:
1. **Bundle Analysis**:
   ```bash
   npm run analyze:bundle
   ```

2. **Code Splitting**: Implement lazy loading for routes
3. **Tree Shaking**: Ensure unused code is eliminated
4. **Image Optimization**: Compress and optimize images

#### Memory Issues

**Problem**: Site uses too much memory

**Symptoms**:
- Browser becomes slow
- Tab crashes
- Out of memory errors

**Solutions**:
1. **Check for Memory Leaks**: Use browser dev tools Memory tab
2. **Optimize Images**: Use WebP format and proper sizing
3. **Limit Concurrent Requests**: Implement request queuing
4. **Clean Up Event Listeners**: Ensure proper cleanup in useEffect

## 🆘 Getting Additional Help

### Self-Diagnosis Steps

1. **Check Browser Console**: Look for JavaScript errors
2. **Network Tab**: Check for failed requests
3. **Local vs Production**: Test locally first
4. **Minimal Reproduction**: Create minimal example of issue

### Reporting Issues

When creating an issue, include:

```markdown
## Bug Report

**Environment:**
- Browser: [Chrome 91, Firefox 89, etc.]
- OS: [Windows 10, macOS 11, Ubuntu 20.04]
- Node.js: [18.16.0]
- npm: [8.5.0]

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
Any error messages from browser console

**Additional Context:**
Any other relevant information
```

### Quick Diagnostic Commands

```bash
# Check all systems
npm run check                    # TypeScript
npm run build                    # Build process
npm run cf:dev                   # Worker locally
wrangler whoami                  # Cloudflare auth
git status                       # Repository state

# Clear everything and restart
rm -rf node_modules .next .turbo dist
npm install
npm run dev
```

### Emergency Fallback

If nothing else works:

1. **Use GitHub Pages Only**: Site will still work as static site
2. **Disable Features**: Turn off AI/dynamic features in .env
3. **Rollback**: Revert to last working commit
4. **Fresh Clone**: Clone repository fresh in new directory

### Contact Support

- **GitHub Issues**: [Create New Issue](https://github.com/reverb256/trovesandcoves/issues/new)
- **Email**: support@trovesandcoves.ca
- **Response Time**: Within 24 hours

---

**Still having issues?** Create a detailed issue report and we'll help you resolve it!
