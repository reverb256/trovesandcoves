# Troves & Coves - Crystal Jewelry Showcase

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A modern crystal jewelry showcase platform built with React, TypeScript, and Cloudflare Workers.

## 🌟 What This Is

This is a **static showcase site** for Troves & Coves crystal jewelry with:
- Beautiful product catalog with Material You-inspired design
- Serverless API backend (Cloudflare Workers)
- Basic cart functionality (localStorage)
- Etsy integration for purchases
- Responsive design with Tailwind CSS

## ⚠️ What This Is Not (Yet)

To be transparent: this is **not currently a full e-commerce platform**. The following features are planned but not implemented:
- ❌ No real database (uses in-memory storage)
- ❌ No payment processing (redirects to Etsy)
- ❌ No user authentication
- ❌ No admin dashboard
- ❌ No AI features (were removed in earlier commit)

See [ROADMAP.md](ROADMAP.md) for planned improvements.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/reverb256/trovesandcoves.git
cd trovesandcoves

# Install dependencies
npm install

# Start development server
npm run dev
```

The site will be available at `http://localhost:5173` and the API at `http://localhost:5000`.

### Environment Variables

Create a `.env` file for optional features:

```bash
# Optional: Stripe (not currently implemented)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...

# Optional: Cloudflare Workers API
VITE_API_URL=https://your-worker.workers.dev
```

## 🛠️ Development

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server (frontend + API) |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run check` | TypeScript type checking |
| `npm run test` | Run Vitest unit tests |
| `npm run test:e2e` | Run Playwright end-to-end tests |
| `npm run lint` | Run ESLint |
| `npm run format` | Format code with Prettier |
| `npm run cf:dev` | Test Cloudflare Worker locally |
| `npm run deploy:all` | Deploy to Cloudflare + GitHub Pages |

## 📁 Project Structure

```
├── src/                      # React frontend
│   ├── components/           # React components (~25 custom components)
│   │   └── ui/              # shadcn/ui base components
│   ├── main.tsx             # React entry point
│   └── App.tsx              # Main app component
├── server/                   # Express.js backend (development only)
│   ├── index.ts             # Server entry point
│   ├── routes.ts            # API route definitions
│   ├── storage.ts           # In-memory product data
│   └── security/            # Security middleware stubs
├── shared/                   # Shared TypeScript code
│   ├── schema.ts            # Drizzle ORM schema (currently unused)
│   ├── brand-config.ts      # Brand/design tokens
│   └── locked-design-language.ts  # Design system constants
├── tests/e2e/               # Playwright end-to-end tests
└── docs/                    # Documentation
```

## 🎨 Design System

The app uses a Material You-inspired design system with a cream color scheme:
- Design tokens in `shared/locked-design-language.ts`
- Tailwind classes: `bg-surface-50`, `text-on-surface-variant`, etc.
- shadcn/ui components for base UI elements

## 🌐 Deployment

### Current Deployment

- **Frontend**: GitHub Pages with custom domain at [https://trovesandcoves.ca](https://trovesandcoves.ca)
- **API**: Cloudflare Workers (if configured)

### Manual Deployment

```bash
# Deploy to GitHub Pages
npm run build:github-pages
npm run deploy:github-pages

# Deploy to Cloudflare Workers
npm run deploy:cloudflare
```

### CI/CD

Pushing to `main` triggers automatic deployment via GitHub Actions (`.github/workflows/deploy.yml`).

## 📖 Documentation

- [ROADMAP.md](ROADMAP.md) - Planned features and improvements
- [TECHNICAL_DEBT.md](TECHNICAL_DEBT.md) - Known issues and technical debt
- [CLAUDE.md](CLAUDE.md) - AI assistant development guide
- [Development Guide](docs/development/README.md) - Local development setup

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- **Live Demo**: [trovesandcoves.ca](https://trovesandcoves.ca)
- **GitHub Pages**: [reverb256.github.io/trovesandcoves](https://reverb256.github.io/trovesandcoves)
- **Etsy Store**: Purchase items on Etsy

## 📞 Support

For support, email support@trovesandcoves.ca or create an issue in this repository.

---

Built with ❤️ for the crystal healing community
