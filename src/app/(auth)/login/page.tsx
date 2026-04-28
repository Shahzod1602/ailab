"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Button, Card, Input, Label } from "@/components/ui";
import { loginAction, type LoginState } from "./actions";

export default function LoginPage() {
  const [state, action, pending] = useActionState<LoginState, FormData>(
    loginAction,
    undefined,
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Sign in</h1>
        <p className="mt-1.5 text-sm text-text-dim">
          Welcome back. Enter your credentials to continue.
        </p>
      </div>

      <Card className="p-6">
        <form action={action} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="you@university.edu"
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              placeholder="••••••••"
            />
          </div>

          {state?.error && (
            <div className="text-sm text-red bg-red/5 border border-red/30 rounded-md px-3 py-2">
              {state.error}
            </div>
          )}

          <Button type="submit" disabled={pending} className="w-full">
            {pending ? "Signing in…" : "Sign in"}
          </Button>
        </form>
      </Card>

      <p className="text-sm text-center text-text-dim">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="text-text hover:text-accent transition-colors">
          Create one
        </Link>
      </p>
    </div>
  );
}
