import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Card, StatusBadge } from "@/components/ui";
import { ReviewForms } from "./review-forms";

export default async function ReviewRequestPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const request = await prisma.request.findUnique({
    where: { id },
    include: {
      user: true,
      grant: { include: { server: true } },
      reviewer: true,
    },
  });
  if (!request) notFound();

  const servers = await prisma.server.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-6 max-w-3xl">
      <Link
        href="/admin"
        className="inline-flex items-center gap-1.5 text-sm text-text-dim hover:text-text transition-colors"
      >
        <span>←</span> Back to pending
      </Link>

      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Request review</h1>
        <p className="mt-1.5 text-sm text-text-dim">Approve or reject this access request.</p>
      </div>

      <Card className="p-6 space-y-5">
        <div className="flex items-center gap-3 flex-wrap">
          <StatusBadge status={request.status} />
          <span className="text-xs text-text-mute">
            {new Date(request.createdAt).toLocaleString("en-US", {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-1">
          <div>
            <div className="text-xs text-text-mute mb-1.5">Requestor</div>
            <div className="text-sm font-medium">{request.user.name}</div>
            <div className="text-sm text-text-dim">{request.user.email}</div>
            {request.user.studentId && (
              <div className="text-xs text-text-mute mt-1">ID: {request.user.studentId}</div>
            )}
          </div>
          <div>
            <div className="text-xs text-text-mute mb-1.5">Requested duration</div>
            <div className="text-sm">{request.durationDays} days</div>
          </div>
        </div>

        <div>
          <div className="text-xs text-text-mute mb-1.5">Project description</div>
          <p className="text-sm whitespace-pre-wrap break-words leading-relaxed">
            {request.purpose}
          </p>
        </div>
      </Card>

      {request.status === "PENDING" && (
        <ReviewForms
          requestId={request.id}
          defaultDuration={request.durationDays}
          servers={servers.map((s) => ({ id: s.id, name: s.name, ipAddress: s.ipAddress }))}
        />
      )}

      {request.status === "APPROVED" && request.grant && (
        <Card className="p-6">
          <div className="text-sm font-medium mb-4 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-green" />
            Approved
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <Field label="Node" value={request.grant.server.name} />
            <Field label="IP" value={request.grant.server.ipAddress} />
            <Field label="Username" value={request.grant.sshUsername} mono />
            <Field label="Password" value={request.grant.sshPassword} mono />
            <Field
              label="Expires"
              value={new Date(request.grant.expiresAt).toLocaleString("en-US", {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            />
            {request.reviewer && <Field label="Approved by" value={request.reviewer.name} />}
          </div>
        </Card>
      )}

      {request.status === "REJECTED" && (
        <Card className="p-6">
          <div className="text-sm font-medium mb-3 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-red" />
            Rejected
          </div>
          <p className="text-sm whitespace-pre-wrap leading-relaxed">{request.rejectionReason}</p>
          {request.reviewer && (
            <div className="text-xs text-text-mute mt-3">By {request.reviewer.name}</div>
          )}
        </Card>
      )}
    </div>
  );
}

function Field({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3 py-1.5 border-b border-border last:border-b-0">
      <span className="text-xs text-text-mute">{label}</span>
      <span className={`text-sm break-all text-right ${mono ? "font-mono" : ""}`}>{value}</span>
    </div>
  );
}
