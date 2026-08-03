import Link from "next/link";
import { getDiscoveryStatus, loadLastRefresh } from "@/lib/discovery-service";

const PIPELINE_STEPS = [
  {
    step: "1",
    title: "Collect & scrape",
    desc: "7 automated sources + manual paste via Collect UI",
    output: "raw-reviews.json",
  },
  {
    step: "2",
    title: "Normalize & dedupe",
    desc: "Hash dedupe, min word filter, chunk for analysis",
    output: "pipeline-stats.json",
  },
  {
    step: "3",
    title: "Theme extract",
    desc: "Rule-based theme mapping to research questions",
    output: "themes.json",
  },
  {
    step: "4",
    title: "Validate",
    desc: "Quote linkage, multi-source, actionable checks",
    output: "validation-results.json",
  },
  {
    step: "5",
    title: "Consume",
    desc: "MVP APIs, playground, Groq RAG in AI nudges",
    output: "GET /api/discovery",
  },
];

function formatWhen(iso: string | undefined): string {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return iso;
  }
}

export function DiscoveryWorkflowShowcase() {
  const status = getDiscoveryStatus();
  const lastRefresh = loadLastRefresh();
  const completedAt =
    typeof lastRefresh?.completedAt === "string" ? lastRefresh.completedAt : undefined;

  return (
    <section className="discovery-workflow-showcase card">
      <div className="discovery-workflow-header">
        <div>
          <h2>Discovery scrape workflow</h2>
          <p className="discovery-workflow-lead">
            Scheduled every <strong>12 hours</strong> via GitHub Actions or n8n. Manual reviews
            merge through the embedded Collect UI — no separate :3001 server required.
          </p>
        </div>
        <div className="discovery-workflow-schedule">
          <span className="discovery-workflow-schedule-pill">⏱ Every 12h</span>
          <span className="discovery-workflow-schedule-pill">📁 data/discovery/</span>
        </div>
      </div>

      <div className="grid grid-4 discovery-workflow-stats">
        <div className="stat-card">
          <div className="stat-value">{status.rawCount}</div>
          <div className="stat-label">Raw reviews</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{status.afterFilter ?? "—"}</div>
          <div className="stat-label">After normalize</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{status.themesAvailable ? "✓" : "—"}</div>
          <div className="stat-label">Themes</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{formatWhen(completedAt)}</div>
          <div className="stat-label">Last refresh</div>
        </div>
      </div>

      <ol className="discovery-workflow-steps">
        {PIPELINE_STEPS.map((s) => (
          <li key={s.step} className="discovery-workflow-step">
            <span className="discovery-workflow-num">{s.step}</span>
            <div>
              <strong>{s.title}</strong>
              <span className="discovery-workflow-output">{s.output}</span>
              <p>{s.desc}</p>
            </div>
          </li>
        ))}
      </ol>

      {lastRefresh && (
        <details className="qa-details discovery-workflow-last-run">
          <summary>Last automated run</summary>
          <pre className="discovery-workflow-pre">
            {JSON.stringify(lastRefresh, null, 2)}
          </pre>
        </details>
      )}

      <div className="discovery-workflow-actions">
        <h3>Run locally</h3>
        <code className="discovery-workflow-cmd">npm run discovery:refresh</code>
        <code className="discovery-workflow-cmd">npm run discovery:refresh -- --notify</code>
        <code className="discovery-workflow-cmd">npm run discovery:scrape</code>
        <p className="discovery-workflow-hint">
          Status API: <code>GET /api/workflows/discovery-refresh</code> · Collect UI:{" "}
          <Link href="/collect">/collect</Link> · Playground:{" "}
          <Link href="/playground#collect">Review collection</Link>
        </p>
      </div>
    </section>
  );
}
