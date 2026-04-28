import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import bcrypt from "bcryptjs";

const url = process.env.DATABASE_URL ?? "file:./prisma/dev.db";
const filename = url.replace(/^file:/, "");
const adapter = new PrismaBetterSqlite3({ url: filename });
const prisma = new PrismaClient({ adapter });

async function main() {
  const adminEmail = "admin@ailab.local";
  const adminPassword = "admin123";

  const existing = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (!existing) {
    const passwordHash = await bcrypt.hash(adminPassword, 10);
    await prisma.user.create({
      data: {
        name: "Admin",
        email: adminEmail,
        passwordHash,
        role: "ADMIN",
      },
    });
    console.log(`Created admin: ${adminEmail} / ${adminPassword}`);
  } else {
    console.log("Admin already exists, skipping");
  }

  const servers = [
    { name: "PC1", ipAddress: "100.64.0.1", description: "GPU Server 1" },
    { name: "PC2", ipAddress: "100.64.0.2", description: "GPU Server 2" },
    { name: "PC3", ipAddress: "100.64.0.3", description: "GPU Server 3" },
  ];

  for (const s of servers) {
    await prisma.server.upsert({
      where: { name: s.name },
      update: {},
      create: s,
    });
  }
  console.log("Seeded 3 servers (PC1, PC2, PC3)");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
