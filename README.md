# Quiver Quantitative

Quiver Quantitative is a production-oriented quantitative research and investment intelligence platform built with Next.js 15, React, TypeScript, TailwindCSS, Recharts, Framer Motion, NextAuth.js, Prisma, and PostgreSQL.

The app is designed for investors, traders, analysts, and researchers who need a unified view of public market data, alternative data, macro events, news sentiment, portfolios, and quant research workflows.

## What is included

- Institutional dark-theme product UI
- Landing page, dashboard, market overview, screener, insider tracker, congressional tracker, ETF dashboard, crypto dashboard, economic calendar, news sentiment hub, portfolio tracker, research lab, AI insights, pricing, contact, and about pages
- API route layer with free/public data provider adapters and deterministic fallbacks
- Prisma schema and SQL schema for users, OAuth accounts, portfolios, watchlists, saved screens, strategies, alerts, trades, and API cache
- NextAuth.js configuration for Google and GitHub login
- Server actions for saved screens and portfolio mutations
- SEO metadata, OpenGraph, sitemap, robots, and structured data
- Deployment, security, and architecture documentation

## Getting started

```bash
npm install
npm run prisma:generate
npm run dev
```

Open http://localhost:3000.

## Production setup

1. Provision PostgreSQL.
2. Copy `.env.example` to `.env` and set secrets.
3. Configure Google and GitHub OAuth apps.
4. Add market data API keys as needed.
5. Run Prisma migrations.
6. Deploy to Vercel.

See `docs/deployment.md` and `docs/security-checklist.md` for the full production checklist.
