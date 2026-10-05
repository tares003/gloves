#!/usr/bin/env bash
# Give IronGrip (/opt/irongrip-site on the VM) a login to the shared Stalwart
# mail server, so the website forms (storefront) and Saleor can send email.
# Run it on the Mac, in a terminal, once the sending mailbox exists in
# Stalwart's admin panel (Directory → Accounts):
#
#   bash deploy/set-mail-login.sh
#
# The password is typed at a hidden prompt and goes straight to the server over
# ssh. There it is tried against mail.properslang.com:465 first; only if the
# login works is it written into api/.env (root only, backed up first) as
# SMTP_URL (storefront forms) and EMAIL_URL (Saleor), and the storefront, api
# and worker containers are recreated. It never appears on screen, in your
# shell history, in a process list or in a log.
set -euo pipefail
HOST=${DEPLOY_HOST:-root@81.0.249.46}
KEY=${DEPLOY_KEY:-$HOME/.ssh/vm}

read -r -p "Mailbox the site signs in as [noreply@irongrip.uk]: " user
user=${user:-noreply@irongrip.uk}
read -r -s -p "Its password (hidden as you type): " pass
echo
if [ -z "$pass" ]; then
	echo "The password is needed." >&2
	exit 1
fi

printf '%s\n%s\n' "$user" "$pass" | ssh -i "$KEY" -o BatchMode=yes "$HOST" '
  set -eu
  IFS= read -r user; IFS= read -r pass
  cd /opt/irongrip-site/api
  MAIL_USER="$user" MAIL_PASS="$pass" python3 - <<"PY"
import os, re, shutil, smtplib, ssl, sys, time
from urllib.parse import quote
user, password = os.environ["MAIL_USER"], os.environ["MAIL_PASS"]
try:
    s = smtplib.SMTP_SSL("mail.properslang.com", 465, timeout=20, context=ssl.create_default_context())
    s.login(user, password)
    s.quit()
except smtplib.SMTPAuthenticationError:
    sys.exit("The mail server refused that password. Nothing was changed.")
creds = quote(user, safe="") + ":" + quote(password, safe="")
values = {
    "SMTP_URL": "smtps://%s@mail.properslang.com:465" % creds,
    "EMAIL_URL": "smtp://%s@mail.properslang.com:465/?ssl=True" % creds,
    "FORMS_FROM_EMAIL": "\"IronGrip <%s>\"" % user,
    "DEFAULT_FROM_EMAIL": user,
}
shutil.copy2(".env", ".env.bak-mail-" + time.strftime("%Y%m%d-%H%M%S"))
lines = [l for l in open(".env").read().splitlines()
         if not re.match(r"^#?\s*(%s)=" % "|".join(values), l)]
lines += ["%s=%s" % kv for kv in values.items()]
old = os.umask(0o077)
open(".env.new", "w").write("\n".join(lines) + "\n")
os.umask(old)
os.replace(".env.new", ".env")
print("The mail server accepted the login for %s. api/.env updated." % user)
PY
  docker compose --env-file .env up -d --no-build storefront api worker </dev/null >/dev/null 2>&1
  echo "Storefront, api and worker restarted with email on."'
echo "Done. Tell Claude, and it will send a test form submission."
