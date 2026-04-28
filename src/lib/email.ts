import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY;
const from = process.env.EMAIL_FROM ?? "AI:LAB <onboarding@resend.dev>";

const resend = apiKey ? new Resend(apiKey) : null;

type SendArgs = {
  to: string;
  subject: string;
  html: string;
  text?: string;
};

export async function sendEmail({ to, subject, html, text }: SendArgs) {
  if (!resend) {
    console.log("\n[email:dev-fallback] RESEND_API_KEY not set, logging email:");
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`---`);
    console.log(text ?? html.replace(/<[^>]+>/g, ""));
    console.log(`---\n`);
    return { ok: true, dev: true };
  }
  const result = await resend.emails.send({ from, to, subject, html, text });
  if (result.error) {
    console.error("Email send failed:", result.error);
    return { ok: false, error: result.error.message };
  }
  return { ok: true };
}

export function approvalEmail(args: {
  studentName: string;
  serverName: string;
  serverIp: string;
  sshUsername: string;
  sshPassword: string;
  expiresAt: Date;
}) {
  const expiry = args.expiresAt.toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });
  const html = `
    <div style="font-family: 'JetBrains Mono', ui-monospace, monospace; max-width: 580px; margin: 0 auto; padding: 0; background: #04060A; color: #C8E0E5;">
      <div style="background: linear-gradient(180deg, rgba(0,240,255,0.06), transparent); padding: 28px 24px 16px; border-bottom: 1px solid rgba(0,240,255,0.2);">
        <div style="font-size: 11px; letter-spacing: 0.24em; text-transform: uppercase; color: #5C7682; margin-bottom: 8px;">// AI:LAB · GPU PORTAL</div>
        <div style="font-size: 22px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: #00F0FF;">ACCESS AUTHORIZED</div>
      </div>
      <div style="padding: 24px;">
        <p style="font-size: 14px; line-height: 1.6; margin: 0 0 16px;">
          Hello <strong style="color: #00F0FF;">${args.studentName}</strong>,
        </p>
        <p style="font-size: 14px; line-height: 1.6; margin: 0 0 24px;">
          Your GPU access request has been <strong style="color: #14FFAA;">approved</strong>. SSH credentials are below.
        </p>

        <div style="font-size: 11px; letter-spacing: 0.24em; text-transform: uppercase; color: #5C7682; margin-bottom: 8px;">▎ CREDENTIALS</div>
        <table style="width: 100%; border-collapse: collapse; background: rgba(0,240,255,0.04); border: 1px solid rgba(0,240,255,0.2); margin-bottom: 24px;">
          <tbody>
            ${[
              ["NODE", args.serverName],
              ["IP", args.serverIp],
              ["USERNAME", args.sshUsername],
              ["PASSWORD", args.sshPassword],
              ["EXPIRES", expiry],
            ]
              .map(
                ([k, v]) => `
              <tr style="border-bottom: 1px solid rgba(0,240,255,0.1);">
                <td style="padding: 10px 14px; font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: #5C7682; width: 110px;">${k}</td>
                <td style="padding: 10px 14px; font-size: 13px; color: #66F5FF; font-family: 'JetBrains Mono', monospace;">${v}</td>
              </tr>
            `,
              )
              .join("")}
          </tbody>
        </table>

        <div style="font-size: 11px; letter-spacing: 0.24em; text-transform: uppercase; color: #5C7682; margin-bottom: 8px;">▎ CONNECTION</div>
        <pre style="background: #0B131C; color: #66F5FF; padding: 14px; border-left: 2px solid #00F0FF; margin: 0 0 24px; font-family: 'JetBrains Mono', monospace; font-size: 13px; overflow-x: auto;">$ ssh ${args.sshUsername}@${args.serverIp}</pre>

        <p style="font-size: 12px; color: #5C7682; line-height: 1.6; margin: 0;">
          The node lives on the university internal network. From off-campus, install Tailscale first.
        </p>
      </div>
      <div style="padding: 16px 24px; border-top: 1px solid rgba(0,240,255,0.1); font-size: 10px; letter-spacing: 0.22em; text-transform: uppercase; color: #38505B;">
        UNIVERSITY AI:LAB · INTERNAL NET · v1.0.0
      </div>
    </div>
  `;
  const text = `// AI:LAB — ACCESS AUTHORIZED

Hello ${args.studentName},

Your GPU access request has been approved.

NODE     : ${args.serverName}
IP       : ${args.serverIp}
USERNAME : ${args.sshUsername}
PASSWORD : ${args.sshPassword}
EXPIRES  : ${expiry}

Connect:
  $ ssh ${args.sshUsername}@${args.serverIp}

The node lives on the university internal network. From off-campus, install Tailscale first.

— AI:LAB
`;
  return { html, text };
}

export function rejectionEmail(args: { studentName: string; reason: string }) {
  const html = `
    <div style="font-family: 'JetBrains Mono', ui-monospace, monospace; max-width: 580px; margin: 0 auto; padding: 0; background: #04060A; color: #C8E0E5;">
      <div style="background: linear-gradient(180deg, rgba(255,46,151,0.08), transparent); padding: 28px 24px 16px; border-bottom: 1px solid rgba(255,46,151,0.25);">
        <div style="font-size: 11px; letter-spacing: 0.24em; text-transform: uppercase; color: #5C7682; margin-bottom: 8px;">// AI:LAB · GPU PORTAL</div>
        <div style="font-size: 22px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: #FF2E97;">ACCESS DENIED</div>
      </div>
      <div style="padding: 24px;">
        <p style="font-size: 14px; line-height: 1.6; margin: 0 0 16px;">
          Hello <strong>${args.studentName}</strong>,
        </p>
        <p style="font-size: 14px; line-height: 1.6; margin: 0 0 20px;">
          Your GPU access request has been <strong style="color: #FF2E97;">denied</strong>.
        </p>

        <div style="font-size: 11px; letter-spacing: 0.24em; text-transform: uppercase; color: #5C7682; margin-bottom: 8px;">▎ REASON</div>
        <div style="background: rgba(255,46,151,0.06); border-left: 2px solid #FF2E97; padding: 14px; font-size: 13px; line-height: 1.6; margin-bottom: 24px;">
          ${args.reason}
        </div>

        <p style="font-size: 12px; color: #5C7682; line-height: 1.6; margin: 0;">
          You may submit another request after addressing the feedback above.
        </p>
      </div>
      <div style="padding: 16px 24px; border-top: 1px solid rgba(0,240,255,0.1); font-size: 10px; letter-spacing: 0.22em; text-transform: uppercase; color: #38505B;">
        UNIVERSITY AI:LAB · INTERNAL NET · v1.0.0
      </div>
    </div>
  `;
  const text = `// AI:LAB — ACCESS DENIED

Hello ${args.studentName},

Your GPU access request has been denied.

REASON:
  ${args.reason}

You may submit another request after addressing the feedback above.

— AI:LAB
`;
  return { html, text };
}
