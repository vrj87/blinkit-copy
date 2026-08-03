# Netlify deploy readiness checklist

Use this before and after connecting [github.com/vrj87/blinkit](https://github.com/vrj87/blinkit) to Netlify.

## Repo configuration (done in code)

| Item | Status | Location |
|------|--------|----------|
| Netlify build config | Ready | `netlify.toml` |
| Linux build script | Ready | `scripts/netlify-build.sh` |
| Next.js 15 plugin v5 | Ready | `package.json` → `@netlify/plugin-nextjs` (dependencies) |
| Node 20 | Ready | `.node-version`, `netlify.toml` |
| Prisma Lambda binary | Ready | `prisma/schema.prisma` → `rhel-openssl-3.0.x` |
| Prisma migrations | Ready | `apps/mvp/prisma/migrations/` |
| PostgreSQL (Neon/Supabase) | Required | `DATABASE_URL` + `DIRECT_URL` in Netlify UI |
| DB + discovery traced in bundle | Ready | `apps/mvp/next.config.js` |
| Unit tests | Ready | `npm test` (29 passing) |
| Publish audit script | Ready | `scripts/audit-publish.ps1` |

## Netlify UI — one-time setup

### 1. Import from Git

- **Repository:** `vrj87/blinkit`
- **Branch:** `main`
- **Base directory:** *(empty — repo root)*
- **Package directory:** `apps/mvp` *(only if build cannot find workspaces)*

Build settings should read from root `netlify.toml`:

- **Build command:** `bash scripts/netlify-build.sh`
- **Publish directory:** `apps/mvp/.next`

### 2. Environment variables (Production + Build)

Set scopes to **All** or at minimum **Builds** + **Deploys**:

| Variable | Required | Example |
|----------|----------|---------|
| `GROQ_API_KEY` | **Yes** (build + runtime) | Your Groq key |
| `DATABASE_URL` | **Yes** | Neon/Supabase **pooled** URL |
| `DIRECT_URL` | **Yes** (build) | Neon/Supabase **direct** URL (for `prisma migrate deploy`) |
| `N8N_WEBHOOK_SECRET` | Recommended | Same as local `.env` |
| `NEXT_PUBLIC_APP_URL` | After 1st deploy | `https://YOUR-SITE.netlify.app` |

Optional:

| Variable | When |
|----------|------|
| `SKIP_LLM_SEED` | `true` to skip Groq calls during build (demo nudges still seeded statically) |

**Important:** `GROQ_API_KEY` must be available during **build** — the seed script calls Groq unless `SKIP_LLM_SEED=true`.

### 3. First deploy

1. **Deploy site**
2. Copy your Netlify URL (e.g. `https://hilarious-biscotti-30273b.netlify.app`)
3. Set `NEXT_PUBLIC_APP_URL` to that URL
4. **Deploys → Trigger deploy → Clear cache and deploy site**

## Post-deploy verification

| URL | Expected |
|-----|----------|
| `/api/health` | JSON `status: "healthy"` or `"degraded"` with `database: true` |
| `/api/ai/status` | `ready: true`, `provider: "groq"` |
| `/mvp` | Blinkit phone demo |
| `/playground` | Full demo hub |

## Local pre-flight (optional)

```powershell
# Windows — requires DATABASE_URL and DIRECT_URL in apps/mvp/.env
cd apps/mvp
npx prisma generate; npx prisma migrate deploy; npm run build
cd ..\..
powershell -ExecutionPolicy Bypass -File scripts/audit-publish.ps1
npm test
```

## Known limitations

- **First deploy:** Database is empty until you run `npm run db:seed` once (locally against prod URL) or set `FORCE_DB_SEED=true` for a single build.
- **Collect UI (`:3001`):** Not deployed — discovery data is bundled in the MVP app.
- **n8n workflows:** Optional; MVP works without them for the demo.

## If deploy fails

See [NETLIFY.md](./NETLIFY.md) troubleshooting:

- `snapshot is not a function` → clear cache, confirm plugin v5
- Config parse error → plugin `package` must be name only (no `@5` suffix)
- 404 on all pages → wrong publish dir or missing Next.js plugin
- 500 on load → check `GROQ_API_KEY` at build time and `/api/health`
