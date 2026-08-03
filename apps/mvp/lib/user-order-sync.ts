import { prisma } from "@/lib/db";

/** Reconcile User.orderCount with actual Order rows for one user. */
export async function syncUserOrderCount(userId: string): Promise<number> {
  const orderCount = await prisma.order.count({ where: { userId } });
  await prisma.user.update({
    where: { id: userId },
    data: { orderCount },
  });
  return orderCount;
}

/** Reconcile order counts for every user (seed repair, admin sync). */
export async function syncAllUserOrderCounts(): Promise<number> {
  const users = await prisma.user.findMany({ select: { id: true } });
  let synced = 0;
  for (const user of users) {
    await syncUserOrderCount(user.id);
    synced++;
  }
  return synced;
}
