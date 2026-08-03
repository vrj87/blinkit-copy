import { prisma } from "@/lib/db";
import { OpsDashboardShowcase } from "@/components/OpsDashboardShowcase";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [users, nudges, orderCount] = await Promise.all([
    prisma.user.findMany({ orderBy: { orderCount: "desc" } }),
    prisma.nudge.findMany({
      orderBy: { createdAt: "desc" },
      include: { user: true },
      take: 10,
    }),
    prisma.order.count(),
  ]);

  return (
    <main className="container container-wide">
      <h1 className="ops-page-title">Ops Dashboard</h1>
      <p className="ops-page-lead">Category expansion funnel and nudge outcomes</p>
      <OpsDashboardShowcase
        users={users}
        nudges={nudges}
        orderCount={orderCount}
        linkMode="demo"
      />
    </main>
  );
}
