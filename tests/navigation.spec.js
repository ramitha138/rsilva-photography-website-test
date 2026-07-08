const { expect, test } = require("@playwright/test");

test.describe("navigation", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("opens and closes the mobile menu", async ({ page }) => {
    await page.goto("/");

    const menuButton = page.getByRole("button", { name: "Open navigation" });
    const siteMenu = page.locator("#site-menu");

    await expect(siteMenu).toBeHidden();
    await expect(menuButton).toHaveAttribute("aria-expanded", "false");

    await menuButton.click();

    await expect(page.getByRole("button", { name: "Close navigation" })).toHaveAttribute(
      "aria-expanded",
      "true"
    );
    await expect(siteMenu).toBeVisible();

    await page.keyboard.press("Escape");

    await expect(page.getByRole("button", { name: "Open navigation" })).toHaveAttribute(
      "aria-expanded",
      "false"
    );
    await expect(siteMenu).toBeHidden();
  });

  test("menu links navigate to the expected page sections", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("button", { name: "Open navigation" }).click();
    await page.getByRole("link", { name: "Work" }).click();

    await expect(page).toHaveURL(/#portfolio$/);
    await expect(page.locator("#portfolio")).toBeInViewport();

    await page.getByRole("button", { name: "Open navigation" }).click();
    await page.getByRole("link", { name: "Approach" }).click();

    await expect(page).toHaveURL(/#about$/);
    await expect(page.locator("#about")).toBeInViewport();
  });
});
