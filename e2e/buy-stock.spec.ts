import { test, expect, Page } from "@playwright/test";

const companyName = "Clean Science & Technology";
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

test("add stock purchase", async ({ page }) => {
  await page.getByRole("link", { name: "Buy Stock" }).click();
  // await page.getByLabel("Company").click();
  await selectCombo(page, "Company", "Clean Science & Technology");
  // await page.getByRole("combobox").first().click();
  // await page.getByLabel("Clean Science & Technology").getByText("Clean Science & Technology").click();
});

async function selectCombo(page: Page, label: string, selectItem: string) {
  console.log(await page.getByLabel(label).allInnerTexts());
  await page.getByLabel(label).click();
  await page.getByLabel(label).click();
  let selected = false;
  do {
    await page.keyboard.press("Enter");
    const currentSelectedItem = await page.getByLabel(label).textContent();
    console.log(currentSelectedItem);
    if (selectItem === currentSelectedItem) {
      console.log("true", currentSelectedItem);
      selected = true;
    } else {
      await page.keyboard.down("ArrowDown");
      await page.keyboard.down("ArrowDown");
    }
  } while (!selected);
  // await page.keyboard.down("ArrowDown");
  // await page.keyboard.press("Enter");
  console.log(await page.getByLabel(label).textContent());
}
