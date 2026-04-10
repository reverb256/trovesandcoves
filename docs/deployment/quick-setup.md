# Quick Setup: GitHub Pages Deployment

## Overview

This guide helps you deploy the Troves & Coves site to GitHub Pages with a custom domain.

---

## Prerequisites

- GitHub account
- Domain registered (optional, for custom domain)
- Node.js 18+ installed locally

---

## Step 1: Fork and Clone

```bash
# Fork the repository on GitHub
# Clone your fork
git clone https://github.com/YOUR_USERNAME/trovesandcoves.git
cd trovesandcoves

# Install dependencies
npm install
```

---

## Step 2: Local Testing

```bash
# Start development server
npm run dev

# Visit http://localhost:5173
```

---

## Step 3: Build

```bash
# Production build
npm run build

# Output: dist/public/
```

---

## Step 4: Configure GitHub Pages

1. Go to your repository → **Settings** → **Pages**
2. Set **Source** to: **GitHub Actions**
3. Click **Save**

---

## Step 5: Deploy

```bash
# Commit and push to main
git add .
git commit -m "Initial deployment"
git push origin main
```

The GitHub Actions workflow will automatically:

1. Build the site
2. Deploy to GitHub Pages
3. Available at: `https://YOUR_USERNAME.github.io/trovesandcoves`

---

## Step 6: Custom Domain (Optional)

### A. Add CNAME File

Create `CNAME` in repository root:

```
yourdomain.com
```

Or for subdomain:

```
www.yourdomain.com
```

### B. Configure DNS

Add CNAME records at your domain provider:

```
Type: CNAME
Name: @
Target: YOUR_USERNAME.github.io
```

```
Type: CNAME
Name: www
Target: YOUR_USERNAME.github.io
```

### C. Update GitHub Pages

1. Go to repository → Settings → Pages
2. Under **Custom domain**, enter your domain
3. Wait for DNS check to pass
4. Enable **Enforce HTTPS**

---

## Step 7: Verify

Visit your site:

- GitHub Pages: `https://YOUR_USERNAME.github.io/trovesandcoves`
- Custom domain: `https://yourdomain.com`

---

## Environment Variables (Optional)

Create `.env` for local development:

```env
# Google Analytics
VITE_GA4_MEASUREMENT_ID=G-XXXXXXXXXX

# API URLs (for development)
VITE_API_URL=http://localhost:5000
```

---

## Troubleshooting

### "Page not found" after deployment

- Wait 5-10 minutes for GitHub Pages to propagate
- Check Actions tab for build failures
- Ensure Pages source is set to "GitHub Actions"

### Custom domain not working

- Verify DNS CNAME records
- Wait up to 24 hours for DNS propagation
- Check that CNAME file exists in repository

### Build failing

- Run `npm run build` locally to debug
- Check Node.js version (must be 18+)
- Review error logs in Actions tab

---

## Next Steps

- [Custom Domain Setup](custom-domain-setup.md) - Detailed domain configuration
- [HTTPS/SSL Setup](https-setup.md) - SSL certificate guide
- [Main Deployment Guide](README.md) - Complete deployment documentation

---

**Last Updated**: 2026-03-13
