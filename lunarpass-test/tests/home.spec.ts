import { test, expect } from '@playwright/test';

test('Expect slogan visible', async ({ page }) => {
  await page.goto('http://localhost:3001/');

  await expect(page).toHaveTitle("Lunar Pass — Passagens para a Lua");
});