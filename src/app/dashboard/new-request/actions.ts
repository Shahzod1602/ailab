"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  purpose: z.string().min(20, "Project brief must be at least 20 characters."),
  durationDays: z.coerce.number().int().min(1).max(90),
});

export type RequestState = { error?: string } | undefined;

export async function submitRequestAction(
  _prev: RequestState,
  formData: FormData,
): Promise<RequestState> {
  const session = await auth();
  if (!session?.user?.id) return { error: "Session expired. Sign in again." };

  const parsed = schema.safeParse({
    purpose: formData.get("purpose"),
    durationDays: formData.get("durationDays"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  await prisma.request.create({
    data: {
      userId: session.user.id,
      purpose: parsed.data.purpose,
      durationDays: parsed.data.durationDays,
      status: "PENDING",
    },
  });

  revalidatePath("/dashboard");
  redirect("/dashboard");
}
