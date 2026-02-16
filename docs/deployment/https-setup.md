# HTTPS/TLS Setup Guide

## 🔒 Automatic HTTPS Configuration

This guide explains how to set up automatic HTTPS/TLS for your Troves & Coves deployment using GitHub Pages and Cloudflare.

## 🌐 GitHub Pages HTTPS

GitHub Pages automatically provides HTTPS certificates for all sites:

### Default GitHub Pages URL
- **URL**: `https://reverb256.github.io/trovesandcoves`
- **SSL**: Automatic via GitHub's SSL certificates
- **Force HTTPS**: Enabled by default

### Custom Domain Setup
If you want to use a custom domain with GitHub Pages:

1. **Add CNAME file** (already included):
   ```
   trovesandcoves.ca
   ```

2. **Configure DNS** at your domain provider:
   ```
   Type: CNAME
   Name: www
   Value: reverb256.github.io
   ```

3. **Enable HTTPS** in GitHub repository settings:
   - Go to Settings → Pages
   - Check "Enforce HTTPS"

## ☁️ Cloudflare HTTPS

Cloudflare provides enterprise-grade SSL/TLS automatically:

### Worker HTTPS
- **URL**: `https://troves-coves-api.reverb256.workers.dev`
- **SSL**: Automatic via Cloudflare's global SSL
- **Certificate**: Cloudflare Universal SSL

### Custom Domain with Cloudflare
For production with custom domain:

1. **Add Domain to Cloudflare**:
   - Sign up at [Cloudflare](https://cloudflare.com)
   - Add your domain (e.g., `trovesandcoves.ca`)
   - Update nameservers as instructed

2. **Configure SSL/TLS**:
   ```
   SSL/TLS → Overview → Full (strict)
   ```

3. **Setup Page Rules** for HTTPS redirect:
   ```
   Rule: *trovesandcoves.ca/*
   Setting: Always Use HTTPS
   ```

4. **Configure Worker Routes**:
   ```
   api.trovesandcoves.ca/* → troves-coves-api.reverb256.workers.dev
   ```

## 🔧 Configuration Files

### GitHub Pages HTTPS
The site automatically uses HTTPS. No additional configuration needed.

### Cloudflare Worker HTTPS Headers
Already configured in `cloudflare-worker.js`:

```javascript
// CORS headers with security
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Session-ID',
  'Access-Control-Max-Age': '86400',
  'Cache-Control': 'public, max-age=3600',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block'
};
```

## 🚀 Deployment with HTTPS

### Environment Variables
The deployment automatically configures HTTPS URLs:

```env
VITE_API_URL=https://troves-coves-api.reverb256.workers.dev
VITE_GITHUB_PAGES_URL=https://reverb256.github.io/trovesandcoves
VITE_ENABLE_HTTPS=true
```

### GitHub Actions
The workflow automatically builds with HTTPS enabled:

```yaml
- name: Build React app
  run: npm run build
  env:
    VITE_ENABLE_HTTPS: true
    VITE_API_URL: https://troves-coves-api.reverb256.workers.dev
```

## 🔍 Verification

### Check HTTPS Status

1. **GitHub Pages**:
   ```bash
   curl -I https://reverb256.github.io/trovesandcoves
   # Should return: HTTP/2 200
   ```

2. **Cloudflare Worker**:
   ```bash
   curl -I https://troves-coves-api.reverb256.workers.dev/api/products
   # Should return: HTTP/2 200
   ```

3. **SSL Certificate**:
   ```bash
   openssl s_client -connect reverb256.github.io:443 -servername reverb256.github.io
   ```

### Browser Testing
1. Visit `https://reverb256.github.io/trovesandcoves`
2. Check for green lock icon in address bar
3. Verify no mixed content warnings
4. Test API calls work over HTTPS

## 🛡️ Security Features

### Automatic Redirects
- HTTP → HTTPS redirects enabled
- www → non-www redirects (configurable)
- Subdomain includes available

### Security Headers
Implemented in the Cloudflare Worker:
- `Strict-Transport-Security`: Force HTTPS for 1 year
- `X-Content-Type-Options`: Prevent MIME sniffing
- `X-Frame-Options`: Prevent clickjacking
- `X-XSS-Protection`: XSS protection

### Certificate Management
- **GitHub Pages**: Automatic certificate renewal
- **Cloudflare**: Universal SSL with automatic renewal
- **Custom Domain**: Free SSL certificates via Cloudflare

## 🚨 Troubleshooting HTTPS Issues

### Common Problems

#### 1. Mixed Content Warnings
**Problem**: Page loads over HTTPS but some resources over HTTP

**Solution**:
```javascript
// Ensure all URLs use HTTPS
const apiUrl = process.env.VITE_API_URL || 'https://troves-coves-api.reverb256.workers.dev';
```

#### 2. Certificate Errors
**Problem**: SSL certificate warnings in browser

**Solutions**:
- **GitHub Pages**: Wait 24 hours after setup
- **Cloudflare**: Check SSL/TLS settings (use "Full (strict)")
- **Custom Domain**: Verify DNS configuration

#### 3. CORS Issues with HTTPS
**Problem**: API calls fail when switching to HTTPS

**Solution**: Update CORS headers in worker:
```javascript
'Access-Control-Allow-Origin': 'https://reverb256.github.io'
```

#### 4. Service Worker HTTPS Requirement
**Problem**: Service worker not registering

**Solution**: Service workers require HTTPS (already configured):
```javascript
if ('serviceWorker' in navigator && window.location.protocol === 'https:') {
  // Register service worker
}
```

### Force HTTPS in React App

Add to your main component:
```javascript
useEffect(() => {
  if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
    location.replace(`https:${location.href.substring(location.protocol.length)}`);
  }
}, []);
```

## 📊 SSL Monitoring

### Automated Checks
Set up monitoring for SSL certificate expiration:

1. **Uptime Robot**: Monitor HTTPS endpoints
2. **Cloudflare Analytics**: Track SSL/TLS errors
3. **GitHub Status**: Monitor Pages availability

### Manual Verification
Regular checks:
```bash
# Check certificate expiration
echo | openssl s_client -connect reverb256.github.io:443 2>/dev/null | 
openssl x509 -noout -dates

# Test HTTPS redirect
curl -I http://reverb256.github.io/trovesandcoves
# Should return 301 with Location: https://...
```

## 🔗 Resources

- [GitHub Pages HTTPS Documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/securing-your-github-pages-site-with-https)
- [Cloudflare SSL/TLS Documentation](https://developers.cloudflare.com/ssl/)
- [Mozilla SSL Configuration Generator](https://ssl-config.mozilla.org/)
- [SSL Labs Testing Tool](https://www.ssllabs.com/ssltest/)

---

Your site now has enterprise-grade HTTPS/TLS security with automatic certificate management!
