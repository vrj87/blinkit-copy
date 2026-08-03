# Discovery documentation

Human-written discovery docs for Phase 1. **Generated JSON data** lives in [`data/discovery/`](../../data/discovery/).

| Doc | Purpose |
|-----|---------|
| [insights.md](./insights.md) | Theme summaries and evidence |
| [validation-rubric.md](./validation-rubric.md) | Quality bar for themes |
| [DISCOVERY_DEMONSTRATION.md](./DISCOVERY_DEMONSTRATION.md) | End-to-end demo walkthrough |

## Discovery scrape workflow

```bash
# Full pipeline (recommended)
npm run discovery:refresh

# With MVP webhook notify (used by GHA / cron)
npm run discovery:refresh -- --notify

# Scrape + normalize only
npm run discovery:scrape
```

**Steps:** 7 sources scrape → merge `raw-reviews.json` → normalize → `pipeline:analyze` → `pipeline:validate` → `last-refresh.json`

**Schedule:** Every 12 hours via [GitHub Actions](../.github/workflows/discovery-scrape.yml) or [n8n](../workflows/twelve-hour-scrape.json).

**Dashboard:** `/dashboard/discovery` · **Status API:** `GET /api/workflows/discovery-refresh`

## Collect more reviews (manual)

Embedded in MVP (no separate server required):

- UI: `http://localhost:3000/collect` or playground **Review collection**
- API: `POST /api/collect/reviews`

Optional legacy app: `npm run dev:collect` → `http://localhost:3001`
