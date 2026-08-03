import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import type { RawReview } from "@blinkit/discovery-core";
import {
  appendReviews,
  getCollectStatus,
  persistNormalized,
} from "@/lib/discovery-service";

const ReviewSchema = z.object({
  source: z.enum([
    "app_store",
    "play_store",
    "reddit",
    "forum",
    "social",
    "product_review",
    "web_ui",
  ]),
  date: z.string().optional(),
  rating: z.number().min(1).max(5).nullable().optional(),
  text: z.string().min(8),
  author_segment_hint: z.string().nullable().optional(),
  url: z.string().optional(),
  keywords: z.array(z.string()).optional(),
});

export async function GET() {
  return NextResponse.json(getCollectStatus());
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  if (body.mode === "normalize") {
    const result = persistNormalized();
    return NextResponse.json({
      ok: true,
      message: "Normalized → data/discovery/",
      ...result,
    });
  }

  if (body.mode === "bulk") {
    const items = z.array(ReviewSchema).safeParse(body.reviews);
    if (!items.success) {
      return NextResponse.json({ error: items.error.flatten() }, { status: 400 });
    }
    const reviews: RawReview[] = items.data.map((item, i) => ({
      id: `web-${Date.now()}-${i}`,
      source: item.source,
      date: item.date ?? new Date().toISOString().slice(0, 10),
      rating: item.rating ?? null,
      text: item.text,
      author_segment_hint: item.author_segment_hint ?? null,
      url: item.url || "https://collect.local/input",
      keywords: item.keywords ?? [],
    }));
    const result = appendReviews(reviews);
    const normalized = persistNormalized();
    return NextResponse.json({ ok: true, ...result, normalize: normalized });
  }

  const parsed = ReviewSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const review: RawReview = {
    id: `web-${Date.now()}`,
    source: parsed.data.source,
    date: parsed.data.date ?? new Date().toISOString().slice(0, 10),
    rating: parsed.data.rating ?? null,
    text: parsed.data.text,
    author_segment_hint: parsed.data.author_segment_hint ?? null,
    url: parsed.data.url || "https://collect.local/input",
    keywords: parsed.data.keywords ?? [],
  };
  const result = appendReviews([review]);
  const normalized = persistNormalized();
  return NextResponse.json({ ok: true, review, ...result, normalize: normalized });
}
