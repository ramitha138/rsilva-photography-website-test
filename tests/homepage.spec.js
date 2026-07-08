const { expect, test } = require("@playwright/test");
const { collectConsoleErrors, expected } = require("./helpers");

test.describe("homepage", () => {
  test("loads the public website without browser errors", async ({ page }) => {
    const consoleErrors = await collectConsoleErrors(page);

    await page.goto("/");

    await expect(page).toHaveTitle(expected.title);
    await expect(page.locator("main#home")).toBeVisible();
    await expect(page.getByRole("heading", { name: /fashion-led portraits/i })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Work" })).toBeVisible();
    await expect(page.getByRole("heading", { name: /built around light/i })).toBeVisible();
    await expect(page.getByRole("heading", { name: /ready to create/i })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Details" })).toBeVisible();

    expect(consoleErrors).toEqual([]);
  });

  test("has expected SEO metadata", async ({ page }) => {
    await page.goto("/");

    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", expected.canonicalUrl);
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
      "content",
      /R\.Silva Photography/i
    );
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
      "content",
      /\/public\/images\/night-editorial\.jpg$/
    );
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
      "content",
      "summary_large_image"
    );
  });
});
