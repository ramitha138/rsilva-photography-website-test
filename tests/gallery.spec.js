const { expect, test } = require("@playwright/test");

test.describe("portfolio gallery", () => {
  test("opens, navigates, and closes the lightbox", async ({ page }) => {
    await page.goto("/");

    const firstItem = page.locator(".gallery-item").first();
    const dialog = page.getByRole("dialog", { name: "Fullscreen portfolio gallery" });
    const dialogImage = dialog.locator("img");

    await firstItem.click();

    await expect(dialog).toBeVisible();
    await expect(dialogImage).toHaveAttribute("src", /portrait-red-chair\.jpg$/);

    await page.getByRole("button", { name: "Next image" }).click();
    await expect(dialogImage).toHaveAttribute("src", /studio-blue-sofa\.jpg$/);

    await page.getByRole("button", { name: "Previous image" }).click();
    await expect(dialogImage).toHaveAttribute("src", /portrait-red-chair\.jpg$/);

    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
  });

  test("closes the lightbox from the close button", async ({ page }) => {
    await page.goto("/");

    const dialog = page.getByRole("dialog", { name: "Fullscreen portfolio gallery" });

    await page.locator(".gallery-item").nth(1).click();
    await expect(dialog).toBeVisible();

    await page.getByRole("button", { name: "Close gallery" }).click();
    await expect(dialog).toBeHidden();
  });
});
