# PROJECT KNOWLEDGE BASE

**Generated:** 2026-01-14
**Commit:** 44126d95bffe9CxwlPbaj0hlfH
**Branch:** main

## OVERVIEW
trovesandcoves - Security-focused business website with OWASP compliance and ISO 27001 security frameworks. Jewelry business theme with turquoise/gold color scheme.

## STRUCTURE
```
trovesandcoves/
├── server/         # Express.js backend with security focus
├── client/         # React/Vite frontend
├── shared/         # Shared components and utilities
├── security/       # Security compliance implementations
└── migrations/     # Database schema migrations
```

## WHERE TO LOOK
| Task | Location | Notes |
|------|----------|-------|
| **Security Compliance** | security/ | OWASP and ISO 27001 implementations |
| **Brand Configuration** | shared/brand-config.ts | Locked design language (DO NOT MODIFY) |
| **Database** | migrations/ | PostgreSQL schema management |
| **Frontend** | client/src/ | React application with jewelry theming |
| **Authentication** | server/routes/ | Security-focused auth implementation |
| **Shared Utilities** | shared/ | Common components and utilities |

## CONVENTIONS
- **Security-first**: OWASP compliance with security frameworks
- **Brand consistency**: Locked turquoise/gold/silver color scheme
- **TypeScript strict**: Full type safety enforcement
- **React with Radix**: Modern component architecture
- **TailwindCSS**: Jewelry-themed design system

## ANTI-PATTERNS (THIS PROJECT)
- **NO** modify brand-config.ts without authorization (LOCKED)
- **NEVER** deploy without security compliance validation
- **NO** hardcoded secrets or credentials
- **NEVER** skip security scanning in CI/CD

## UNIQUE STYLES
- **Jewelry theming**: Turquoise, gold, and silver color palette
- **Security compliance**: OWASP and ISO 27001 frameworks
- **Brand consistency**: Locked design language
- **Business focus**: Professional jewelry business presentation

## COMMANDS
```bash
npm run dev         # Development with security middleware
npm run build       # Production build
npm run lint        # Strict linting with security checks
npm run test        # Comprehensive testing with Playwright
npm run db:push     # Database migrations
```

## NOTES
- Brand configuration is locked and requires authorization to modify
- Heavy focus on security compliance and frameworks
- Jewelry business with professional presentation standards
- Strict development and deployment security requirements