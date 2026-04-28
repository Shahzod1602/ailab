import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { Nav } from "@/components/nav";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (session.user.role === "ADMIN") redirect("/admin");

  return (
    <div className="flex flex-col flex-1">
      <Nav
        links={[
          { href: "/dashboard", label: "Requests" },
          { href: "/dashboard/new-request", label: "New request" },
          { href: "/guide", label: "Guide" },
        ]}
      />
      <main className="flex-1 max-w-5xl w-full mx-auto px-6 py-10">{children}</main>
    </div>
  );
}
