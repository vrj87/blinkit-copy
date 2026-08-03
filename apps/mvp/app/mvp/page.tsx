import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { Part4MvpShowcase } from "@/components/Part4MvpShowcase";
import { getDemoProfile, PRIMARY_DEMO_USER_IDS } from "@/lib/demo-users";
import { syncAllUserOrderCounts } from "@/lib/user-order-sync";

export const dynamic = "force-dynamic";

export default async function MvpPage() {
  await syncAllUserOrderCounts();

  const demoUserRows = await Promise.all(
    PRIMARY_DEMO_USER_IDS.map((id) =>
      prisma.user.findUnique({
        where: { id },
        include: {
          orders: { orderBy: { createdAt: "desc" }, take: 12 },
          nudges: { orderBy: { createdAt: "desc" }, take: 10 },
        },
      })
    )
  );

  const demoUsers = demoUserRows.filter((u): u is NonNullable<typeof u> => u !== null);
  if (demoUsers.length === 0) notFound();

  return (
    <main className="container container-wide mvp-page">
      <Part4MvpShowcase
        users={demoUsers.map((user) => {
          const profile = getDemoProfile(user.id);
          return {
            id: user.id,
            name: user.name,
            orderCount: user.orderCount,
            categoriesPurchased: user.categoriesPurchased,
            personaLabel: profile?.personaLabel ?? "P1 Restocker",
            addressTitle: profile?.addressTitle ?? "Home · Bengaluru",
            addressSub: profile?.addressSub ?? "Delivery in 10 minutes",
            orders: user.orders.map((o) => ({
              ...o,
              createdAt: o.createdAt.toISOString(),
            })),
            nudges: user.nudges,
          };
        })}
      />
    </main>
  );
}
