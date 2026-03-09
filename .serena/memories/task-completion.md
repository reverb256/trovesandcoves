# Troves & Coves - Task Completion Checklist

## Before Marking a Task Complete

Run these commands to ensure code quality:

### 1. Type Checking
```bash
npm run check
```
Must pass with no errors. Some unused parameter warnings are acceptable.

### 2. Linting
```bash
npm run lint
```
Fix any errors with `npm run lint:fix`.

### 3. Formatting
```bash
npm run format
```
Code should be properly formatted with Prettier.

### 4. Tests
```bash
npm run test               # Unit tests
npm run test:e2e           # E2E tests (if applicable)
```
All tests should pass.

## What to Include in Changes

### For New Features
- [ ] Component/page implementation
- [ ] TypeScript types (no `any` if possible)
- [ ] Tests (unit tests for components, E2E for flows)
- [ ] Update to relevant documentation
- [ ] Error handling
- [ ] Loading states

### For Bug Fixes
- [ ] Fix the issue
- [ ] Add test to prevent regression
- [ ] Update TECHNICAL_DEBT.md if related to known debt

### For Refactoring
- [ ] Preserve existing functionality
- [ ] Ensure all tests still pass
- [ ] Add tests if coverage was missing
- [ ] Update relevant documentation

## Code Review Criteria

### Functionality
- Does it work as intended?
- Are edge cases handled?
- Is error handling appropriate?

### Code Quality
- Is code readable and maintainable?
- Are variables/functions named clearly?
- Is there unnecessary complexity?

### TypeScript
- Are types properly defined?
- Is `any` avoided?
- Are null/undefined cases handled?

### Performance
- Are expensive operations optimized?
- Is lazy loading used where appropriate?
- Are images optimized?

### Accessibility
- Are semantic HTML elements used?
- Do interactive elements have proper ARIA labels?
- Is keyboard navigation supported?
- Are colors accessible (contrast)?

### Testing
- Do tests cover critical paths?
- Are tests independent?
- Are tests readable?

## Git Commit Guidelines

### Commit Message Format
```
type(scope): description

[optional body]

[optional footer]
```

### Types
- `feat:` - New feature
- `fix:` - Bug fix
- `refactor:` - Code refactoring without behavior change
- `test:` - Adding or updating tests
- `docs:` - Documentation only
- `chore:` - Maintenance tasks
- `style:` - Code style changes (formatting, etc.)
- `perf:` - Performance improvements

### Examples
```
feat(cart): add quantity selector to product cards
fix(products): resolve category filtering bug
refactor(api): centralize error handling
test(checkout): add E2E tests for checkout flow
docs(readme): update deployment instructions
```

## Documentation Updates

Update these files when relevant:
- `README.md` - For user-facing changes
- `CLAUDE.md` - For architecture changes
- `ROADMAP.md` - When completing roadmap items
- `TECHNICAL_DEBT.md` - When addressing debt or finding new issues
- `docs/` - For detailed documentation

## Deployment Readiness

For production deployments:
```bash
# Build for GitHub Pages
npm run build:github-pages

# Test production build locally
npm run preview

# Run E2E tests on production build
npm run test:e2e
```

## Common Gotchas

1. **GitHub Pages Base Path**: Remember `/trovesandcoves/` base path
2. **In-Memory Storage**: Data resets on server restart
3. **Unused Database**: Schema exists but is NOT connected
4. **Stripe Stub**: Only runs when STRIPE_SECRET_KEY is set
5. **Admin Dashboard**: Is a stub, not functional
6. **Path Aliases**: Use `@/`, `@shared/`, `@assets/` consistently
7. **Material You Classes**: Use `bg-surface-*`, `text-on-surface-*` etc.

## When You're Stuck

1. Check `TECHNICAL_DEBT.md` for known issues
2. Check `ROADMAP.md` for planned features
3. Check browser console for errors
4. Check server logs: `npm run dev` output
5. Run `npm run check` for type errors
6. Run `npm run lint` for code quality issues
