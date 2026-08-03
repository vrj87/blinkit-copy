# Production URLs

> **Netlify:** [NETLIFY.md](./NETLIFY.md) + root `netlify.toml` · **Vercel:** `scripts\deploy-prod.cmd`

| Page | Path |
|------|------|
| **Playground** | `/playground` |
| **MVP phone** | `/mvp` |
| Discovery Q&A | `/dashboard/discovery` |
| P1 demo | `/demo/user/user-atharv` |
| Ops | `/dashboard` |

Use `https://YOUR-SITE.netlify.app` + path above (or your Vercel URL).

**Deck slide 3 & 8:** **playground** URL.

## Configured automatically on deploy

- `GROQ_API_KEY` — Groq LLM for explained recommendations (`llama-3.3-70b-versatile`)
- `DATABASE_URL` — PostgreSQL pooled URL (Neon/Supabase)
- `DIRECT_URL` — PostgreSQL direct URL (migrations at build)
- `N8N_WEBHOOK_SECRET` — `blinkit-mvp-webhook-prod`
- `NEXT_PUBLIC_APP_URL` / `NEXT_PUBLIC_COLLECT_URL` — set after first deploy + redeploy

## Production vs local

| Feature | Local | Production |
|---------|-------|--------------|
| Playground | http://localhost:3000/playground | `/playground` on Netlify/Vercel |
| Collect UI iframe | http://localhost:3001 | Discovery dashboard (read-only workflow) |
| Discovery data | `data/discovery/` (577 signals) | Bundled via `outputFileTracingRoot` |
| LLM nudges | Groq API | Groq API (env on host) |
