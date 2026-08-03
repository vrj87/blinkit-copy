import { readFileSync } from "fs";
import { join } from "path";
import { discoveryDataDir, themesPath, validationResultsPath } from "@blinkit/discovery-core";
import { prisma } from "@/lib/db";
import { collectAppUrl, collectIframeSrc, isLocalCollectHost, shouldEmbedCollectFrame } from "@/lib/collect-url";
import { ResearchQAShowcase } from "@/components/ResearchQAShowcase";
import { CollectPipelineShowcase } from "@/components/CollectPipelineShowcase";
import { CollectReviewPanel } from "@/components/CollectReviewPanel";
import { loadSurveyEvidence } from "@/lib/survey-evidence";
import { PlaygroundNav } from "@/components/PlaygroundNav";
import { ProblemDefinitionShowcase } from "@/components/ProblemDefinitionShowcase";
import { MvpLaunchHighlight } from "@/components/MvpLaunchHighlight";
import { OpsDashboardShowcase } from "@/components/OpsDashboardShowcase";

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

export default async function PlaygroundPage() {
  const discovery = loadDiscovery();
  const survey = loadSurveyEvidence();
  const collectUrl = collectAppUrl();
  const localCollect = isLocalCollectHost(collectUrl);
  const embedCollect = shouldEmbedCollectFrame(collectUrl);
  const collectLink = collectUrl.includes("/dashboard/discovery")
    ? "/dashboard/discovery"
    : collectUrl.includes("/collect")
      ? "/collect"
      : collectUrl;

  const [users, nudges, orderCount] = await Promise.all([
    prisma.user.findMany({ orderBy: { orderCount: "desc" } }),
    prisma.nudge.findMany({ include: { user: true }, orderBy: { createdAt: "desc" }, take: 8 }),
    prisma.order.count(),
  ]);

  return (
    <>
      <header className="hero playground-hero">
        <h1>Smart Category Explorer</h1>
        <p>
          Discover new categories with explained picks — powered by scraped insights and
          primary survey research.
        </p>
        <PlaygroundNav />
      </header>

      <main className="container container-wide playground-main">
        <section id="mvp" className="playground-section playground-mvp-section">
          <MvpLaunchHighlight />
        </section>

        {/* Overview */}
        <section id="overview" className="playground-section">
          <h2>Project overview</h2>
          <div className="grid grid-3">
            <div className="card stat-card">
              <div className="stat-value">{discovery?.stats.afterFilter ?? "—"}</div>
              <div className="stat-label">Scraped reviews</div>
            </div>
            <div className="card stat-card">
              <div className="stat-value">{survey?.meta.n ?? 40}</div>
              <div className="stat-label">Survey responses</div>
            </div>
            <div className="card stat-card">
              <div className="stat-value">{discovery?.themes.themes.length ?? "—"}</div>
              <div className="stat-label">Themes validated</div>
            </div>
          </div>
          <div className="card playground-steps">
            <h3>Recommended walkthrough</h3>
            <ol>
              <li>
                <strong>
                  <a href="/mvp" target="_blank" rel="noopener noreferrer">
                    Open the live MVP
                  </a>
                </strong>{" "}
                — shop, order, track delivery, get AI category pick
              </li>
              <li>
                <a href="#collect">Collect user feedback</a> — reviews and survey signals
              </li>
              <li>
                <a href="#discovery">Read research insights</a> — eight key questions answered
              </li>
              <li>
                <a href="#problem">Define the problem</a> — segment, root cause, and validation
              </li>
              <li>
                <a href="#ops">Check ops dashboard</a> — nudge funnel and outcomes
              </li>
            </ol>
          </div>
          <p style={{ marginTop: "1rem", fontSize: "0.875rem", color: "var(--muted)" }}>
            Survey:{" "}
            <a
              href="https://docs.google.com/forms/d/e/1FAIpQLScAJAfUjeyQm-bw0qCQdlk2LKf0RM0S5bhXcIFsdiLjgRHSAg/viewform"
              target="_blank"
              rel="noopener noreferrer"
            >
              Questionnaire
            </a>
            {" · "}
            <a
              href="https://docs.google.com/spreadsheets/d/1aGnzWyNH2nMwUDRZnC6xTcms9RwCW5R8gzDuA0Szmtw/edit"
              target="_blank"
              rel="noopener noreferrer"
            >
              Responses (n=40)
            </a>
          </p>
        </section>

        {/* Collect — gather feedback */}
        <section id="collect" className="playground-section">
          <h2>Review collection</h2>
          <p className="playground-lead">
            {localCollect
              ? "Paste reviews or upload CSV — the first step in understanding what Blinkit users need."
              : "Scraped reviews from app stores, forums, and social — normalized into themes for discovery."}
          </p>
          <p style={{ marginBottom: "1rem" }}>
            <a
              href={collectLink}
              target={localCollect ? "_blank" : undefined}
              rel={localCollect ? "noopener noreferrer" : undefined}
            >
              {localCollect ? "Open collect UI in new tab →" : "Open discovery workflow →"}
            </a>
          </p>
          <CollectPipelineShowcase />
          {embedCollect ? (
            <iframe
              title={localCollect ? "Collect UI" : "Discovery workflow"}
              src={collectIframeSrc(collectUrl)}
              className="playground-iframe"
              loading="lazy"
              style={{ marginTop: "1rem" }}
            />
          ) : (
            <div style={{ marginTop: "1rem" }}>
              <CollectReviewPanel embedded />
            </div>
          )}
        </section>

        {/* Research — discovery insights (detailed) */}
        <section id="discovery" className="playground-section">
          <h2>Research insights</h2>
          <p className="playground-lead">
            What we learned from reviews and our primary survey — eight questions about repeat
            buying and category exploration.{" "}
            <a href="/discovery/part1">Open full insights page →</a>
          </p>
          {discovery ? (
            <ResearchQAShowcase
              themes={discovery.themes.themes}
              survey={survey}
              scrapedTotal={discovery.stats.afterFilter}
              audience="reviewer"
            />
          ) : (
            <div className="card">
              <p>Research data is not available yet.</p>
            </div>
          )}
        </section>

        {/* Part 3 — problem definition */}
        <section id="problem" className="playground-section">
          <h2>Problem definition</h2>
          <p className="playground-lead">
            Who we serve, why category exploration stalls, and how primary research validated
            (or challenged) AI discovery.{" "}
            <a href="/discovery/part3">Open full problem page →</a>
          </p>
          <ProblemDefinitionShowcase embedded themes={discovery?.themes.themes} />
        </section>

        <section id="ops" className="playground-section">
          <h2>Ops dashboard</h2>
          <p className="playground-lead">
            Live funnel metrics from demo users, orders, and AI nudges.{" "}
            <a href="/dashboard">Open full ops page →</a>
          </p>
          <OpsDashboardShowcase
            users={users}
            nudges={nudges}
            orderCount={orderCount}
            linkMode="mvp"
          />
        </section>
      </main>
    </>
  );
}
