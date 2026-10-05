# 0001 — Storefront base: Saleor Paper, customised

Date: 2026-10-05 · Status: accepted

We forked the official `saleor/storefront` ("Paper", Next.js 16) rather than writing a storefront from
scratch, so phase 2 gets product pages, cart, checkout and Stripe for free.

Customisations kept deliberately small and isolated:

- Branding: `src/config/brand.ts`, `src/styles/brand.css` tokens, `src/lib/fonts.ts` (self-hosted Barlow
  Condensed — no Google Fonts call at build or runtime), logo component, favicons.
- IronGrip pages live in `src/app/(storefront)/[locale]/[channel]/(main)/{trade,subscribe,…}` and
  shared blocks in `src/ui/irongrip/`.
- Navigation comes from `src/config/irongrip.ts` instead of a Saleor menu.
- Clean URLs: `src/middleware.ts` rewrites `/trade`, `/products`, … and `/` to `/en/uk/…`.
- Locale `en` uses `en-GB` formatting; single channel `uk`; `CONTENT_PROVIDER=code`.

Upgrading Paper: follow `skills/saleor-paper-storefront/migrations/SKILL.md`; conflicts should be limited
to the files above.
