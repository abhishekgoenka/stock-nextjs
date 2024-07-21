import { test, expect, Page } from "@playwright/test";
import { selectCombo, selectDate } from "./helper";

test.beforeEach(async ({ page }) => {
  // Runs before each test and signs in each page.
  await page.goto("http://localhost:3001/");
  await page.getByRole("link", { name: "Reports" }).click();
});

test("has title", async ({ page }) => {
  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/StockSync : Report/);
});

test("validate report", async ({ page }) => {
  await page.getByLabel("NSE").click();
  await expect(page.getByText("₹5,00,000.00").nth(1)).toBeVisible();
  await expect(page.getByText("₹2,17,04,485.46")).toBeVisible();
  await expect(page.getByText("₹91,99,999.99").nth(1)).toBeVisible();
  await expect(page.getByText("₹2,64,93,616.89")).toBeVisible();
  await expect(page.getByText("₹47,89,131.43")).toBeVisible();
  await expect(page.getByText("₹1,83,40,358.11")).toBeVisible();
  await expect(page.getByText("₹2,00,30,296.66")).toBeVisible();
  await expect(page.getByText("₹76,286.45").nth(1)).toBeVisible();
  await expect(page.getByText("₹1,83,635.57")).toBeVisible();

  await expect(page.getByText("₹17,24,864.02")).toBeVisible();
  await expect(page.getByText("₹4,020.00")).toBeVisible();
});

test("add annual return", async ({ page }) => {
  await page.getByRole("link", { name: "Add Annual Return" }).click();
  await selectCombo(page, "Year", "2024");
  await page.getByLabel("Investments").fill("1000");
  await page.getByLabel("Expected return").fill("2000");
  await page.getByLabel("Actual return").fill("1800");
  await page.getByLabel("Return percentage").fill("18");
  await page.getByLabel("Index Return").fill("17");
  await selectCombo(page, "Exchange", "NSE");
  await page.getByRole("button", { name: "Save" }).click();
  await page.waitForTimeout(1000);
  await expect(page.getByText("Your changes have been saved successfully", { exact: true })).toBeVisible();
});

test("validate annual return", async ({ page }) => {
  await expect(page.getByRole("cell", { name: "2024", exact: true }).nth(2)).toBeVisible();
  await expect(page.getByText("₹1,000.00")).toBeVisible();
  await expect(page.getByText("₹2,000.00")).toBeVisible();
  await expect(page.getByText("₹1,800.00")).toBeVisible();
  await expect(page.getByText("18.00%")).toBeVisible();
});
