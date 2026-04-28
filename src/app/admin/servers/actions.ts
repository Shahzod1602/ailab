"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const createSchema = z.object({
  name: z.string().min(1, "Name is required."),
  ipAddress: z.string().min(1, "IP address is required."),
  description: z.string().optional(),
});

export type ServerState = { error?: string } | undefined;

export async function createServerAction(
  _prev: ServerState,
  formData: FormData,
): Promise<ServerState> {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return { error: "Unauthorized." };

  const parsed = createSchema.safeParse({
    name: formData.get("name"),
    ipAddress: formData.get("ipAddress"),
    description: formData.get("description") || undefined,
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input." };

  const exists = await prisma.server.findUnique({ where: { name: parsed.data.name } });
  if (exists) return { error: "A node with this name already exists." };

  await prisma.server.create({ data: parsed.data });
  revalidatePath("/admin/servers");
  return { error: undefined };
}

export async function toggleServerAction(serverId: string) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return;

  const s = await prisma.server.findUnique({ where: { id: serverId } });
  if (!s) return;

  await prisma.server.update({
    where: { id: serverId },
    data: { isActive: !s.isActive },
  });
  revalidatePath("/admin/servers");
}
