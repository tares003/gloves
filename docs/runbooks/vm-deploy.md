# Runbook — IronGrip on the shared VM (81.0.249.46)

Deployed 2026-10-05. The VM also hosts other live sites; never restart, prune or edit their config.

## Layout

- Code: `/opt/irongrip-site` (rsync from the repo, no `.git`). Compose project `irongrip`, run from
  `/opt/irongrip-site/api` **without `-f`** so `docker-compose.override.yml` is loaded:
  `docker compose --env-file .env …`
- Secrets: `/opt/irongrip-site/api/.env` (600). Logins: `/root/irongrip-credentials.txt` (600).
- Containers: `irongrip-{db,cache,api,worker,dashboard,storefront}-1`. Volumes `irongrip_*`.
- Proxy: the VM's shared Caddy, container `anwarul-uloom-caddy-1` (compose project `/opt/anwarul-uloom`).
  - Our blocks: `/data/sites/irongrip.caddy` in its data volume
    (`/var/lib/docker/volumes/anwarul-uloom_caddy_data/_data/sites/irongrip.caddy`), built from
    `deploy/irongrip.caddy` with the Dashboard basic-auth hash filled in.
  - Pulled in by the last line of `/opt/anwarul-uloom/Caddyfile`: `import /data/sites/irongrip.caddy`.
    If that file is ever redeployed from the anwarul-uloom repo, re-add the line.
  - api, dashboard and storefront join `anwarul-uloom_aul_net` as `irongrip-api`, `irongrip-dashboard`,
    `irongrip-storefront`. db and cache stay private; connection strings use `irongrip-db` /
    `irongrip-cache` because that network already has other projects' `db` and `redis`.
  - The repo's own `caddy` service is disabled by the override.

## Changing Caddy

The Caddyfile is a single-file bind mount: edit in place (`>>`, `cat backup > Caddyfile`), never
`sed -i` or `mv`, or the container keeps the old inode.

```bash
cp -p /opt/anwarul-uloom/Caddyfile /opt/anwarul-uloom/Caddyfile.bak-$(date +%Y%m%d-%H%M%S)
docker exec anwarul-uloom-caddy-1 caddy validate --config /etc/caddy/Caddyfile --adapter caddyfile
docker exec anwarul-uloom-caddy-1 caddy reload --config /etc/caddy/Caddyfile --adapter caddyfile
```

Never restart the Caddy container.

## Updating the site

```bash
rsync -az --exclude node_modules --exclude .next --exclude .git --exclude '.env*.local' --exclude brand-source \
  -e "ssh -i ~/.ssh/vm" ./ root@81.0.249.46:/opt/irongrip-site/
ssh -i ~/.ssh/vm root@81.0.249.46 'cd /opt/irongrip-site/api && docker compose --env-file .env build storefront && docker compose --env-file .env up -d storefront'
```

`docker compose run` needs `-T` and `</dev/null` inside scripted ssh sessions, or it eats the script's stdin.

## Email

Sent through the VM's Stalwart server (`mail.properslang.com`, compose project `/opt/mail`). Set up 2026-10-05:

- Domain `irongrip.uk`: manual DNS, automatic DKIM (RSA + Ed25519, selectors `v1-*-20261005`), reports to postmaster@.
- Mailboxes: `hello@irongrip.uk` (alias `postmaster@`) and `trade@irongrip.uk` (shared by the owners).
  Mail to hello@ is also copied to trade@ by a filter in hello@'s mailbox (set up by the owner in webmail).
- `noreply@irongrip.uk`: sending-only account; the storefront (`SMTP_URL`) and Saleor (`EMAIL_URL`) log in
  with it on port 465. Set by `bash deploy/set-mail-login.sh` on the Mac (tests the login first).
- Mail apps use `mail.irongrip.uk` (IMAP 993 / SMTP 465, SSL/TLS, full address as username). Certificate
  `*.irongrip.uk` from Let's Encrypt, issued 2026-10-05 by Stalwart (ACME DNS-01, auto-renews) using the Cloudflare
  token "Stalwart mail server (DNS + certificates)", which includes the irongrip.uk zone. Stalwart publishes DKIM,
  SPF, SRV and TLS-RPT through it (domain set to automatic DNS with only those record types). A, MX
  (`mail.irongrip.uk`) and DMARC (`p=quarantine`) are set by hand: `docs/runbooks/irongrip-mail-dns.txt`.
- `https://mail.irongrip.uk` in a browser does not work by design: port 443 is the shared Caddy, which has no
  site for it. Webmail stays behind the ssh tunnel.
- Temporary passwords for hello@, trade@ and noreply@: `/root/irongrip-credentials.txt` on the VM.
- Admin panel: `bash scripts/mail-admin-tunnel.sh` in the properslang repo → http://localhost:18080/admin.

## Rollback (remove IronGrip entirely)

```bash
cat /opt/anwarul-uloom/Caddyfile.bak-irongrip-20261005-192541 > /opt/anwarul-uloom/Caddyfile
docker exec anwarul-uloom-caddy-1 caddy validate --config /etc/caddy/Caddyfile --adapter caddyfile
docker exec anwarul-uloom-caddy-1 caddy reload --config /etc/caddy/Caddyfile --adapter caddyfile
cd /opt/irongrip-site/api && docker compose --env-file .env down
# optional, destroys data: docker volume rm irongrip_db-data irongrip_cache-data irongrip_media
# optional: rm -r /opt/irongrip-site /var/lib/docker/volumes/anwarul-uloom_caddy_data/_data/sites/irongrip.caddy
```
