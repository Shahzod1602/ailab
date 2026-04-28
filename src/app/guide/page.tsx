import Link from "next/link";
import { Card } from "@/components/ui";

export const metadata = {
  title: "Guide — AI Lab",
  description: "How to request and use GPU access at the AI Lab.",
};

export default function GuidePage() {
  return (
    <div className="flex flex-col flex-1">
      <header className="border-b border-border">
        <div className="max-w-3xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-accent" />
            ai/lab
          </Link>
          <nav className="flex items-center gap-4 text-sm text-text-dim">
            <Link href="/login" className="hover:text-text">Sign in</Link>
            <Link
              href="/register"
              className="inline-flex items-center h-9 px-3.5 rounded-md bg-text text-bg font-medium hover:bg-white transition-colors"
            >
              Get access
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-3xl w-full mx-auto px-6 py-12 space-y-10">
        <header>
          <div className="text-xs font-mono text-text-mute mb-3">
            Guide · ~5 min read
          </div>
          <h1 className="text-4xl font-semibold tracking-tight">Getting started</h1>
          <p className="mt-3 text-text-dim leading-relaxed">
            Everything you need to request, connect to, and use a GPU node in the AI Lab.
            Read this once before you submit your first request.
          </p>
        </header>

        <Section
          number="00"
          title="Before you start"
          subtitle="What you need to know and have on your machine."
        >
          <p className="text-text-dim leading-relaxed">
            This is a self-serve compute environment — there is no babysitting. You should be
            comfortable with the following before requesting access:
          </p>
          <ul className="space-y-2 text-text-dim">
            {[
              ["Linux & SSH", "You can navigate a remote shell, edit files with vim/nano, manage processes (top, htop, ps, kill), and read logs."],
              ["Docker", "You know what an image vs a container is, can write a Dockerfile or use a prebuilt one, and can mount volumes. Workloads run inside containers — no global pip installs."],
              ["Your ML framework", "You know how to run training/inference in PyTorch, TensorFlow, JAX, or whatever you brought."],
              ["Git", "Your code lives in a repo. You'll clone it on the node and push results back."],
            ].map(([title, body]) => (
              <li key={title} className="flex gap-3">
                <span className="text-accent mt-1.5">·</span>
                <div>
                  <span className="text-text font-medium">{title}.</span>{" "}
                  <span>{body}</span>
                </div>
              </li>
            ))}
          </ul>

          <Callout tone="amber" title="If any of these are unfamiliar">
            Don&apos;t request access yet — go learn the basics first. The lab admins won&apos;t
            tutor you on Linux or Docker. There are great free resources online; pick one and
            spend a weekend.
          </Callout>
        </Section>

        <Section
          number="01"
          title="Install Tailscale"
          subtitle="The GPU nodes are on a private network. You'll connect via Tailscale."
        >
          <p className="text-text-dim leading-relaxed">
            All three GPU nodes live behind Tailscale (private CGNAT IPs in the{" "}
            <Code>100.64.0.0/16</Code> range). You cannot reach them without Tailscale running
            on your machine.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <PlatformCard os="macOS" cmd="brew install tailscale" />
            <PlatformCard os="Linux" cmd="curl -fsSL https://tailscale.com/install.sh | sh" />
            <PlatformCard os="Windows" cmd="tailscale.com/download" link="https://tailscale.com/download" />
          </div>

          <p className="text-text-dim leading-relaxed">
            After installing, run <Code>tailscale up</Code> and sign in with the account the
            admin links to your email. Once you&apos;re on the tailnet, the node IPs in your
            approval email will be reachable directly.
          </p>

          <div className="rounded-md bg-bg-2 border border-border px-3.5 py-2.5 font-mono text-xs text-text-dim overflow-x-auto">
            <span className="text-text-mute">$ </span>tailscale ping 100.64.0.1
            <br />
            <span className="text-text-mute"># pong via direct in 12ms — you&apos;re connected.</span>
          </div>
        </Section>

        <Section
          number="02"
          title="Submit a request"
          subtitle="Tell the admin what you want to do and for how long."
        >
          <p className="text-text-dim leading-relaxed">
            <Link href="/register" className="text-text underline hover:text-accent">Create an account</Link>{" "}
            with your university email, then submit a request describing your project. Good
            briefs get approved faster — be specific:
          </p>

          <div className="rounded-md bg-bg-2 border border-border p-4 space-y-2 text-sm">
            <div className="text-xs text-text-mute mb-1">Example brief</div>
            <p className="text-text-dim leading-relaxed">
              <span className="text-text">Thesis project</span> — fine-tune YOLOv8 on a custom
              30K-image fruit detection dataset. PyTorch 2.4 + CUDA 12.1. Training fits on a
              single GPU. Estimated 2 weeks of compute, mostly overnight runs.
            </p>
          </div>

          <ul className="text-sm text-text-dim space-y-1.5">
            <li>· Mention framework + version (PyTorch, TF, JAX, …)</li>
            <li>· Mention dataset size + storage needs</li>
            <li>· Mention how long you actually need the node</li>
            <li>· Don&apos;t ask for &quot;always-on&quot; — request realistic windows</li>
          </ul>
        </Section>

        <Section
          number="03"
          title="Connect via SSH"
          subtitle="On approval, you'll receive an email with credentials."
        >
          <p className="text-text-dim leading-relaxed">
            The email contains your node, IP, username, password, and an expiry date. Connect
            from your terminal:
          </p>

          <div className="rounded-md bg-bg-2 border border-border px-3.5 py-2.5 font-mono text-xs text-text-dim overflow-x-auto">
            <span className="text-text-mute">$ </span>ssh student01@100.64.0.1
          </div>

          <p className="text-text-dim leading-relaxed text-sm">
            On first connection you&apos;ll be asked to verify the host fingerprint — type{" "}
            <Code>yes</Code>. Change your password immediately:
          </p>

          <div className="rounded-md bg-bg-2 border border-border px-3.5 py-2.5 font-mono text-xs text-text-dim overflow-x-auto">
            <span className="text-text-mute">$ </span>passwd
          </div>

          <Callout tone="cyan" title="Pro tip — set up SSH keys">
            After your first password login, copy your SSH public key over with{" "}
            <Code>ssh-copy-id</Code>. Way faster than typing a 14-char password every time.
          </Callout>
        </Section>

        <Section
          number="04"
          title="Run your workload (Docker)"
          subtitle="Containerize. The host stays clean. You stay sane."
        >
          <p className="text-text-dim leading-relaxed">
            Run everything inside Docker. The nodes have{" "}
            <Code>nvidia-container-toolkit</Code> installed, so you can pass GPUs into
            containers with <Code>--gpus all</Code>:
          </p>

          <div className="rounded-md bg-bg-2 border border-border px-3.5 py-3 font-mono text-xs text-text-dim overflow-x-auto whitespace-pre">
            <span className="text-text-mute"># interactive PyTorch shell with all GPUs</span>
            {"\n"}
            <span className="text-text-mute">$ </span>docker run --gpus all -it --rm \
            {"\n    "}-v $PWD:/workspace -w /workspace \
            {"\n    "}pytorch/pytorch:2.4.0-cuda12.1-cudnn9-runtime{"\n"}
            {"\n"}
            <span className="text-text-mute"># or run a script and exit</span>
            {"\n"}
            <span className="text-text-mute">$ </span>docker run --gpus all --rm \
            {"\n    "}-v $PWD:/workspace -w /workspace \
            {"\n    "}pytorch/pytorch:2.4.0-cuda12.1-cudnn9-runtime \
            {"\n    "}python train.py
          </div>

          <ul className="text-sm text-text-dim space-y-1.5">
            <li>· <Code>nvidia-smi</Code> on the host shows your processes — admins watch this</li>
            <li>· Mount your work directory with <Code>-v $PWD:/workspace</Code></li>
            <li>· Keep large datasets in <Code>/data</Code> (shared, read-only mount)</li>
            <li>· Save final artifacts to <Code>~</Code> — get them before your access expires</li>
          </ul>
        </Section>

        <Section
          number="05"
          title="Rules of the road"
          subtitle="Be a good neighbor. Other students need the node too."
        >
          <ul className="space-y-2.5 text-text-dim">
            {[
              ["No shared accounts.", "The credentials are yours alone. If a friend needs access, they request their own."],
              ["Stay in your time window.", "When your access expires, your account is removed. Plan around it — checkpoint often."],
              ["Don't fill the disk.", "Clean up after yourself. Failed runs, stale Docker images, model checkpoints you don't need — gone."],
              ["Don't hog all GPUs.", "If others are using the node, scope to specific GPUs with CUDA_VISIBLE_DEVICES or --gpus '\"device=0\"'."],
              ["No mining, no scraping.", "Obvious. Instant ban + report to your department."],
              ["Report problems.", "If something is broken — driver, network, disk — tell an admin. Don't silently struggle."],
            ].map(([title, body]) => (
              <li key={title} className="flex gap-3">
                <span className="text-accent mt-1.5">·</span>
                <div>
                  <span className="text-text font-medium">{title}</span>{" "}
                  <span>{body}</span>
                </div>
              </li>
            ))}
          </ul>
        </Section>

        <div className="pt-6 border-t border-border flex flex-wrap items-center justify-between gap-4">
          <p className="text-sm text-text-dim">Ready? Submit your first request.</p>
          <Link
            href="/register"
            className="inline-flex items-center h-10 px-4 rounded-md bg-text text-bg text-sm font-medium hover:bg-white transition-colors"
          >
            Create account →
          </Link>
        </div>
      </main>

      <footer className="border-t border-border">
        <div className="max-w-3xl mx-auto px-6 h-14 flex items-center justify-between text-xs text-text-mute font-mono">
          <span>university ai lab · internal network</span>
          <span>v1.0.0</span>
        </div>
      </footer>
    </div>
  );
}

function Section({
  number,
  title,
  subtitle,
  children,
}: {
  number: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-4">
      <div className="flex items-baseline gap-4 pb-3 border-b border-border">
        <span className="font-mono text-xs text-text-mute">{number}</span>
        <div>
          <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
          {subtitle && <p className="text-sm text-text-dim mt-0.5">{subtitle}</p>}
        </div>
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function Code({ children }: { children: React.ReactNode }) {
  return (
    <code className="font-mono text-[0.85em] bg-bg-2 border border-border rounded px-1.5 py-0.5 text-text">
      {children}
    </code>
  );
}

function Callout({
  tone,
  title,
  children,
}: {
  tone: "amber" | "cyan" | "red";
  title?: string;
  children: React.ReactNode;
}) {
  const styles = {
    amber: "border-amber/30 bg-amber/5 text-amber",
    cyan: "border-accent/30 bg-accent/5 text-accent",
    red: "border-red/30 bg-red/5 text-red",
  }[tone];
  return (
    <div className={`rounded-md border ${styles} px-4 py-3`}>
      {title && <div className="text-sm font-medium mb-1">{title}</div>}
      <div className="text-sm text-text-dim leading-relaxed">{children}</div>
    </div>
  );
}

function PlatformCard({
  os,
  cmd,
  link,
}: {
  os: string;
  cmd: string;
  link?: string;
}) {
  return (
    <div className="rounded-md border border-border bg-bg-2 p-3.5">
      <div className="text-xs text-text-mute mb-2">{os}</div>
      {link ? (
        <a
          href={link}
          target="_blank"
          rel="noreferrer"
          className="text-xs font-mono text-text hover:text-accent break-all"
        >
          {cmd}
        </a>
      ) : (
        <code className="text-xs font-mono text-text break-all">{cmd}</code>
      )}
    </div>
  );
}
