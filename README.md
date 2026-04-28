# ailab

GPU access management portal for a university AI lab. Students request remote
SSH access to GPU nodes; admins review and email out credentials.

## Stack

- Next.js 16 (App Router) + TypeScript + Tailwind v4
- Prisma 7 + SQLite (via `@prisma/adapter-better-sqlite3`)
- NextAuth.js v5 (credentials provider, JWT, role-based)
- Resend for transactional email (dev fallback to console)

## Quick start

```bash
npm install
cp .env.example .env  # or copy your own
npm run db:migrate
npm run db:seed       # creates admin@ailab.local / admin123 + 3 demo nodes
npm run dev
```

Open <http://localhost:3000>.

## Scripts

| Command            | What it does                                           |
| ------------------ | ------------------------------------------------------ |
| `npm run dev`      | Start the dev server                                   |
| `npm run build`    | Production build                                       |
| `npm run db:migrate` | Run Prisma migrations                                |
| `npm run db:seed`  | Seed the default admin user and 3 GPU server entries   |
| `npm run db:studio`| Open Prisma Studio                                     |

## Default credentials

After running `db:seed`:

- Admin: `admin@ailab.local` / `admin123`

Change the password after first login (or edit `prisma/seed.ts`).

## Environment

`.env`:

```
DATABASE_URL="file:./prisma/dev.db"
AUTH_SECRET="<openssl rand -base64 32>"
RESEND_API_KEY=""              # leave empty in dev — emails log to console
EMAIL_FROM="AI Lab <onboarding@resend.dev>"
```

## Routes

- `/` — landing
- `/guide` — getting-started guide (Tailscale, Docker, SSH, rules)
- `/login`, `/register` — auth
- `/dashboard` — student request list
- `/dashboard/new-request` — submit a GPU request
- `/admin` — pending review queue
- `/admin/requests` — full request log
- `/admin/grants` — active access grants (revoke)
- `/admin/servers` — manage GPU nodes

## Notes

- The dev DB (`prisma/dev.db`) and `.env` are gitignored.
- For production, switch `DATABASE_URL` to Postgres and set a real `RESEND_API_KEY`.
