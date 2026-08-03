import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { nudgeFeedbackSchema } from "@/lib/api/schemas";
import { jsonError } from "@/lib/api/response";
import { placeStarterPackOrder } from "@/lib/order-service";
import { serializeOrder } from "@/lib/serialize";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError("Invalid JSON body");
  }

  const parsed = nudgeFeedbackSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(parsed.error.issues.map((i) => i.message).join("; "));
  }

  const { status } = parsed.data;

  const nudge = await prisma.nudge.update({
    where: { id },
    data: {
      status,
      respondedAt: new Date(),
    },
  });

  if (status === "accepted") {
    const result = await placeStarterPackOrder(nudge.userId, nudge.suggestedCategory);
    if ("error" in result && result.status === 404) {
      return NextResponse.json({ error: result.error }, { status: 404 });
    }
    return NextResponse.json({
      nudge,
      order: serializeOrder(result.order),
      itemCount: result.itemCount,
      orderCount: result.orderCount,
    });
  }

  return NextResponse.json({ nudge, order: null, itemCount: 0 });
}
