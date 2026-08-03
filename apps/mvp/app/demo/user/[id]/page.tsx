import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { DemoUserClient } from "@/components/DemoUserClient";
import { getDemoProfile } from "@/lib/demo-users";
import { syncUserOrderCount } from "@/lib/user-order-sync";

export const dynamic = "force-dynamic";

export default async function DemoUserPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const exists = await prisma.user.findUnique({ where: { id }, select: { id: true } });
  if (!exists) notFound();

  await syncUserOrderCount(id);
  const syncedUser = await prisma.user.findUnique({
    where: { id },
    include: {
      orders: { orderBy: { createdAt: "desc" }, take: 12 },
      nudges: { orderBy: { createdAt: "desc" }, take: 10 },
    },
  });

  if (!syncedUser) notFound();

  const profile = getDemoProfile(syncedUser.id);

  return (
    <DemoUserClient
      user={{
        ...syncedUser,
        personaLabel: profile?.personaLabel,
        addressTitle: profile?.addressTitle,
        addressSub: profile?.addressSub,
        orders: syncedUser.orders.map((o) => ({
          ...o,
          createdAt: o.createdAt.toISOString(),
        })),
      }}
    />
  );
}
