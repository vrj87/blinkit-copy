import { PrismaClient } from "@prisma/client";
import { readFileSync } from "fs";
import { themesPath } from "@blinkit/discovery-core";
import { DEMO_NUDGE_SEEDERS, type DemoNudgeSeed } from "../lib/demo-nudges";
import { DEMO_USER_PROFILES } from "../lib/demo-users";
import { generateNudge } from "../lib/llm";
import { parseJsonArray } from "../lib/segment";
import { syncAllUserOrderCounts } from "../lib/user-order-sync";

const prisma = new PrismaClient();

/** Generate a fresh Groq nudge for each demo user */
const LLM_NUDGE_USER_IDS = ["user-atharv", "user-raju", "user-sandy"];

async function main() {
  const forceSeed = process.env.FORCE_DB_SEED === "true";
  const existingUsers = await prisma.user.count();

  if (existingUsers > 0 && !forceSeed) {
    console.log(
      `Seed skipped: database already has ${existingUsers} user(s). Set FORCE_DB_SEED=true to wipe and re-seed.`
    );
    return;
  }

  if (forceSeed) {
    console.log("FORCE_DB_SEED=true — wiping tables before seed");
    await prisma.nudge.deleteMany();
    await prisma.order.deleteMany();
    await prisma.user.deleteMany();
    await prisma.theme.deleteMany();
  }

  let themes: { themes: { id: string; label: string; summary: string; confidence: string; quotes: unknown[] }[] } = { themes: [] };
  try {
    themes = JSON.parse(readFileSync(themesPath(), "utf-8"));
  } catch {
    console.warn("themes.json not found, skipping theme seed");
  }

  for (const t of themes.themes) {
    await prisma.theme.create({
      data: {
        id: t.id,
        label: t.label,
        summary: t.summary,
        confidence: t.confidence,
        quotes: JSON.stringify(t.quotes),
      },
    });
  }

  let orderTotal = 0;
  let nudgeTotal = 0;

  for (const profile of DEMO_USER_PROFILES) {
    const user = await prisma.user.create({
      data: {
        id: profile.id,
        name: profile.name,
        email: profile.email,
        segmentTags: JSON.stringify(profile.segmentTags),
        categoriesPurchased: JSON.stringify(profile.categoriesPurchased),
        orderCount: profile.orders.length,
        lastOrderAt: profile.orders[profile.orders.length - 1]?.createdAt,
      },
    });

    for (const o of profile.orders) {
      await prisma.order.create({
        data: {
          userId: user.id,
          items: JSON.stringify(o.items),
          categories: JSON.stringify(o.categories),
          totalAmount: o.totalAmount,
          createdAt: o.createdAt,
        },
      });
      orderTotal++;
    }

    const seedNudges = DEMO_NUDGE_SEEDERS[profile.id];
    if (seedNudges) {
      nudgeTotal += await seedNudgesForUser(user.id, seedNudges());
    }
  }

  const amit = await prisma.user.create({
    data: {
      id: "user-amit",
      name: "Amit Patel",
      email: "amit@example.com",
      segmentTags: JSON.stringify(["weekly_essentials_buyer"]),
      categoriesPurchased: JSON.stringify(["Household Essentials"]),
      orderCount: 5,
      lastOrderAt: new Date("2025-12-05"),
    },
  });

  for (const o of [
    {
      items: ["Surf Excel 2kg", "Vim Dishwash", "Tissue Box"],
      categories: ["Household Essentials"],
      totalAmount: 420,
      createdAt: new Date("2025-11-20"),
    },
    {
      items: ["Harpic", "Floor Cleaner", "Garbage Bags"],
      categories: ["Household Essentials"],
      totalAmount: 356,
      createdAt: new Date("2025-12-05"),
    },
  ]) {
    await prisma.order.create({
      data: {
        userId: amit.id,
        items: JSON.stringify(o.items),
        categories: JSON.stringify(o.categories),
        totalAmount: o.totalAmount,
        createdAt: o.createdAt,
      },
    });
    orderTotal++;
  }

  nudgeTotal += await seedNudgesForUser(amit.id, DEMO_NUDGE_SEEDERS["user-amit"]());

  await prisma.user.create({
    data: {
      id: "user-neha",
      name: "Neha Gupta",
      email: "neha@example.com",
      segmentTags: JSON.stringify(["explorer"]),
      categoriesPurchased: JSON.stringify(["Groceries", "Personal Care", "Snacks & Beverages"]),
      orderCount: 8,
      lastOrderAt: new Date("2025-12-10"),
    },
  });

  console.log("\n=== Generating LLM pending nudges (Groq) ===\n");
  const llmCount = await seedLlmPendingNudges();
  nudgeTotal += llmCount;

  await syncAllUserOrderCounts();

  const userCount = DEMO_USER_PROFILES.length + 2;
  console.log(`\nSeed complete: ${userCount} users, ${orderTotal} orders, ${nudgeTotal} nudges (${llmCount} fresh LLM), themes loaded`);
}

async function seedLlmPendingNudges() {
  if (process.env.SKIP_LLM_SEED === "true") {
    console.log("SKIP_LLM_SEED=true — skipping Groq nudge generation");
    return 0;
  }
  if (!process.env.GROQ_API_KEY && !process.env.OPENAI_API_KEY) {
    console.warn("No GROQ_API_KEY or OPENAI_API_KEY — skipping LLM nudge seed");
    return 0;
  }

  let created = 0;

  for (const userId of LLM_NUDGE_USER_IDS) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        orders: { orderBy: { createdAt: "desc" }, take: 5 },
        nudges: true,
      },
    });

    if (!user) {
      console.warn(`Skip LLM nudge — user ${userId} not found`);
      continue;
    }

    const categories = parseJsonArray<string>(user.categoriesPurchased);

    const recentItems = user.orders.flatMap((o) => parseJsonArray<string>(o.items));

    try {
      const { output, meta } = await generateNudge({
        userName: user.name,
        categoriesPurchased: categories,
        recentItems,
        orderCount: user.orderCount,
      });

      await prisma.nudge.create({
        data: {
          userId: user.id,
          suggestedCategory: output.suggestedCategory,
          adjacentTo: JSON.stringify(output.adjacentTo),
          copy: output.copy,
          rationale: output.rationale,
          riskReducers: JSON.stringify(output.riskReducers),
          confidence: output.confidence,
          evidenceThemeIds: JSON.stringify(output.evidenceThemeIds),
          status: "pending",
          triggerType: "batch_scan",
          generationMeta: JSON.stringify(meta),
          createdAt: new Date(),
        },
      });

      created++;
      console.log(
        `  ✓ ${user.name}: ${output.suggestedCategory} [${meta.source}${meta.model ? ` · ${meta.model}` : ""} · ${meta.latencyMs}ms]`
      );
    } catch (err) {
      console.warn(`  ✗ LLM nudge failed for ${user.name}:`, err);
    }
  }

  return created;
}

async function seedNudgesForUser(userId: string, nudges: DemoNudgeSeed[]) {
  for (const n of nudges) {
    await prisma.nudge.create({
      data: {
        userId,
        suggestedCategory: n.suggestedCategory,
        adjacentTo: JSON.stringify(n.adjacentTo),
        copy: n.copy,
        rationale: n.rationale,
        riskReducers: JSON.stringify(n.riskReducers),
        confidence: n.confidence,
        evidenceThemeIds: JSON.stringify(n.evidenceThemeIds),
        status: n.status,
        triggerType: n.triggerType,
        createdAt: n.createdAt ?? new Date(),
        respondedAt: n.status !== "pending" ? n.createdAt ?? new Date() : undefined,
      },
    });
  }
  return nudges.length;
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
