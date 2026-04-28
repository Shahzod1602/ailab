"use client";

import { useActionState, useState } from "react";
import { Button, Card, Input, Label, Select, Textarea } from "@/components/ui";
import {
  approveRequestAction,
  rejectRequestAction,
  type ActionState,
} from "./actions";

function genPassword() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";
  let p = "";
  for (let i = 0; i < 14; i++) {
    p += chars[Math.floor(Math.random() * chars.length)];
  }
  return p;
}

export function ReviewForms({
  requestId,
  defaultDuration,
  servers,
}: {
  requestId: string;
  defaultDuration: number;
  servers: { id: string; name: string; ipAddress: string }[];
}) {
  const [tab, setTab] = useState<"approve" | "reject">("approve");
  const [password, setPassword] = useState(genPassword());

  const [approveState, approveAction, approvePending] = useActionState<ActionState, FormData>(
    approveRequestAction,
    undefined,
  );
  const [rejectState, rejectAction, rejectPending] = useActionState<ActionState, FormData>(
    rejectRequestAction,
    undefined,
  );

  return (
    <Card className="overflow-hidden">
      <div className="flex border-b border-border">
        <button
          type="button"
          onClick={() => setTab("approve")}
          className={`flex-1 px-5 py-3 text-sm font-medium border-b-2 -mb-px transition-colors ${
            tab === "approve"
              ? "border-accent text-text"
              : "border-transparent text-text-dim hover:text-text"
          }`}
        >
          Approve
        </button>
        <button
          type="button"
          onClick={() => setTab("reject")}
          className={`flex-1 px-5 py-3 text-sm font-medium border-b-2 -mb-px transition-colors ${
            tab === "reject"
              ? "border-red text-text"
              : "border-transparent text-text-dim hover:text-text"
          }`}
        >
          Reject
        </button>
      </div>

      <div className="p-6">
        {tab === "approve" ? (
          <form action={approveAction} className="space-y-4">
            <input type="hidden" name="requestId" value={requestId} />

            <div>
              <Label htmlFor="serverId">Target node</Label>
              <Select id="serverId" name="serverId" required defaultValue="">
                <option value="" disabled>
                  Select a node
                </option>
                {servers.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} · {s.ipAddress}
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <Label htmlFor="sshUsername">SSH username</Label>
              <Input
                id="sshUsername"
                name="sshUsername"
                required
                placeholder="e.g. student01"
                autoComplete="off"
              />
            </div>

            <div>
              <Label htmlFor="sshPassword">SSH password</Label>
              <div className="flex gap-2">
                <Input
                  id="sshPassword"
                  name="sshPassword"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="off"
                  className="font-mono"
                />
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setPassword(genPassword())}
                >
                  Regenerate
                </Button>
              </div>
            </div>

            <div>
              <Label htmlFor="durationDays" hint="1–365 days">
                Access duration
              </Label>
              <Input
                id="durationDays"
                name="durationDays"
                type="number"
                min={1}
                max={365}
                defaultValue={defaultDuration}
                required
              />
            </div>

            {approveState?.error && (
              <div className="text-sm text-red bg-red/5 border border-red/30 rounded-md px-3 py-2">
                {approveState.error}
              </div>
            )}

            <div className="pt-2 space-y-3">
              <Button type="submit" disabled={approvePending}>
                {approvePending ? "Approving…" : "Approve & send email"}
              </Button>
              <p className="text-xs text-text-mute leading-relaxed">
                Create the Linux user on the node first (<code className="font-mono text-text-dim">useradd</code>),
                then enter credentials here. The requestor will receive an email with these details.
              </p>
            </div>
          </form>
        ) : (
          <form action={rejectAction} className="space-y-4">
            <input type="hidden" name="requestId" value={requestId} />

            <div>
              <Label htmlFor="reason">Rejection reason</Label>
              <Textarea
                id="reason"
                name="reason"
                required
                rows={5}
                placeholder="Visible to the requestor — be clear and constructive."
              />
            </div>

            {rejectState?.error && (
              <div className="text-sm text-red bg-red/5 border border-red/30 rounded-md px-3 py-2">
                {rejectState.error}
              </div>
            )}

            <Button type="submit" variant="danger" disabled={rejectPending}>
              {rejectPending ? "Sending…" : "Reject request"}
            </Button>
          </form>
        )}
      </div>
    </Card>
  );
}
