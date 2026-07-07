# Deployment Instructions

## 1. Provision Infrastructure

- Create a PostgreSQL database.
- Create Google and GitHub OAuth applications.
- Create free API keys for the providers you plan to enable.
- Create a Vercel project connected to the repository.

## 2. Configure Environment Variables

Copy `.env.example` to `.env` for local development and configure the same keys in Vercel:

```bash
NEXT_PUBLIC_APP_URL=https://your-domain.example
AUTH_SECRET=replace-with-a-strong-secret
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/quiver_quantitative?schema=public
AUTH_GOOGLE_ID=...
AUTH_GOOGLE_SECRET=...
AUTH_GITHUB_ID=...
AUTH_GITHUB_SECRET=...
ALPHA_VANTAGE_API_KEY=...
FMP_API_KEY=...
TWELVE_DATA_API_KEY=...
FRED_API_KEY=...
NEWS_API_KEY=...
GNEWS_API_KEY=...
HUGGINGFACE_API_KEY=...
AI_PROVIDER_BASE_URL=https://api.openai.com/v1
AI_PROVIDER_API_KEY=...
AI_PROVIDER_MODEL=gpt-4.1-mini
```

Generate `AUTH_SECRET` with:

```bash
openssl rand -base64 32
```

## 3. Install and Generate Prisma

```bash
npm install
npm run prisma:generate
```

## 4. Run Migrations

```bash
npm run prisma:migrate
```

For production, run migrations from a controlled release job before routing traffic.

## 5. Validate

```bash
npm run typecheck
npm run lint
npm run build
```

## 6. Deploy to Vercel

```bash
vercel
vercel --prod
```

Recommended Vercel settings:

- Framework preset: Next.js
- Build command: `npm run build`
- Install command: `npm install`
- Node.js version: 20.x or newer
- Environment variables: production, preview, and development scoped correctly

## 7. Provider Rate Limits

- Cache market and crypto endpoints for at least 300 seconds.
- Cache news endpoints for at least 900 seconds.
- Use `ApiCache` for SEC filings, congressional disclosures, and fundamentals.
- Add ingestion jobs for SEC EDGAR and House/Senate disclosure data before scaling to large user bases.
