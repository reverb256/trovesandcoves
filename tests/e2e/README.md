# E2E Tests

**IMPORTANT: These tests run against PRODUCTION by default**

- **Target**: `https://trovesandcoves.ca`
- **Command**: `npm run test:e2e`
- **Browsers**: Chrome, Firefox, Safari, Mobile Chrome, Mobile Safari

## Test Organization

### Production Tests (this directory)
These tests validate the live production site. They run against:
- `https://trovesandcoves.ca` (all browsers)

### Debug Tests (`../e2e-debug/`)
These tests run against the local development server:
- `http://localhost:5000` (Chrome only)
- Run with: `npm run test:e2e:debug`

## Why Test Against Production?

1. **Accuracy**: Tests the actual deployed code, not a dev build
2. **No HMR Issues**: Avoids Vite HMR problems in middleware mode
3. **Full Stack**: Tests the complete production build including optimizations
4. **Real Performance**: Validates real-world load times and bundle sizes

## Running Tests

```bash
# Run all production E2E tests
npm run test:e2e

# Run with UI reporter
npm run test:e2e:ui

# View HTML report
npm run test:e2e:report

# Run debug tests (requires dev server running)
npm run dev                    # In one terminal
npm run test:e2e:debug       # In another

# Run all tests (unit + E2E)
npm run test:all
```

## CI/CD Usage

In GitHub Actions, always use:
```yaml
- run: npm run test:e2e
```

Do NOT use debug tests in CI.

## Known Limitations

### NixOS Local Development

On NixOS systems, Firefox and WebKit browsers may fail to launch due to missing system libraries (`libstdc++.so.6`, `libxcb-shm.so.0`, etc.).

**To run tests locally on NixOS:**
```bash
# Run only Chromium tests (works on NixOS)
npm run test:e2e -- --project=chromium

# CI will run all browsers successfully
```

**For full browser testing locally on NixOS**, install the required libraries via nix:
```bash
nix-shell -p firefox webkitgtk
```

Or use the development environment which includes browser dependencies.
