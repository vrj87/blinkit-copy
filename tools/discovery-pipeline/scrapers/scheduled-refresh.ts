/**
 * Scheduled discovery refresh: scrape → analyze themes → validate → record last run.
 *
 * Usage:
 *   npm run discovery:refresh -w discovery-pipeline
 *   npm run discovery:refresh -- --notify   (POST summary to MVP API)
 *
 * Schedule: every 12 hours via n8n, GitHub Actions, or Task Scheduler.
 */
import { execSync } from "child_process";
import { readFileSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { discoveryDataDir, themesPath, validationResultsPath } from "@blinkit/discovery-core";
import { runScrape } from "./run-scrape.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const pipelineRoot = join(__dirname, "..");

export interface DiscoveryRefreshReport {
  completedAt: string;
  schedule: "12h";
  runner: "discovery-pipeline";
  steps: string[];
  scrape: Awaited<ReturnType<typeof runScrape>>;
  themes: number;
  validationPassed: number;
  validationTotal: number;
}

async function notifyMvp(report: DiscoveryRefreshReport) {
  const base = process.env.MVP_APP_URL ?? process.env.NEXT_PUBLIC_APP_URL;
  if (!base) {
    console.warn("Skipping notify — set MVP_APP_URL or NEXT_PUBLIC_APP_URL");
    return;
  }

  const secret = process.env.N8N_WEBHOOK_SECRET ?? "";
  const res = await fetch(`${base.replace(/\/$/, "")}/api/workflows/discovery-refresh`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(secret ? { "x-webhook-secret": secret } : {}),
    },
    body: JSON.stringify(report),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`MVP notify failed (${res.status}): ${text}`);
  }
  console.log("Notified MVP:", await res.json());
}

export async function runDiscoveryRefresh(options: {
  fresh?: boolean;
  notify?: boolean;
}): Promise<DiscoveryRefreshReport> {
  const scrape = await runScrape({ fresh: options.fresh });

  console.log("\n=== Analyzing themes ===\n");
  execSync("npm run pipeline:analyze", { cwd: pipelineRoot, stdio: "inherit" });

  console.log("\n=== Validating insights ===\n");
  execSync("npm run pipeline:validate", { cwd: pipelineRoot, stdio: "inherit" });

  const themesFile = JSON.parse(readFileSync(themesPath(), "utf-8")) as { themes: unknown[] };
  const validationFile = JSON.parse(readFileSync(validationResultsPath(), "utf-8")) as {
    passed: number;
    totalThemes: number;
  };

  const report: DiscoveryRefreshReport = {
    completedAt: new Date().toISOString(),
    schedule: "12h",
    runner: "discovery-pipeline",
    steps: [
      "scrape (7 sources + merge)",
      "normalize",
      "pipeline:analyze",
      "pipeline:validate",
    ],
    scrape,
    themes: themesFile.themes.length,
    validationPassed: validationFile.passed,
    validationTotal: validationFile.totalThemes,
  };

  writeFileSync(
    join(discoveryDataDir(), "last-refresh.json"),
    JSON.stringify(report, null, 2),
    "utf-8"
  );

  console.log("\n=== Refresh complete ===");
  console.log(JSON.stringify(report, null, 2));

  if (options.notify) {
    await notifyMvp(report);
  }

  return report;
}

async function main() {
  const fresh = process.argv.includes("--fresh");
  const notify = process.argv.includes("--notify");
  await runDiscoveryRefresh({ fresh, notify });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
