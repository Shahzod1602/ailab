import Link from "next/link";
import { auth, signOut } from "@/auth";

export async function Nav({
  links,
}: {
  links: { href: string; label: string }[];
  context?: "USER" | "ADMIN";
}) {
  const session = await auth();

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-bg/85 backdrop-blur-sm">
      <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between gap-6">
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="flex items-center gap-2 text-[15px] font-semibold tracking-tight"
          >
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-accent" />
            ai/lab
          </Link>
          <nav className="flex items-center gap-5 text-sm text-text-dim">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="hover:text-text transition-colors"
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <span className="hidden sm:inline text-text-mute">{session?.user?.email}</span>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/" });
            }}
          >
            <button
              type="submit"
              className="text-text-dim hover:text-text transition-colors"
            >
              Sign out
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
