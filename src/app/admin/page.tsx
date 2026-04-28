import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Button, Card, EmptyState, PageHeader, StatusBadge } from "@/components/ui";

export default async function AdminHome() {
  const [pending, totals, activeGrants] = await Promise.all([
    prisma.request.findMany({
      where: { status: "PENDING" },
      orderBy: { createdAt: "asc" },
      include: { user: true },
    }),
    prisma.request.groupBy({ by: ["status"], _count: true }),
    prisma.accessGrant.count({ where: { revokedAt: null } }),
  ]);

  const counts = Object.fromEntries(totals.map((t) => [t.status, t._count]));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Pending requests"
        description={`${pending.length} ${pending.length === 1 ? "request" : "requests"} awaiting review`}
      />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Stat label="Pending" value={pending.length} />
        <Stat label="Approved" value={counts.APPROVED ?? 0} accent="text-green" />
        <Stat label="Rejected" value={counts.REJECTED ?? 0} accent="text-red" />
        <Stat label="Active access" value={activeGrants} accent="text-accent" />
      </div>

      {pending.length === 0 ? (
        <EmptyState
          title="Inbox zero"
          description="No pending requests right now. New ones will appear here."
        />
      ) : (
        <div className="space-y-3">
          {pending.map((r) => (
            <Card key={r.id} className="p-5 animate-fade-in">
              <div className="flex items-start justify-between gap-4 mb-3 flex-wrap">
                <div className="flex items-center gap-3 flex-wrap">
                  <StatusBadge status={r.status} />
                  <span className="text-sm font-medium">{r.user.name}</span>
                  <span className="text-xs text-text-mute">{r.user.email}</span>
                </div>
                <div className="text-xs text-text-mute">
                  {new Date(r.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}{" "}
                  · {r.durationDays} days
                </div>
              </div>

              <p className="text-sm text-text-dim line-clamp-3 leading-relaxed">{r.purpose}</p>

              <div className="mt-4 flex justify-end">
                <Link href={`/admin/requests/${r.id}`}>
                  <Button size="sm">Review</Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function Stat({
  label,
  value,
  accent = "text-text",
}: {
  label: string;
  value: number;
  accent?: string;
}) {
  return (
    <Card className="p-4">
      <div className="text-xs text-text-mute mb-1">{label}</div>
      <div className={`text-2xl font-semibold ${accent}`}>{value}</div>
    </Card>
  );
}
