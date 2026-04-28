import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import bcrypt from "bcryptjs";

const url = process.env.DATABASE_URL ?? "file:./prisma/dev.db";
const filename = url.replace(/^file:/, "");
const adapter = new PrismaBetterSqlite3({ url: filename });
const prisma = new PrismaClient({ adapter });

async function main() {
  const email = "test.student@uni.local";
  const password = "test123";

  let user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    user = await prisma.user.create({
      data: {
        name: "Test Student",
        email,
        passwordHash: await bcrypt.hash(password, 10),
        role: "STUDENT",
        studentId: "ST-001",
      },
    });
    console.log(`Created test student: ${email} / ${password}`);
  }

  const existing = await prisma.request.findFirst({
    where: { userId: user.id, status: "PENDING" },
  });
  if (!existing) {
    const req = await prisma.request.create({
      data: {
        userId: user.id,
        purpose:
          "Diplom ishi: YOLOv8 modelini fruit detection vazifasiga moslashtirish. Dataset 30K rasm, transfer learning, taxminan 2 hafta GPU kerak.",
        durationDays: 14,
        status: "PENDING",
      },
    });
    console.log(`Created pending request: ${req.id}`);
  } else {
    console.log(`Existing pending request: ${existing.id}`);
  }

  const pending = await prisma.request.count({ where: { status: "PENDING" } });
  const allUsers = await prisma.user.count();
  const servers = await prisma.server.count();

  console.log(`\nDB state:`);
  console.log(`  Users: ${allUsers}`);
  console.log(`  Servers: ${servers}`);
  console.log(`  Pending requests: ${pending}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
