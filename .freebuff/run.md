# Run Doc: Troves & Coves Dev Server

## How to Reproduce Artifacts

No special artifact reproduction needed — dependencies are already installed.

If `node_modules/` is missing or stale:
```bash
npm install
```

## How to Run the Server

```bash
PORT=5000 npm run dev
```

This runs `NODE_ENV=development tsx server/index.ts` which starts an Express dev server with Vite middleware on port 5000 (configurable via `PORT` env var; default in `shared/config.ts` is `5000`).

The server serves both the API and the Vite-served React frontend on the same port.

## Port

- Default: **5000** (from `shared/config.ts` → `SERVER_PORT`)
- Vite dev server config says 5173 in `vite.config.ts`, but the Express server in `server/index.ts` uses `SERVER_PORT` from shared config
- The `npm run dev` script runs the Express server, not raw Vite

## Notes

- Session warning about `express-slow-down` `delayMs` is benign (cosmetic deprecation warning)
- `SESSION_SECRET` uses a default dev value — fine for local dev
