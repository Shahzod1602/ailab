import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { Nav } from "@/components/nav";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (session.user.role !== "ADMIN") redirect("/dashboard");

  return (
    <div className="flex flex-col flex-1">
      <Nav
        links={[
          { href: "/admin", label: "Pending" },
          { href: "/admin/requests", label: "All requests" },
          { href: "/admin/grants", label: "Active access" },
          { href: "/admin/servers", label: "Servers" },
        ]}
      />
      <main className="flex-1 max-w-5xl w-full mx-auto px-6 py-10">{children}</main>
    </div>
  );
}
