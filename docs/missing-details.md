# Missing details — removed from the live site

On 2026-10-05 every placeholder was taken off https://irongrip.uk before search engines index it. The site now
says only "IronGrip" where a company detail is unknown, and shows nothing for anything else that's missing.
This file lists what was removed, and where to put it back once it's known.

## Company details (required by UK law once incorporated)

The Companies Act requires the registered name, company number, place of registration and registered office on
the website. Add them as soon as the company exists.

| Detail | Where it goes | What showed before |
| --- | --- | --- |
| Company legal name (e.g. "IronGrip Ltd") | `storefront/src/config/irongrip.ts` → `company.legalName`; also `src/config/brand.ts` → `copyrightHolder` | `[Company legal name] Ltd` in the footer and on every legal page |
| Company number | `company.companyNumber` | `[number]` in the footer |
| Registered office address | `company.registeredOffice` | `[Registered office address]` in the footer, on Contact and on every legal page |
| WhatsApp number | `company.whatsapp` | nothing (already hidden) |
| TikTok / Instagram | `company.social` | nothing (already hidden) |

Once `legalName` is set, the footer adds "Registered in England and Wales, company no. …" and
"IronGrip is a trading name of …" by itself. Each field is shown only when it's filled in.

## Legal pages (need a solicitor)

| Page | Removed | To do |
| --- | --- | --- |
| All legal pages | Banner: "DRAFT — this page is a placeholder and must be reviewed by a solicitor before launch." | Solicitor review of Privacy, Terms, Cookies, Delivery & returns |
| Privacy (`legal/privacy/page.tsx`) | `[Confirm retention periods.]` | Confirm "Enquiries: up to 24 months" and the marketing-consent wording |
| Terms (`legal/terms/page.tsx`) | `[To be drafted by a solicitor.]` — replaced on 2026-10-05 with the owner's Liability wording | Solicitor to review the Liability section; terms of sale before online ordering |
| Delivery & returns (`legal/returns/page.tsx`) | `[Confirm Highlands, Islands and Northern Ireland before launch.]` | Decide delivery to Highlands, Islands and Northern Ireland, and say so |

## From the content file (`docs/content.md`), not on the site

- Trade page: payment terms for approved accounts.
- FAQ: returns window for unopened boxes (`[14/30] days`; the site currently says 14 days).

## Behind the scenes (not public, but fill in)

- Saleor warehouse address: `TBC — update after incorporation` (Dashboard → Configuration → Warehouses → UK Warehouse; also `api/seed/seed.mjs`).
- Shipping rates for the "United Kingdom" zone: `rates TBC before launch` (Dashboard → Shipping).
- Cloudflare Turnstile keys (`TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY` in `api/.env`): forms work without them, with no bot check.
- Email: Stalwart accounts, DNS records and `deploy/set-mail-login.sh` (see `docs/runbooks/vm-deploy.md`).
- `/sitemap.xml` (no `sitemap.ts` yet) and `metadataBase` for share images.
- Vector logo files; trademark check on "IronGrip".
