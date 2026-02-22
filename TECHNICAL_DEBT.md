# TECHNICAL_DEBT.md

This document tracks known technical debt and issues in the codebase.

## Critical Issues

### 1. Documentation Inaccuracies
**Status**: Fixed ✅
- ✅ Updated README.md to reflect reality
- ✅ Updated CLAUDE.md with accurate information
- ✅ Updated docs/development/README.md with accurate architecture
- ⚠️ docs/api/README.md and docs/deployment/README.md may still need updates

### 2. Dead Code After AI Removal
**Status**: Fixed ✅
- Git commit `be3cb65` removed AI features
- ✅ Removed AI dependencies: @anthropic-ai/sdk, openai, node-telegram-bot-api, puppeteer, cheerio
- ✅ Updated ROADMAP.md to remove AI features from Phase 5
- No AI-related imports found in codebase

### 3. Unused Database Schema
**Status**: Known
- `shared/schema.ts` defines comprehensive Drizzle schema
- `server/db-storage.ts` exists but is not used
- All code uses `MemStorage` instead
- **Action**: Either implement database or remove unused schema code

## High Priority Technical Debt

### 4. Security Files Are Boilerplate
**Location**: `server/security/`
- `owasp-compliance.ts` - Largely template code
- `iso27001-compliance.ts` - Theoretical framework only
- **Risk**: False sense of security, badges on README are misleading
- **Action**: Either implement real security measures or remove compliance claims

### 5. Fake Admin Dashboard
**Location**: `src/components/AdminDashboard.tsx`
- Component exists but shows only mock data
- No real admin functionality
- No backend endpoints for admin operations
- **Action**: Remove or implement real admin features (see Roadmap Phase 4)

### 6. Stripe Integration Is Stub
**Location**: `server/routes.ts` (lines 197-212)
- Stripe code exists but is conditionally disabled
- No actual payment flow implemented
- **Action**: Either complete Stripe integration or remove stub code

### 7. No Error Boundaries
**Impact**: Users see blank screens on React errors
- **Action**: Add error boundary components at route level

### 8. Cart Is LocalStorage-Only
**Location**: Cart implementation
- Data lost when users clear browser cache
- No cart persistence across devices
- **Action**: Implement server-side cart storage

## Medium Priority Technical Debt

### 9. Inconsistent State Management
- Some components use React hooks
- Some use localStorage directly
- No unified state management pattern
- **Action**: Choose Zustand, React Query, or Context API and standardize

### 10. No TypeScript Strict Mode Compliance
**Location**: Throughout codebase
- `tsconfig.json` has `strict: true` but code may have `any` types or exceptions
- **Action**: Run `npm run check` and fix all type errors

### 11. Missing Component Tests
**Impact**: Regressions when changing UI code
- Only one test file exists: `client/src/apiClient.test.ts`
- No component tests
- **Action**: Add tests for at least critical components (ProductCard, Cart, Checkout)

### 12. No API Client Abstraction
- API calls are scattered throughout components
- No centralized error handling
- No request/response interceptors
- **Action**: Create a proper API client module

### 13. Hardcoded Configuration
**Location**: Various files
- URLs, timeouts, and other config values hardcoded
- **Action**: Centralize configuration in environment variables

### 14. No Logging/Monitoring
- No structured logging
- No error tracking (Sentry, etc.)
- No analytics integration
- **Action**: Add logging framework and error tracking

## Low Priority Technical Debt

### 15. Inconsistent File Naming
- Some files use PascalCase (components)
- Some use kebab-case
- **Action**: Standardize on kebab-case for files, PascalCase for components

### 16. Unused Dependencies
**Status**: Fixed ✅
**Location**: `package.json`
- ✅ Removed unused AI dependencies: @anthropic-ai/sdk, openai, node-telegram-bot-api, @types/node-telegram-bot-api, puppeteer, cheerio
- These packages were not imported anywhere in the codebase

### 17. Large Component Files
**Location**: Some components may be too large
- **Action**: Break down into smaller, reusable components

### 18. No Accessibility Testing
**Impact**: Poor experience for disabled users
- **Action**: Run axe-core or Lighthouse accessibility audits

### 19. No Performance Budget
**Impact**: Bundle size may grow unbounded
- **Action**: Set up bundle size limits in CI

### 20. Git History Issues
- Commit `be3cb65` removed significant functionality
- No explanation in commit message of why AI was removed
- **Action**: Add git notes or documentation explaining architecture decisions

## Code Quality Issues

### Import Errors
- **Risk**: Some files may import from non-existent modules
- **Action**: Run `npm run check` and fix all import errors

### Dead Code
- Components that exist but are never used
- Functions that are defined but never called
- **Action**: Use `ts-prune` or similar tool to find unused exports

### Contradictory Implementation
- README says "Express.js backend" but uses Cloudflare Workers
- README says "PostgreSQL" but uses in-memory storage
- **Status**: Fixed in README.md
- **Action**: Ensure all documentation is consistent

## Security Concerns

### 21. OWASP/ISO 27001 Badges Are Misleading
**Status**: Partially fixed
- ✅ Removed badges from updated README.md
- **Risk**: Old README.md may still exist in forks or cached locations
- **Action**: Ensure all instances of false security claims are removed

### 22. No Rate Limiting in Production
**Location**: Cloudflare Workers
- **Impact**: Vulnerable to DDoS attacks
- **Action**: Implement proper rate limiting

### 23. No Input Validation
**Location**: Form submissions
- **Impact**: Potential for XSS or injection attacks
- **Action**: Add proper validation and sanitization

## Infrastructure Issues

### 24. No Backup Strategy
**Impact**: Data loss if GitHub/Cloudflare has issues
- **Action**: Implement database backups if using PostgreSQL

### 25. No Staging Environment
**Impact**: Testing changes in production
- **Action**: Set up staging environment on Cloudflare Workers

## Documentation Debt

### 26. Outdated Development Guide
**Location**: `docs/development/README.md`
- Still references Express.js and PostgreSQL as if they're implemented
- **Action**: Rewrite to reflect current architecture

### 27. Missing API Documentation
**Location**: `docs/api/README.md`
- May document endpoints that don't exist
- **Action**: Document actual endpoints or remove file

### 28. Deployment Guide Issues
**Location**: `docs/deployment/README.md`
- May contain instructions for features that don't exist
- **Action**: Update to reflect actual deployment process

## Tracking Template

When adding items to this document, use this template:

```markdown
### [Number]. [Title]
**Location**: [File path or general area]
**Priority**: [Critical/High/Medium/Low]
**Impact**: [What happens if this isn't fixed]
**Status**: [Known/In Progress/Fixed]
**Action**: [What needs to be done]
```

## Review Schedule

This document should be reviewed:
- Before starting any new phase of the roadmap
- After completing any major feature
- Quarterly as part of technical debt review

## Related Documents

- [ROADMAP.md](ROADMAP.md) - Planned features and improvements
- [CLAUDE.md](CLAUDE.md) - AI assistant development guide
- [README.md](README.md) - Project overview (now accurate)
