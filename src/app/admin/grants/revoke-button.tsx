"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui";
import { revokeGrantAction } from "../requests/[id]/actions";

export function RevokeButton({ grantId }: { grantId: string }) {
  const [pending, startTransition] = useTransition();
  return (
    <Button
      variant="danger"
      size="sm"
      disabled={pending}
      onClick={() => {
        if (!confirm("Revoke this access grant?")) return;
        startTransition(async () => {
          await revokeGrantAction(grantId);
        });
      }}
    >
      {pending ? "Revoking…" : "Revoke"}
    </Button>
  );
}
