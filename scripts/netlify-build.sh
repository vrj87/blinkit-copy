#!/usr/bin/env bash
# Netlify production build (runs on Linux)
set -euo pipefail

echo "=== Netlify build: blinkit-category-discovery ==="

if [[ -z "${DATABASE_URL:-}" ]]; then
  echo "ERROR: DATABASE_URL is required (set in Netlify UI — Neon/Supabase pooled URL)" >&2
  exit 1
fi
if [[ -z "${DIRECT_URL:-}" ]]; then
  echo "ERROR: DIRECT_URL is required for prisma migrate deploy (Neon/Supabase direct URL)" >&2
  exit 1
fi

npm install

cd apps/mvp

echo "=== Prisma generate + migrate deploy ==="
npx prisma generate
npx prisma migrate deploy

echo "=== Copy discovery + research data for serverless bundle ==="
mkdir -p data/discovery data/research
cp -rf ../../data/discovery/. data/discovery/
cp -rf ../../data/research/. data/research/
if [[ ! -f data/discovery/themes.json ]]; then
  echo "ERROR: discovery data missing (data/discovery/themes.json)" >&2
  exit 1
fi
echo "Bundled discovery: $(find data/discovery -type f | wc -l) files, research: $(find data/research -type f | wc -l) files"

echo "=== Next.js build ==="
npm run build

if [[ ! -d .next/server ]]; then
  echo "ERROR: .next/server missing after build" >&2
  exit 1
fi

echo "=== Build OK ==="
ls -la .next | head -20
