import postgres from "postgres";
import type { FormKind } from "./schemas";

/**
 * Form submissions are stored in a separate `forms` Postgres database (not Saleor's), so
 * Saleor upgrades never touch them. Table is created on first use.
 *
 * FORMS_DATABASE_URL=postgres://user:pass@host:5432/forms
 */
let sql: ReturnType<typeof postgres> | null = null;
let ready: Promise<void> | null = null;

function getClient() {
	const url = process.env["FORMS_DATABASE_URL"];
	if (!url) return null;
	if (!sql) {
		sql = postgres(url, { max: 3, idle_timeout: 30 });
	}
	return sql;
}

async function ensureTable(client: ReturnType<typeof postgres>) {
	if (!ready) {
		ready = client`
			CREATE TABLE IF NOT EXISTS form_submissions (
				id BIGSERIAL PRIMARY KEY,
				kind TEXT NOT NULL,
				email TEXT NOT NULL,
				payload JSONB NOT NULL,
				marketing_consent BOOLEAN NOT NULL DEFAULT FALSE,
				created_at TIMESTAMPTZ NOT NULL DEFAULT now()
			)
		`.then(async () => {
			await client`CREATE INDEX IF NOT EXISTS form_submissions_email_idx ON form_submissions (email)`;
		});
	}
	return ready;
}

/** Persist a submission. Returns false (and logs) when storage is unavailable. */
export async function storeSubmission(
	kind: FormKind,
	email: string,
	payload: Record<string, unknown>,
	marketingConsent: boolean,
): Promise<boolean> {
	const client = getClient();
	if (!client) {
		console.warn("[forms] FORMS_DATABASE_URL not set — submission not stored");
		return false;
	}
	try {
		await ensureTable(client);
		await client`
			INSERT INTO form_submissions (kind, email, payload, marketing_consent)
			VALUES (${kind}, ${email}, ${client.json(payload as postgres.JSONValue)}, ${marketingConsent})
		`;
		return true;
	} catch (error) {
		ready = null;
		console.error("[forms] failed to store submission", error instanceof Error ? error.message : error);
		return false;
	}
}
