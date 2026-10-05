#!/usr/bin/env bash
# IronGrip — one-shot, re-runnable server setup (Ubuntu/Debian, run as root).
#
#   cd /opt/irongrip-site && bash deploy/setup-vm.sh
#
# Installs Docker if needed, generates secrets on first run (saved to /root/irongrip-credentials.txt),
# starts Saleor + Caddy (automatic HTTPS), migrates and seeds Saleor, builds and starts the storefront.
set -euo pipefail

REPO_DIR="$(cd "$(dirname "$0")/.." && pwd)"
API_DIR="$REPO_DIR/api"
ENV_FILE="$API_DIR/.env"
CREDS_FILE="/root/irongrip-credentials.txt"
COMPOSE=(docker compose --project-directory "$API_DIR" -f "$API_DIR/docker-compose.yml" --env-file "$ENV_FILE")

log() { printf '\n\033[1;33m==> %s\033[0m\n' "$*"; }

# 1. Docker ------------------------------------------------------------------
if ! command -v docker >/dev/null 2>&1; then
	log "Installing Docker"
	curl -fsSL https://get.docker.com | sh
fi
systemctl enable --now docker >/dev/null 2>&1 || true

# 2. Firewall (only if ufw is present) ---------------------------------------
if command -v ufw >/dev/null 2>&1; then
	log "Opening firewall ports 22, 80, 443"
	ufw allow 22/tcp >/dev/null || true
	ufw allow 80/tcp >/dev/null || true
	ufw allow 443/tcp >/dev/null || true
	ufw allow 443/udp >/dev/null || true
fi

# 3. Secrets / .env (first run only) -----------------------------------------
if [[ ! -f "$ENV_FILE" ]]; then
	log "Generating $ENV_FILE with fresh secrets"
	rand() { openssl rand -base64 48 | tr -dc 'A-Za-z0-9' | head -c "${1:-32}"; }
	SECRET_KEY="$(rand 64)"
	DB_PASSWORD="$(rand 32)"
	ADMIN_BASIC_PASSWORD="$(rand 20)"
	SALEOR_ADMIN_PASSWORD="$(rand 20)"
	ADMIN_BASIC_HASH="$(docker run --rm caddy:2-alpine caddy hash-password --plaintext "$ADMIN_BASIC_PASSWORD")"

	sed \
		-e "s|^SECRET_KEY=.*|SECRET_KEY=$SECRET_KEY|" \
		-e "s|^POSTGRES_PASSWORD=.*|POSTGRES_PASSWORD=$DB_PASSWORD|" \
		-e "s|^ADMIN_BASIC_AUTH_HASH=.*|ADMIN_BASIC_AUTH_HASH='$ADMIN_BASIC_HASH'|" \
		"$API_DIR/.env.example" >"$ENV_FILE"
	echo "SALEOR_ADMIN_EMAIL=admin@irongrip.uk" >>"$ENV_FILE"
	echo "SALEOR_ADMIN_PASSWORD=$SALEOR_ADMIN_PASSWORD" >>"$ENV_FILE"
	chmod 600 "$ENV_FILE"

	umask 077
	cat >"$CREDS_FILE" <<EOF
IronGrip credentials (generated $(date -u +%F))

Dashboard URL:         https://admin.irongrip.uk
1) Browser login box:  admin / $ADMIN_BASIC_PASSWORD
2) Saleor login:       admin@irongrip.uk / $SALEOR_ADMIN_PASSWORD

Database password and Django secret are in $ENV_FILE.
Change these passwords after first login and store them in a password manager.
EOF
fi

set -a
# shellcheck disable=SC1090
source "$ENV_FILE"
set +a

# 4. Backend -----------------------------------------------------------------
log "Pulling images"
"${COMPOSE[@]}" pull db cache api worker dashboard caddy

log "Starting database and cache"
"${COMPOSE[@]}" up -d db cache
for _ in {1..30}; do
	"${COMPOSE[@]}" exec -T db pg_isready -U "${POSTGRES_USER:-saleor}" >/dev/null 2>&1 && break
	sleep 2
done
# The forms DB is created by db-init on a fresh volume; make sure it exists on older volumes too.
"${COMPOSE[@]}" exec -T db psql -U "${POSTGRES_USER:-saleor}" -tc "SELECT 1 FROM pg_database WHERE datname='forms'" | grep -q 1 ||
	"${COMPOSE[@]}" exec -T db psql -U "${POSTGRES_USER:-saleor}" -c "CREATE DATABASE forms"

log "Running Saleor migrations"
"${COMPOSE[@]}" run --rm api python manage.py migrate --noinput

log "Creating Saleor admin user (skipped if it exists)"
"${COMPOSE[@]}" run --rm -e DJANGO_SUPERUSER_PASSWORD="$SALEOR_ADMIN_PASSWORD" api \
	python manage.py createsuperuser --noinput --email "$SALEOR_ADMIN_EMAIL" 2>/dev/null || true

log "Starting API, worker, dashboard and Caddy (HTTPS)"
"${COMPOSE[@]}" up -d api worker dashboard caddy

log "Waiting for https://$API_HOST/graphql/ (DNS + certificate)"
for i in {1..60}; do
	if curl -fsS -o /dev/null -X POST -H 'content-type: application/json' \
		-d '{"query":"{ shop { name } }"}' "https://$API_HOST/graphql/"; then
		echo "API is up."
		break
	fi
	[[ $i == 60 ]] && { echo "API not reachable over HTTPS. Check DNS A records and ports 80/443."; exit 1; }
	sleep 5
done

log "Seeding Saleor (channel, tax, product type, categories)"
docker run --rm --network irongrip_default \
	-v "$API_DIR/seed:/seed:ro" \
	-e SALEOR_API_URL="http://api:8000/graphql/" \
	-e SALEOR_ADMIN_EMAIL="$SALEOR_ADMIN_EMAIL" \
	-e SALEOR_ADMIN_PASSWORD="$SALEOR_ADMIN_PASSWORD" \
	node:22-alpine node /seed/seed.mjs

# 5. Storefront --------------------------------------------------------------
log "Building storefront (this takes a few minutes)"
"${COMPOSE[@]}" build storefront
"${COMPOSE[@]}" up -d storefront

log "Done"
"${COMPOSE[@]}" ps
echo
echo "Site:      https://$SITE_HOST"
echo "API:       https://$API_HOST/graphql/"
echo "Dashboard: https://$ADMIN_HOST   (credentials in $CREDS_FILE)"
