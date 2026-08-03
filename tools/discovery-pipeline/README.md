# Discovery Pipeline

Scrape → Normalize → Theme extract → Validate

## Quick commands (from repo root)

```bash
npm run discovery:refresh              # scrape + analyze + validate
npm run discovery:refresh -- --notify  # + POST /api/workflows/discovery-refresh
npm run discovery:scrape               # scrape + normalize only
npm run discovery:all                  # alias for discovery:refresh
```

## Scrape sources

| Source | Method |
|--------|--------|
| App Store reviews | Apple RSS feeds (Blinkit, BigBasket) |
| Play Store reviews | `google-play-scraper` |
| Reddit discussions | Reddit JSON API + comments |
| Community forums | Reddit search (forum-style threads) |
| Social media | Reddit search (WhatsApp/social mentions) |
| Product reviews | Play Store helpful reviews + Reddit |
| Quick-commerce discussions | Reddit search (Blinkit/Instamart) |

Options:

- `--fresh` — ignore existing `data/discovery/raw-reviews.json`
- Default — merge new items (deduped by text hash)

## Manual collection

Reviews pasted in the MVP Collect UI merge into the same corpus:

- **Embedded UI:** `http://localhost:3000/collect` → `POST /api/collect/reviews`
- **Playground:** `/playground#collect`
- **Legacy (optional):** `npm run dev:collect` → `:3001`

## Outputs (`data/discovery/`)

| File | Description |
|------|-------------|
| `raw-reviews.json` | Scraped + merged + manual reviews |
| `normalized-reviews.json` | Cleaned, deduplicated |
| `pipeline-stats.json` | Counts, source breakdown |
| `themes.json` | Themes with quotes |
| `validation-results.json` | Quality gate |
| `last-refresh.json` | Last `discovery:refresh` report (runtime) |

## Scheduled runs

| Runner | Config |
|--------|--------|
| GitHub Actions | `.github/workflows/discovery-scrape.yml` |
| n8n | `workflows/twelve-hour-scrape.json` |
| Local cron | `scripts/scheduled-discovery-refresh.sh --notify` |

After GHA commits `data/discovery/`, **redeploy MVP** so hosted bundles include new JSON.
