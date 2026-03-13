# Custom Domain Setup Guide

## Overview

This guide walks through setting up a custom domain for the Troves & Coves site on GitHub Pages using Cloudflare DNS.

---

## Example Domain

This guide uses `trovesandcoves.ca` as an example. Replace with your actual domain.

---

## Step 1: Add CNAME File

Create a `CNAME` file in your repository root:

```
trovesandcoves.ca
```

Or use the subdomain:
```
www.trovesandcoves.ca
```

Commit and push this file:
```bash
git add CNAME
git commit -m "Add custom domain CNAME"
git push origin main
```

---

## Step 2: Configure DNS Records

### Option A: Using Cloudflare (Recommended)

1. **Add your domain to Cloudflare**
   - Sign up at [cloudflare.com](https://cloudflare.com)
   - Add your domain
   - Update nameservers at your registrar

2. **Add DNS Records**

   **Root Domain (@):**
   ```
   Type: CNAME
   Name: @
   Target: reverb256.github.io
   Proxy: ✅ Proxied (orange cloud)
   TTL: Auto
   ```

   **WWW Subdomain:**
   ```
   Type: CNAME
   Name: www
   Target: reverb256.github.io
   Proxy: ✅ Proxied (orange cloud)
   TTL: Auto
   ```

### Option B: Other DNS Providers

Add the same CNAME records at your provider (without proxy).

---

## Step 3: Configure GitHub Pages

1. Go to your repository → **Settings** → **Pages**
2. Under **Custom domain**, enter: `trovesandcoves.ca`
3. Wait for DNS check to pass
4. **Check "Enforce HTTPS"** once available

---

## Step 4: Configure SSL/TLS (Cloudflare)

### SSL Mode

1. In Cloudflare, go to **SSL/TLS** → **Overview**
2. Set encryption mode to **Full (strict)**

### Edge Certificates

1. Go to **SSL/TLS** → **Edge Certificates**
2. Ensure **Universal SSL** is enabled
3. Enable **Always Use HTTPS**

---

## Step 5: Page Rules (Optional)

### Force HTTPS

Create a page rule in Cloudflare:
```
Rule: *trovesandcoves.ca/*
Setting: Always Use HTTPS
```

### WWW Redirect

Redirect www to non-www:
```
Rule: www.trovesandcoves.ca/*
Setting: Forwarding URL (301)
Target: https://trovesandcoves.ca/$1
```

---

## Step 6: Verify DNS Propagation

### Check DNS

```bash
# Check root domain
dig trovesandcoves.ca

# Check www subdomain
dig www.trovesandcoves.ca

# Or use online tools
```

Visit: [DNS Checker](https://dnschecker.org/)

### Test Site Access

```bash
# Test HTTP
curl -I http://trovesandcoves.ca

# Test HTTPS
curl -I https://trovesandcoves.ca
```

Both should return `200` or `301` redirect.

---

## Verification Checklist

- [ ] CNAME file added to repository
- [ ] DNS records configured
- [ ] DNS propagated (may take 24-48 hours)
- [ ] GitHub Pages custom domain set
- [ ] DNS check passed in GitHub
- [ ] HTTPS enforced
- [ ] Site accessible at custom domain
- [ ] SSL certificate valid (no browser warnings)

---

## Troubleshooting

### "DNS_PROBE_FINISHED_NXDOMAIN"

- Verify DNS records are correct
- Wait for DNS propagation (up to 48 hours)
- Check domain nameservers are correct

### "SSL Certificate Error"

- Wait for certificate provisioning (up to 24 hours)
- Ensure SSL mode is "Full (strict)"
- Try disabling proxy temporarily, then re-enabling

### GitHub Pages "Not Found"

- Verify CNAME file contains correct domain
- Check repository is public
- Ensure GitHub Pages is enabled

### Site Loads but No Styles

- Check for mixed content (HTTP resources on HTTPS page)
- Verify all assets use relative paths
- Clear browser cache and hard refresh

---

## Cloudflare vs. Direct DNS

| Feature | Cloudflare | Direct DNS |
|---------|-----------|------------|
| CDN | ✅ Yes | ❌ No |
| SSL | ✅ Free | ✅ GitHub provides |
| DDoS Protection | ✅ Yes | ❌ No |
| Caching | ✅ Yes | ❌ No |
| Page Rules | ✅ Yes | ❌ No |
| Setup | More complex | Simpler |

---

## Final URLs

After configuration:
- **Main Site**: https://trovesandcoves.ca
- **GitHub Pages**: https://reverb256.github.io/trovesandcoves (redirects to custom domain)
- **API (dev)**: http://localhost:5000 (local only)

---

## Related Documentation

- [HTTPS/SSL Setup](https-setup.md) - Detailed SSL configuration
- [Quick Setup Guide](quick-setup.md) - Initial deployment
- [Main Deployment Guide](README.md) - Complete documentation

---

**Last Updated**: 2026-03-13
