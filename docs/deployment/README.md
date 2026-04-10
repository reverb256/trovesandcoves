# GitHub Pages Deployment Guide

## Overview

This project uses **GitHub Pages** for static site hosting. The deployment is fully automated via GitHub Actions.

- **Live Site**: https://trovesandcoves.ca
- **GitHub Pages URL**: https://reverb256.github.io/trovesandcoves
- **Platform**: GitHub Pages (static hosting)
- **Custom Domain**: trovesandcoves.ca (via Cloudflare DNS)

---

## Quick Start

### Initial Setup

1. **Clone the repository**

```bash
git clone https://github.com/YOUR_USERNAME/trovesandcoves.git
cd trovesandcoves
```

2. **Install dependencies**

```bash
npm install
```

3. **Build locally**

```bash
npm run build
```

### GitHub Pages Configuration

1. Go to your repository → Settings → Pages
2. Set **Source** to "GitHub Actions"
3. Push to `main` branch to trigger automatic deployment

---

## Build Process

The build process (`npm run build`):

1. **Vite Build**: Compiles React app to `dist/public/`
2. **Post-Build Copy**: Copies necessary assets (CNAME, 404.html)
3. **Sitemap Generation**: Creates dynamic sitemap with all products

### Build Output

```
dist/public/
├── index.html          # Main app
├── 404.html            # SPA routing fallback
├── CNAME               # Custom domain (trovesandcoves.ca)
├── sitemap.xml         # Dynamic sitemap
├── assets/             # JS, CSS, images
└── ...                 # Other static files
```

---

## CI/CD Pipeline

### GitHub Actions Workflow

Location: `.github/workflows/deploy.yml`

**Triggered by:**

- Push to `main` branch
- Manual workflow dispatch

**Jobs:**

1. **Build Frontend**: Runs `npm run build` with Node.js 20
2. **Deploy GitHub Pages**: Deploys `dist/public` to GitHub Pages
3. **Deploy Etsy Worker** (optional): Only when `cloudflare/` files change

### Environment Variables

The build uses these environment variables:

```yaml
NODE_ENV: production
VITE_GITHUB_PAGES_URL: https://trovesandcoves.ca
```

---

## Custom Domain Setup

### DNS Configuration

Configure these DNS records in Cloudflare:

```
Type: CNAME
Name: @ (or trovesandcoves.ca)
Target: reverb256.github.io
Proxy: ✅ Proxied (orange cloud)
```

```
Type: CNAME
Name: www
Target: reverb256.github.io
Proxy: ✅ Proxied (orange cloud)
```

### GitHub Pages Settings

1. Add `CNAME` file to repository root:

```
trovesandcoves.ca
```

2. In GitHub repository settings:
   - Settings → Pages → Custom domain
   - Enter: `trovesandcoves.ca`
   - Enable "Enforce HTTPS"

---

## Available Commands

### Development

```bash
npm run dev              # Start full-stack dev server
npm run preview          # Preview production build
```

### Building

```bash
npm run build            # Build for production (with sitemap)
npm run build:analyze    # Build with bundle analysis
```

### Testing

```bash
npm run check            # TypeScript type checking
npm run test             # Run unit tests
npm run test:e2e         # Run E2E tests
npm run lint             # Run linter
```

---

## Cloudflare Worker (Optional)

The project includes a Cloudflare Worker for **Etsy product synchronization**:

- **Purpose**: Sync products from Etsy API to KV storage
- **Triggered**: Cron job (scheduled) or manual
- **Location**: `cloudflare/etsy-sync-worker.ts`

### Deploy Worker

```bash
# Install Wrangler
npm install -g wrangler

# Login
wrangler login

# Deploy
wrangler deploy --config cloudflare/wrangler-etsy-sync.toml
```

**Note**: The worker is optional. The main site works perfectly without it.

---

## Troubleshooting

### GitHub Actions Failing

```bash
# Check secrets
gh secret list

# Verify build locally
npm run build
```

Required secrets for Cloudflare Worker (optional):

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

### Site Not Updating

1. **Check Actions tab**: Verify workflow completed successfully
2. **Hard refresh**: Clear browser cache (Ctrl+F5)
3. **Check DNS**: Ensure CNAME records are correct
4. **Wait for propagation**: DNS changes can take up to 24 hours

### 404 Errors

- **Ensure CNAME file exists** in repository root
- **Check GitHub Pages source** is set to "GitHub Actions"
- **Verify custom domain** in repository settings

---

## Performance

### Bundle Size

Run bundle analysis:

```bash
npm run build:analyze
```

Opens `stats.html` with bundle visualization.

### Optimization Features

- **Code Splitting**: Vendor and animation chunks
- **Tree Shaking**: Dead code elimination
- **PWA Support**: Service worker for caching
- **Image Optimization**: WebP format with responsive images

---

## Monitoring

### GitHub Actions

View deployment status:

1. Repository → Actions tab
2. Select "Deploy to GitHub Pages & Cloudflare" workflow
3. View logs for each job

### Site Analytics

Configure Google Analytics 4:

```env
# .env.local
VITE_GA4_MEASUREMENT_ID=G-XXXXXXXXXX
```

---

## Related Documentation

- [Quick Setup Guide](quick-setup.md)
- [Custom Domain Setup](custom-domain-setup.md)
- [HTTPS/SSL Setup](https-setup.md)
- [Troubleshooting](../guides/troubleshooting.md)

---

**Last Updated**: 2026-03-13
