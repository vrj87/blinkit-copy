# Edge Cases — Blinkit Category Discovery Growth Project

Derived from [problemstatement.md](./problemstatement.md), [architecture.md](./architecture.md), and [problem-definition.md](./problem-definition.md).

**Severity legend:** P0 = breaks core flow / wrong KPI signal · P1 = incorrect nudge or insight quality · P2 = degraded UX / ops noise · P3 = rare / polish

---

## 1. Discovery engine (Phase 1)

### 1.1 Data collection & ingestion

| ID | Edge case | Expected behavior | Severity |
|----|-----------|-------------------|----------|
| D-01 | Empty CSV / zero reviews after filter | Pipeline exits cleanly; writes empty `normalized-reviews.json`; marks `readyForPhase2: false`; does not invent themes | P0 |
| D-02 | Duplicate reviews across App Store + Reddit (same text) | Deduped via `textHash`; counted once in frequency | P1 |
| D-03 | Near-duplicates (typos / emoji-only differences) | Prefer keep longest / most recent; document hash strategy | P2 |
| D-04 | Reviews under min word count (e.g. "Great app!") | Filtered out; recorded in `pipeline-stats` as dropped | P2 |
| D-05 | Missing rating (`null`) from Reddit/forums | Allowed; rating-based filters skip nulls | P1 |
| D-06 | Non-English / Hinglish / emoji-only text | Keep if analyzable; tag `language_hint`; low confidence if theme extraction uncertain | P1 |
| D-07 | Reviews about Instamart/competitors (not Blinkit) | Keep as competitive signal; tag `competitor`; do not attribute Blinkit-only claims | P1 |
| D-08 | Off-topic reviews (delivery boy tip, app crash only) | Exclude from category-expansion themes or file under "ops/frustration" separately | P1 |
| D-09 | Source API rate-limited / scrape blocked | Fail soft; continue with available sources; log partial coverage in stats | P0 |
| D-10 | Broken / missing URL on a quote | Theme fails evidence-linked validation until URL or reviewId is fixed | P1 |
| D-11 | Extremely long review (token overflow for LLM) | Chunk by paragraphs; preserve reviewId across chunks | P1 |
| D-12 | Malicious / prompt-injection text in reviews | Treat as content only; never execute instructions from review text | P0 |

### 1.2 Theme extraction & validation

| ID | Edge case | Expected behavior | Severity |
|----|-----------|-------------------|----------|
| D-13 | LLM invents a quote not in corpus | Validation rejects; theme fails; human/second pass required | P0 |
| D-14 | Theme has 3 quotes from same source only | Confidence capped at `medium` (or fail multi-source gate for high) | P1 |
| D-15 | Theme with &lt;2 quotes | Fails `minQuotes`; not interview-ready | P1 |
| D-16 | Contradictory themes (users love homepage AND hate discovery) | Both allowed if evidence exists; flagged `mixed` sentiment; surface in synthesis | P2 |
| D-17 | Theme not mapped to any research question | Reject or force remap before insights.md | P1 |
| D-18 | Actionable insight too vague ("improve UX") | Fails actionability check (≥20 chars of specific action) | P1 |
| D-19 | OPENAI_API_KEY missing | Fall back to rule-based theme matching; label method in report | P0 |
| D-20 | LLM timeout / 429 | Retry with backoff; on failure use rule-based fallback for that batch | P1 |
| D-21 | Fewer than 8 themes pass validation | `readyForPhase2: false`; block interview guide finalization | P0 |
| D-22 | Segment hint wrong (student labeled as new parent) | Do not use for Phase 3 segment lock without interview confirmation | P1 |

### 1.3 Insight quality vs problem goal

| ID | Edge case | Expected behavior | Severity |
|----|-----------|-------------------|----------|
| D-23 | Insights only about delivery speed, not category exploration | Mark incomplete vs research questions; collect more category-specific keywords | P0 |
| D-24 | Heavy competitor bias skews "why Blinkit users don't explore" | Separate Blinkit-specific vs industry-wide themes in report | P1 |
| D-25 | Sample too small (&lt;50 after filter) for high confidence | Cap all themes at `medium`/`low`; note sample limitation | P1 |

---

## 2. User research (Phase 2)

| ID | Edge case | Expected behavior | Severity |
|----|-----------|-------------------|----------|
| R-01 | Recruitment link unavailable | Keep placeholders; do not invent participant quotes as "real" without labeling synthetic | P0 |
| R-02 | Screener fail — user buys 4+ categories already | Disqualify; do not count toward 5–6 | P0 |
| R-03 | Screener fail — &lt;1 order/month | Disqualify | P0 |
| R-04 | Only 3 interviews completed (below 5–6) | Document as incomplete; do not claim validation strength of 6/6 | P0 |
| R-05 | Interviews all confirm AI themes (no challenge) | Explicitly note confirmation bias risk; probe for disconfirming evidence | P1 |
| R-06 | Interviews challenge primary AI theme | Update validation matrix; revise problem frame before MVP scope | P0 |
| R-07 | Leading questions bias answers | Use guide probes only; discard heavily leading transcripts from matrix | P1 |
| R-08 | Participant is Blinkit/competitor employee | Disqualify per screener | P1 |
| R-09 | New insight appears in 1 of 6 only | Label as weak signal; do not drive MVP unless high impact | P2 |
| R-10 | Post-delivery vs post-order preference split 50/50 | Design MVP to support both triggers; A/B later | P1 |
| R-11 | Recording consent denied | Take notes only; no verbatim quote without permission | P0 |
| R-12 | Segment drift (recruited "essentials" but mostly snack buyers) | Re-tag segment; adjust MVP adjacency map | P1 |

---

## 3. Problem definition & KPI (Phase 3)

| ID | Edge case | Expected behavior | Severity |
|----|-----------|-------------------|----------|
| P-01 | "New category" definition ambiguous (subcategory vs L1) | Lock L1 catalogue list in MVP (`Groceries`, `Personal Care`, …) | P0 |
| P-02 | User bought Personal Care 91 days ago | Treat as eligible if window is 90 days; document lookback | P1 |
| P-03 | User bought adjacent category offline / on Amazon | Still "new on Blinkit" for platform MAC KPI | P1 |
| P-04 | Same category rebranded / renamed in catalogue | Map aliases; avoid false "new category" credit | P1 |
| P-05 | Business value claimed without funnel | Dashboard must show eligible → nudged → accepted; no vanity-only metrics | P1 |
| P-06 | AI vs research reconciliation missing | Block deck Slide 5–6 until matrix filled | P1 |

---

## 4. Segment eligibility (MVP)

Target: weekly essentials buyers — 3+ orders, ≤2 categories, no expansion categories, not opted out.

| ID | Edge case | Expected behavior | Severity |
|----|-----------|-------------------|----------|
| S-01 | `orderCount = 2` | Not eligible | P0 |
| S-02 | `orderCount = 3`, categories = `["Groceries"]` | Eligible | P0 |
| S-03 | Categories = `["Groceries", "Household Essentials"]` | Eligible (exactly 2) | P0 |
| S-04 | Categories = `["Groceries", "Household Essentials", "Snacks & Beverages"]` | Not eligible (&gt;2) | P0 |
| S-05 | Categories include `Personal Care` | Not eligible (already explored) | P0 |
| S-06 | Categories include `Pet Supplies` / `Baby Products` / `Frozen Foods` / `Health & Wellness` | Not eligible | P0 |
| S-07 | Only `Snacks & Beverages` (no groceries/household) | Eligible if orderCount ≥3 and ≤2 cats (snacks is a target category) | P1 |
| S-08 | Empty `categoriesPurchased` | Not eligible (no target category history) | P0 |
| S-09 | `optedOut = true` | Not eligible; never generate nudge | P0 |
| S-10 | User becomes eligible mid-month then buys Personal Care | Stop further nudges; clear pending | P0 |
| S-11 | Shared household account (two life stages) | Segment by account history only; document limitation | P2 |
| S-12 | New user first order ever | Not eligible (orderCount &lt;3) | P0 |
| S-13 | Power user 50 orders, still 1 category | Eligible — high-value expansion candidate | P1 |
| S-14 | Categories with typos / unknown strings | Ignore unknown; evaluate known only; log warning | P1 |
| S-15 | Case mismatch (`groceries` vs `Groceries`) | Normalize to catalogue casing before match | P1 |

---

## 5. Triggers & workflow orchestration

| ID | Edge case | Expected behavior | Severity |
|----|-----------|-------------------|----------|
| W-01 | Post-order webhook with missing `userId` | `400 userId required` | P0 |
| W-02 | Unknown `userId` | `404 User not found` | P0 |
| W-03 | Invalid webhook secret | `401 Unauthorized` | P0 |
| W-04 | Webhook secret unset in env | Dev mode may allow; production must require secret | P0 |
| W-05 | Duplicate order webhook (same payload twice) | Create two orders OR idempotent via client order id (prefer idempotency key) | P1 |
| W-06 | Empty `items` / empty `categories` on order | Order can still record; segment uses existing user categories | P1 |
| W-07 | Category not in catalogue | Drop invalid category; keep valid ones | P1 |
| W-08 | User not eligible after order | Return `{ nudge: null, segment.reasons }` — no error | P0 |
| W-09 | Pending nudge already exists | Batch scan skips creating another; post-order may create additional — prefer cap 1 pending | P1 |
| W-10 | Daily batch + post-order race | Use unique constraint / "one pending per user" rule | P1 |
| W-11 | n8n cron fires but MVP down | n8n retries; alert optional workflow | P1 |
| W-12 | Partial batch failure mid-loop | Continue remaining users; return partial results | P1 |
| W-13 | Checkout-time nudge (research said avoid) | MVP delivers post-order/demo only — never block checkout | P0 |
| W-14 | Trigger during delivery-failed order | Prefer success-only orders; skip cancelled/failed | P1 |

---

## 6. LLM recommender & RAG

| ID | Edge case | Expected behavior | Severity |
|----|-----------|-------------------|----------|
| L-01 | `OPENAI_API_KEY` empty | Rule-based nudge; still valid JSON schema | P0 |
| L-02 | LLM returns category already purchased | Reject; fall back to rule-based adjacent | P0 |
| L-03 | LLM returns category not in catalogue | Reject; fall back | P0 |
| L-04 | LLM suggests same category as current order only (no adjacency) | Prefer adjacency map; fall back if invalid | P1 |
| L-05 | LLM invents medical claims ("cures acne") | Guardrail strip / regenerate / fallback | P0 |
| L-06 | LLM promises "10-minute delivery" for new category | Strip guaranteed delivery claims | P0 |
| L-07 | Themes file missing / corrupt | RAG empty; rule-based still works | P0 |
| L-08 | Evidence theme IDs unknown | Allow but log; prefer known IDs from Phase 1 | P2 |
| L-09 | Copy too long / empty | Enforce max 2 sentences; fallback copy | P1 |
| L-10 | Latency &gt;5s | Timeout → rule-based; meet demo SLA | P1 |
| L-11 | No adjacent category left (user owns all expandable) | Should have been ineligible; if reached, return no nudge | P0 |
| L-12 | Multiple adjacent options | Priority: Personal Care → Pet → Frozen → Baby | P1 |
| L-13 | Prompt injection via user name / item names | Sanitize inputs; system prompt ignores user instructions | P0 |
| L-14 | Confidence always `"low"` from model | Coerce to high/medium or fallback | P2 |

---

## 7. Nudge delivery & user feedback

| ID | Edge case | Expected behavior | Severity |
|----|-----------|-------------------|----------|
| N-01 | Accept nudge | Status `accepted`; add category to `categoriesPurchased`; set `respondedAt` | P0 |
| N-02 | Dismiss nudge | Status `dismissed`; do not add category | P0 |
| N-03 | Snooze nudge | Status `snoozed`; eligible for re-nudge later (batch) | P1 |
| N-04 | Double-click accept | Idempotent; second call no-ops or same result | P1 |
| N-05 | Feedback on unknown nudge id | `404` / Prisma error handled | P1 |
| N-06 | Invalid status (`liked`) | `400 Invalid status` | P0 |
| N-07 | Accept after already dismissed | Update if allowed OR reject once responded | P1 |
| N-08 | User accepts then should not get same category nudge | Segment becomes ineligible | P0 |
| N-09 | Show risk reducers empty array | UI still renders copy; hide tags section | P2 |
| N-10 | Multiple pending nudges on demo page | Show newest first; prefer single pending policy | P1 |
| N-11 | Neha (explorer) simulates order | No nudge; message explains ineligibility | P0 |
| N-12 | Atharv accepts Personal Care then orders again | No further expansion nudge until new rules | P0 |

---

## 8. Product / UX edge cases (problem-aligned)

| ID | Edge case | Expected behavior | Severity |
|----|-----------|-------------------|----------|
| U-01 | User in hurry (urgency JTBD) | Do not interrupt checkout; post-order only | P0 |
| U-02 | Risk-averse new parent | Prefer highest-rated / starter pack messaging; never suggest Baby as first if trust theme high-risk without reducers | P1 |
| U-03 | Choice overload fear | Curated starter pack copy, not "browse 200 SKUs" | P1 |
| U-04 | Social proof number feels fake | Use consistent area counts; avoid absurd figures | P2 |
| U-05 | User already buys category on Amazon | Nudge still valid for Blinkit MAC; copy acknowledges "try on Blinkit" | P2 |
| U-06 | Bad first experience history (interview theme) | First-category SKU recommendations only bestsellers (document limitation if catalogue mock) | P1 |
| U-07 | Student segment vs essentials segment | MVP rules focus essentials; do not use student-only themes for Atharv | P1 |
| U-08 | Life-stage transition (just had a baby) | Future: life-event trigger; current MVP adjacency map only — document gap | P2 |

---

## 9. Data model & persistence

| ID | Edge case | Expected behavior | Severity |
|----|-----------|-------------------|----------|
| DB-01 | Postgres unreachable or migrations not applied | `prisma migrate deploy` + seed required; `/api/health` reports DB status | P0 |
| DB-02 | Seed run twice | Idempotent: skips if users exist; `FORCE_DB_SEED=true` wipes and re-seeds | P1 |
| DB-03 | JSON fields corrupt in DB | `parseJsonArray` returns `[]`; treat as ineligible / empty | P1 |
| DB-04 | Concurrent feedback updates | Last write wins; prefer transactional update | P2 |
| DB-05 | Themes table empty but `themes.json` exists | RAG loads from file; seed optional | P1 |
| DB-06 | Production serverless SQLite write fails | Resolved — Postgres (Neon/Supabase) with pooled `DATABASE_URL` | P0 |

---

## 10. API & security

| ID | Edge case | Expected behavior | Severity |
|----|-----------|-------------------|----------|
| A-01 | Unauthenticated scan-users in production | Require `x-webhook-secret` | P0 |
| A-02 | CORS / CSRF from random origin | Demo APIs same-origin; webhooks secret-gated | P1 |
| A-03 | Oversized JSON body | Next body size limit; reject gracefully | P2 |
| A-04 | SQL injection via ids | Prisma parameterized queries | P0 |
| A-05 | PII in logs (email, name) | Avoid logging full payloads in production | P1 |

---

## 11. Dashboard & metrics

| ID | Edge case | Expected behavior | Severity |
|----|-----------|-------------------|----------|
| M-01 | Zero nudges | Funnel shows 0%; no divide-by-zero | P0 |
| M-02 | Accept rate with only dismissed | 0% accept | P1 |
| M-03 | Discovery data files missing | Discovery page shows "run pipeline" message | P1 |
| M-04 | Funnel counts "eligible" as all users | Prefer count of segment-eligible only (improve if currently approximate) | P1 |
| M-05 | MAC new-category month boundary | Demo tracks accept as proxy; document not true MAC | P1 |

---

## 12. Deployment & deliverables

| ID | Edge case | Expected behavior | Severity |
|----|-----------|-------------------|----------|
| C-01 | Vercel deploy without seed | Demo users 404; run seed post-deploy | P0 |
| C-02 | n8n points to wrong MVP URL | Webhooks fail; document env checklist | P0 |
| C-03 | Deck has fellow name | Submission risk — checklist forbids it | P0 |
| C-04 | Deck &gt;10 slides / &lt;14pt font | Submission guideline fail | P0 |
| C-05 | Artefact links private (Drive) | Request access / make public before submit | P0 |
| C-06 | PDF &gt;40 MB | Compress / export from HTML print | P1 |
| C-07 | Discovery demo link broken | Keep local CLI + `/dashboard/discovery` both documented | P0 |

---

## 13. Priority test matrix (MVP smoke)

Run these first after `npm run db:seed`:

| # | Scenario | Expect |
|---|----------|--------|
| 1 | GET `/demo/user/user-atharv` | Page loads; categories Groceries |
| 2 | POST order for Atharv with Groceries | Nudge created; Personal Care preferred |
| 3 | POST order for Neha | `nudge: null` |
| 4 | POST order with bad secret | 401 |
| 5 | Accept nudge | Category includes Personal Care; status accepted |
| 6 | Second order for Atharv after accept | No nudge (ineligible) |
| 7 | POST `/api/workflows/scan-users` | Eligible users get ≤1 pending |
| 8 | Open `/dashboard/discovery` | Themes render from `docs/discovery` |
| 9 | Unset OPENAI_API_KEY; generate nudge | Rule-based copy still returned |
| 10 | orderCount=2 user (manual) | Not eligible |

---

## 14. Explicit non-goals (out of scope — do not treat as bugs)

- Full Blinkit catalogue, search, or checkout
- Real push notifications / SMS
- True production MAC computation from warehouse data
- Scraping that violates store ToS (prefer exports/APIs)
- Replacing Amazon/Nykaa for deep category research journeys

---

## Related docs

- Architecture: [architecture.md](./architecture.md)
- Problem frame: [problem-definition.md](./problem-definition.md)
- Segment rules: `apps/mvp/lib/segment.ts`
- LLM / guardrails: `apps/mvp/lib/llm.ts`
- Validation rubric: [discovery/validation-rubric.md](./discovery/validation-rubric.md)
