import { z } from "zod";

const trimmed = (max: number) => z.string().trim().max(max);
const requiredText = (label: string, max = 200) => trimmed(max).min(1, `Please enter ${label}.`);
const email = z.string().trim().toLowerCase().email("Please enter a valid email address.").max(254);
const optionalPhone = trimmed(40)
	.optional()
	.transform((value) => (value ? value : undefined))
	.refine((value) => !value || /^[+()\d\s-]{7,40}$/.test(value), "Please enter a valid phone number.");

/** Checkbox values arrive as "on" or are missing. */
const checkbox = z
	.string()
	.optional()
	.transform((value) => value === "on" || value === "true");

export const BUSINESS_TYPES = [
	"Automotive",
	"Cleaning",
	"Beauty & tattoo",
	"Hospitality & food",
	"Construction & trades",
	"Other",
] as const;

export const MONTHLY_BOXES = ["1–5", "6–20", "21–50", "50+"] as const;

export const USE_TYPES = ["Business", "Home"] as const;

export const GLOVE_INTERESTS = ["Heavy duty", "Everyday", "Chemical resistant", "Food safe", "Not sure yet"] as const;

export const tradeSchema = z.object({
	name: requiredText("your name", 120),
	businessName: requiredText("your business name", 160),
	businessType: z.enum(BUSINESS_TYPES, { message: "Please choose your business type." }),
	email,
	phone: optionalPhone,
	monthlyBoxes: z.enum(MONTHLY_BOXES, { message: "Please choose roughly how many boxes a month." }),
	message: trimmed(2000).optional(),
	marketingConsent: checkbox,
});

export const waitlistSchema = z.object({
	firstName: requiredText("your first name", 80),
	email,
	useType: z.enum(USE_TYPES, { message: "Please tell us if this is for business or home." }),
	gloveInterest: z.enum(GLOVE_INTERESTS, { message: "Please choose the gloves you're interested in." }),
	monthlyBoxes: z.enum(MONTHLY_BOXES, { message: "Please choose roughly how many boxes a month." }),
	marketingConsent: checkbox,
});

export const contactSchema = z.object({
	name: requiredText("your name", 120),
	email,
	message: requiredText("a message", 4000),
});

export type FormKind = "trade" | "waitlist" | "contact";
export type TradeInput = z.infer<typeof tradeSchema>;
export type WaitlistInput = z.infer<typeof waitlistSchema>;
export type ContactInput = z.infer<typeof contactSchema>;

/** State returned by every form server action (consumed by useActionState). */
export type FormState = {
	status: "idle" | "success" | "error";
	message?: string;
	fieldErrors?: Record<string, string>;
	/** Echo of submitted values so the form keeps them after a validation error. */
	values?: Record<string, string>;
};

export const initialFormState: FormState = { status: "idle" };

/** Flatten zod issues to `{ field: firstMessage }`. */
export function toFieldErrors(error: z.ZodError): Record<string, string> {
	const fieldErrors: Record<string, string> = {};
	for (const issue of error.issues) {
		const key = String(issue.path[0] ?? "form");
		if (!fieldErrors[key]) fieldErrors[key] = issue.message;
	}
	return fieldErrors;
}
