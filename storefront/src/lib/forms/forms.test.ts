import { beforeEach, describe, expect, it, vi } from "vitest";
import { contactSchema, toFieldErrors, tradeSchema, waitlistSchema } from "./schemas";
import { isRateLimited, resetRateLimit } from "./rate-limit";

vi.mock("./store", () => ({ storeSubmission: vi.fn(async () => true) }));
vi.mock("./notify", () => ({ notifySubmission: vi.fn(async () => true) }));

const { processForm } = await import("./process");
const { storeSubmission } = await import("./store");

function fd(values: Record<string, string>) {
	const data = new FormData();
	for (const [k, v] of Object.entries(values)) data.set(k, v);
	return data;
}

const validTrade = {
	name: "Sam Smith",
	businessName: "Smith Motors",
	businessType: "Automotive",
	email: "Sam@Example.com ",
	monthlyBoxes: "6–20",
	marketingConsent: "on",
};

describe("schemas", () => {
	it("accepts a valid trade enquiry and normalises email + consent", () => {
		const parsed = tradeSchema.parse(validTrade);
		expect(parsed.email).toBe("sam@example.com");
		expect(parsed.marketingConsent).toBe(true);
		expect(parsed.phone).toBeUndefined();
	});

	it("treats a missing consent checkbox as no consent", () => {
		const { marketingConsent: _omit, ...rest } = validTrade;
		expect(tradeSchema.parse(rest).marketingConsent).toBe(false);
	});

	it("rejects unknown business types and bad phone numbers", () => {
		const result = tradeSchema.safeParse({ ...validTrade, businessType: "Spaceships", phone: "call me" });
		expect(result.success).toBe(false);
		if (!result.success) {
			const errors = toFieldErrors(result.error);
			expect(errors["businessType"]).toBeDefined();
			expect(errors["phone"]).toBeDefined();
		}
	});

	it("requires the waitlist fields", () => {
		const result = waitlistSchema.safeParse({ email: "a@b.co" });
		expect(result.success).toBe(false);
		if (!result.success) {
			expect(Object.keys(toFieldErrors(result.error))).toEqual(
				expect.arrayContaining(["firstName", "useType", "gloveInterest", "monthlyBoxes"]),
			);
		}
	});

	it("requires a contact message", () => {
		expect(contactSchema.safeParse({ name: "A", email: "a@b.co", message: "   " }).success).toBe(false);
	});
});

describe("rate limit", () => {
	beforeEach(() => resetRateLimit());
	it("allows 5 requests per window then blocks", () => {
		const now = 1_000_000;
		for (let i = 0; i < 5; i++) expect(isRateLimited("k", now + i)).toBe(false);
		expect(isRateLimited("k", now + 10)).toBe(true);
		expect(isRateLimited("k", now + 11 * 60 * 1000)).toBe(false);
	});
});

describe("processForm", () => {
	beforeEach(() => {
		resetRateLimit();
		vi.mocked(storeSubmission).mockClear();
	});

	it("stores a valid submission and returns success", async () => {
		const state = await processForm("trade", tradeSchema, fd(validTrade), "1.2.3.4");
		expect(state.status).toBe("success");
		expect(storeSubmission).toHaveBeenCalledWith(
			"trade",
			"sam@example.com",
			expect.objectContaining({ businessName: "Smith Motors" }),
			true,
		);
	});

	it("returns field errors and echoes values on invalid input", async () => {
		const state = await processForm("contact", contactSchema, fd({ name: "", email: "nope", message: "" }), "1.2.3.4");
		expect(state.status).toBe("error");
		expect(state.fieldErrors?.["email"]).toBeDefined();
		expect(state.values?.["email"]).toBe("nope");
		expect(storeSubmission).not.toHaveBeenCalled();
	});

	it("silently accepts honeypot submissions without storing them", async () => {
		const state = await processForm("trade", tradeSchema, fd({ ...validTrade, website: "spam.example" }), "1.2.3.4");
		expect(state.status).toBe("success");
		expect(storeSubmission).not.toHaveBeenCalled();
	});
});
