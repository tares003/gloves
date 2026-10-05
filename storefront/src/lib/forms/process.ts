import { type z } from "zod";
import { isRateLimited } from "./rate-limit";
import { notifySubmission } from "./notify";
import { storeSubmission } from "./store";
import { type FormKind, type FormState, toFieldErrors } from "./schemas";
import { verifyTurnstile } from "./turnstile";

const HONEYPOT_FIELD = "website";

const SUCCESS_MESSAGES: Record<FormKind, string> = {
	trade: "Thanks — we've got your details. We'll be in touch within one working day.",
	waitlist: "You're on the list. We'll email you before launch with founding-member pricing.",
	contact: "Thanks for getting in touch. We'll reply within one working day.",
};

function formDataToValues(formData: FormData): Record<string, string> {
	const values: Record<string, string> = {};
	for (const [key, value] of formData.entries()) {
		if (typeof value === "string" && !key.startsWith("$") && key !== "cf-turnstile-response") {
			values[key] = value;
		}
	}
	return values;
}

/**
 * Shared pipeline for every form: honeypot → rate limit → Turnstile → validate → store → notify.
 * Pure of framework APIs so it can be unit-tested; the server action passes the client IP.
 */
export async function processForm<S extends z.ZodType<Record<string, unknown>>>(
	kind: FormKind,
	schema: S,
	formData: FormData,
	ip: string | null,
): Promise<FormState> {
	const values = formDataToValues(formData);

	// Bots fill hidden fields; pretend success so they move on.
	if (values[HONEYPOT_FIELD]) {
		return { status: "success", message: SUCCESS_MESSAGES[kind] };
	}

	if (isRateLimited(`${kind}:${ip ?? "unknown"}`)) {
		return {
			status: "error",
			message: "Too many submissions from your connection. Please try again in a few minutes.",
			values,
		};
	}

	const token = formData.get("cf-turnstile-response");
	const human = await verifyTurnstile(typeof token === "string" ? token : null, ip);
	if (!human) {
		return { status: "error", message: "Please complete the security check and try again.", values };
	}

	const { [HONEYPOT_FIELD]: _honeypot, ...input } = values;
	const parsed = schema.safeParse(input);
	if (!parsed.success) {
		return {
			status: "error",
			message: "Please check the highlighted fields.",
			fieldErrors: toFieldErrors(parsed.error),
			values,
		};
	}

	const data = parsed.data;
	const email = String(data["email"]);
	const consent = data["marketingConsent"] === true;

	const [stored, notified] = await Promise.all([
		storeSubmission(kind, email, data, consent),
		notifySubmission(kind, email, data),
	]);

	if (!stored && !notified) {
		return {
			status: "error",
			message: "Sorry, something went wrong on our side. Please email hello@irongrip.uk instead.",
			values,
		};
	}

	return { status: "success", message: SUCCESS_MESSAGES[kind] };
}
