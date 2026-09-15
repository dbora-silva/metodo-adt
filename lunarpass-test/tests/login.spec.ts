import { test, expect } from '@playwright/test';

import { LoginPage } from '../pages/components/login.page';
import { Navbar } from '../pages/components/navbar';

let loginPage: LoginPage;
let navbar: Navbar;

test.beforeEach(async ({ page }) => {
  loginPage = new LoginPage(page);
  navbar = new Navbar(page);
  // Arrange - Preparação do cenário
  await loginPage.go();
});


test('Deve autenticar o Controle de Missões', async ({ page }) => {
  // Act - Execução da ação
  await loginPage.login('buzz@lunarpass.dev', 'pwd123');

  // Assert - Verificação do resultado
  await expect(navbar.logoutButton).toBeVisible();
});  

test('Deve falhar a autenticação com senha inválida', async ({ page }) => {
  // Act - Execução da ação
  await loginPage.login('buzz@lunarpass.dev', 'wrongpassword');

  // Assert - Verificação do resultado
  await expect(loginPage.alert).toHaveText('E-mail ou senha inválidos.');
});

test('Deve falhar a autenticação com e-mail não cadastrado', async ({ page }) => {
  // Act - Execução da ação
  await loginPage.login('nonexistent@lunarpass.dev', 'pwd123');

  // Assert - Verificação do resultado
  await expect(loginPage.alert).toHaveText('E-mail ou senha inválidos.');
});

test('Deve falhar quando a senha não for fornecida', async ({ page }) => {
  // Act - Execução da ação
  await loginPage.login('nonexistent@lunarpass.dev', '');

  // Assert - Verificação do resultado
  await expect(loginPage.alert).toHaveText('Informe a senha');
});

test('Deve falhar quando o e-mail não for fornecido', async ({ page }) => {
  // Act - Execução da ação
  await loginPage.login('', 'pwd123');

  // Assert - Verificação do resultado
  await expect(loginPage.alert).toHaveText('Informe um e-mail válido');
});