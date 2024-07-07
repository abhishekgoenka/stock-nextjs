import { test, expect } from "@playwright/test";

test("has title", async ({ page }) => {
  await page.goto("http://localhost:3001/");

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/StockSync : Dashboard/);
});

test("get overview link", async ({ page }) => {
  await page.goto("http://localhost:3001/");

  // Click the get started link.
  await page.getByRole("link", { name: "Dashboard" }).click();

  // Expects page to have a heading with the name of Installation.
  const totalInvestmentPage = await page.getByRole("heading", { name: "Total Investment" });
  await expect(totalInvestmentPage.first()).toBeVisible();

  await expect(await page.getByText("₹2,17,04,485.46")).toBeVisible();
  await expect(await page.getByText("$25,789.27")).toBeVisible();
  await expect(await page.getByText("₹47,89,131.43")).toBeVisible();
  await expect(await page.getByText("$12,726.18")).toBeVisible();
});
