"use server";

import { signIn } from "@/auth";
import { prisma } from "@/lib/prisma";
import { AuthError } from "next-auth";

export type LoginState = { error?: string } | undefined;

export async function loginAction(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Email and access key are required." };
  }

  const user = await prisma.user.findUnique({ where: { email } });
  const redirectTo = user?.role === "ADMIN" ? "/admin" : "/dashboard";

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo,
    });
  } catch (err) {
    if (err instanceof AuthError) {
      if (err.type === "CredentialsSignin") {
        return { error: "Authentication failed. Check email and access key." };
      }
      return { error: `Auth error: ${err.type}` };
    }
    throw err;
  }
}
