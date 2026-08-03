# Smart Category Explorer

AI-powered discovery engine + cross-category recommendation MVP for Blinkit quick-commerce growth.

**Submission deck:** [docs/Blinkit.pdf](docs/Blinkit.pdf) · **Alignment:** [docs/DECK_ALIGNMENT.md](docs/DECK_ALIGNMENT.md) · **Expectations:** [docs/EXPECTATIONS.md](docs/EXPECTATIONS.md)

## Monorepo structure

```
GrauationProject2/
├── apps/
│   ├── collect/              # Phase 1a — review collection web UI (:3001)
│   └── mvp/                  # Phase 4 — Smart Category Explorer MVP (:3000, Vercel)
├── packages/
│   └── discovery-core/       # Shared types, normalize, path helpers
├── tools/
│   └── discovery-pipeline/   # Phase 1b — scrape, theme extract, validate
├── data/
│   └── discovery/            # Pipeline artefacts (raw, themes, validation)
├── tests/
│   ├── mvp/unit/             # MVP unit tests
│   └── discovery/unit/       # discovery-core tests
├── docs/
│   ├── Blinkit.pdf           # Final submission deck (10 slides)
│   ├── architecture.md       # System architecture (as built)
│   ├── deck/                 # Deck outline + 1-slider workflow
│   ├── discovery/            # Insights, rubric, demo guide
│   ├── research/               # Survey, interviews, synthesis
│   └── problem-definition.md
├── workflows/                # n8n workflow exports
├── scripts/                  # Dev, deploy, scrape helpers
├── netlify.toml              # Netlify build (GitHub → Netlify CD)
├── vitest.config.ts
└── package.json
```

## Quick start

### Prerequisites

- Node.js 20+
- npm
- PostgreSQL database ([Neon](https://neon.tech) or [Supabase](https://supabase.com) — free tier works for demo)

### PostgreSQL setup

1. Create a Neon or Supabase project.
2. Copy connection strings into `apps/mvp/.env` (see `apps/mvp/.env.example`):
   - `DATABASE_URL` — pooled URL (Neon pooled / Supabase transaction pooler port 6543)
   - `DIRECT_URL` — direct URL for migrations (Neon direct / Supabase port 5432)
3. Run setup (applies migrations + seeds empty DB):

```bash
npm install
npm run backend:setup
```

To wipe and re-seed: `FORCE_DB_SEED=true npm run db:seed` from `apps/mvp`.

### 1. Install

### 2. Run MVP

```bash
npm run dev
```

Open http://localhost:3000/playground — hub for discovery, problem frame, ops, and MVP launch.

Primary demo: http://localhost:3000/mvp (Blinkit phone shell).

### 3. Collect UI (optional, local)

```bash
npm run dev:collect
```

Open http://localhost:3001 · expand corpus: `npm run expand:corpus`

### 4. Discovery pipeline

```bash
npm run discovery:refresh   # scrape → analyze → validate
npm run discovery:scrape    # scrape only
```

**Corpus:** 577 reviews · 10 themes · 10/10 validated

### 5. Tests

```bash
npm test              # 40 unit tests (MVP + discovery)
npm run test:mvp      # MVP tests only
```

## Demo flow (P1 Routine Restocker)

1. Open `/mvp` or `/demo/user/user-atharv`
2. **Home** — browse catalog, search, add to cart, place order
3. **For you** — AI category nudge (Groq LLM)
4. Accept starter pack → appears in **Orders**
5. **Ops** — `/dashboard` for funnel metrics

## Deploy to production

### GitHub → Netlify (recommended)

1. Push to [github.com/vrj87/blinkit](https://github.com/vrj87/blinkit) (`main` branch).
2. Connect the repo in [Netlify](https://app.netlify.com) (Import from Git).
3. Set env vars — see [docs/NETLIFY_CHECKLIST.md](docs/NETLIFY_CHECKLIST.md) and [docs/NETLIFY.md](docs/NETLIFY.md).

Every `git push origin main` triggers a new Netlify production deploy.

### Vercel (alternative)

```cmd
scripts\deploy-prod.cmd
```

See [docs/PRODUCTION.md](docs/PRODUCTION.md).

## Deliverables

| Deliverable | Location |
|-------------|----------|
| **10-slide deck (submit)** | `docs/Blinkit.pdf` |
| Deck outline + 1-slider | `docs/deck/` |
| Review collection UI | `apps/collect` → :3001 |
| Discovery pipeline | `tools/discovery-pipeline` |
| Discovery demo guide | `docs/discovery/DISCOVERY_DEMONSTRATION.md` |
| Research Q&A | `/dashboard/discovery` |
| MVP prototype | `/mvp` · `/playground` |
| Problem definition | `docs/problem-definition.md` |
| Primary survey (n=40) | [Questionnaire](https://docs.google.com/forms/d/e/1FAIpQLScAJAfUjeyQm-bw0qCQdlk2LKf0RM0S5bhXcIFsdiLjgRHSAg/viewform?pli=1) · [Responses](https://docs.google.com/spreadsheets/d/1aGnzWyNH2nMwUDRZnC6xTcms9RwCW5R8gzDuA0Szmtw/edit?gid=0#gid=0) |
| Unit tests | `tests/mvp/` · `npm test` |

## Target outcomes (deck)

| Metric | Target |
|--------|--------|
| New category buyers | +20% |
| AOV | +15% |
| Recommendation CTR | +18% |
| Retention | +10% |
