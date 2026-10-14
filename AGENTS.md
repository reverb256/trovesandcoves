# trovesandcoves — Troves & Coves (crystal-jewelry showcase)

React + Vite + TypeScript, Express backend. Deploys as a static site to GitHub Pages (trovesandcoves.ca); check per-repo docs for the export flow.

## Dev server

If `node_modules/` is missing or stale: `npm install`.

```bash
PORT=5000 npm run dev
```

This runs `NODE_ENV=development tsx server/index.ts` — an Express dev server with Vite middleware serving both the API and the React frontend on one port.

## Port

- Default: **5000** (`shared/config.ts` → `SERVER_PORT`; env `PORT` overrides)
- `vite.config.ts` says 5173, but `npm run dev` runs the Express server from `server/index.ts`, not raw Vite — trust `SERVER_PORT`.

## Notes

- `express-slow-down` `delayMs` session warning is a benign, cosmetic deprecation warning.
- `SESSION_SECRET` uses a default dev value — fine for local dev.
