# CLAUDE.md — IronGrip (irongrip.uk)

Instructions for Claude Code working in this repository. Read this first, then:
- `docs/brief.md` — what to build, phases, acceptance criteria, brand-asset mapping
- `docs/content.md` — all page copy, form labels and SEO metadata (use verbatim)

If anything here conflicts with those two files, the brief wins on *scope* and this file wins on *how to code it*. Ask before guessing.

---

## 1. Project in one paragraph

IronGrip is a UK distributor and supplier of premium disposable nitrile gloves. Phase 1 is a credible brand site with **no products**: trade-enquiry, subscription-waitlist and contact forms. Phase 2 adds products, checkout (Stripe) and a subscription. Stack: **Saleor** (Python/Django GraphQL API + Dashboard) and the **official Saleor Next.js storefront**. DNS and CDN run through Cloudflare.

## 2. Repository layout

```
/
├── CLAUDE.md
├── docs/                    # brief, content, decisions (ADRs), runbooks
├── api/                     # Saleor core via Docker Compose (do NOT fork core)
│   ├── docker-compose.yml   # api, worker, postgres, redis, dashboard, mailpit
│   └── .env.example
├── apps/                    # our Saleor Apps / webhook handlers (TypeScript, Next.js API routes)
│   └── forms-and-subscriptions/
└── storefront/              # fork of github.com/saleor/storefront (Next.js App Router)
    ├── public/brand/        # brand assets (see brief §9)
    ├── src/app/             # routes
    ├── src/components/      # UI components
    ├── src/lib/             # server utilities, GraphQL client, validation
    ├── src/graphql/         # .graphql documents → generated types
    └── .env.example
```

## 3. Golden rules

1. **Never modify Saleor core.** Extend Saleor through its GraphQL API, Saleor Apps, webhooks, metadata and Dashboard configuration. Run core from official Docker images pinned to one version.
2. **Small, reviewable changes.** One concern per commit and PR. Explain *why* in the PR description.
3. **Ask before** adding a paid service, a new runtime dependency over ~50 kB, changing the stack, or touching DNS/production.
4. **No secrets in git.** Every variable goes in `.env.example` with a dummy value and a comment.
5. **Follow the content rules** (brief §5): no fake reviews or logos, no medical claims, no certification or strength claims without evidence, no copied competitor content.
6. **Copy comes from `docs/content.md`.** Don't invent marketing text. If copy is missing, add a clearly marked `TODO(copy)` placeholder.

## 4. Commands

Use **pnpm** for all JavaScript/TypeScript, and the Node and Python versions pinned by the upstream Saleor repos. Record the exact versions in `.nvmrc` / `.tool-versions` once chosen.

```bash
# API (from /api)
docker compose up -d                  # start Saleor, Postgres, Redis, Dashboard, Mailpit
docker compose run --rm api python manage.py migrate
docker compose run --rm api python manage.py createsuperuser
docker compose logs -f api

# Storefront (from /storefront)
pnpm install
pnpm dev                              # http://localhost:3000
pnpm generate                         # GraphQL codegen after editing src/graphql/*.graphql
pnpm lint && pnpm typecheck && pnpm test && pnpm build   # must all pass before a PR
```

Add any new commands here when you create them.

## 5. TypeScript / Next.js conventions

- **TypeScript strict mode.** No `any`. Use `unknown` and narrow it. No `@ts-ignore` without a comment explaining why.
- **App Router, Server Components by default.** Add `"use client"` only for interactivity (forms, menus). Keep client components small and at the leaves.
- **Data fetching:** server-side through the typed GraphQL client in `src/lib/graphql.ts`. Never call the Saleor API from the browser with privileged tokens.
- **GraphQL:** write operations in `src/graphql/*.graphql` and use the generated typed documents. No inline untyped query strings.
- **Forms:** Server Actions or route handlers with **Zod** validation on the server (client-side validation is UX only). Check Cloudflare Turnstile server-side. Rate-limit by IP. Return friendly, specific errors.
- **Empty states first:** every product or category view must render correctly when Saleor returns zero items.
- **Images:** `next/image` with explicit `width`/`height` and meaningful `alt`. Write "IronGrip" in alt text, never "IRON GRIP UK".
- **Naming:** components `PascalCase.tsx`, utilities `camelCase.ts`, routes kebab-case, constants `SCREAMING_SNAKE_CASE`.
- **Imports:** absolute via `@/`. No circular imports. No barrel files in `components/`.
- **Errors:** never swallow them. Log server errors with context (no personal data). Show users a friendly message.
- **Formatting:** Prettier and ESLint (Next + TypeScript rules). Don't hand-format.

## 6. Styling and design

- **Tailwind CSS** using the theme tokens below. No hard-coded hex values in components.
  - `black #111315` · `charcoal #24282c` · `graphite #3a3f44` · `silver #bfc3c7` · `white #f5f5f2` · `orange #ff6500` (accent and CTAs only)
- **Mobile first.** Layouts must work from 360 px wide with no horizontal scroll.
- **Buttons are built in CSS**, not image files. Primary = orange background with black text; secondary = outline.
- **Textures** (`public/brand/textures/`) only as subtle backgrounds at low opacity, never behind body text.
- **Accessibility (WCAG 2.2 AA):** colour contrast ≥ 4.5:1 for text, visible focus rings, labels on every input, logical heading order, keyboard-navigable menus, `prefers-reduced-motion` respected.

## 7. Saleor conventions

- **Configuration as code where possible.** Channels, product types, attributes, categories, shipping zones and tax setup go in idempotent seed scripts under `api/seed/` (GraphQL mutations), not only as manual Dashboard clicks. Document the remaining manual steps in `docs/runbooks/`.
- **Channel `uk`:** GBP, country GB, prices **including VAT (20%)**. An optional `trade` channel holds trade pricing.
- **Product data** lives in attributes (see brief §4). Don't put specs in description HTML.
- **Custom behaviour** (form storage, subscriptions, notifications) goes in a **Saleor App** in `/apps`, which receives webhooks and verifies their signatures.
- **Subscriptions:** Saleor has none built in. Don't build until the design (e.g. Stripe Billing plus a webhook that creates a Saleor order each cycle) is written up in `docs/decisions/` and approved.
- **Payments:** the official Saleor Stripe app only. Never handle raw card data.

## 8. Python (only if we ever need it)

We aim to write **no Python**. If a Django-side extension becomes unavoidable, it must go in a separate plugin package, never inside core. Use Python 3 type hints, `ruff` for linting and formatting, `pytest` tests, and an ADR explaining why an App wasn't enough.

## 9. Testing

- **Unit tests (Vitest):** validation schemas, utilities and price/VAT helpers.
- **Component tests (Testing Library):** forms (validation, success and error states) and empty states.
- **End-to-end (Playwright):** home loads; each form submits successfully (with Turnstile in test mode); `/products` empty state; 360 px mobile viewport.
- **Lighthouse CI** on `/` and `/products`: performance, accessibility and SEO ≥ 90 on mobile.
- A bug fix comes with a test that fails without the fix.

## 10. Security and privacy (UK GDPR)

- Collect only the fields the forms need. Store submissions with a timestamp and consent flag. Provide a way to export or delete a person's data on request.
- Marketing consent is an **unticked** checkbox, separate from submitting the form.
- No analytics cookies before consent. Prefer Cloudflare Web Analytics (cookieless).
- Security headers via Next config: CSP, HSTS, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`.
- Dashboard (`admin.irongrip.uk`) sits behind Cloudflare Access. The API is accessible only over HTTPS.
- Keep dependencies patched. Run `pnpm audit` in CI and fail on high-severity issues.

## 11. SEO

- Metadata per page from the content file (`generateMetadata`). Canonical URLs on `https://irongrip.uk`.
- `sitemap.ts`, `robots.ts`, Open Graph images, JSON-LD `Organization` (and `Product` in phase 2, using real data only).
- Exactly one `<h1>` per page. Descriptive link text.

## 12. Git and CI

- Branches: `main` (production), feature branches `feat/…`, `fix/…`, `chore/…`.
- Conventional commits: `feat: add trade enquiry form`, `fix: …`, `chore: …`, `docs: …`.
- CI (GitHub Actions) on every PR: install → lint → typecheck → unit tests → build → Playwright smoke → Lighthouse CI.
- Never force-push `main`. Production deploys only from `main`.

## 13. Definition of done

- [ ] Meets the acceptance criteria in the brief for that feature
- [ ] Copy matches the content file; no unsupported claims
- [ ] Lint, typecheck, tests and build pass locally and in CI
- [ ] Works at 360 px and desktop; keyboard and screen-reader check done
- [ ] New environment variables are in `.env.example`; README and commands updated
- [ ] Any decision with lasting impact is recorded in `docs/decisions/NNNN-title.md`

## 14. Open decisions (ask Tariq)

- Hosting: Saleor Cloud vs VPS; Vercel vs Cloudflare for the storefront
- Where form submissions are stored (Saleor App database vs email provider list)
- Company legal details for the footer (after incorporation)
- Final vector logo files (current PNGs are low resolution)
- Trademark clearance for "IronGrip" before any packaging or paid branding
