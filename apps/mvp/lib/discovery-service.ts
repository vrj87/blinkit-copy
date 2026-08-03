import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";
import {
  discoveryDataDir,
  findRepoRoot,
  rawReviewsPath,
  runNormalizePipeline,
  themesPath,
  validationResultsPath,
  type PipelineStats,
  type RawReview,
} from "@blinkit/discovery-core";

function ensureDataDir() {
  mkdirSync(discoveryDataDir(), { recursive: true });
}

export function loadRawReviews(): RawReview[] {
  const path = rawReviewsPath();
  if (!existsSync(path)) return [];
  return JSON.parse(readFileSync(path, "utf-8")) as RawReview[];
}

export function saveRawReviews(reviews: RawReview[]) {
  ensureDataDir();
  writeFileSync(rawReviewsPath(), JSON.stringify(reviews, null, 2), "utf-8");
}

export function appendReviews(newReviews: RawReview[]) {
  const existing = loadRawReviews();
  const seen = new Set(existing.map((r) => r.text.trim().toLowerCase()));
  let added = 0;
  let skippedDuplicates = 0;

  for (const review of newReviews) {
    const key = review.text.trim().toLowerCase();
    if (!key || seen.has(key)) {
      skippedDuplicates += 1;
      continue;
    }
    existing.push(review);
    seen.add(key);
    added += 1;
  }

  saveRawReviews(existing);
  return { added, skippedDuplicates, total: existing.length };
}

export function persistNormalized() {
  ensureDataDir();
  const raw = loadRawReviews();
  const { filtered, chunks, stats } = runNormalizePipeline(raw, "web_ui");
  const dir = discoveryDataDir();

  writeFileSync(join(dir, "normalized-reviews.json"), JSON.stringify(filtered, null, 2), "utf-8");
  writeFileSync(
    join(dir, "chunks.json"),
    JSON.stringify(
      chunks.map((chunk, i) => ({
        chunkId: `chunk-${i + 1}`,
        reviewCount: chunk.length,
        reviewIds: chunk.map((r) => r.id),
      })),
      null,
      2
    ),
    "utf-8"
  );
  writeFileSync(join(dir, "pipeline-stats.json"), JSON.stringify(stats, null, 2), "utf-8");

  return { stats, reviewCount: filtered.length };
}

export function getDiscoveryStatus() {
  const raw = loadRawReviews();
  const statsPath = join(discoveryDataDir(), "pipeline-stats.json");
  let stats: PipelineStats | null = null;
  if (existsSync(statsPath)) {
    stats = JSON.parse(readFileSync(statsPath, "utf-8")) as PipelineStats;
  }

  return {
    rawCount: raw.length,
    normalizedAt: stats?.processedAt ?? null,
    afterFilter: stats?.afterFilter ?? null,
    chunkCount: stats?.chunkCount ?? null,
    sourceBreakdown: stats?.sourceBreakdown ?? {},
    themesAvailable: existsSync(themesPath()),
    validationAvailable: existsSync(validationResultsPath()),
    lastRefresh: loadLastRefresh(),
  };
}

export function loadLastRefresh(): Record<string, unknown> | null {
  const path = join(discoveryDataDir(), "last-refresh.json");
  if (!existsSync(path)) return null;
  try {
    return JSON.parse(readFileSync(path, "utf-8")) as Record<string, unknown>;
  } catch {
    return null;
  }
}

export function saveLastRefresh(report: Record<string, unknown>) {
  ensureDataDir();
  writeFileSync(
    join(discoveryDataDir(), "last-refresh.json"),
    JSON.stringify(report, null, 2),
    "utf-8"
  );
}

export function loadDiscoveryBundle() {
  const dataDir = discoveryDataDir();
  const stats = JSON.parse(readFileSync(join(dataDir, "pipeline-stats.json"), "utf-8"));
  const themes = JSON.parse(readFileSync(themesPath(), "utf-8"));
  const validation = JSON.parse(readFileSync(validationResultsPath(), "utf-8"));
  return { stats, themes, validation };
}

export function loadCollectConfig() {
  const path = join(findRepoRoot(), "apps/collect/config/keywords.json");
  return JSON.parse(readFileSync(path, "utf-8")) as {
    keywords: string[];
    segmentHints: string[];
    targetSegment: { label: string; criteria: string[] };
    targetVolume: { min: number; ideal: number };
  };
}

export function getCollectStatus() {
  const config = loadCollectConfig();
  const raw = loadRawReviews();
  const statsPath = join(discoveryDataDir(), "pipeline-stats.json");
  let stats: PipelineStats | null = null;
  if (existsSync(statsPath)) {
    stats = JSON.parse(readFileSync(statsPath, "utf-8")) as PipelineStats;
  }
  const targetMin = config.targetVolume?.min ?? 200;
  const targetIdeal = config.targetVolume?.ideal ?? 500;

  return {
    config,
    rawCount: raw.length,
    targetMin,
    targetIdeal,
    progressPct: Math.min(100, Math.round((raw.length / targetMin) * 100)),
    stats: stats
      ? { afterFilter: stats.afterFilter, chunkCount: stats.chunkCount }
      : null,
    recent: raw.slice(-5).reverse().map((r) => ({
      id: r.id,
      source: r.source,
      text: r.text,
    })),
  };
}

export function prepareIngestReviews(
  input: Array<{
    source: RawReview["source"];
    text: string;
    id?: string;
    date?: string;
    rating?: number | null;
    author_segment_hint?: string | null;
    url?: string;
    keywords?: string[];
  }>
): RawReview[] {
  const now = new Date().toISOString().slice(0, 10);
  return input.map((r, i) => ({
    id: r.id ?? `api-${Date.now()}-${i}`,
    source: r.source,
    date: r.date ?? now,
    rating: r.rating ?? null,
    text: r.text.trim(),
    author_segment_hint: r.author_segment_hint ?? null,
    url: r.url ?? "",
    keywords: r.keywords ?? [],
  }));
}
