import { expect, test } from "@playwright/test";

import { selectCombo, selectDate } from "./helper";

const mutualFundName = "Parag Parikh Flexi Cap Fund - Direct Plan - Growth";
test.beforeEach(async ({ page }) => {
  // Runs before each test and signs in each page.
  await page.goto("http://localhost:3001/");
  await page.getByText("Inventory Management").hover();
  await page.getByText("Buy Mutual Fund").click();
});

test("has title", async ({ page }) => {
  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/StockSync : Investments/);
});

test("add mutual fund purchase", async ({ page }) => {
  await page.getByRole("link", { name: "Buy Mutual Fund" }).click();
  await selectCombo(page, "Mutual Fund", mutualFundName);
  await selectCombo(page, "Broker", "UPSTOX");
  await selectCombo(page, "Currency", "INR");
  await selectDate(page, "Purchase Date");
  await page.getByPlaceholder("Qty").fill("500");
  await page.getByPlaceholder("Price").fill("74.98");
  await expect(page.getByText("37490.00")).toBeVisible();
  await page.getByRole("button", { name: "Save Investments" }).click();
  await page.waitForTimeout(1000);
  await expect(page.getByText("Your changes have been saved successfully", { exact: true })).toBeVisible();
});

test("search mutual fund purchase", async ({ page }) => {
  await expect(async () => {
    await page.getByRole("button", { name: "Broker" }).first().click();
    await expect(page.getByRole("option", { name: "UPSTOX" }).locator("div")).toBeVisible();
  }).toPass();
  await page.getByRole("option", { name: "UPSTOX" }).locator("div").click();
  await page.getByPlaceholder("Filter mutual funds...").fill(mutualFundName);
  await expect(await page.getByRole("cell", { name: mutualFundName }).count()).toBe(6);
});
