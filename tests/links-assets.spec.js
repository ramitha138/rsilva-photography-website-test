const { expect, test } = require("@playwright/test");
const { expected } = require("./helpers");

const staticPaths = [
  "/robots.txt",
  "/sitemap.xml",
  "/site.webmanifest",
  "/favicon.ico",
  "/public/icons/favicon-32.png",
  "/public/images/portrait-red-chair.jpg",
  "/public/images/studio-blue-sofa.jpg",
  "/public/images/lifestyle-wine.jpg",
  "/public/images/beach-sunset.jpg",
  "/public/images/coastal-rocks.jpg",
  "/public/images/night-editorial.jpg",
  "/public/images/city-motion.jpg",
];

test.describe("links and static assets", () => {
  test("has expected contact and social links", async ({ page }) => {
    await page.goto("/");

    const instagramLinks = page.locator(`a[href="${expected.instagramUrl}"]`);
    const emailLinks = page.locator(`a[href="${expected.emailHref}"]`);

    await expect(instagramLinks).toHaveCount(3);
    await expect(emailLinks).toHaveCount(2);

    for (const link of await instagramLinks.all()) {
      await expect(link).toHaveAttribute("target", "_blank");
      await expect(link).toHaveAttribute("rel", /noreferrer/);
    }
  });

  for (const path of staticPaths) {
    test(`serves ${path}`, async ({ request }) => {
      const response = await request.get(path);

      expect(response.ok(), `${path} should return a successful response`).toBe(true);
    });
  }
});
