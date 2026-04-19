import { expect, test } from "@playwright/test";

// Resolved in globalSetup from the Testcontainers nginx instance.
const base = () => process.env.PLAYWRIGHT_BASE_URL!;

test("homepage loads with correct structure", async ({ page }) => {
	await page.goto(base());
	await expect(page).toHaveTitle(/Usarral/);
	await expect(page.locator("header")).toBeVisible();
	await expect(page.locator("main")).toBeVisible();
	await expect(page.locator("footer")).toBeVisible();
});

test("blog page loads and shows content", async ({ page }) => {
	await page.goto(`${base()}/posts/`);
	await expect(page).toHaveTitle(/Usarral/);
	await expect(page.locator("main")).toBeVisible();
});

test("tags index page loads", async ({ page }) => {
	await page.goto(`${base()}/tags/`);
	await expect(page.locator("main")).toBeVisible();
});

test("navigation link to blog works", async ({ page }) => {
	await page.goto(base());
	await page.click('a[href="/posts/"]');
	await expect(page).toHaveURL(/\/posts\//);
});

test("unknown route returns 404", async ({ page }) => {
	const response = await page.goto(`${base()}/this-page-does-not-exist/`);
	expect(response?.status()).toBe(404);
});
