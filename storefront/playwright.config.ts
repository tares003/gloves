import { defineConfig, devices } from "@playwright/test";

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:3020";

export default defineConfig({
	testDir: "./e2e",
	fullyParallel: true,
	forbidOnly: Boolean(process.env.CI),
	retries: process.env.CI ? 2 : 0,
	reporter: "list",
	use: {
		...devices["Desktop Chrome"],
		baseURL,
		trace: "on-first-retry",
		// Use a preinstalled Chromium when the matching Playwright browser isn't downloaded.
		launchOptions: process.env.PLAYWRIGHT_CHROMIUM_PATH
			? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_PATH }
			: undefined,
	},
	webServer: process.env.PLAYWRIGHT_BASE_URL
		? undefined
		: {
				command: "PORT=3020 pnpm start",
				url: `${baseURL}/en/uk`,
				reuseExistingServer: true,
				timeout: 120_000,
			},
});
