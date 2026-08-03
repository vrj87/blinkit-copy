# Phase 1a — Collect & Normalize (legacy standalone app)

Optional standalone collect UI. **Primary path is MVP-embedded** at `http://localhost:3000/collect` (`POST /api/collect/reviews`).

Writes to `data/discovery/` (shared with scrape pipeline).

```bash
npm run dev:collect    # http://localhost:3001 (optional)
npm run expand:corpus    # synthetic corpus expansion
```

For scheduled scrape + analyze + validate, use from repo root:

```bash
npm run discovery:refresh
```
