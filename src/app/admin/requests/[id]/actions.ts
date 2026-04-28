"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { sendEmail, approvalEmail, rejectionEmail } from "@/lib/email";

const approveSchema = z.object({
  requestId: z.string().min(1),
  serverId: z.string().min(1),
  sshUsername: z.string().min(1, "SSH username is required."),
  sshPassword: z.string().min(1, "SSH access key is required."),
  durationDays: z.coerce.number().int().min(1).max(365),
});

const rejectSchema = z.object({
  requestId: z.string().min(1),
  reason: z.string().min(3, "Provide a denial reason."),
});

export type ActionState = { error?: string; ok?: boolean } | undefined;

export async function approveRequestAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return { error: "Unauthorized." };

  const parsed = approveSchema.safeParse({
    requestId: formData.get("requestId"),
    serverId: formData.get("serverId"),
    sshUsername: formData.get("sshUsername"),
    sshPassword: formData.get("sshPassword"),
    durationDays: formData.get("durationDays"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input." };

  const request = await prisma.request.findUnique({
    where: { id: parsed.data.requestId },
    include: { user: true },
  });
  if (!request) return { error: "Request not found." };
  if (request.status !== "PENDING") return { error: "Request already reviewed." };

  const server = await prisma.server.findUnique({ where: { id: parsed.data.serverId } });
  if (!server) return { error: "Node not found." };

  const expiresAt = new Date(Date.now() + parsed.data.durationDays * 24 * 60 * 60 * 1000);

  await prisma.$transaction([
    prisma.request.update({
      where: { id: request.id },
      data: {
        status: "APPROVED",
        reviewerId: session.user.id,
        reviewedAt: new Date(),
      },
    }),
    prisma.accessGrant.create({
      data: {
        requestId: request.id,
        serverId: server.id,
        sshUsername: parsed.data.sshUsername,
        sshPassword: parsed.data.sshPassword,
        expiresAt,
      },
    }),
  ]);

  const { html, text } = approvalEmail({
    studentName: request.user.name,
    serverName: server.name,
    serverIp: server.ipAddress,
    sshUsername: parsed.data.sshUsername,
    sshPassword: parsed.data.sshPassword,
    expiresAt,
  });
  await sendEmail({
    to: request.user.email,
    subject: "AI:LAB — Access authorized",
    html,
    text,
  });

  revalidatePath("/admin");
  revalidatePath("/admin/requests");
  redirect("/admin");
}

export async function rejectRequestAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return { error: "Unauthorized." };

  const parsed = rejectSchema.safeParse({
    requestId: formData.get("requestId"),
    reason: formData.get("reason"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input." };

  const request = await prisma.request.findUnique({
    where: { id: parsed.data.requestId },
    include: { user: true },
  });
  if (!request) return { error: "Request not found." };
  if (request.status !== "PENDING") return { error: "Request already reviewed." };

  await prisma.request.update({
    where: { id: request.id },
    data: {
      status: "REJECTED",
      reviewerId: session.user.id,
      reviewedAt: new Date(),
      rejectionReason: parsed.data.reason,
    },
  });

  const { html, text } = rejectionEmail({
    studentName: request.user.name,
    reason: parsed.data.reason,
  });
  await sendEmail({
    to: request.user.email,
    subject: "AI:LAB — Access denied",
    html,
    text,
  });

  revalidatePath("/admin");
  revalidatePath("/admin/requests");
  redirect("/admin");
}

export async function revokeGrantAction(grantId: string) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return;

  await prisma.accessGrant.update({
    where: { id: grantId },
    data: { revokedAt: new Date() },
  });
  revalidatePath("/admin/grants");
}
