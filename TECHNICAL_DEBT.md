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
- ✅ Removed SubtleAI.tsx component (263 lines)
- ✅ Removed AI imports from Products.tsx
- No AI-related imports found in codebase

### 3. Unused Database Schema
**Status**: Known
- `shared/schema.ts` defines comprehensive Drizzle schema
- `server/db-storage.ts` exists but is not used
- All code uses `MemStorage` instead (which is correct for current showcase site)
- **Note**: Schema is kept as blueprint for Phase 1 database implementation (see ROADMAP.md)

## High Priority Technical Debt

### 4. Security Files Are Boilerplate
**Status**: Improved ✅
- ✅ Simplified `owasp-compliance.ts` to working code
- ✅ Simplified `iso27001-compliance.ts` to working code
- ✅ Fixed all TypeScript errors in security files
- ✅ Security middleware now functional (rate limiting, input sanitization, etc.)
- **Note**: These provide actual security measures now, not just boilerplate

### 5. Fake Admin Dashboard
**Status**: Not Found ✅
- No AdminDashboard component exists
- Admin functionality not implemented (see ROADMAP Phase 4)

### 6. Stripe Integration Is Stub
**Status**: Acceptable ✅
- Stripe code exists but only runs when STRIPE_SECRET_KEY is set
- Conditional check `if (stripe)` prevents errors
- **Note**: This is the correct approach for future implementation (see ROADMAP Phase 2)

### 7. No Error Boundaries
**Status**: Fixed ✅
- ✅ Added ErrorBoundary component
- ✅ Wrapped App with error handling
- ✅ Added Suspense with loading fallback
- ✅ Lazy loaded components for performance

### 8. Cart Is LocalStorage-Only
**Status**: Partially Addressed ✅
- ✅ Server-side cart exists with session management (server/storage.ts, server/routes.ts)
- ✅ SessionManager in apiClient provides backup/restore
- **Note**: Full cart persistence requires database (see ROADMAP Phase 1)

## Medium Priority Technical Debt

### 9. Inconsistent State Management
**Status**: Known
- Some components use React hooks
- Some use localStorage directly
- No unified state management pattern
- **Action**: Choose Zustand, React Query, or Context API and standardize

### 10. No TypeScript Strict Mode Compliance
**Status**: Fixed ✅
- ✅ Fixed all critical TypeScript errors
- ✅ `npm run check` now passes with no errors
- ✅ Fixed type annotations in apiClient, routes, storage, etc.
- **Note**: Some unused parameter warnings remain (cosmetic)

### 11. Missing Component Tests
**Impact**: Regressions when changing UI code
- Only one test file exists: `client/src/apiClient.test.ts`
- No component tests
- **Action**: Add tests for at least critical components (ProductCard, Cart, Checkout)

### 12. No API Client Abstraction
**Status**: Improved ✅
- ✅ Created `apiClient.ts` with centralized API functions
- ✅ Added timeout support with AbortController
- ✅ Added retry logic with exponential backoff
- **Action**: Consider adding request/response interceptors for centralized error handling
- No centralized error handling
- No request/response interceptors
- **Action**: Create a proper API client module

### 13. Hardcoded Configuration
**Status**: Fixed ✅
**Location**: Various files
- ✅ Created `shared/config.ts` with all centralized configuration
- ✅ API URLs, server config, session config, rate limiting all in one place
- ✅ Updated apiClient.ts to use config
- ✅ Updated server/index.ts to use config
- ✅ Updated server/security/owasp-compliance.ts to use config
- ✅ Added feature flags, environment helpers, and validation function

### 14. No Logging/Monitoring

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
**Status**: Fixed ✅
- ✅ All import errors resolved
- ✅ `npm run check` passes with no errors
- ✅ Removed imports for non-existent modules

### Dead Code
**Status**: Improved ✅
- ✅ Moved unused files to `server/deprecated/`:
  - cloudflare-deployment.ts
  - cloudflare-edge-optimizer.ts
  - cloudflare-orchestrator.ts
  - cloudflare-types.d.ts
  - service-discovery.ts
  - services/image-preservation.ts
  - routes/audit.ts
- ✅ Removed SubtleAI.tsx component (263 lines)
- **Action**: Review deprecated folder periodically and remove if not needed

### Contradictory Implementation
**Status**: Fixed ✅
- ✅ README.md now accurately reflects current architecture
- ✅ CLAUDE.md updated with accurate information
- ✅ All documentation is consistent

## Security Concerns

### 21. OWASP/ISO 27001 Badges Are Misleading
**Status**: Fixed ✅
- ✅ Removed badges from updated README.md
- ✅ Documentation now accurately describes current security measures
- ✅ Security middleware is functional (not just stubs)

### 22. No Rate Limiting in Production
**Status**: Fixed ✅
**Location**: server/security/owasp-compliance.ts
- ✅ Implemented `generalRateLimit` with configurable window and max requests
- ✅ Implemented `slowDownMiddleware` to slow down repeated requests
- ✅ Rate limiting is active in server/index.ts

### 23. No Input Validation
**Status**: Fixed ✅
**Location**: Form submissions
- ✅ Implemented `sanitizeInput` middleware to remove dangerous patterns
- ✅ Implemented `validateInput` helper for SQL injection detection
- ✅ Security validation is active in server/index.ts

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
