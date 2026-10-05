# IronGrip — irongrip.uk

UK supplier of premium nitrile gloves. Saleor (commerce API + Dashboard) and a customised Saleor
"Paper" Next.js storefront. Read **CLAUDE.md** first; the brief and page copy live in `docs/`.

```
api/          Saleor stack: docker-compose.yml, Caddyfile (HTTPS), seed script, .env.example
storefront/   Next.js 16 storefront (fork of saleor/storefront, IronGrip-branded)
deploy/       setup-vm.sh — one-shot server setup
docs/         brief, content, decisions (ADRs)
```

## Production (the VM)

```bash
# on the server, as root
git clone <this repo> /opt/irongrip-site      # or copy the folder
cd /opt/irongrip-site && bash deploy/setup-vm.sh
```

The script installs Docker, generates secrets (`/root/irongrip-credentials.txt`), starts Saleor + Caddy
(Let's Encrypt HTTPS), migrates and seeds Saleor, then builds and starts the storefront.
DNS: A records for `irongrip.uk`, `www`, `api`, `admin` → server IP (DNS only / grey cloud).

| URL | What |
| --- | --- |
| https://irongrip.uk | Storefront |
| https://api.irongrip.uk/graphql/ | Saleor API |
| https://admin.irongrip.uk | Saleor Dashboard (basic auth + Saleor login) |

Update after code changes: `cd /opt/irongrip-site && git pull && docker compose --project-directory api --env-file api/.env build storefront && docker compose --project-directory api --env-file api/.env up -d storefront`

## Local development

Needs Docker and Node 24 + pnpm.

```bash
cp api/.env.example api/.env        # set SITE_HOST=localhost etc. for local use, or run Saleor via saleor-platform
docker compose --project-directory api --env-file api/.env --profile dev up -d db cache api worker mailpit
docker compose --project-directory api --env-file api/.env run --rm api python manage.py migrate
docker compose --project-directory api --env-file api/.env run --rm -e DJANGO_SUPERUSER_PASSWORD=admin api python manage.py createsuperuser --noinput --email admin@irongrip.uk
SALEOR_API_URL=http://localhost:8000/graphql/ SALEOR_ADMIN_EMAIL=admin@irongrip.uk SALEOR_ADMIN_PASSWORD=admin node api/seed/seed.mjs
cd storefront && cp .env.example .env.local   # see below
pnpm install && pnpm dev                      # http://localhost:3000
```

Storefront `.env.local`:

```
NEXT_PUBLIC_SALEOR_API_URL=http://localhost:8000/graphql/
NEXT_PUBLIC_STOREFRONT_URL=http://localhost:3000
NEXT_PUBLIC_DEFAULT_CHANNEL=uk
STOREFRONT_CHANNELS=uk
NEXT_PUBLIC_STOREFRONT_LOCALES=en
CONTENT_PROVIDER=code
FORMS_DATABASE_URL=postgres://saleor:<password>@localhost:5432/forms
SMTP_URL=smtp://localhost:1025        # Mailpit: http://localhost:8025
```

(Expose ports 8000/5432 locally with a `docker-compose.override.yml` if you run the API in Docker.)

## Checks

```bash
cd storefront
pnpm run verify                                   # tokens, typecheck, lint, unit tests
PLAYWRIGHT_BASE_URL=http://localhost:3000 pnpm exec playwright test e2e/irongrip.spec.ts
```

## Adding a product (Dashboard)

1. Dashboard → Products → Create product → type **Disposable gloves**.
2. Fill attributes (material, colour, thickness, standards…), choose a category.
3. Variants: one per size (XS–XXL) with SKU, price (GBP, VAT-inclusive) and stock in **UK Warehouse**.
4. Availability: publish in channel **United Kingdom**. It appears on `/products` within a minute.
5. Before selling: add shipping rates to the "United Kingdom" zone and install the Stripe app.

## Open items before launch

- Company legal name, number, registered office → `storefront/src/config/irongrip.ts`
- Vector logo files (current PNGs were cleaned from the supplied sheet)
- Turnstile keys, SMTP provider for form notifications, email forwarding for hello@/trade@
- Solicitor review of legal pages; trademark check on "IronGrip"
