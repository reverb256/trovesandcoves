# Troves & Coves - Mystical Crystal Jewelry Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Security: OWASP](https://img.shields.io/badge/Security-OWASP%20Compliant-green)](https://owasp.org/)
[![Security: ISO 27001](https://img.shields.io/badge/Security-ISO%2027001-blue)](https://www.iso.org/iso-27001-information-security.html)

A production-ready, enterprise-grade e-commerce platform for authentic crystal jewelry with AI-powered customer service and comprehensive security compliance.

## 🌟 Features

### **E-commerce Platform**
- **Full-Stack Architecture**: React 18 + TypeScript frontend, Express.js backend
- **Database**: PostgreSQL with Drizzle ORM for enterprise data management
- **Payment Processing**: Stripe integration for secure transactions
- **Product Catalog**: Advanced categorization, search, and filtering
- **Shopping Cart**: Real-time cart management with React Query
- **Admin Dashboard**: Complete order and inventory management

### **AI-Powered Customer Service**
- **7 Specialized AI Agents**: Crystal consultant, customer service, RAG, web scraper
- **Multi-Model Support**: Anthropic Claude, OpenAI GPT, custom integrations
- **Intelligent Recommendations**: AI-driven crystal selection guidance
- **Natural Language Processing**: Advanced query understanding and response

### **Enterprise Security & Compliance**
- **OWASP Compliance**: Full security framework implementation
- **ISO 27001 Standards**: Enterprise-grade security management
- **Data Protection**: Encrypted data storage and transmission
- **Access Control**: Role-based authentication and authorization
- **Security Auditing**: Continuous vulnerability scanning and monitoring

### **Modern Development Stack**
- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Radix UI
- **Backend**: Express.js, TypeScript, PostgreSQL, Drizzle ORM
- **State Management**: React Query, custom cart store
- **Testing**: Vitest (unit), Playwright (e2e), Lighthouse CI (performance)
- **Build Tools**: Vite with PWA support and optimization

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Stripe account (for payments)
- Anthropic/OpenAI API keys (for AI features)

### Installation

```bash
# Clone the repository
git clone https://github.com/reverb256/trovesandcoves.git
cd trovesandcoves

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your database and API keys

# Set up database
npm run db:migrate
npm run db:seed

# Start development server
npm run dev
```

### Environment Configuration

Required environment variables:
```bash
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/trovesandcoves

# Payment Processing
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...

# AI Services
ANTHROPIC_API_KEY=sk-ant-...
OPENAI_API_KEY=sk-...

# Security
JWT_SECRET=your-jwt-secret
SESSION_SECRET=your-session-secret
```

### Production Deployment

For production deployment instructions, see [Deployment Guide](docs/deployment/README.md).

## 📁 Project Structure

```
├── client/                 # React frontend application
│   ├── src/
│   │   ├── components/     # 50+ UI components (shadcn/ui Radix)
│   │   │   ├── ui/        # Design system components
│   │   │   ├── AIAssistant.tsx
│   │   │   ├── Cart.tsx
│   │   │   └── Header.tsx
│   │   ├── pages/         # 15 route components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── lib/           # API client, utilities, store
│   │   ├── App.tsx        # Main app with routing
│   │   └── main.tsx       # React entry point
│   └── public/            # Static assets
├── server/                # Express.js backend
│   ├── index.ts           # Server entry point
│   ├── routes.ts          # API route definitions
│   ├── agents/            # 7 AI agent implementations
│   ├── security/           # OWASP & ISO27001 compliance
│   └── containers/         # Container management
├── shared/                # Shared code
│   ├── schema.ts          # Database schema (Drizzle ORM)
│   └── types.ts           # TypeScript type definitions
├── docs/                  # Documentation
│   ├── deployment/        # Deployment guides
│   ├── development/       # Development guides
│   ├── api/              # API documentation
│   └── security/         # Security compliance docs
├── scripts/              # Build and utility scripts
├── .github/              # GitHub Actions workflows
├── vite.config.ts        # Vite build configuration
├── tailwind.config.ts    # Tailwind CSS configuration
└── package.json          # Dependencies and scripts
```

## 🛠️ Development

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run deploy:all` | Deploy to both platforms |
| `npm run cf:dev` | Test Cloudflare Worker locally |

### Development Workflow

1. **Local Development**: `npm run dev` - Full-stack development with hot reload
2. **Testing**: `npm run build` - Verify builds work correctly
3. **Deployment**: Push to main - Automatic deployment via GitHub Actions

See [Development Guide](docs/development/README.md) for detailed instructions.

## 🌐 Architecture

### Hybrid Deployment Strategy

- **GitHub Pages**: Hosts static React frontend with global CDN
- **Cloudflare Workers**: Handles dynamic API requests and features
- **Cloudflare KV**: Stores product data, cart sessions, and analytics

### Free Tier Optimization

- **GitHub Pages**: 1GB storage, 100GB bandwidth/month
- **Cloudflare Workers**: 100k requests/day with automatic rate limiting
- **Cloudflare KV**: 1GB storage with TTL optimization

## 📖 Documentation

- [**Deployment Guide**](docs/deployment/README.md) - Complete deployment instructions
- [**Development Guide**](docs/development/README.md) - Local development setup
- [**API Documentation**](docs/api/README.md) - API endpoints and usage
- [**User Guides**](docs/guides/README.md) - End-user documentation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- **Live Demo**: [trovesandcoves.ca](https://trovesandcoves.ca)
- **GitHub Pages**: [GitHub Pages Site](https://reverb256.github.io/trovesandcoves)
- **Cloudflare Worker**: [API Endpoint](https://troves-coves-api.your-subdomain.workers.dev)
- **Documentation**: [Full Documentation](docs/)

## 📞 Support

For support, email support@trovesandcoves.ca or create an issue in this repository.

---

Built with ❤️ for the crystal healing community
