import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Card, EmptyState, PageHeader, StatusBadge } from "@/components/ui";

export default async function AllRequests() {
  const all = await prisma.request.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: true, grant: { include: { server: true } } },
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="All requests"
        description={`${all.length} total`}
      />

      {all.length === 0 ? (
        <EmptyState title="No requests yet" />
      ) : (
        <div className="space-y-2">
          {all.map((r) => (
            <Link key={r.id} href={`/admin/requests/${r.id}`} className="block">
              <Card className="p-4 hover:border-border-2 transition-colors animate-fade-in">
                <div className="flex items-center gap-3 mb-1.5 flex-wrap">
                  <StatusBadge status={r.status} />
                  <span className="text-sm font-medium">{r.user.name}</span>
                  <span className="text-xs text-text-mute">{r.user.email}</span>
                  {r.grant && (
                    <span className="text-xs text-text-mute">→ {r.grant.server.name}</span>
                  )}
                  <span className="ml-auto text-xs text-text-mute">
                    {new Date(r.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <p className="text-sm text-text-dim line-clamp-2">{r.purpose}</p>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
