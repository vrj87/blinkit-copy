# Vercel Deploy

## One-click (Windows)

```cmd
..\..\scripts\deploy-prod.cmd
```

From repo root:

```cmd
scripts\deploy-prod.cmd
```

## What the script does

1. Sets Vercel production env: `GROQ_API_KEY`, `DATABASE_URL`, `DIRECT_URL`, `N8N_WEBHOOK_SECRET`
2. Deploys to `vrj87/category-explorer-mvp`
3. Sets `NEXT_PUBLIC_APP_URL` + redeploys
4. Updates `docs/PRODUCTION.md` with live URLs

## Manual

```powershell
cd apps/mvp
vercel link --yes --scope vrj87 --project category-explorer-mvp
powershell -ExecutionPolicy Bypass -File ..\..\scripts\set-vercel-env.ps1 -Deploy
```

## Production fixes (already in repo)

- **Monorepo install:** `vercel.json` runs `cd ../.. && npm install`
- **Discovery data:** `outputFileTracingRoot` includes `data/discovery/` in serverless bundle
- **Groq LLM:** `GROQ_API_KEY` from local `.env` pushed to Vercel (explained nudges)
- **Collect UI:** production uses `/dashboard/discovery` instead of localhost:3001 iframe
- **PostgreSQL:** `prisma migrate deploy` at build; seed once via `npm run db:seed` (idempotent — skips if users exist)

## After deploy

Add playground URL to `docs/Blinkit.pdf` slides 3 & 8:

```
https://category-explorer-mvp.vercel.app/playground
```

Project dashboard: https://vercel.com/vrj87/category-explorer-mvp
