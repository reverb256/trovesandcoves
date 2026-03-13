# HTTPS/SSL Setup Guide

## Overview

This guide explains HTTPS/SSL configuration for the Troves & Coves site. Both GitHub Pages and Cloudflare provide free SSL certificates.

---

## GitHub Pages HTTPS

### Automatic SSL

GitHub Pages automatically provides HTTPS certificates for all sites:

**Default URL:**
```
https://reverb256.github.io/trovesandcoves
```

**Features:**
- ✅ Automatic SSL certificate
- ✅ Auto-renewal
- ✅ Force HTTPS enabled by default
- ✅ HSTS enabled

### Custom Domain HTTPS

For custom domains (e.g., `trovesandcoves.ca`):

1. **Add CNAME file** to repository:
```
trovesandcoves.ca
```

2. **Configure DNS** at your provider:
```
Type: CNAME
Name: @
Target: reverb256.github.io
```

3. **Enable HTTPS in GitHub**:
   - Go to repository → Settings → Pages
   - Under "Custom domain", enter your domain
   - Check "Enforce HTTPS" (may take 24 hours)

---

## Cloudflare HTTPS

### Universal SSL

If using Cloudflare for DNS, you get free SSL:

1. **Add domain to Cloudflare**
2. **Update nameservers** at your registrar
3. **SSL is automatic** - no configuration needed

### SSL/TLS Mode

In Cloudflare dashboard → SSL/TLS → Overview:

| Mode | Description | Recommendation |
|------|-------------|----------------|
| **Off** | No HTTPS | ❌ Don't use |
| **Flexible** | HTTPS between user and Cloudflare only | ⚠️ Not recommended |
| **Full** | HTTPS to origin, but doesn't validate cert | ⚠️ OK for testing |
| **Full (Strict)** | HTTPS with valid certificate required | ✅ **Recommended** |

Set to **Full (strict)** for production.

### Edge Certificates

Enable these settings in SSL/TLS → Edge Certificates:

- ✅ **Universal SSL**: On
- ✅ **Always Use HTTPS**: On
- ✅ **Automatic HTTPS Rewrites**: On
- ✅ **Minimum TLS Version**: 1.2
- ✅ **Opportunistic Encryption**: On

---

## Security Headers

### GitHub Pages Headers

GitHub Pages automatically adds these headers:

```
Strict-Transport-Security: max-age=31536000
X-Content-Type-Options: nosniff
X-Frame-Options: SAMEORIGIN
```

### Cloudflare Security Headers

Optionally add via Cloudflare Page Rules:

```
Rule: *trovesandcoves.ca/*

Settings:
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- X-XSS-Protection: 1; mode=block
- Referrer-Policy: strict-origin-when-cross-origin
```

---

## Verification

### Check HTTPS Status

**Using curl:**
```bash
curl -I https://trovesandcoves.ca
# Should return: HTTP/2 200
```

**Check SSL Certificate:**
```bash
openssl s_client -connect trovesandcoves.ca:443 -servername trovesandcoves.ca
# Shows certificate details
```

**Check Certificate Expiration:**
```bash
echo | openssl s_client -connect trovesandcoves.ca:443 2>/dev/null | openssl x509 -noout -dates
```

### Online Tools

- [SSL Labs](https://www.ssllabs.com/ssltest/) - Comprehensive SSL test
- [Why No HTTPS?](https://whynohttps.com/) - Quick HTTPS check
- [Security Headers](https://securityheaders.com/) - Header analysis

---

## Troubleshooting HTTPS

### Mixed Content Warnings

**Problem:** Page loads over HTTPS but some resources use HTTP

**Solutions:**
1. Use relative URLs for internal resources
2. Ensure all external resources support HTTPS
3. Add meta tag: `<meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests">`

### Certificate Errors

**Problem:** Browser shows SSL certificate warning

**Solutions:**
- **GitHub Pages**: Wait 24 hours after DNS setup
- **Cloudflare**: Check SSL/TLS mode is "Full (strict)"
- **Custom Domain**: Verify DNS CNAME is correct
- **Clear DNS cache**: `ipconfig /flushdns` (Windows) or `sudo dscacheutil -flushcache` (Mac)

### HTTP Still Accessible

**Problem:** Site accessible via HTTP (should redirect to HTTPS)

**Solutions:**
1. In GitHub Pages Settings, check "Enforce HTTPS"
2. In Cloudflare, enable "Always Use HTTPS"
3. Add page rule for HTTP→HTTPS redirect

### Certificate Not Issued

**Problem:** GitHub Pages shows "Certificate not issued"

**Causes:**
- DNS not propagated
- Wrong DNS record type
- CNAME file missing or incorrect

**Solutions:**
1. Verify DNS with `dig yourdomain.com`
2. Check CNAME file exists in repo
3. Use DNS Checker to verify propagation
4. Wait up to 48 hours for full propagation

---

## HTTP to HTTPS Redirect

### Automatic Redirects

**GitHub Pages:** Automatically redirects HTTP to HTTPS

**Cloudflare:** Enable "Always Use HTTPS" in SSL/TLS settings

### Manual Redirect (Optional)

Add to your React app or HTML:

```javascript
// In main.tsx
useEffect(() => {
  if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
    location.replace(`https:${location.href.substring(location.protocol.length)}`);
  }
}, []);
```

---

## Best Practices

1. ✅ **Always use HTTPS** in production
2. ✅ **Enable HSTS** with long max-age
3. ✅ **Use strong TLS** (1.2 minimum, 1.3 preferred)
4. ✅ **Keep certificates updated** (automatic with GitHub/Cloudflare)
5. ✅ **Test SSL configuration** regularly
6. ✅ **Monitor certificate expiration**

---

## Monitoring

### SSL Certificate Expiration

Set up monitoring for:
- Certificate expiration (30-day warning)
- SSL/TLS configuration changes
- Mixed content issues

Tools:
- [Uptime Robot](https://uptimerobot.com/) - Free monitoring
- [StatusCake](https://www.statuscake.com/) - SSL monitoring
- Cloudflare Analytics - SSL/TLS error tracking

---

## Summary

| Platform | SSL Provider | Auto-Renewal | Configuration |
|----------|-------------|--------------|--------------|
| GitHub Pages | Let's Encrypt | ✅ Yes | Automatic |
| Cloudflare | Cloudflare SSL | ✅ Yes | Automatic |
| Custom (Direct) | Let's Encrypt/Certbot | ⚠️ Manual | Manual setup required |

---

## Related Documentation

- [Custom Domain Setup](custom-domain-setup.md) - DNS and domain configuration
- [Quick Setup Guide](quick-setup.md) - Initial deployment
- [Main Deployment Guide](README.md) - Complete documentation

---

**Last Updated**: 2026-03-13
