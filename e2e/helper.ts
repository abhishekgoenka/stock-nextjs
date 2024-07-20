import { expect, Page } from "@playwright/test";

export async function selectCombo(page: Page, label: string, selectItem: string) {
  await expect(async () => {
    await page.getByLabel(label, { exact: true }).click();
    await expect(page.getByRole("option", { name: selectItem })).toBeVisible();
  }).toPass();
  await page.getByRole("option", { name: selectItem }).click();
}

export async function selectDate(page: Page, label: string) {
  await page.getByLabel(label, { exact: true }).click();
  await page.getByRole("gridcell", { name: "1", exact: true }).first().click();
}
