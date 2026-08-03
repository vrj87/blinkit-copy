# Generated discovery artefacts

Pipeline outputs consumed by `apps/mvp`, `tools/discovery-pipeline`, and optional `apps/collect`.

| File | Producer | Consumer |
|------|----------|----------|
| `raw-reviews.json` | Scrape (`discovery:scrape`), Collect UI (`/api/collect/reviews`), webhook ingest | Normalize step |
| `normalized-reviews.json` | Normalize step | Theme analysis |
| `chunks.json` | Normalize step | LLM batching |
| `pipeline-stats.json` | Normalize step | MVP dashboard, playground |
| `themes.json` | `pipeline:analyze` | MVP APIs, Groq RAG, seed |
| `validation-results.json` | `pipeline:validate` | MVP dashboard |
| `last-refresh.json` | `discovery:refresh` (local only, not always committed) | `GET /api/workflows/discovery-refresh` |

## Collect paths (current)

| Surface | Path |
|---------|------|
| Collect UI (embedded) | `http://localhost:3000/collect` |
| Collect API | `POST /api/collect/reviews` |
| Webhook ingest (scrapers) | `POST /api/discovery/reviews` + `x-webhook-secret` |
| Legacy collect app | `npm run dev:collect` → `:3001` (optional) |

## Scheduled refresh

```bash
npm run discovery:refresh              # scrape + analyze + validate
npm run discovery:refresh -- --notify  # also POST summary to MVP API
npm run discovery:scrape               # scrape + normalize only
```

GitHub Actions: `.github/workflows/discovery-scrape.yml` (every 12h UTC).

Human-readable reports: `docs/discovery/`.
