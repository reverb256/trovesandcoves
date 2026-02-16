# GitHub Pages + Cloudflare Workers Deployment Guide

## 🎯 Architecture Overview

This setup maximizes the free tiers of both GitHub Pages and Cloudflare Workers:

- **GitHub Pages**: Hosts the React frontend (1GB storage, 100GB bandwidth/month)
- **Cloudflare Workers**: Handles API requests and dynamic features (100k requests/day)
- **Cloudflare KV**: Stores product data, cart sessions, and analytics (1GB total)

## 🚀 Quick Setup

### 1. GitHub Repository Setup

```bash
# Clone this repository
git clone https://github.com/YOUR_USERNAME/troves-coves.git
cd troves-coves

# Install dependencies
npm install

# Test local build
npm run build:frontend
```

### 2. GitHub Pages Configuration

1. Go to your repository settings → Pages
2. Set source to "GitHub Actions"
3. The workflow will automatically deploy on push to main

### 3. Cloudflare Setup

#### A. Get API Credentials
1. Login to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Go to "My Profile" → "API Tokens"
3. Create token with permissions:
   - Zone:Zone:Read
   - Zone:Zone Settings:Edit  
   - Account:Cloudflare Workers:Edit
   - Account:Account Settings:Read

#### B. Add GitHub Secrets
Go to your repository → Settings → Secrets and variables → Actions:

```
CLOUDFLARE_API_TOKEN=your_token_here
CLOUDFLARE_ACCOUNT_ID=your_account_id_here
ANTHROPIC_API_KEY=your_anthropic_key (optional)
OPENAI_API_KEY=your_openai_key (optional)
```

#### C. Deploy Worker
```bash
# Install Wrangler CLI
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Deploy worker
npm run deploy:cloudflare
```

### 4. Domain Configuration (Optional)

#### For Custom Domain:
1. Add your domain to Cloudflare
2. Update `cloudflare.toml` routes section
3. Add CNAME record: `api.yourdomain.com` → `your-worker.your-subdomain.workers.dev`

## 📊 Free Tier Limits & Optimization

### GitHub Pages Limits
- ✅ **Storage**: 1GB (plenty for static site)
- ✅ **Bandwidth**: 100GB/month (excellent for traffic)
- ✅ **Build time**: 10 minutes (our build takes ~2 minutes)

### Cloudflare Workers Limits
- ✅ **CPU time**: 10ms per request (our functions use ~2-5ms)
- ✅ **Requests**: 100,000/day (with automatic rate limiting at 90k)
- ✅ **Memory**: 128MB (our worker uses ~10-20MB)

### Cloudflare KV Limits
- ✅ **Storage**: 1GB total (optimized with TTL and data cleanup)
- ✅ **Reads**: 100,000/day (cached aggressively)
- ✅ **Writes**: 1,000/day (batch operations where possible)

## 🛠️ Available Commands

### Development
```bash
npm run dev              # Start full-stack development server
npm run cf:dev          # Test Cloudflare Worker locally
```

### Building
```bash
npm run build                    # Build both frontend and worker
npm run build:frontend          # Build React app only
npm run build:github-pages      # Build optimized for GitHub Pages
```

### Deployment
```bash
npm run deploy:github-pages     # Deploy to GitHub Pages
npm run deploy:cloudflare       # Deploy to Cloudflare Workers
npm run deploy:all              # Deploy to both platforms
```

### Monitoring
```bash
npm run cf:tail                 # View Cloudflare Worker logs
npm run cf:kv:list             # List KV namespaces
npm run analyze:bundle         # Analyze bundle size
```

## 🔧 Configuration Files

### Key Files
- `.github/workflows/deploy.yml` - Automated deployment
- `cloudflare.toml` - Worker configuration  
- `cloudflare-worker.js` - API and routing logic
- `vite.config.ts` - Frontend build configuration

### Environment Variables
- `VITE_API_URL` - Points to your Cloudflare Worker
- `MAX_REQUESTS_PER_DAY` - Rate limiting (default: 90,000)
- `GITHUB_PAGES_URL` - Fallback URL when worker is rate limited

## 📈 Performance Optimizations

### Frontend (GitHub Pages)
- ✅ Static asset caching
- ✅ Image optimization  
- ✅ Code splitting
- ✅ Lazy loading components
- ✅ Service worker for offline support

### Backend (Cloudflare Workers)
- ✅ Request rate limiting
- ✅ Aggressive caching (1 hour default)
- ✅ KV storage with TTL
- ✅ Graceful fallback to GitHub Pages
- ✅ Analytics sampling (10% in production)

## 🔍 Monitoring & Analytics

### Request Tracking
The worker automatically tracks daily request counts and implements rate limiting at 90% of the free tier limit (90,000 requests/day).

### KV Storage Management
- Cart sessions: 24 hour TTL
- Analytics data: 30 day TTL  
- Product cache: 1 hour TTL
- Request counters: 25 hour TTL

### Error Handling
- Automatic fallback to GitHub Pages when worker is unavailable
- Graceful degradation when rate limits are reached
- Comprehensive error logging

## 🚨 Troubleshooting

### Common Issues

#### 1. GitHub Actions failing
```bash
# Check if secrets are set correctly
gh secret list

# Verify build locally
npm run build:frontend
```

#### 2. Cloudflare Worker not deploying
```bash
# Check wrangler authentication
wrangler whoami

# Verify configuration
wrangler dev --local
```

#### 3. Rate limiting triggered
The worker will automatically redirect to GitHub Pages when the daily limit is reached. This ensures continuous service.

#### 4. KV storage full
Monitor storage usage:
```bash
wrangler kv:namespace list
```

Implement data cleanup in your worker if needed.

## 🎯 Free Tier Maximization Tips

1. **Enable caching**: All responses cached for 1 hour
2. **Use CDN**: Cloudflare's global network reduces origin requests
3. **Implement rate limiting**: Automatic protection against exceeding limits
4. **Optimize images**: Use WebP format and responsive images
5. **Lazy load content**: Reduce initial bundle size
6. **Monitor usage**: Regular checks on Cloudflare dashboard

## 📝 Deployment Checklist

- [ ] Repository cloned and dependencies installed
- [ ] GitHub Pages enabled with Actions source
- [ ] Cloudflare API token created and added to GitHub secrets  
- [ ] Cloudflare account ID added to GitHub secrets
- [ ] Worker deployed successfully
- [ ] KV namespaces created
- [ ] Custom domain configured (optional)
- [ ] SSL certificate active
- [ ] Rate limiting tested
- [ ] Fallback to GitHub Pages working

## 🔗 Useful Links

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/)
- [Wrangler CLI Reference](https://developers.cloudflare.com/workers/wrangler/)
- [Cloudflare KV Documentation](https://developers.cloudflare.com/workers/runtime-apis/kv/)

## 💡 Next Steps

1. **Deploy**: Follow the setup steps above
2. **Test**: Verify both GitHub Pages and Cloudflare Worker are working
3. **Monitor**: Keep an eye on usage metrics in Cloudflare dashboard
4. **Optimize**: Use the monitoring data to further optimize performance
5. **Scale**: When ready to upgrade, consider Cloudflare Workers Paid plan for unlimited requests

---

**Need help?** Check the troubleshooting section above or create an issue in this repository.
