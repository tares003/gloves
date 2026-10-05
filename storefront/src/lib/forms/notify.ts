import nodemailer, { type Transporter } from "nodemailer";
import type { FormKind } from "./schemas";

/**
 * Email notification to the IronGrip inbox.
 * SMTP_URL=smtp://user:pass@host:port  (local dev: smtp://localhost:1025 → Mailpit)
 */
let transporter: Transporter | null = null;

function getTransporter() {
	const url = process.env["SMTP_URL"];
	if (!url) return null;
	transporter ??= nodemailer.createTransport(url);
	return transporter;
}

const SUBJECTS: Record<FormKind, string> = {
	trade: "New trade account enquiry",
	waitlist: "New subscription waitlist sign-up",
	contact: "New contact message",
};

const RECIPIENT_ENV: Record<FormKind, string> = {
	trade: "FORMS_TRADE_EMAIL",
	waitlist: "FORMS_NOTIFY_EMAIL",
	contact: "FORMS_NOTIFY_EMAIL",
};

function escapeHtml(value: string) {
	return value.replace(
		/[&<>"']/g,
		(c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] ?? c,
	);
}

export async function notifySubmission(
	kind: FormKind,
	replyTo: string,
	fields: Record<string, unknown>,
): Promise<boolean> {
	const transport = getTransporter();
	const to = process.env[RECIPIENT_ENV[kind]] || process.env["FORMS_NOTIFY_EMAIL"] || "hello@irongrip.uk";
	const from = process.env["FORMS_FROM_EMAIL"] || "IronGrip <noreply@irongrip.uk>";
	if (!transport) {
		console.warn("[forms] SMTP_URL not set — notification not sent");
		return false;
	}

	const rows = Object.entries(fields)
		.filter(([, value]) => value !== undefined && value !== "")
		.map(([key, value]) => [key, String(value)] as const);

	try {
		await transport.sendMail({
			from,
			to,
			replyTo,
			subject: `${SUBJECTS[kind]} — IronGrip`,
			text: rows.map(([k, v]) => `${k}: ${v}`).join("\n"),
			html: `<h2>${SUBJECTS[kind]}</h2><table cellpadding="6">${rows
				.map(([k, v]) => `<tr><th align="left">${escapeHtml(k)}</th><td>${escapeHtml(v)}</td></tr>`)
				.join("")}</table>`,
		});
		return true;
	} catch (error) {
		console.error("[forms] failed to send notification", error instanceof Error ? error.message : error);
		return false;
	}
}
