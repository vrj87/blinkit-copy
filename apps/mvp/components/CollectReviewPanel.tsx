"use client";

import { useCallback, useEffect, useState } from "react";

type Status = {
  config: {
    keywords: string[];
    segmentHints: string[];
    targetSegment: { label: string; criteria: string[] };
    targetVolume: { min: number; ideal: number };
  };
  rawCount: number;
  targetMin: number;
  targetIdeal: number;
  progressPct: number;
  stats: { afterFilter: number; chunkCount: number } | null;
  recent: { id: string; source: string; text: string }[];
};

const SOURCES = [
  { value: "web_ui", label: "Web UI" },
  { value: "app_store", label: "App Store" },
  { value: "play_store", label: "Play Store" },
  { value: "reddit", label: "Reddit" },
  { value: "forum", label: "Forum" },
  { value: "social", label: "Social" },
  { value: "product_review", label: "Product review" },
];

export function CollectReviewPanel({ embedded = false }: { embedded?: boolean }) {
  const [status, setStatus] = useState<Status | null>(null);
  const [source, setSource] = useState("play_store");
  const [text, setText] = useState("");
  const [rating, setRating] = useState("");
  const [segment, setSegment] = useState("weekly_essentials_buyer");
  const [url, setUrl] = useState("");
  const [keywords, setKeywords] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const refresh = useCallback(async () => {
    const res = await fetch("/api/collect/reviews");
    setStatus(await res.json());
  }, []);

  useEffect(() => {
    refresh().catch(() => setError("Failed to load collect status"));
  }, [refresh]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMessage("");
    setError("");
    try {
      const res = await fetch("/api/collect/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source,
          text,
          rating: rating ? Number(rating) : null,
          author_segment_hint: segment,
          url: url || undefined,
          keywords,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(JSON.stringify(data.error ?? data));
        return;
      }
      setMessage(`Saved. Corpus: ${data.total} → normalized ${data.normalize.reviewCount}`);
      setText("");
      setUrl("");
      await refresh();
    } catch {
      setError("Submit failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className={`collect-ui${embedded ? " collect-ui-embedded" : ""}`}>
      {!embedded && (
        <div className="blinkit-collect-header">
          <span className="logo">blink<span>it</span></span>
          <span className="muted" style={{ fontWeight: 700 }}>Collect</span>
        </div>
      )}

      {!embedded && (
        <>
          <h1>Collect &amp; Normalize</h1>
          <p className="muted" style={{ marginBottom: "1.5rem" }}>
            Paste reviews → unified corpus in <code>data/discovery/</code>
          </p>
        </>
      )}

      <section className="card">
        <div className="grid grid-2">
          <div>
            <div className="stat">{status?.rawCount ?? "—"}</div>
            <div className="muted">
              collected / target {status?.targetMin}–{status?.targetIdeal}
            </div>
            <div className="progress">
              <span style={{ width: `${status?.progressPct ?? 0}%` }} />
            </div>
          </div>
          <div>
            <div className="stat">{status?.stats?.afterFilter ?? "—"}</div>
            <div className="muted">
              normalized · {status?.stats?.chunkCount ?? 0} chunks
            </div>
          </div>
        </div>
      </section>

      <section className="card">
        <h2 style={{ fontSize: "1rem", marginBottom: "0.5rem" }}>Keywords</h2>
        <div className="keywords">
          {(status?.config.keywords ?? []).map((k) => (
            <button
              key={k}
              type="button"
              className={`keyword ${keywords.includes(k) ? "active" : ""}`}
              onClick={() =>
                setKeywords((p) =>
                  p.includes(k) ? p.filter((x) => x !== k) : [...p, k]
                )
              }
            >
              {k}
            </button>
          ))}
        </div>
      </section>

      <section className="card">
        <form onSubmit={submit}>
          <label>Source</label>
          <select value={source} onChange={(e) => setSource(e.target.value)}>
            {SOURCES.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
          <label>Segment</label>
          <select value={segment} onChange={(e) => setSegment(e.target.value)}>
            {(status?.config.segmentHints ?? ["weekly_essentials_buyer"]).map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <label>Review text</label>
          <textarea
            required
            minLength={8}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste App Store, Play Store, Reddit, forum, or social feedback..."
          />
          <button className="btn" type="submit" disabled={busy}>
            {busy ? "Saving..." : "Save & normalize"}
          </button>
        </form>
        {message && <div className="message">{message}</div>}
        {error && <div className="message error">{error}</div>}
      </section>

      <section className="card">
        <h2 style={{ fontSize: "1rem", marginBottom: "0.5rem" }}>Recent</h2>
        <ul className="recent">
          {(status?.recent ?? []).map((r) => (
            <li key={r.id}>
              <strong>{r.source}</strong> · {r.text.slice(0, 120)}
              {r.text.length > 120 ? "…" : ""}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
