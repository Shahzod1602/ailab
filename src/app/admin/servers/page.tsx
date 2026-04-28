import { prisma } from "@/lib/prisma";
import { Card, PageHeader } from "@/components/ui";
import { ServersList, NewServerForm } from "./client";

export default async function ServersPage() {
  const servers = await prisma.server.findMany({ orderBy: { name: "asc" } });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Servers"
        description={`${servers.length} ${servers.length === 1 ? "node" : "nodes"} registered`}
      />

      <Card className="p-6">
        <h2 className="text-sm font-medium mb-4">Add a new node</h2>
        <NewServerForm />
      </Card>

      <ServersList
        servers={servers.map((s) => ({
          id: s.id,
          name: s.name,
          ipAddress: s.ipAddress,
          description: s.description,
          isActive: s.isActive,
        }))}
      />
    </div>
  );
}
