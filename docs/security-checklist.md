# Production Security Checklist

## Authentication

- Set a strong `AUTH_SECRET`.
- Configure OAuth callback URLs for every Vercel environment.
- Keep Google and GitHub client secrets out of source control.
- Require authentication for user-owned data mutations.
- Add organization and role-based access control before multi-tenant enterprise use.

## Database

- Use managed PostgreSQL with TLS.
- Rotate database credentials periodically.
- Limit database user permissions to the application schema.
- Add backups, restore drills, and point-in-time recovery.
- Add audit tables for institutional tenant activity.

## API and Data Providers

- Keep provider keys server-side.
- Cache aggressively to protect free-tier provider quotas.
- Add request throttling per user and IP.
- Validate all query parameters with Zod.
- Store raw provider responses only when needed for auditability.

## Application Security

- Security headers are configured in `next.config.mjs`.
- Avoid exposing `/api/auth` internals through robots indexing.
- Sanitize user-submitted notes, screen names, and strategy labels before rendering rich text.
- Add CSRF checks to non-NextAuth mutation endpoints if they accept browser cookies.
- Add structured logging without secrets or full access tokens.

## AI and Sentiment

- Treat model output as advisory, not deterministic investment advice.
- Log prompts and outputs only after redacting identifiers and secrets.
- Enforce timeout and token limits on AI provider calls.
- Display confidence metrics and explain uncertainty.

## Compliance

- Add market-data vendor terms review before commercial launch.
- Add investment disclaimer and terms of use.
- Add privacy policy and data deletion workflow.
- Store congressional and insider data with source URLs and timestamps.
- Maintain model methodology notes for AI-generated signals.
