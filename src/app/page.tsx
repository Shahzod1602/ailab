import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";

export default async function Home() {
  const session = await auth();
  if (session?.user) {
    redirect(session.user.role === "ADMIN" ? "/admin" : "/dashboard");
  }

  return (
    <div className="flex flex-col flex-1">
      <header className="border-b border-border">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-accent" />
            ai/lab
          </Link>
          <div className="flex items-center gap-4 text-sm">
            <Link href="/guide" className="text-text-dim hover:text-text transition-colors">
              Guide
            </Link>
            <Link href="/login" className="text-text-dim hover:text-text transition-colors">
              Sign in
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center h-9 px-3.5 rounded-md bg-text text-bg text-sm font-medium hover:bg-white transition-colors"
            >
              Get access
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="max-w-5xl mx-auto px-6 pt-24 pb-20">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 mb-6 text-xs text-text-mute font-mono">
              <span className="h-1.5 w-1.5 rounded-full bg-green animate-pulse-soft" />
              <span>3 nodes online</span>
            </div>
            <h1 className="text-5xl sm:text-6xl font-semibold tracking-tight leading-[1.05]">
              Remote GPU access<br />
              <span className="text-text-dim">for the AI lab.</span>
            </h1>
            <p className="mt-6 text-lg text-text-dim leading-relaxed max-w-xl">
              Submit a project brief, get reviewed, and receive SSH credentials by email.
              No queues. No paperwork. Just compute.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/register"
                className="inline-flex items-center h-11 px-5 rounded-md bg-text text-bg text-sm font-medium hover:bg-white transition-colors"
              >
                Create account
              </Link>
              <Link
                href="/guide"
                className="inline-flex items-center h-11 px-5 rounded-md border border-border-2 text-text text-sm font-medium hover:bg-surface hover:border-text-mute transition-colors"
              >
                Read the guide
              </Link>
            </div>
          </div>
        </section>

        <section className="max-w-5xl mx-auto px-6 pb-24">
          <div className="grid grid-cols-1 sm:grid-cols-3 border-t border-border">
            {[
              {
                num: "01",
                title: "Register",
                body: "Sign up with your university email. Students only.",
              },
              {
                num: "02",
                title: "Submit a brief",
                body: "Describe the project, the workload, and the time you need.",
              },
              {
                num: "03",
                title: "Get credentials",
                body: "On approval, SSH credentials and the node IP arrive by email.",
              },
            ].map((s, i) => (
              <div
                key={s.num}
                className={`p-8 ${
                  i > 0 ? "sm:border-l border-border" : ""
                }`}
              >
                <div className="text-xs font-mono text-text-mute mb-3">{s.num}</div>
                <h3 className="text-base font-medium mb-2">{s.title}</h3>
                <p className="text-sm text-text-dim leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="max-w-5xl mx-auto px-6 pb-24">
          <div className="rounded-lg border border-border bg-bg-2 p-6 sm:p-8">
            <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
              <div>
                <div className="text-xs font-mono text-text-mute mb-2">Cluster status</div>
                <h3 className="text-lg font-semibold">3 GPU nodes available</h3>
              </div>
              <div className="text-xs text-text-mute font-mono">updated · just now</div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {["pc-01", "pc-02", "pc-03"].map((name) => (
                <div
                  key={name}
                  className="rounded-md border border-border bg-bg p-4 flex items-center justify-between"
                >
                  <div>
                    <div className="text-sm font-mono">{name}</div>
                    <div className="text-xs text-text-mute mt-0.5">standby</div>
                  </div>
                  <span className="h-2 w-2 rounded-full bg-green" />
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between text-xs text-text-mute font-mono">
          <span>university ai lab · internal network</span>
          <span>v1.0.0</span>
        </div>
      </footer>
    </div>
  );
}
