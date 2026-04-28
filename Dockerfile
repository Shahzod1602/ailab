# syntax=docker/dockerfile:1.7

# ─── Stage 1: install all deps + native build tools ──
FROM node:22-bookworm-slim AS deps
RUN apt-get update && apt-get install -y --no-install-recommends \
      openssl python3 make g++ ca-certificates \
    && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# ─── Stage 2: build ──────────────────────────────────────────
FROM node:22-bookworm-slim AS builder
RUN apt-get update && apt-get install -y --no-install-recommends openssl \
    && rm -rf /var/lib/apt/lists/*
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build

# ─── Stage 3: production deps only ───────────────────────────
FROM node:22-bookworm-slim AS prod-deps
RUN apt-get update && apt-get install -y --no-install-recommends \
      openssl python3 make g++ ca-certificates \
    && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# ─── Stage 4: runtime ────────────────────────────────────────
FROM node:22-bookworm-slim AS runner
RUN apt-get update && apt-get install -y --no-install-recommends \
      openssl curl ca-certificates \
    && rm -rf /var/lib/apt/lists/*
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN groupadd -r nodejs && useradd -r -g nodejs -s /bin/false nextjs

# Production node_modules (with full prisma CLI + transitive deps)
COPY --from=prod-deps --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --chown=nextjs:nodejs package.json package-lock.json ./

# Generated prisma client (must come from the builder where `prisma generate` ran)
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/@prisma/client ./node_modules/@prisma/client

# Next.js build artifacts + static
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Prisma schema, migrations, config
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/prisma.config.ts ./prisma.config.ts
COPY --from=builder --chown=nextjs:nodejs /app/next.config.ts ./next.config.ts

# Persistent SQLite data dir
RUN mkdir -p /app/data && chown nextjs:nodejs /app/data

USER nextjs

EXPOSE 3000

# Run migrations at startup, then start Next.js
CMD ["sh", "-c", "npx prisma migrate deploy && npx next start -H 0.0.0.0 -p 3000"]
