import { expect, test } from "@playwright/test";

const PAGES = ["/", "/products", "/trade", "/subscribe", "/quality", "/about", "/contact", "/faq", "/legal/privacy"];

test.describe("IronGrip phase-1 pages", () => {
	for (const path of PAGES) {
		test(`${path} renders with exactly one h1`, async ({ page }) => {
			const response = await page.goto(path);
			expect(response?.status()).toBe(200);
			await expect(page.locator("h1")).toHaveCount(1);
			await expect(page.locator("footer")).toContainText("Registered in England and Wales");
		});
	}

	test("home has no horizontal scroll at 360px", async ({ page }) => {
		await page.setViewportSize({ width: 360, height: 800 });
		await page.goto("/");
		const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
		expect(overflow).toBe(false);
	});

	test("products shows the launch empty state", async ({ page }) => {
		await page.goto("/products");
		await expect(page.getByRole("heading", { name: /the range is on its way/i })).toBeVisible();
	});
});

test.describe("forms", () => {
	test("trade enquiry validates then succeeds", async ({ page }) => {
		await page.goto("/trade");
		const form = page.getByRole("form", { name: "Request a trade account" });
		await form.getByRole("button", { name: /send enquiry/i }).click();
		await expect(form.getByRole("alert").first()).toBeVisible();

		await form.getByLabel("Your name").fill("Playwright Test");
		await form.getByLabel("Business name").fill("Test Garage Ltd");
		await form.getByLabel("Business type").selectOption("Automotive");
		await form.getByLabel(/how many boxes/i).selectOption("6–20");
		await form.getByRole("textbox", { name: /^Email/ }).fill(`e2e+${Date.now()}@example.com`);
		await form.getByRole("button", { name: /send enquiry/i }).click();

		await expect(page.getByRole("status")).toContainText("We'll be in touch within one working day");
	});

	test("waitlist sign-up succeeds", async ({ page }) => {
		await page.goto("/subscribe");
		const form = page.getByRole("form", { name: "Join the waitlist" });
		await form.getByLabel("First name").fill("Alex");
		await form.getByRole("textbox", { name: /^Email/ }).fill(`waitlist+${Date.now()}@example.com`);
		await form.getByLabel(/business or home/i).selectOption("Business");
		await form.getByLabel(/which gloves/i).selectOption("Heavy duty");
		await form.getByLabel(/how many boxes/i).selectOption("1–5");
		await form.getByRole("button", { name: /join the waitlist/i }).click();
		await expect(page.getByRole("status")).toContainText("You're on the list");
	});

	test("contact message succeeds", async ({ page }) => {
		await page.goto("/contact");
		const form = page.getByRole("form", { name: "Contact IronGrip" });
		await form.getByLabel("Name").fill("Jo");
		await form.getByRole("textbox", { name: /^Email/ }).fill(`contact+${Date.now()}@example.com`);
		await form.getByLabel("Message").fill("Do you sell XXL?");
		await form.getByRole("button", { name: /send message/i }).click();
		await expect(page.getByRole("status")).toContainText("Thanks for getting in touch");
	});
});
