"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Button, Card, Input, Label, PageHeader, Textarea } from "@/components/ui";
import { submitRequestAction, type RequestState } from "./actions";

export default function NewRequestPage() {
  const [state, action, pending] = useActionState<RequestState, FormData>(
    submitRequestAction,
    undefined,
  );

  return (
    <div className="space-y-6 max-w-2xl">
      <PageHeader
        title="New request"
        description="Describe your project. An admin will review and respond by email."
      />

      <Card className="p-6">
        <form action={action} className="space-y-5">
          <div>
            <Label htmlFor="purpose" hint="20+ characters">
              Project description
            </Label>
            <Textarea
              id="purpose"
              name="purpose"
              required
              rows={7}
              placeholder="e.g. Thesis project — fine-tuning YOLOv8 on a custom 30K-image fruit dataset. Transfer learning, ~2 weeks of GPU time."
            />
          </div>

          <div>
            <Label htmlFor="durationDays" hint="1–90 days">
              Duration
            </Label>
            <Input
              id="durationDays"
              name="durationDays"
              type="number"
              required
              min={1}
              max={90}
              defaultValue={7}
            />
          </div>

          {state?.error && (
            <div className="text-sm text-red bg-red/5 border border-red/30 rounded-md px-3 py-2">
              {state.error}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <Button type="submit" disabled={pending}>
              {pending ? "Submitting…" : "Submit request"}
            </Button>
            <Link href="/dashboard">
              <Button variant="secondary" type="button">
                Cancel
              </Button>
            </Link>
          </div>
        </form>
      </Card>

      <div className="rounded-md border border-border bg-bg-2 px-4 py-3 text-sm text-text-dim leading-relaxed">
        <span className="font-medium text-text">First time?</span> Read the{" "}
        <Link href="/guide" className="text-text underline hover:text-accent">
          getting started guide
        </Link>{" "}
        first — it covers Tailscale, Docker, and what to write in a good brief.
      </div>
    </div>
  );
}
