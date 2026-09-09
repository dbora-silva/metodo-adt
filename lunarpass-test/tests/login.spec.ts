import { test, expect } from '@playwright/test';

test('Deve autenticar o Controle de Missões', async ({ page }) => {
  
  // AAA Patern
  // Arrange - Preparação do cenário
  await page.goto('http://localhost:3001/mission-control/login'); 

  const title = page.getByRole('heading', { name: 'Mission Control' });
  await expect(title).toBeVisible();

  // Act - Execução da ação
  await page.getByLabel('E-mail').fill('buzz@lunarpass.dev');
  await page.getByLabel('Senha').fill('pwd123');
  await page.getByRole('button', { name: 'Entrar' }).click();

  // Assert - Verificação do resultado
  const logoutButton = page.getByRole('button', { name: 'Sair' });
  await expect(logoutButton).toBeVisible();
});  

