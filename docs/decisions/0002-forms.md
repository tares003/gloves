# 0002 — Website forms storage and delivery

Date: 2026-10-05 · Status: accepted

Trade enquiry, waitlist and contact forms are Next.js Server Actions (`src/app/forms-actions.ts`) with a
shared pipeline (`src/lib/forms/process.ts`): honeypot → per-IP rate limit → Cloudflare Turnstile →
Zod validation → store → email.

- Stored in a separate Postgres database `forms` (table `form_submissions`, created on first use) using
  the `postgres` client — simpler than an ORM for one table. Saleor's schema is never touched.
- Email notification via SMTP (`SMTP_URL`) is best-effort; a submission succeeds if it was stored or
  emailed.
- Turnstile is skipped when `TURNSTILE_SECRET_KEY` is unset so the site works before keys exist.
- Marketing consent is a separate, unticked checkbox and stored per submission.
