import { test, expect } from "@playwright/test";

test("home page loads with search input", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("searchbox")).toBeVisible();
});

test("search navigates to results page", async ({ page }) => {
  await page.goto("/");
  const input = page.getByRole("searchbox");
  await input.fill("crossref");
  await input.press("Enter");
  await expect(page).toHaveURL(/\/search\/works\?q=crossref/);
});
