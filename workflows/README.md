# n8n Workflow Integration

Import these workflows into n8n Cloud or self-hosted n8n.

## Workflows

| File | Trigger | Action |
|------|---------|--------|
| [post-order-nudge.json](./post-order-nudge.json) | Webhook on order completion | POST `/api/events/order` |
| [daily-batch-scan.json](./daily-batch-scan.json) | Daily cron (24h) | POST `/api/workflows/scan-users` |
| [twelve-hour-scrape.json](./twelve-hour-scrape.json) | Every 12 hours | `npm run discovery:refresh -w discovery-pipeline -- --notify` |

## 12-hour discovery scrape

**Pipeline:** 7 sources → merge `raw-reviews.json` → normalize → analyze themes → validate → `last-refresh.json` → notify MVP.

Manual reviews merge via MVP **Collect UI** (`/collect`, `POST /api/collect/reviews`) — no `:3001` server required locally.

### Option A — GitHub Actions (recommended)

Workflow: [`.github/workflows/discovery-scrape.yml`](../.github/workflows/discovery-scrape.yml)

- Runs at **00:00 and 12:00 UTC**
- Uses `--notify` during refresh (single webhook, no duplicate curl step)
- Commits updated `data/discovery/` when new reviews are found
- Set repo variable `MVP_APP_URL` and secret `N8N_WEBHOOK_SECRET` for MVP notify

Manual run: **Actions → Discovery scrape (12h) → Run workflow**

### Option B — n8n (self-hosted)

Import [twelve-hour-scrape.json](./twelve-hour-scrape.json). Requires **Execute Command** node.

```bash
REPO_PATH=/path/to/repo
MVP_APP_URL=https://your-app.vercel.app
N8N_WEBHOOK_SECRET=your-shared-secret
```

Command: `npm run discovery:refresh -w discovery-pipeline -- --notify`

### Option C — Local cron / Task Scheduler

```bash
# Linux/macOS — every 12 hours
0 */12 * * * cd /path/to/repo && ./scripts/scheduled-discovery-refresh.sh --notify
```

```powershell
# Windows — register task (adjust path)
schtasks /Create /SC HOURLY /MO 12 /TN "BlinkitDiscoveryRefresh" `
  /TR "powershell -ExecutionPolicy Bypass -File C:\path\to\scripts\scheduled-discovery-refresh.ps1 --notify"
```

### Manual run

```bash
npm run discovery:refresh              # scrape + analyze + validate
npm run discovery:refresh -- --notify  # also POST summary to MVP API
npm run discovery:scrape               # scrape + normalize only
npm run discovery:refresh -- --fresh   # ignore existing corpus
```

Check status: `GET /api/workflows/discovery-refresh` or `/dashboard/discovery`

## Environment variables

```bash
MVP_APP_URL=https://your-app.vercel.app
N8N_WEBHOOK_SECRET=your-shared-secret
REPO_PATH=/path/to/repo   # twelve-hour-scrape only (self-hosted n8n)
```

Set the same `N8N_WEBHOOK_SECRET` in your MVP host env (Vercel / Netlify).

## API authentication

Workflow API calls include:

```http
x-webhook-secret: <N8N_WEBHOOK_SECRET>
```

## Testing locally

```bash
curl http://localhost:3000/api/workflows/discovery-refresh

curl -X POST http://localhost:3000/api/workflows/discovery-refresh \
  -H "Content-Type: application/json" \
  -H "x-webhook-secret: blinkit-mvp-webhook-prod" \
  -d '{"completedAt":"2026-08-03T12:00:00Z","schedule":"12h","themes":10}'

curl -X POST http://localhost:3000/api/collect/reviews \
  -H "Content-Type: application/json" \
  -d '{"source":"web_ui","text":"Blinkit delivery was super fast today, love the app"}'
```
