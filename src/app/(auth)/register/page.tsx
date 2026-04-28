"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Button, Card, Input, Label } from "@/components/ui";
import { registerAction, type RegisterState } from "./actions";

export default function RegisterPage() {
  const [state, action, pending] = useActionState<RegisterState, FormData>(
    registerAction,
    undefined,
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Create account</h1>
        <p className="mt-1.5 text-sm text-text-dim">
          Sign up to request GPU access for your project.
        </p>
      </div>

      <Card className="p-6">
        <form action={action} className="space-y-4">
          <div>
            <Label htmlFor="name">Full name</Label>
            <Input id="name" name="name" required autoComplete="name" placeholder="Jane Doe" />
          </div>
          <div>
            <Label htmlFor="email">University email</Label>
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
            <Label htmlFor="studentId" hint="optional">
              Student ID
            </Label>
            <Input id="studentId" name="studentId" placeholder="ST-0000" />
          </div>
          <div>
            <Label htmlFor="password" hint="6+ characters">
              Password
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              minLength={6}
              autoComplete="new-password"
              placeholder="••••••••"
            />
          </div>

          {state?.error && (
            <div className="text-sm text-red bg-red/5 border border-red/30 rounded-md px-3 py-2">
              {state.error}
            </div>
          )}

          <Button type="submit" disabled={pending} className="w-full">
            {pending ? "Creating account…" : "Create account"}
          </Button>
        </form>
      </Card>

      <p className="text-sm text-center text-text-dim">
        Already have an account?{" "}
        <Link href="/login" className="text-text hover:text-accent transition-colors">
          Sign in
        </Link>
      </p>
    </div>
  );
}
