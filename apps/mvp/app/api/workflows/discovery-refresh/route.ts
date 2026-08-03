import { NextRequest, NextResponse } from "next/server";
import { unauthorizedResponse, verifyWebhook } from "@/lib/api/auth";
import {
  getDiscoveryStatus,
  loadLastRefresh,
  saveLastRefresh,
} from "@/lib/discovery-service";

export async function GET() {
  return NextResponse.json({
    schedule: "every 12 hours",
    lastRefresh: loadLastRefresh(),
    status: getDiscoveryStatus(),
    runner: "npm run discovery:refresh -- --notify",
    collect: {
      ui: "/collect",
      api: "/api/collect/reviews",
      webhookIngest: "/api/discovery/reviews",
    },
    workflows: [
      "workflows/twelve-hour-scrape.json",
      ".github/workflows/discovery-scrape.yml",
      "scripts/scheduled-discovery-refresh.sh",
    ],
    redeployNote:
      "After GHA commits data/discovery/, redeploy MVP so serverless bundles pick up new JSON.",
  });
}

export async function POST(request: NextRequest) {
  if (!verifyWebhook(request)) return unauthorizedResponse();

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (body && typeof body === "object") {
    const report = body as Record<string, unknown>;
    if (!report.completedAt) {
      report.completedAt = new Date().toISOString();
    }
    saveLastRefresh(report);
  }

  return NextResponse.json({
    received: true,
    recordedAt: new Date().toISOString(),
    report: body,
    currentStatus: getDiscoveryStatus(),
    message:
      "Discovery refresh recorded. Redeploy MVP after data/discovery/ commits on hosted deploys.",
  });
}
