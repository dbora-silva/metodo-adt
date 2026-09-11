import { test, expect } from '@playwright/test';

test('O slogan deve estar visível', async ({ page }) => {
  await page.goto('http://localhost:3001/');

  await expect(page).toHaveTitle("Lunar Pass — Passagens para a Lua");
});