/**
 * Cloudflare Turnstile server-side verification.
 * When TURNSTILE_SECRET_KEY is unset, verification is skipped (honeypot + rate limit still apply)
 * so the site keeps working before Turnstile is configured. Set both keys in production.
 * Use Cloudflare's published test keys in development/CI.
 */
let warned = false;

export async function verifyTurnstile(token: string | null, ip: string | null): Promise<boolean> {
	const secret = process.env["TURNSTILE_SECRET_KEY"];
	if (!secret) {
		if (!warned && process.env.NODE_ENV === "production") {
			console.warn("[forms] TURNSTILE_SECRET_KEY not set — Turnstile check skipped");
			warned = true;
		}
		return true;
	}
	if (!token) return false;

	const body = new URLSearchParams({ secret, response: token });
	if (ip) body.set("remoteip", ip);

	try {
		const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
			method: "POST",
			body,
			cache: "no-store",
		});
		const data = (await res.json()) as { success?: boolean };
		return data.success === true;
	} catch (error) {
		console.error("[forms] Turnstile verification failed", error instanceof Error ? error.message : error);
		return false;
	}
}
