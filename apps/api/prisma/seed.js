const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("demo1234", 10);
  const user = await prisma.user.upsert({
    where: { email: "demo@teamhub.com" },
    update: {},
    create: {
      email: "demo@teamhub.com",
      passwordHash,
      name: "Demo User"
    }
  });

  const workspace = await prisma.workspace.create({
    data: {
      name: "FredoCloud Demo",
      description: "Seeded workspace",
      memberships: {
        create: { userId: user.id, role: "ADMIN" }
      }
    }
  });

  await prisma.goal.create({
    data: {
      workspaceId: workspace.id,
      ownerId: user.id,
      title: "Launch Team Hub",
      status: "in_progress"
    }
  });

  console.log("Seed complete.");
}

main().finally(() => prisma.$disconnect());
