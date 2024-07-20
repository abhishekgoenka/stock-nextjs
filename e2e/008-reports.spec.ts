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
