import { test, expect } from "@playwright/test";

const mutualFundName = "test mutual fund";

test.beforeEach(async ({ page }) => {
  // Runs before each test and signs in each page.
  await page.goto("http://localhost:3001/");
  await page.getByText("Profile Management").hover();
  await page.getByText("Mutual Fund Information").click();
});

test("has title", async ({ page }) => {
  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/StockSync : Mutual Fund/);
});

test("add new mutual fund", async ({ page }) => {
  // should have add mutual func button
  await expect(page.getByRole("button", { name: "Add Mutual Fund" })).toBeVisible();

  await page.getByRole("button", { name: "Add Mutual Fund" }).click();
  await expect(page.getByRole("heading", { name: "Add Mutual Fund" })).toBeVisible();

  // add new mutual fund
  await page.getByPlaceholder("Mutual fund name").fill(mutualFundName);
  await page.getByPlaceholder("URL").fill("http://www.test.com");
  await page.getByLabel("Exchange").click();
  await page.getByLabel("NSE").click();
  await page.getByPlaceholder("Symbol").click();
  await page.getByPlaceholder("Symbol").fill("test");
  await page.getByLabel("Index fund").click();
  await page.getByPlaceholder("Equity").fill("99");
  await page.getByPlaceholder("Large cap").fill("1");
  await page.getByRole("button", { name: "Save" }).click();
  await page.waitForTimeout(1000);

  await expect(page.getByText("Your changes have been saved successfully", { exact: true })).toBeVisible();
  await page.waitForTimeout(1000);

  //validate the new company
  await page.reload();
  await page.getByPlaceholder("Filter mutual fund...").pressSequentially(mutualFundName, { delay: 500 });
  await page.getByRole("button", { name: "View" }).click();
  await page.getByRole("menuitemcheckbox", { name: "equity" }).click();
  await page.getByRole("button", { name: "View" }).click();
  await page.getByRole("menuitemcheckbox", { name: "debt" }).click();
  await page.getByRole("button", { name: "View" }).click();
  await page.getByRole("menuitemcheckbox", { name: "others" }).click();
  await page.getByRole("button", { name: "View" }).click();
  await page.getByRole("menuitemcheckbox", { name: "exchange" }).click();
  await page.getByRole("button", { name: "View" }).click();
  await page.getByRole("menuitemcheckbox", { name: "currentPrice" }).click();

  await expect(page.getByRole("cell", { name: mutualFundName })).toBeVisible();
});
