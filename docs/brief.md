# IronGrip (irongrip.uk) — Website Build Brief

Hand this file to Claude Code (or save it as `CLAUDE.md` in the repo root). Last updated: 5 Oct 2026.

## 1. What we're building

IronGrip is a UK **distributor and supplier of premium disposable gloves** (heavy-duty nitrile first). Customers: trade businesses (car detailers, garages, cleaners, salons/tattoo studios, hospitality) and, later, consumers on a subscription.

The site has two jobs, in this order:

1. **Look like a credible UK distributor** — for suppliers (we are negotiating with a Malaysian manufacturer) and for trade buyers.
2. **Be ready to sell** — products get added later through the Saleor dashboard, with no code changes.

There are **no products at launch**. The catalogue must render well when empty ("range launching soon" + enquiry/waitlist capture).

## 2. Stack (decided)

- **Backend:** Saleor core (Python/Django, GraphQL API) — https://github.com/saleor/saleor
- **Admin:** Saleor Dashboard — https://github.com/saleor/saleor-dashboard
- **Storefront:** start from the official Next.js storefront (App Router, TypeScript, Tailwind) — https://github.com/saleor/storefront — and customise it. Do not use the deprecated `saleor/saleor-storefront`.
- **Local dev:** Docker Compose (Saleor API + Postgres + Redis/Celery worker + Dashboard), following https://docs.saleor.io/setup/quickstart
- **DNS/CDN:** Cloudflare (domain irongrip.uk already on Cloudflare, registered at Namecheap).
- **Hosting (proposal — confirm with Tariq before provisioning anything paid):**
  - Storefront: Vercel (simplest for Next.js) or Cloudflare via OpenNext.
  - API + Dashboard: either Saleor Cloud, or a small VPS (e.g. Hetzner) running Docker Compose with managed backups.
  - Subdomains: `irongrip.uk` / `www` → storefront; `api.irongrip.uk` → Saleor API; `admin.irongrip.uk` → Dashboard (protected behind Cloudflare Access).
- **Email:** transactional email provider (e.g. Resend or Brevo) for enquiry forms and Saleor order emails; `hello@irongrip.uk` and `trade@irongrip.uk` addresses.
- **Payments (phase 2):** Stripe via the official Saleor Stripe app. Not needed for phase 1.

## 3. Phase 1 — launch site, no products (target: live within 1 week)

### Pages

| Route | Purpose | Key content |
|---|---|---|
| `/` | Home | Hero, who we supply, product families, why IronGrip, trade CTA, waitlist CTA |
| `/products` | Catalogue | Product family cards (see §5). Empty state: "Range launching soon — register interest" |
| `/trade` | Trade & wholesale | Benefits, how trade accounts work, **trade account enquiry form** |
| `/subscribe` | Subscription waitlist | How "never run out" will work; email + business type + monthly usage form |
| `/quality` | Standards & compliance | Plain-English explainer of glove standards (EN ISO 374, EN 455, EN ISO 21420, food contact). **No certification claims** until we hold the certificates — use "certificates available on request" only once true |
| `/about` | About us | UK-based founders, mission, distributor model |
| `/contact` | Contact | Form, email, (company address once registered) |
| `/faq` | FAQ | Sizing, delivery, trade terms, returns |
| `/legal/privacy`, `/legal/terms`, `/legal/cookies`, `/legal/returns` | Legal | Placeholder text clearly marked DRAFT for solicitor review |

### Forms (all phase 1)

- Trade enquiry: name, business name, business type (dropdown), email, phone, estimated monthly boxes, message.
- Subscription waitlist: email, first name, business or home use, glove type interest, estimated boxes/month.
- Contact: name, email, message.
- Requirements: server-side validation, spam protection (Cloudflare Turnstile), email notification to `trade@`/`hello@`, store submissions (simple table or the email provider's list). GDPR consent checkbox for marketing; link to privacy policy.

### Global

- Header: logo (text wordmark for now), Products, Trade, Subscribe, Quality, About, Contact; CTA button "Trade enquiry".
- Footer: company legal name, registration number, registered office (**placeholders until incorporated — UK law requires these on the site**), VAT number (if registered), legal links, social links (TikTok, Instagram).
- Cookie consent banner (only if non-essential cookies/analytics are used). Prefer Cloudflare Web Analytics (cookieless).
- SEO: metadata per page, Open Graph images, `sitemap.xml`, `robots.txt`, JSON-LD `Organization`; target phrases like "black nitrile gloves UK", "heavy duty nitrile gloves", "trade glove supplier UK".
- Performance: Lighthouse ≥ 90 on mobile for home and products.
- Accessibility: WCAG 2.2 AA (contrast, focus states, labels).

## 4. Phase 2 — selling (after supplier samples and pricing are confirmed)

Configure in Saleor (seed scripts or documented dashboard steps):

- **Channel:** `uk` — currency GBP, country GB, prices entered **including VAT 20%**.
- **Second channel (optional):** `trade` — trade price list, visible only to approved trade customers.
- **Product type "Disposable gloves"** with attributes: material, colour, thickness (mm, finger/palm), texture (diamond, finger, smooth), pack quantity (50/100), cuff length (mm), powder-free (Y/N), standards (multi-select: EN ISO 374-1, EN ISO 374-5, EN 455, food contact), AQL, duty level (light/medium/heavy).
- **Variants:** by size (XS, S, M, L, XL, XXL) with SKU and stock per variant.
- **Categories:** Heavy duty, Everyday, Chemical resistant, Food safe.
- **Shipping:** UK zone(s), free delivery threshold (value TBC), Royal Mail/Evri/DPD rates TBC.
- **Payments:** Saleor Stripe app (cards, Apple Pay, Google Pay).
- **Bulk pricing:** quantity tiers per box (e.g. 4+, 6+, 10+) — implement via Saleor promotions/discount rules.
- **Subscriptions:** Saleor has no native subscriptions. Propose a design (e.g. Stripe Billing for the recurring charge + a webhook that creates a Saleor order each cycle) and get sign-off before building.

## 5. Brand & content direction

**Page copy:** use `docs/content.md` (same folder) for all page text, form labels and SEO metadata.

- **Positioning line:** "Premium gloves, supplied properly." Supporting: "UK distributor of heavy-duty and everyday nitrile gloves for trades and businesses."
- **Tone:** direct, practical, no hype. Short sentences. UK spelling.
- **Look:** industrial and premium — near-black, off-white, one accent colour (e.g. safety orange). Big product photography slots (placeholders for now), bold sans-serif headings.
- **Product families (placeholder cards, no prices):**
  - Heavy-duty textured nitrile — for workshops, detailing and tough jobs.
  - Everyday nitrile — black, blue and colours for general use.
  - Chemical-resistant nitrile — for cleaning and chemical handling.
  - Food-safe gloves — for kitchens and food prep.
- **Why IronGrip (homepage blocks):** UK stock and fast dispatch · trade pricing and accounts · subscription so you never run out (coming soon) · standards explained clearly.

### Content rules (must follow)

- No fake reviews, testimonials, "trusted by" logos or sales figures.
- No medical or clinical claims ("examination", "medical grade") — we are not selling into medical settings in phase 1.
- No certification marks (CE/UKCA) or standard numbers claimed for specific products until we hold the documents.
- No claims like "X times stronger" without our own test evidence.
- Do not copy text, images or videos from other glove sellers (including hygienehub.au).
- Supplier brand names (e.g. Grip-X) are not used on the site until a distribution agreement is signed.

## 6. Repo & workflow

- Monorepo: `/api` (Saleor + compose), `/storefront` (Next.js), `/docs`.
- `.env.example` for every service; never commit secrets.
- README with: local setup in under 10 commands, how to add a product in Dashboard, how to deploy.
- GitHub Actions: lint + typecheck + build on PR.
- Small commits; ask before adding paid services.

## 7. Acceptance criteria — phase 1

- [ ] irongrip.uk and www serve the storefront over HTTPS via Cloudflare
- [ ] All pages in §3 exist, responsive from 360px wide
- [ ] Products page shows a clean empty state; adding a product in Dashboard makes it appear without a redeploy
- [ ] All three forms deliver an email and store the submission; Turnstile active
- [ ] Footer company-details placeholders are present and obviously marked
- [ ] Lighthouse mobile ≥ 90 (performance, accessibility, SEO) on `/` and `/products`
- [ ] Dashboard reachable only behind Cloudflare Access

## 8. Open items for the founders

- Company legal name, number and registered office (after incorporation)
- Logo / final colour
- Hosting choice and budget
- Trademark clearance for "IronGrip" before printing packaging (see note in chat)

## 9. Brand assets — copy into the storefront

**Source folder (on Tariq's Mac):** `/Users/stareq/Documents/Projects/Gloves/IronGrip_UK_Brand_Assets_Clear_Colours/` (28 transparent PNGs). A zip of the same set and a static prototype (`index.html`, `logo.png`, `favicon.png`) sit in `/Users/stareq/Documents/Projects/Gloves/`.

**Rules**
- **Copy, don't move**: leave the originals where they are.
- Destination: `storefront/public/brand/` using the kebab-case names below.
- Serve every image through `next/image`. Also generate WebP versions.
- These are small rasters (the main logo is 815×455). Don't upscale them. Keep a `TODO: replace with SVG` note next to each logo use until vector files arrive.
- Reuse the colour tokens from the prototype `index.html`: `--black #111315`, `--charcoal #24282c`, `--orange #ff6500`, `--white #f5f5f2`, `--silver #bfc3c7`, `--graphite #3a3f44`. Map them into the Tailwind theme.

**Mapping**

| Source file | Copy to `public/brand/` | Use |
|---|---|---|
| 01_Main_Logo.png | logo-main.png | Home hero / about only |
| 04_Horizontal_Wordmark.png | logo-horizontal.png | Header logo (desktop) |
| 05_Stacked_Wordmark.png | logo-stacked.png | Footer |
| 06_Mountain_Wordmark.png | logo-mountain.png | Spare, not used in phase 1 |
| 07_IG_Mark.png | mark-ig.png | Header logo (mobile), loading states |
| 02_Square_Favicon.png | icon-square.png | Source for favicon.ico, apple-touch-icon (180), icon-192, icon-512, OG fallback |
| 03_Round_Badge.png | badge-round.png | Social / about page |
| 08_Superior_Grip_Badge.png | icons/superior-grip.png | "Why IronGrip" row |
| 09_Heavy_Duty_Badge.png | icons/heavy-duty.png | "Why IronGrip" row |
| 14_Built_For_Trades_Badge.png | icons/built-for-trades.png | "Why IronGrip" row |
| 15_UK_Brand_Badge.png | icons/uk-brand.png | "Why IronGrip" row |
| 11_Oil_Resistant_Badge.png | icons/oil-resistant.png | **Product pages only, and only on products with test evidence** |
| 18_View_The_Range_Button.png | (none) | Don't use button images. Build buttons in CSS to this style |
| 20_New_Badge.png, 21_Heavy_Duty_Badge.png | tags/new.png, tags/heavy-duty.png | Product card tags (phase 2) |
| 19_Best_Seller_Badge.png | tags/best-seller.png | Phase 2, only once backed by real sales data |
| 23_Oil_Grip_Badge.png | tags/oil-grip.png | Phase 2, product-specific only |
| 25_Industrial_Texture.png, 26_Angular_Graphic_Texture.png, 27_Hexagon_Pattern.png, 28_Orange_Splatter_Texture.png | textures/*.png | Section backgrounds and dividers, used sparingly at low opacity |

**Do not copy or use (claims we can't support for disposable nitrile gloves):**
- 10_Cut_Resistant_Badge.png
- 22_Cut_Resistant_Badge.png
- 12_Impact_Protection_Badge.png
- 13_Breathable_Comfort_Badge.png
- 24_Professional_Grade_Badge.png
- 16_Shop_Gloves_Button.png and 17_Find_Your_Glove_Button.png (no products yet; build CSS buttons with the copy from the content file instead)

**Naming:** the artwork says "IRON GRIP UK"; the brand in copy and metadata is **IronGrip**. Use the PNGs as supplied, but write "IronGrip" in all text and alt text (e.g. `alt="IronGrip logo"`).
