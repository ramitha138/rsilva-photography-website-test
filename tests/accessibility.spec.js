const { expect, test } = require("@playwright/test");
const AxeBuilder = require("@axe-core/playwright").default;

test.describe("accessibility", () => {
  test("has no serious or critical accessibility violations on the homepage", async ({ page }) => {
    await page.goto("/");

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();

    const seriousOrCritical = results.violations.filter((violation) =>
      ["serious", "critical"].includes(violation.impact)
    );

    expect(seriousOrCritical).toEqual([]);
  });
});
