import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import bcrypt from "bcryptjs";

async function main() {
  const url = process.env.DATABASE_URL ?? "file:./prisma/dev.db";
  const adapter = new PrismaBetterSqlite3({ url: url.replace(/^file:/, "") });
  const prisma = new PrismaClient({ adapter });
  const u = await prisma.user.findUnique({ where: { email: "admin@ailab.local" } });
  if (!u) {
    console.log("ADMIN NOT FOUND");
    return;
  }
  console.log("Admin:", { id: u.id, email: u.email, role: u.role });
  console.log("Password 'admin123' valid?", await bcrypt.compare("admin123", u.passwordHash));
  await prisma.$disconnect();
}
main().catch((e) => { console.error(e); process.exit(1); });
