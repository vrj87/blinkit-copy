# MVP tests

Unit tests for the Smart Category Explorer MVP live in this folder (`tests/mvp/unit/`).

## Run

From the repository root:

```bash
npm run test:mvp
```

Run all project unit tests (MVP + discovery):

```bash
npm test
```

Watch mode:

```bash
npm run test:watch
```

## Coverage

| File | Module | Tests |
|------|--------|--------|
| `segment.test.ts` | `lib/segment.ts` | Eligibility rules, JSON parsing |
| `product-catalog.test.ts` | `lib/product-catalog.ts` | Search, categories, cart resolution |
| `schemas.test.ts` | `lib/api/schemas.ts` | Order and nudge API validation |
| `starter-packs.test.ts` | `lib/starter-packs.ts` | Starter pack lookup |
| `demo-order-cache.test.ts` | `lib/demo-order-cache.ts` | Order merge + local count |
| `demo-orders.test.ts` | `lib/demo-orders.ts` | `formatOrderDate` (Today / last 10 days) |
| `order-row.test.ts` | `lib/order-row.ts` | Order row normalization |
| `collect-url.test.ts` | `lib/collect-url.ts` | Collect / discovery URLs |
| `blinkit-storefront.test.ts` | `lib/blinkit-storefront.ts` | Promo data, discount % |

Tests import MVP code via the `@mvp` alias configured in `vitest.config.ts`.

**Current count:** 10 MVP test files · 36 tests (40 total with discovery).
