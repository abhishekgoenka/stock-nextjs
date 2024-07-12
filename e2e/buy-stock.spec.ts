import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  // Runs before each test and signs in each page.
  await page.goto("http://localhost:3001/");
  await page.getByText("Inventory Management").hover();
  await page.getByText("Buy Stock").click();
});

test("has title", async ({ page }) => {
  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/StockSync : Investments/);
});
