# Custom Domain Setup: trovesandcoves.ca

## 🌐 Overview

Since you have `trovesandcoves.ca` in Cloudflare, we can set this up as your primary domain with proper routing between GitHub Pages and Cloudflare Workers.

## 🔧 Cloudflare DNS Configuration

### 1. Main Website (GitHub Pages)
Configure these DNS records in your Cloudflare dashboard:

```
Type: CNAME
Name: @ (or trovesandcoves.ca)
Target: reverb256.github.io
Proxy: ✅ Proxied (orange cloud)
TTL: Auto
```

```
Type: CNAME  
Name: www
Target: reverb256.github.io
Proxy: ✅ Proxied (orange cloud)
TTL: Auto
```

### 2. API Subdomain (Cloudflare Worker)
```
Type: CNAME
Name: api
Target: troves-coves-api.reverb256.workers.dev
Proxy: ✅ Proxied (orange cloud)
TTL: Auto
```

## 🛠️ GitHub Pages Custom Domain

### 1. Add CNAME File
Create a CNAME file in your repository:

```bash
echo "trovesandcoves.ca" > CNAME
git add CNAME
git commit -m "Add custom domain CNAME"
git push origin main
```

### 2. Configure GitHub Pages
1. Go to: https://github.com/reverb256/trovesandcoves/settings/pages
2. Under "Custom domain", enter: `trovesandcoves.ca`
3. Check "Enforce HTTPS" (may take 24 hours to become available)

## ⚙️ Cloudflare Page Rules

Set up these page rules in Cloudflare (SSL/TLS → Page Rules):

### 1. HTTPS Redirect
```
Rule: http://trovesandcoves.ca/*
Setting: Always Use HTTPS
```

### 2. WWW Redirect  
```
Rule: www.trovesandcoves.ca/*
Setting: Forwarding URL (301 redirect)
Target: https://trovesandcoves.ca/$1
```

### 3. API Routing
```
Rule: trovesandcoves.ca/api/*
Setting: Resolve Override
Target: troves-coves-api.reverb256.workers.dev
```

## 🔒 SSL/TLS Configuration

### 1. SSL Mode
Set to **Full (strict)** in Cloudflare:
```
SSL/TLS → Overview → Full (strict)
```

### 2. Edge Certificates
Ensure Universal SSL is enabled:
```
SSL/TLS → Edge Certificates → Universal SSL: On
```

## 📝 Update Configuration Files

### 1. Update Cloudflare Worker URLs
Update `cloudflare.toml`:

```toml
GITHUB_PAGES_URL = "https://trovesandcoves.ca"
```

### 2. Update GitHub Actions
Update `.github/workflows/deploy.yml`:

```yaml
env:
  VITE_API_URL: https://api.trovesandcoves.ca
  VITE_GITHUB_PAGES_URL: https://trovesandcoves.ca
```

### 3. Update Worker Routes
In your Cloudflare dashboard → Workers & Pages → troves-coves-api → Settings → Triggers:

Add routes:
- `api.trovesandcoves.ca/*`
- `trovesandcoves.ca/api/*`

## 🧪 Testing Your Setup

### 1. DNS Propagation
```bash
dig trovesandcoves.ca
dig www.trovesandcoves.ca  
dig api.trovesandcoves.ca
```

### 2. Website Access
```bash
curl -I https://trovesandcoves.ca
# Should return: HTTP/2 200

curl -I https://www.trovesandcoves.ca
# Should redirect to https://trovesandcoves.ca
```

### 3. API Access
```bash
curl https://api.trovesandcoves.ca/api/products
# Should return: JSON array of products
```

## 📋 Complete Setup Checklist

- [ ] DNS records configured in Cloudflare
- [ ] CNAME file added to repository
- [ ] GitHub Pages custom domain set
- [ ] SSL/TLS set to Full (strict)
- [ ] Page rules configured
- [ ] Worker routes added
- [ ] Configuration files updated
- [ ] DNS propagation complete (up to 24 hours)
- [ ] HTTPS certificate issued (up to 24 hours)

## 🚨 Troubleshooting

### "DNS_PROBE_FINISHED_NXDOMAIN"
- Check DNS records are correctly configured
- Wait for DNS propagation (up to 24 hours)

### "SSL Certificate Error"
- Ensure SSL mode is "Full (strict)"
- Wait for certificate provisioning (up to 24 hours)
- Try disabling proxy temporarily, then re-enable

### "GitHub Pages Not Found"
- Verify CNAME file contains `trovesandcoves.ca`
- Check repository is public
- Ensure GitHub Pages is enabled with custom domain

### API Not Working
- Verify worker routes are configured
- Check worker deployment succeeded
- Test worker directly: `https://troves-coves-api.reverb256.workers.dev`

## 📞 Final URLs

Once configured, your URLs will be:

- **Main Site**: https://trovesandcoves.ca
- **API**: https://api.trovesandcoves.ca
- **Admin** (future): https://admin.trovesandcoves.ca

## 💡 Pro Tips

1. **DNS Propagation**: Use [DNS Checker](https://dnschecker.org/) to monitor propagation
2. **SSL Testing**: Use [SSL Labs](https://www.ssllabs.com/ssltest/) to test SSL configuration
3. **Cloudflare Analytics**: Monitor traffic and performance in Cloudflare dashboard
4. **GitHub Actions**: Update environment variables after domain change

---

**Ready to switch to your custom domain?** Follow the steps above and your mystical crystal jewelry platform will be live at `trovesandcoves.ca`! ✨
