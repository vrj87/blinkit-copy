export interface ApiRouteDoc {
  method: string;
  path: string;
  description: string;
  auth?: "webhook" | "public";
  phase: "discovery" | "mvp" | "ops";
  example?: Record<string, unknown>;
  /** Omit from GET /api catalog and any in-app API listings */
  hideFromUi?: boolean;
}

const base = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export function getApiCatalog(): { baseUrl: string; routes: ApiRouteDoc[] } {
  const routes: ApiRouteDoc[] = [
      {
        method: "GET",
        path: "/api",
        description: "API index — lists all endpoints (this document)",
        auth: "public",
        phase: "ops",
      },
      {
        method: "GET",
        path: "/api/health",
        description: "Health check — database, discovery data, LLM config",
        auth: "public",
        phase: "ops",
      },
      {
        method: "GET",
        path: "/api/discovery",
        description: "Discovery pipeline output — stats, themes, validation",
        auth: "public",
        phase: "discovery",
      },
      {
        method: "GET",
        path: "/api/discovery/status",
        description: "Lightweight discovery ingest status (raw review count)",
        auth: "public",
        phase: "discovery",
      },
      {
        method: "POST",
        path: "/api/discovery/reviews",
        description: "Ingest reviews from collect UI or external scrapers",
        auth: "webhook",
        phase: "discovery",
        example: {
          reviews: [
            {
              source: "web_ui",
              text: "I only reorder the same groceries every week",
              rating: 3,
            },
          ],
          normalize: true,
        },
      },
      {
        method: "POST",
        path: "/api/discovery/normalize",
        description: "Re-run normalize + dedup pipeline on raw reviews",
        auth: "webhook",
        phase: "discovery",
      },
      {
        method: "GET",
        path: "/api/research/questions",
        description: "Part 1 research Q&A with themes and evidence quotes",
        auth: "public",
        phase: "discovery",
      },
      {
        method: "GET",
        path: "/api/problem-definition",
        description: "Part 3 problem frame — segment, root cause, validation matrix",
        auth: "public",
        phase: "discovery",
      },
      {
        method: "GET",
        path: "/api/users",
        description: "List demo users with segment eligibility",
        auth: "public",
        phase: "mvp",
      },
      {
        method: "GET",
        path: "/api/users/:id",
        description: "User profile with orders and nudges",
        auth: "public",
        phase: "mvp",
      },
      {
        method: "GET",
        path: "/api/orders",
        description: "List orders (optional ?userId= filter)",
        auth: "public",
        phase: "mvp",
      },
      {
        method: "POST",
        path: "/api/orders",
        description: "Place order from catalog or basket → DB → Groq LLM nudge",
        auth: "public",
        phase: "mvp",
        example: {
          userId: "user-atharv",
          lineItems: [{ productId: "groc-milk", quantity: 2 }],
        },
      },
      {
        method: "GET",
        path: "/api/products",
        description: "Blinkit product catalog (?category=all|Groceries|…)",
        auth: "public",
        phase: "mvp",
      },
      {
        method: "GET",
        path: "/api/nudges",
        description: "List nudges (optional ?userId= & ?status= filters)",
        auth: "public",
        phase: "mvp",
      },
      {
        method: "GET",
        path: "/api/ai/status",
        description: "LLM config — Groq/OpenAI model and readiness",
        auth: "public",
        phase: "mvp",
        hideFromUi: true,
      },
      {
        method: "POST",
        path: "/api/ai/recommend",
        description: "Generate AI category recommendation (Groq LLM + discovery RAG)",
        auth: "public",
        phase: "mvp",
        hideFromUi: true,
        example: { userId: "user-atharv", forceNew: true },
      },
      {
        method: "POST",
        path: "/api/nudges/generate",
        description: "Generate category nudge for eligible user (LLM)",
        auth: "webhook",
        phase: "mvp",
        example: { userId: "user-atharv", forceNew: true },
      },
      {
        method: "POST",
        path: "/api/nudges/:id/feedback",
        description: "Record accept / dismiss / snooze on a nudge",
        auth: "public",
        phase: "mvp",
        example: { status: "accepted" },
      },
      {
        method: "POST",
        path: "/api/events/order",
        description: "Post-order webhook — creates order + optional nudge (n8n)",
        auth: "webhook",
        phase: "mvp",
        hideFromUi: true,
        example: {
          userId: "user-atharv",
          items: ["Amul Milk 1L", "Britannia Bread"],
          categories: ["Groceries"],
          totalAmount: 189,
        },
      },
      {
        method: "GET",
        path: "/api/workflows/discovery-refresh",
        description: "12h scrape workflow status and last refresh report",
        auth: "public",
        phase: "discovery",
      },
      {
        method: "POST",
        path: "/api/workflows/discovery-refresh",
        description: "Webhook — receive completion report from scheduled scrape runner",
        auth: "webhook",
        phase: "discovery",
      },
      {
        method: "POST",
        path: "/api/workflows/scan-users",
        description: "Batch scan all users and create nudges (n8n daily job)",
        auth: "webhook",
        phase: "mvp",
      },
      {
        method: "GET",
        path: "/api/workflows",
        description: "n8n workflow contracts and webhook entry points",
        auth: "public",
        phase: "ops",
      },
      {
        method: "GET",
        path: "/api/dashboard",
        description: "Ops dashboard stats — funnel, recent nudges, themes",
        auth: "public",
        phase: "ops",
      },
    ];

  return {
    baseUrl: base,
    routes: routes.filter((route) => !route.hideFromUi),
  };
}
