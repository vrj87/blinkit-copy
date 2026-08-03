# Deploy: GitHub → Netlify

Continuous deployment: **push to `main` on GitHub** → Netlify builds and publishes automatically.

**Repo:** [github.com/vrj87/blinkit](https://github.com/vrj87/blinkit)

---

## One-time setup

### 1. Push code to GitHub

```bash
git add .
git commit -m "Your message"
git push origin main
```

(Config lives in root `netlify.toml` — Netlify reads it on each deploy.)

### 2. Connect Netlify to GitHub

1. Open [app.netlify.com](https://app.netlify.com) → **Add new site** → **Import an existing project**
2. Choose **GitHub** → authorize → select **`vrj87/blinkit`**
3. Branch: **`main`**
4. Build settings (should auto-fill from `netlify.toml`):

| Setting | Value |
|---------|--------|
| Base directory | *(leave empty)* |
| Build command | From `netlify.toml` |
| Publish directory | `apps/mvp/.next` |
| Package directory | `apps/mvp` *(set in UI if builds fail — see below)* |

5. Click **Deploy site**

### 3. Environment variables (required)

**Site configuration → Environment variables → Production:**

| Variable | Value |
|----------|--------|
| `GROQ_API_KEY` | Your key from [console.groq.com/keys](https://console.groq.com/keys) |
| `DATABASE_URL` | Neon/Supabase **pooled** connection URL |
| `DIRECT_URL` | Neon/Supabase **direct** URL (for `prisma migrate deploy` at build) |
| `N8N_WEBHOOK_SECRET` | Same as `apps/mvp/.env` |
| `NEXT_PUBLIC_APP_URL` | `https://YOUR-SITE.netlify.app` *(after first deploy)* |

After setting `NEXT_PUBLIC_APP_URL`, go to **Deploys → Trigger deploy → Clear cache and deploy**.

Optional: sync env from local `.env` (requires [Netlify CLI](https://docs.netlify.com/cli/get-started/)):

```powershell
npm install -g netlify-cli
netlify login
netlify link
powershell -ExecutionPolicy Bypass -File scripts\set-netlify-env.ps1
```

---

## Day-to-day workflow

```text
Edit code locally → git push origin main → Netlify auto-builds → live site updates
```

Check build status: Netlify **Deploys** tab or GitHub commit checks (if enabled).

---

## Verify production

Replace `YOUR-SITE` with your Netlify subdomain (e.g. `blinkit` → `blinkit.netlify.app`):

| Check | URL |
|-------|-----|
| Health | `https://YOUR-SITE.netlify.app/api/health` |
| MVP demo | `https://YOUR-SITE.netlify.app/mvp` |
| Playground | `https://YOUR-SITE.netlify.app/playground` |
| LLM status | `https://YOUR-SITE.netlify.app/api/ai/status` |

**Deck link:** `https://YOUR-SITE.netlify.app/playground`

---

## Deploy audit (local vs Netlify)

Before trusting a Netlify deploy, compare what the build produced locally:

```powershell
# From repo root — after a full build (see scripts/netlify-build.sh on Linux / below on Windows)
powershell -ExecutionPolicy Bypass -File scripts/audit-publish.ps1
```

**Local build (Windows):**

```powershell
cd apps/mvp
# DATABASE_URL and DIRECT_URL from apps/mvp/.env
npx prisma generate
npx prisma migrate deploy
npm run build
cd ../..
powershell -ExecutionPolicy Bypass -File scripts/audit-publish.ps1
```

**What to expect** (healthy build):

| Check | Expected |
|-------|----------|
| `apps/mvp/.next` | ~300+ files, ~150–200 MB |
| Routes | `/mvp`, `/playground`, `/api/health`, etc. under `server/app` |
| No `dev.db` in traces | Expected — Postgres is external |
| Prisma engine | `libquery_engine-rhel-openssl-3.0.x.so.node` in traces |

### Netlify CLI

```bash
npm install -g netlify-cli
netlify login
netlify link

# Lists files before upload — eyeball count/paths:
netlify deploy --build

# Production:
netlify deploy --build --prod

# After deploy — replace DEPLOY_ID from deploy URL or dashboard:
netlify api getDeploy --data '{"deploy_id": "DEPLOY_ID"}'
```

Check `summary.messages` for warnings and `required` for missing content hashes.

---

## Troubleshooting

### `a3.snapshot is not a function` (Next.js 15)

Root `netlify.toml` uses `@netlify/plugin-nextjs` (v5 from `package.json`). After pulling latest code:

1. **Deploys → Clear cache and deploy site**
2. Confirm build log shows plugin **v5.x** (not v4.x)

### 500 on page load (database)

Ensure `DATABASE_URL` and `DIRECT_URL` are set in Netlify UI. Build runs `prisma migrate deploy` — check build logs for migration errors. Seed demo data once with `npm run db:seed` (locally against prod URL) if the DB is empty.

### 404 on every page

- Confirm `@netlify/plugin-nextjs` is in `netlify.toml` (it is).
- **Publish directory** must be `apps/mvp/.next`, not `public` or repo root.
- Redeploy with **Clear cache**.

### Build fails: workspace / module not found

In Netlify UI → **Build settings**:

- **Base directory:** empty (repo root)
- **Package directory:** `apps/mvp`

Keep `netlify.toml` at the **repository root** so the build command runs `npm install` from root (npm workspaces).

### Build fails: Prisma / seed

Ensure `GROQ_API_KEY` is set before deploy (seed calls Groq for demo nudges).

### Wrong Node version

Root `.node-version` pins Node **20**. `netlify.toml` also sets `NODE_VERSION = "20"`.

---

## Files reference

| File | Purpose |
|------|---------|
| `netlify.toml` | Build command, Next.js plugin, publish path |
| `.node-version` | Node 20 for Netlify |
| `scripts/set-netlify-env.ps1` | Push local `.env` secrets to Netlify (optional) |

See also: [PRODUCTION.md](./PRODUCTION.md)
