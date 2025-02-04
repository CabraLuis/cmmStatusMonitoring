import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
async function main() {
  const priority = await prisma.priority.createMany({
    data: [
      { id: 1, priority: "Alta" },
      { id: 2, priority: "Media" },
      { id: 3, priority: "Baja" },
    ],
  });
  const status = await prisma.status.createMany({
    data: [
      { id: 1, status: "Standby" },
      { id: 2, status: "Midiendo" },
      { id: 3, status: "Terminado" },
    ],
  });
  console.log({ priority, status });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
