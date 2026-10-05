# 0003 — Hosting on a single VM with Docker Compose + Caddy

Date: 2026-10-05 · Status: accepted

Everything runs on one VM (81.0.249.46): Postgres, Valkey, Saleor API + worker, Dashboard, storefront
and Caddy (automatic Let's Encrypt HTTPS). Cloudflare is DNS only (grey cloud) so Caddy can issue
certificates; switching to proxied later requires SSL mode "Full (strict)".

The Dashboard sits behind Caddy basic auth in addition to Saleor's own login.
Backups are not automated yet — add a nightly `pg_dump` of `saleor` and `forms` before taking orders.
