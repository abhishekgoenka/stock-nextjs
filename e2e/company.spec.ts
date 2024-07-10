import { test, expect } from "@playwright/test";

const companyName = "Dummy company";

test("has title", async ({ page }) => {
  await page.goto("http://localhost:3001/");

  await page.getByText("Profile Management").hover();

  await page.getByText("Company Information").click();

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/StockSync : Companies/);
});

test("add new company", async ({ page }) => {
  await page.goto("http://localhost:3001/");

  await page.getByText("Profile Management").hover();

  await page.getByText("Company Information").click();

  // should have add company button
  await expect(page.getByRole("button", { name: "Add Company" })).toBeVisible();

  page.getByRole("button", { name: "Add Company" }).click();
  await expect(page.getByRole("heading", { name: "Add Company" })).toBeVisible();

  // add new company

  await page.getByPlaceholder("Company name").fill(companyName);
  await page.getByLabel("Sector").click();
  await page.keyboard.down("ArrowDown");
  await page.keyboard.down("ArrowDown");
  await page.keyboard.press("Enter");

  await page.getByLabel("Type").click();
  await page.keyboard.down("ArrowDown");
  await page.keyboard.down("ArrowDown");
  await page.keyboard.press("Enter");

  await page.getByLabel("Exchange").click();
  await page.keyboard.down("ArrowDown");
  await page.keyboard.press("Enter");
  await page.getByPlaceholder("Symbol").fill("Test Symbol");
  await page.getByPlaceholder("URL").fill("http:\\www.test.com");
  await page.getByRole("button", { name: "Save" }).click();
  await page.waitForTimeout(1000);

  await expect(page.getByText("Your changes have been saved successfully", { exact: true })).toBeVisible();
  await page.waitForTimeout(1000);

  //validate the new company
  await page.reload();
  await page.getByPlaceholder("Filter companies...").pressSequentially(companyName, { delay: 500 });
  await page.getByRole("button", { name: "Type" }).first().focus();
  await expect(page.getByRole("cell", { name: companyName })).toBeVisible();
  await expect(page.getByRole("cell", { name: "Commodity Chemicals" })).toBeVisible();
  await expect(page.getByRole("cell", { name: "Smallcap" })).toBeVisible();
  await expect(page.getByRole("cell", { name: "NASDAQ" })).toBeVisible();
});
