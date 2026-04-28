"use client";

import { useActionState, useTransition } from "react";
import { Button, Card, Input, Label } from "@/components/ui";
import { createServerAction, toggleServerAction, type ServerState } from "./actions";

export function NewServerForm() {
  const [state, action, pending] = useActionState<ServerState, FormData>(
    createServerAction,
    undefined,
  );

  return (
    <form
      action={action}
      className="grid gap-4 sm:grid-cols-3"
      key={state?.error ? "err" : "fresh"}
    >
      <div>
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" required placeholder="PC4" />
      </div>
      <div>
        <Label htmlFor="ipAddress">IP address</Label>
        <Input id="ipAddress" name="ipAddress" required placeholder="100.64.0.4" />
      </div>
      <div>
        <Label htmlFor="description" hint="optional">
          Description
        </Label>
        <Input id="description" name="description" placeholder="GPU Server 4" />
      </div>
      <div className="sm:col-span-3 flex items-center gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? "Adding…" : "Add node"}
        </Button>
        {state?.error && (
          <span className="text-sm text-red">{state.error}</span>
        )}
      </div>
    </form>
  );
}

type ServerItem = {
  id: string;
  name: string;
  ipAddress: string;
  description: string | null;
  isActive: boolean;
};

export function ServersList({ servers }: { servers: ServerItem[] }) {
  if (servers.length === 0) {
    return (
      <Card className="p-8 text-center text-sm text-text-mute">No nodes registered.</Card>
    );
  }
  return (
    <div className="space-y-3">
      {servers.map((s) => (
        <ServerRow key={s.id} server={s} />
      ))}
    </div>
  );
}

function ServerRow({ server }: { server: ServerItem }) {
  const [pending, startTransition] = useTransition();
  return (
    <Card className="p-5 flex items-center justify-between gap-4 flex-wrap">
      <div className="flex items-center gap-4">
        <span
          className={`h-2.5 w-2.5 rounded-full ${
            server.isActive ? "bg-green" : "bg-text-mute"
          }`}
        />
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-sm font-medium">{server.name}</span>
            <code className="text-xs font-mono text-text-dim">{server.ipAddress}</code>
            {!server.isActive && (
              <span className="text-xs text-text-mute">disabled</span>
            )}
          </div>
          {server.description && (
            <p className="text-xs text-text-dim mt-0.5">{server.description}</p>
          )}
        </div>
      </div>
      <Button
        variant="secondary"
        size="sm"
        disabled={pending}
        onClick={() =>
          startTransition(async () => {
            await toggleServerAction(server.id);
          })
        }
      >
        {pending ? "…" : server.isActive ? "Disable" : "Enable"}
      </Button>
    </Card>
  );
}
