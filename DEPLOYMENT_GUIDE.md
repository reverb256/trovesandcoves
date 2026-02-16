# 🚀 Troves & Coves Serverless Deployment Guide

## Quick Start Deployment

### Prerequisites
- GitHub account (for Pages)
- Vercel account (for API)
- Neon database account
- Stripe account (for payments)

### 1. Database Setup (Neon)
```bash
# 1. Go to neon.tech and create account
# 2. Create new PostgreSQL database
# 3. Get connection string: postgresql://user:pass@ep-xxx.us-east-2.aws.neon.tech/db
# 4. Copy to .env.serverless as DATABASE_URL
```

### 2. Environment Configuration
```bash
# Copy and configure environment files
cp .env.serverless .env.local

# Add your credentials:
DATABASE_URL=postgresql://...
STRIPE_SECRET_KEY=sk_test_...
ALLOWED_ORIGIN=https://reverb256.github.io/troves-coves
```

### 3. Deploy Backend (Vercel)
```bash
# Install serverless dependencies
cd api && npm install

# Deploy to Vercel
npm run deploy

# Note your Vercel URL: https://troves-coves-api.vercel.app
```

### 4. Configure Frontend
Update these in your `.env.local`:
```bash
VITE_API_URL=https://troves-coves-api.vercel.app
VITE_STRIPE_PUBLIC_KEY=pk_test_...
```

### 5. Deploy Frontend (GitHub Pages)
```bash
# Build for GitHub Pages
npm run build:github-pages

# Deploy to GitHub Pages
npm run deploy:github-pages

# Your site will be live at: https://reverb256.github.io/troves-coves
```

### 6. Test Everything
```bash
# Test API endpoints
curl https://troves-coves-api.vercel.app/api/categories

# Test complete e-commerce flow
# Visit: https://reverb256.github.io/troves-coves
# Add products to cart, checkout with Stripe, verify orders
```

## One-Command Deployment

### Simple Deploy (Recommended)
```bash
# Make sure you've configured .env.serverless first
./scripts/deploy-serverless.sh
```

This script will:
- ✅ Build frontend for GitHub Pages
- ✅ Deploy frontend to GitHub Pages
- ✅ Setup and deploy backend to Vercel
- ✅ Test API connection

## Environment Variables Guide

### Backend (Vercel Dashboard)
```bash
DATABASE_URL=postgresql://user:pass@ep-xxx.us-east-2.aws.neon.tech/db
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
ALLOWED_ORIGIN=https://reverb256.github.io/troves-coves
NODE_ENV=production
```

### Frontend (GitHub Actions/Repository Settings)
```bash
VITE_API_URL=https://troves-coves-api.vercel.app
VITE_STRIPE_PUBLIC_KEY=pk_test_your_stripe_publishable_key
VITE_GITHUB_PAGES_URL=https://reverb256.github.io/troves-coves
NODE_ENV=production
```

## Troubleshooting

### Common Issues

1. **CORS Errors**
   ```bash
   # Make sure ALLOWED_ORIGIN matches exactly
   ALLOWED_ORIGIN=https://reverb256.github.io/troves-coves
   # NOT https://reverb256.github.io/troves-coves/
   ```

2. **Database Connection**
   ```bash
   # Test Neon connection
   psql $DATABASE_URL -c "SELECT 1;"
   ```

3. **Build Failures**
   ```bash
   # Clear build cache
   rm -rf dist/
   npm run build:github-pages
   ```

4. **API Not Responding**
   ```bash
   # Check Vercel function logs
   vercel logs
   ```

## Post-Deployment Checklist

- [ ] Frontend loads at GitHub Pages URL
- [ ] API endpoints respond correctly
- [ ] Database connectivity working
- [ ] Cart functionality works
- [ ] Stripe payment processing works
- [ ] Order creation successful
- [ ] Contact forms submit
- [ ] AI features functional
- [ ] No CORS errors in console
- [ ] Mobile responsive design works

## Performance Optimization

After deployment, consider:

1. **Enable Vercel Edge Functions**
   ```bash
   # Move functions to edge regions
   vercel --prod --regions iad1,bru1,sfo1
   ```

2. **Set up CDN**
   - GitHub Pages already provides CDN
   - Consider custom domain for better caching

3. **Monitor Performance**
   ```bash
   # Vercel analytics
   vercel logs
   
   # Google PageSpeed Insights
   # Test with your GitHub Pages URL
   ```

## Security Considerations

1. **Environment Variables**
   - Never commit secrets to Git
   - Use Vercel/GitHub secrets for production
   - Regularly rotate Stripe keys

2. **API Security**
   - CORS properly configured
   - Rate limiting (if needed)
   - Input validation in all endpoints

3. **Database Security**
   - Neon provides automatic SSL
   - Use connection pooling
   - Regular backups

## Support Links

- [Vercel Dashboard](https://vercel.com/dashboard)
- [Neon Console](https://console.neon.tech)
- [GitHub Pages Settings](https://github.com/reverb256/troves-coves/settings/pages)
- [Stripe Dashboard](https://dashboard.stripe.com)

---

**Deployment Time: ~30 minutes**
**Cost: Free (all platforms have generous free tiers)**
**Maintenance: Minimal (serverless auto-scaling)**