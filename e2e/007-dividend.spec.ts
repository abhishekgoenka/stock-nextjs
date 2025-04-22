import { expect, test } from "@playwright/test";

import { selectCombo, selectDate } from "./helper";

test.beforeEach(async ({ page }) => {
  // Runs before each test and signs in each page.
  await page.goto("http://localhost:3001/");
  await page.getByText("Inventory Management").hover();
  await page.getByText("Dividend", { exact: true }).click();
});

test("has title", async ({ page }) => {
  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/StockSync : Dividend/);
});

test("receive dividend of $1000 to Fidility - Traditional", async ({ page }) => {
  await page.getByRole("link", { name: "Add Deposit" }).click();
  await selectCombo(page, "Description", "Dividend");
  await selectDate(page, "Purchase Date");
  await selectCombo(page, "Currency", "USD");
  await page.getByPlaceholder("Amount").fill("1000");
  await selectCombo(page, "From", "Fidility - Traditional");
  await selectCombo(page, "To", "Fidility - Traditional");
  await page.waitForTimeout(1000);
  await page.getByRole("button", { name: "Save" }).click();

  await expect(page.getByText("Your changes have been saved successfully", { exact: true })).toBeVisible();
});
