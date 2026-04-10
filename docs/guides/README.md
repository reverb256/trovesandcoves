# User Guides

## Overview

This section contains guides for end users, administrators, and technical support.

---

## Available Guides

### For End Users

- [Getting Started](#getting-started) - Basic site navigation
- [Shopping Guide](#shopping-guide) - Browsing and purchasing products
- [Contact Support](#contact-support) - Getting help

### For Administrators

- [Content Management](#content-management) - Managing products
- [Deployment](#deployment) - Site deployment

### Technical Support

- [Troubleshooting](troubleshooting.md) - Common issues and solutions
- [Development Setup](#development-setup) - Local development

---

## Getting Started

### First Visit

1. **Browse Products** - Explore our collection of handcrafted crystal jewelry
2. **Search & Filter** - Use the search bar to find specific items
3. **Product Details** - Click any product for detailed information
4. **Add to Cart** - Select items and add them to your cart

### Navigation

- **Home** (`/`) - Featured products and latest arrivals
- **Products** (`/products`) - Full product catalog with filtering
- **About** (`/about`) - Our story and craftsmanship
- **Contact** (`/contact`) - Get in touch with us

---

## Shopping Guide

### Browsing Products

- **Categories**: Filter by jewelry type (Pendants, Necklaces, Bracelets, Earrings)
- **Search**: Use keywords to find specific crystals or styles
- **Featured**: View our featured and newest items

### Product Information

Each product page includes:

- High-quality images
- Detailed description
- Materials used
- Pricing in Canadian dollars
- Link to Etsy listing for purchase

### Shopping Cart

- **Add Items**: Click "Add to Cart" on product pages
- **View Cart**: Click cart icon in navigation
- **Checkout**: Click "Checkout on Etsy" to complete purchase on Etsy

---

## Content Management

### Product Data

Products are managed through:

- **Development**: `server/storage.ts` - In-memory storage with seeded data
- **Etsy Import**: `etsy-products.json` - Product data from Etsy

### Adding New Products

1. **Add product data** to `server/storage.ts`
2. **Add product images** to `product-images/` directory
3. **Update types** in `shared/types.ts` if needed
4. **Rebuild** the site to include new products

### Updating Product Information

1. Edit `server/storage.ts` with new product details
2. Run `npm run build` to regenerate the site
3. Deploy to GitHub Pages

---

## Deployment

### Quick Deploy

```bash
# Commit changes
git add .
git commit -m "Update products"
git push origin main
```

GitHub Actions will automatically build and deploy.

### Manual Deploy

```bash
# Build locally
npm run build

# Verify build output
ls dist/public

# Deploy (automatic via GitHub Actions)
git push origin main
```

---

## Development Setup

### Local Development

```bash
# Clone repository
git clone https://github.com/reverb256/trovesandcoves.git
cd trovesandcoves

# Install dependencies
npm install

# Start development server
npm run dev
```

Site available at:

- Frontend: http://localhost:5173
- API: http://localhost:5000

### Environment Variables

Create `.env` file:

```env
# Google Analytics (optional)
VITE_GA4_MEASUREMENT_ID=G-XXXXXXXXXX

# API URL (development)
VITE_API_URL=http://localhost:5000
```

---

## Development Commands

| Command            | Description              |
| ------------------ | ------------------------ |
| `npm run dev`      | Start development server |
| `npm run build`    | Build for production     |
| `npm run preview`  | Preview production build |
| `npm run check`    | TypeScript type checking |
| `npm run test`     | Run unit tests           |
| `npm run test:e2e` | Run E2E tests            |
| `npm run lint`     | Run linter               |
| `npm run format`   | Format code              |

---

## Site Architecture

### Technology Stack

- **Frontend**: React 18 + TypeScript
- **Build**: Vite 5
- **Styling**: Tailwind CSS + shadcn/ui
- **Design**: Material You-inspired
- **Hosting**: GitHub Pages
- **CI/CD**: GitHub Actions

### Key Files

| File                           | Purpose                     |
| ------------------------------ | --------------------------- |
| `client/src/main.tsx`          | React entry point           |
| `server/storage.ts`            | Product data storage        |
| `shared/types.ts`              | TypeScript type definitions |
| `vite.config.ts`               | Build configuration         |
| `.github/workflows/deploy.yml` | CI/CD pipeline              |

---

## Contact Support

### Getting Help

For technical issues:

1. Check the [Troubleshooting Guide](troubleshooting.md)
2. Search existing [GitHub Issues](https://github.com/reverb256/trovesandcoves/issues)
3. Create a new issue with details

### Reporting Issues

When reporting issues, include:

- Browser type and version
- Operating system
- Steps to reproduce
- Error messages (if any)
- Screenshots (if applicable)

### Feature Requests

Feature requests are welcome! Please:

1. Check [ROADMAP.md](../../ROADMAP.md) for planned features
2. Search existing requests
3. Create a detailed issue describing the feature
4. Include use cases and benefits

---

## FAQ

### General Questions

**Q: Is this site secure for browsing?**
A: Yes, the site uses HTTPS with SSL certificates provided by GitHub Pages.

**Q: Do you ship internationally?**
A: Shipping is handled through Etsy. See our Etsy shop for shipping policies.

**Q: What payment methods do you accept?**
A: Payments are processed through Etsy, which accepts various payment methods.

**Q: Can I custom order a piece?**
A: Contact us through the form on the site or message us on Etsy.

### Technical Questions

**Q: Why does the cart use localStorage?**
A: For this showcase site, we use localStorage for simplicity. Full cart persistence is planned for Phase 2.

**Q: Can I browse offline?**
A: Yes! The site includes PWA support with service worker caching.

**Q: How often are products updated?**
A: Products can be updated by modifying the data files and rebuilding. We plan to add Etsy API sync in the future.

---

## Related Documentation

- [README.md](../../README.md) - Project overview
- [CLAUDE.md](../../CLAUDE.md) - Development guide
- [ROADMAP.md](../../ROADMAP.md) - Planned features
- [TECHNICAL_DEBT.md](../../TECHNICAL_DEBT.md) - Known issues

---

**Last Updated**: 2026-03-13
