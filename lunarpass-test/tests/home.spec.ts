import { test, expect } from '@playwright/test';

test('Deve exibir o título da aplicação', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveTitle("Lunar Pass — Passagens para a Lua");
});