import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Button, Card, EmptyState, PageHeader, StatusBadge } from "@/components/ui";

export default async function DashboardHome() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const requests = await prisma.request.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: { grant: { include: { server: true } } },
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="My requests"
        description={`${requests.length} ${requests.length === 1 ? "request" : "requests"} on file`}
        action={
          <Link href="/dashboard/new-request">
            <Button>New request</Button>
          </Link>
        }
      />

      {requests.length === 0 ? (
        <EmptyState
          title="No requests yet"
          description="You haven't submitted a GPU access request. Create your first one to get started."
          action={
            <Link href="/dashboard/new-request">
              <Button>Submit a request</Button>
            </Link>
          }
        />
      ) : (
        <div className="space-y-3">
          {requests.map((r) => (
            <Card key={r.id} className="p-5 animate-fade-in">
              <div className="flex items-start justify-between gap-4 mb-3 flex-wrap">
                <div className="flex items-center gap-3 flex-wrap">
                  <StatusBadge status={r.status} />
                  <span className="text-xs text-text-mute">
                    {new Date(r.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                  <span className="text-text-mute">·</span>
                  <span className="text-xs text-text-mute">{r.durationDays} days</span>
                </div>
              </div>

              <p className="text-sm text-text whitespace-pre-wrap break-words leading-relaxed">
                {r.purpose}
              </p>

              {r.status === "REJECTED" && r.rejectionReason && (
                <div className="mt-4 rounded-md bg-red/5 border border-red/20 px-3.5 py-2.5">
                  <div className="text-xs text-red font-medium mb-1">Rejected</div>
                  <div className="text-sm text-text-dim">{r.rejectionReason}</div>
                </div>
              )}

              {r.status === "APPROVED" && r.grant && (
                <div className="mt-5 rounded-md border border-border bg-bg p-4 space-y-3">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="text-sm font-medium">Access credentials</div>
                    <div className="text-xs text-text-mute">
                      Expires{" "}
                      {new Date(r.grant.expiresAt).toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                    <Field label="Node" value={r.grant.server.name} />
                    <Field label="IP" value={r.grant.server.ipAddress} />
                    <Field label="Username" value={r.grant.sshUsername} />
                    <Field label="Password" value={r.grant.sshPassword} mono />
                  </div>
                  <div className="rounded-md bg-bg-2 border border-border px-3 py-2 font-mono text-xs text-text-dim overflow-x-auto">
                    <span className="text-text-mute">$ </span>
                    ssh {r.grant.sshUsername}@{r.grant.server.ipAddress}
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function Field({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3 py-1">
      <span className="text-xs text-text-mute">{label}</span>
      <span className={`text-sm break-all ${mono ? "font-mono" : ""}`}>{value}</span>
    </div>
  );
}
