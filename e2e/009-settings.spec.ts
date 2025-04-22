import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  // Runs before each test and signs in each page.
  await page.goto("http://localhost:3001/");
  await page.getByRole("link", { name: "Setting" }).click();
});

test("has title", async ({ page }) => {
  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/StockSync : Setting/);
});

test("validate stock sync", async ({ page }) => {
  await page.getByRole("button", { name: "Sync Stock Price" }).click();
  await expect(async () => {
    await expect(page.getByText("Error: Company TestSymbol has")).toBeVisible();
  }).toPass();
});

test("validate mutal fund sync", async ({ page }) => {
  await page.getByRole("button", { name: "Sync Mutual Fund Price" }).click();
  await expect(async () => {
    await expect(page.getByText("Error: Fund test mutual fund")).toBeVisible();
  }).toPass();
});
