# Troves & Coves - Essential Commands

## Development

### Start Development Server
```bash
npm run dev
```
Starts Express server (port 5000) + Vite frontend (port 5173)

### Type Checking
```bash
npm run check
```
Run TypeScript compiler to check for type errors

### Build for Production
```bash
npm run build              # Standard build
npm run build:github-pages  # Build for GitHub Pages (includes base path)
npm run build:worker       # Build Cloudflare Worker bundle
```

## Testing

### Unit Tests (Vitest)
```bash
npm run test               # Run all unit tests
npm run test:coverage      # Run with coverage report
npm run test:ui            # Run with Vitest UI
```

### E2E Tests (Playwright)
```bash
npm run test:e2e           # Run all E2E tests
npm run test:e2e:ui        # Run with Playwright UI
npm run test:e2e:report    # Show test report
npm run test:e2e:debug     # Run in debug mode
```

### All Tests
```bash
npm run test:all           # Run unit + E2E tests
```

## Code Quality

### Linting
```bash
npm run lint               # Check for lint errors
npm run lint:fix           # Fix auto-fixable lint errors
```

### Formatting
```bash
npm run format             # Format code with Prettier
npm run format:check       # Check formatting without changes
```

## Database (Currently Unused)

These commands exist but the database is not currently connected:
```bash
npm run db:push            # Push schema to database
npm run db:migrate         # Run database migrations
npm run db:seed            # Seed database with data
```

## Cloudflare Workers

### Local Development
```bash
npm run cf:dev             # Run Worker locally with Wrangler
npm run cf:tail            # Tail Worker logs in production
npm run cf:kv:list         # List KV namespaces
```

### Deployment
```bash
npm run deploy:cloudflare  # Deploy to Cloudflare Workers
npm run deploy:serverless  # Deploy serverless API
```

## Deployment

### GitHub Pages
```bash
npm run deploy:github-pages
```
Builds and deploys to GitHub Pages

### Full Deployment
```bash
npm run deploy:all         # Deploy serverless + GitHub Pages
```

## Utilities

### Image Optimization
```bash
npm run optimize:images    # Optimize images in attached_assets
```

### Bundle Analysis
```bash
npm run analyze:bundle     # Analyze bundle size
```

## Pre-Commit Checklist

Before committing, run these commands:
```bash
npm run check              # Verify no TypeScript errors
npm run lint               # Verify no lint errors
npm run test               # Verify tests pass
npm run format             # Ensure code is formatted
```

## Git Workflow

### Create Feature Branch
```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

### Commit Changes
```bash
git add .
git commit -m "feat: add your feature description"
```

### Push and PR
```bash
git push origin feature/your-feature-name
# Then create PR on GitHub
```

## Linux System Commands

This project runs on Linux. Useful commands:
```bash
ls -la                     # List all files with details
grep -r "pattern" .        # Search for pattern in files
find . -name "*.ts"        # Find all TypeScript files
cd /path/to/directory      # Change directory
pwd                        # Print working directory
cat file.txt               # View file contents
tail -f log.txt            # Follow log file
```
