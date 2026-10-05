/**
 * Small in-memory sliding-window rate limiter (per server instance).
 * Good enough for a single-VM deployment; Cloudflare WAF rules add a second layer.
 */
const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 5;
const hits = new Map<string, number[]>();

export function isRateLimited(key: string, now: number = Date.now()): boolean {
	const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
	if (recent.length >= MAX_REQUESTS) {
		hits.set(key, recent);
		return true;
	}
	recent.push(now);
	hits.set(key, recent);
	if (hits.size > 10_000) {
		const oldest = hits.keys().next().value;
		if (oldest) hits.delete(oldest);
	}
	return false;
}

export function resetRateLimit() {
	hits.clear();
}
