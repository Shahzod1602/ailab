import { prisma } from "@/lib/prisma";
import { Card, EmptyState, PageHeader } from "@/components/ui";
import { RevokeButton } from "./revoke-button";

export default async function GrantsPage() {
  const grants = await prisma.accessGrant.findMany({
    where: { revokedAt: null },
    orderBy: { createdAt: "desc" },
    include: {
      server: true,
      request: { include: { user: true } },
    },
  });

  const now = Date.now();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Active access"
        description={`${grants.length} ${grants.length === 1 ? "grant" : "grants"} currently active`}
      />

      {grants.length === 0 ? (
        <EmptyState title="No active access" description="No SSH credentials are currently issued." />
      ) : (
        <div className="space-y-3">
          {grants.map((g) => {
            const expired = new Date(g.expiresAt).getTime() < now;
            return (
              <Card key={g.id} className="p-5 animate-fade-in">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="text-sm font-medium">{g.request.user.name}</span>
                      <span className="text-xs text-text-mute">{g.request.user.email}</span>
                      {expired && (
                        <span className="inline-flex items-center gap-1.5 rounded-md border border-red/40 bg-red/5 px-2 py-0.5 text-xs text-red">
                          <span className="h-1.5 w-1.5 rounded-full bg-red" />
                          Expired
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-text-dim flex flex-wrap gap-x-4 gap-y-1">
                      <span>
                        Node: <span className="font-mono text-text">{g.server.name}</span>
                      </span>
                      <span>
                        IP: <span className="font-mono text-text">{g.server.ipAddress}</span>
                      </span>
                      <span>
                        User: <span className="font-mono text-text">{g.sshUsername}</span>
                      </span>
                    </div>
                    <div className="text-xs text-text-mute">
                      Expires{" "}
                      {new Date(g.expiresAt).toLocaleString("en-US", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </div>
                  </div>
                  <RevokeButton grantId={g.id} />
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
