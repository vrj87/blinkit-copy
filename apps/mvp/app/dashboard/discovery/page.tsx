import Link from "next/link";
import { readFileSync } from "fs";
import { join } from "path";
import { discoveryDataDir, themesPath, validationResultsPath } from "@blinkit/discovery-core";
import { DiscoveryWorkflowShowcase } from "@/components/DiscoveryWorkflowShowcase";
import { ResearchQAShowcase } from "@/components/ResearchQAShowcase";
import { loadSurveyEvidence } from "@/lib/survey-evidence";

export const dynamic = "force-dynamic";

function loadDiscovery() {
  try {
    const dataDir = discoveryDataDir();
    const themes = JSON.parse(readFileSync(themesPath(), "utf-8"));
    const stats = JSON.parse(readFileSync(join(dataDir, "pipeline-stats.json"), "utf-8"));
    const validation = JSON.parse(readFileSync(validationResultsPath(), "utf-8"));
    return { themes, stats, validation };
  } catch {
    return null;
  }
}

export default function DiscoveryDashboardPage() {
  const data = loadDiscovery();
  const survey = loadSurveyEvidence();

  return (
    <main className="container container-wide">
      <p>
        <Link href="/playground">← Playground</Link> · <Link href="/dashboard">Ops Dashboard</Link>
      </p>
      <h1 style={{ margin: "1rem 0" }}>Discovery Engine</h1>
      <p style={{ color: "var(--muted)", marginBottom: "1.5rem" }}>
        Scrape workflow + primary survey (n=40) ·{" "}
        <Link href="/discovery/part1">Full research insights →</Link> ·{" "}
        <Link href="/collect">Collect UI →</Link>
      </p>

      <DiscoveryWorkflowShowcase />

      {!data ? (
        <div className="card">
          <p>Discovery data not found. Run: <code>npm run discovery:refresh</code></p>
        </div>
      ) : (
        <>
          <div className="grid grid-3" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
            <div className="card stat-card">
              <div className="stat-value">{data.stats.afterFilter}</div>
              <div className="stat-label">Scraped reviews</div>
            </div>
            <div className="card stat-card">
              <div className="stat-value">{survey?.meta.n ?? 40}</div>
              <div className="stat-label">Survey responses</div>
            </div>
            <div className="card stat-card">
              <div className="stat-value">{data.themes.themes.length}</div>
              <div className="stat-label">Themes extracted</div>
            </div>
            <div className="card stat-card">
              <div className="stat-value">
                {data.validation.passed}/{data.validation.totalThemes}
              </div>
              <div className="stat-label">Validation passed</div>
            </div>
          </div>

          <ResearchQAShowcase
            themes={data.themes.themes}
            survey={survey}
            scrapedTotal={data.stats.afterFilter}
          />

          <details className="qa-details">
            <summary>All themes (raw analysis)</summary>
            <div style={{ marginTop: "1rem" }}>
              {data.themes.themes.map(
                (theme: {
                  id: string;
                  label: string;
                  summary: string;
                  researchQuestion: string;
                  confidence: string;
                  frequency: number;
                  quotes: { text: string; source: string }[];
                }) => (
                  <div key={theme.id} className="card">
                    <span className="badge badge-pending">{theme.confidence}</span>
                    <span className="risk-tag" style={{ marginLeft: "0.5rem" }}>
                      {theme.frequency} mentions
                    </span>
                    <strong style={{ marginLeft: "0.5rem" }}>{theme.label}</strong>
                    <p style={{ fontSize: "0.85rem", color: "var(--muted)", margin: "0.25rem 0" }}>
                      Maps to: {theme.researchQuestion}
                    </p>
                    <p style={{ margin: "0.5rem 0" }}>{theme.summary}</p>
                    {theme.quotes[0] && (
                      <blockquote className="qa-quote">
                        &ldquo;{theme.quotes[0].text.slice(0, 180)}…&rdquo;
                        <footer>— {theme.quotes[0].source}</footer>
                      </blockquote>
                    )}
                  </div>
                )
              )}
            </div>
          </details>

          <details className="qa-details">
            <summary>Pipeline &amp; hypotheses</summary>
            <div className="card" style={{ marginTop: "1rem" }}>
              <h3>Pipeline flow</h3>
              <p style={{ marginTop: "0.5rem" }}>
                Scrape (7 sources) → Normalize → Dedupe → Chunk → Theme Extract → Validate
              </p>
              <p style={{ marginTop: "0.5rem", fontSize: "0.875rem", color: "var(--muted)" }}>
                Sources:{" "}
                {Object.entries(data.stats.sourceBreakdown as Record<string, number>)
                  .map(([k, v]) => `${k} ${v}`)
                  .join(" · ")}
              </p>
            </div>
            <div className="card stat-card">
              <h3>Hypotheses for Phase 2 interviews</h3>
              <ol style={{ paddingLeft: "1.25rem", marginTop: "0.5rem" }}>
                {data.themes.hypotheses.map((h: string, i: number) => (
                  <li key={i} style={{ marginBottom: "0.5rem" }}>
                    {h}
                  </li>
                ))}
              </ol>
            </div>
          </details>
        </>
      )}
    </main>
  );
}
