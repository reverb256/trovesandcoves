# Quick Setup: GitHub Pages + Cloudflare + Vite for Custom Domains

## Domains Supported
- **reverb256.ca** (root and www)
- **trovesandcoves.ca** (root and www)
- **GitHub Pages project subpath:** `/trovesandcoves/`

---

## 1. Vite Config

- For Troves & Coves, set in `vite.config.ts`:
  ```js
  base: '/trovesandcoves/',
  ```

---

## 2. Build

```sh
npm run build:frontend
```
- Output: `dist/public/`

---

## 3. CNAME File

- In `dist/public/CNAME`:
  - For main site: `reverb256.ca`
  - For Troves & Coves: `trovesandcoves.ca`

---

## 4. 404.html for SPA Routing

```sh
cp dist/public/index.html dist/public/404.html
```

---

## 5. GitHub Pages Settings

- **Source:** `gh-pages` branch (or `/docs` folder on `main`)
- **Custom domain:** Set to `reverb256.ca` or `trovesandcoves.ca` as appropriate

---

## 6. Cloudflare DNS

- **CNAME** for `@` and `www` on both domains, pointing to `reverb256.github.io`
- **SSL:** "Full" mode

---

## 7. Deploy

- Push to main branch, workflow deploys `dist/public` to `gh-pages`
- Confirm CNAME and 404.html are present in deployed files

---

## 8. Test

- Visit:
  - https://reverb256.ca
  - https://www.reverb256.ca
  - https://trovesandcoves.ca
  - https://www.trovesandcoves.ca
  - https://reverb256.ca/trovesandcoves

---

## Troubleshooting

- If you see a 404, check DNS propagation, CNAME file, and GitHub Pages settings.
- For SPA routing, ensure 404.html is present and is a copy of index.html.

---

## Automation

- Cloudflare API token and zone ID are set for DNS automation.
- GitHub Actions workflow deploys on push.

---

_Last updated: 2025-06-20_
