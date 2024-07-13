import { Page } from "@playwright/test";

export async function selectCombo(page: Page, label: string, selectItem: string) {
  await page.getByLabel(label, { exact: true }).click();
  // await page.getByLabel(label, { exact: true }).click();
  let selected = false;
  do {
    await page.keyboard.press("Enter");
    const currentSelectedItem = await page.getByLabel(label, { exact: true }).textContent();
    if (selectItem === currentSelectedItem) {
      selected = true;
    } else {
      await page.keyboard.down("ArrowDown");
      await page.keyboard.down("ArrowDown");
    }
  } while (!selected);
}

export async function selectDate(page: Page, label: string) {
  await page.getByLabel(label, { exact: true }).click();
  await page.getByRole("gridcell", { name: "1", exact: true }).first().click();
}
