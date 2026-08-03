import { PrismaClient } from "@prisma/client";
import { syncAllUserOrderCounts } from "../lib/user-order-sync";

const prisma = new PrismaClient();

async function main() {
  const synced = await syncAllUserOrderCounts();
  console.log(`Synced order counts for ${synced} user(s)`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
