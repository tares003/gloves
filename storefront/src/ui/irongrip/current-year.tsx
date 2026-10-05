"use client";

/** Current year, rendered on the client so prerendered pages never go stale. */
export function CurrentYear() {
	return <>{new Date().getFullYear()}</>;
}
