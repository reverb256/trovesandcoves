# Troves & Coves: Serverless Migration Guide

## Overview
This guide migrates trovesandcoves from a monolithic Express+PostgreSQL setup to a static GitHub Pages frontend with Vercel serverless backend.

## Architecture Changes

### Before (Current)
```
┌─────────────┐    ┌──────────────┐    ┌──────────────┐
│ React App   │────│ Express API  │────│ PostgreSQL   │
│ (Vite Dev)  │    │ (Port 5000)  │    │ (Local)      │
└─────────────┘    └──────────────┘    └──────────────┘
```

### After (Target)
```
┌─────────────┐    ┌──────────────┐    ┌──────────────┐
│ React App   │────│ Vercel API   │────│ Neon DB      │
│ (GitHub Pgs) │    │ (Serverless) │    │ (Serverless) │
└─────────────┘    └──────────────┘    └──────────────┘
```

## Benefits
✅ **Free Hosting**: GitHub Pages + Vercel free tiers
✅ **Better Performance**: Edge-optimized backend
✅ **Scalability**: Auto-scaling serverless functions
✅ **Lower Costs**: No server maintenance
✅ **Better SEO**: Static hosting benefits

## Migration Steps

### 1. Database Setup (Neon)
1. Create account at [neon.tech](https://neon.tech)
2. Create new database
3. Get connection string
4. Update `.env.serverless` with DATABASE_URL

### 2. Schema Migration
```bash
# Backup existing data
./scripts/migrate-database.sh

# Push schema to Neon
npm run db:push
```

### 3. Backend Migration
```bash
# Install serverless dependencies
cd api && npm install

# Test locally
npm run dev

# Deploy to Vercel
npm run deploy
```

### 4. Frontend Configuration
Update environment variables:
- `VITE_API_URL=https://troves-coves-api.vercel.app`
- `VITE_GITHUB_PAGES_URL=https://reverb256.github.io/troves-coves`

### 5. Frontend Deployment
```bash
# Build for GitHub Pages
npm run build:github-pages

# Deploy to GitHub Pages
npm run deploy:github-pages
```

## API Structure

### Serverless Functions
- `api/products/index.js` - Product catalog
- `api/cart/index.js` - Shopping cart
- `api/orders/index.js` - Order management
- `api/payments/create-intent.js` - Stripe payments
- `api/contact/index.js` - Contact forms
- `api/categories/index.js` - Product categories

### Session Management
- Uses `X-Session-ID` header instead of server sessions
- Fallback to sessionStorage/localStorage
- Preserves cart across page refreshes

## Environment Configuration

### Serverless (.env.serverless)
```bash
DATABASE_URL=postgresql://user:pass@ep-xxx.us-east-2.aws.neon.tech/db
STRIPE_SECRET_KEY=sk_test_...
ALLOWED_ORIGIN=https://reverb256.github.io/troves-coves
```

### Frontend (Vite)
```bash
VITE_API_URL=https://troves-coves-api.vercel.app
VITE_STRIPE_PUBLIC_KEY=pk_test_...
```

## Testing

### Local Development
```bash
# Frontend
npm run dev

# Backend (separate terminal)
cd api && npm run dev
```

### Production Testing
```bash
# Test API
curl https://troves-coves-api.vercel.app/api/categories

# Test Frontend
https://reverb256.github.io/troves-coves
```

## Deployment Commands

### Full Deployment
```bash
./scripts/deploy-serverless.sh
```

### Individual Deployments
```bash
# Backend only
npm run deploy:serverless

# Frontend only
npm run deploy:github-pages
```

## Monitoring

### Vercel
- API logs: `vercel logs`
- Analytics: Vercel dashboard
- Functions usage: Vercel dashboard

### Neon
- Database metrics: Neon dashboard
- Connection pooling: Auto-configured
- Backups: Automatic

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Check `ALLOWED_ORIGIN` environment variable
   - Verify GitHub Pages URL matches exactly

2. **Database Connection**
   - Ensure Neon DATABASE_URL is correct
   - Check connection string format
   - Verify SSL mode is enabled

3. **Stripe Integration**
   - Verify Stripe keys are correct
   - Check webhook configuration
   - Test with test mode first

4. **Session Management**
   - Clear browser storage if issues persist
   - Check session ID generation
   - Verify CORS headers

### Debug Commands
```bash
# Check API response
curl -H "X-Session-ID: test" https://troves-coves-api.vercel.app/api/cart

# Verify database connection
psql $DATABASE_URL -c "SELECT COUNT(*) FROM products;"
```

## Rollback Plan

If migration fails:
1. Restore original server: `npm run dev`
2. Revert database: Use backup SQL file
3. Frontend: Update VITE_API_URL back to localhost:5000

## Post-Migration Checklist

- [ ] All products load correctly
- [ ] Cart functionality works
- [ ] Checkout process complete
- [ ] Stripe payments process
- [ ] Contact forms submit
- [ ] Admin dashboard accessible
- [ ] AI features functional
- [ ] Performance metrics acceptable
- [ ] Error logging configured
- [ ] Monitoring setup complete

## Support Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Neon Documentation](https://neon.tech/docs)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [Stripe Documentation](https://stripe.com/docs)