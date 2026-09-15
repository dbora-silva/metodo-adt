import { test, expect } from '@playwright/test';

import { LoginPage } from '../pages/login.page';
import { Navbar } from '../pages/components/navbar';
import { DEMO_USER } from '../support/test-data';

let loginPage: LoginPage;
let navbar: Navbar;

test.beforeEach(async ({ page }) => {
  loginPage = new LoginPage(page);
  navbar = new Navbar(page);
  // Arrange - Preparação do cenário
  await loginPage.go();
});


test('Deve autenticar o Controle de Missões', async () => {
  // Act - Execução da ação
  await loginPage.login(DEMO_USER.email, DEMO_USER.password);

  // Assert - Verificação do resultado
  await expect(navbar.logout).toBeVisible();
});

test('Deve falhar a autenticação com senha inválida', async () => {
  // Act - Execução da ação
  await loginPage.login(DEMO_USER.email, 'wrongpassword');

  // Assert - Verificação do resultado
  await expect(loginPage.alert).toHaveText('E-mail ou senha inválidos.');
});

test('Deve falhar a autenticação com e-mail não cadastrado', async () => {
  // Act - Execução da ação
  await loginPage.login('nonexistent@lunarpass.dev', DEMO_USER.password);

  // Assert - Verificação do resultado
  await expect(loginPage.alert).toHaveText('E-mail ou senha inválidos.');
});

test('Deve falhar quando a senha não for fornecida', async () => {
  // Act - Execução da ação
  await loginPage.login('nonexistent@lunarpass.dev', '');

  // Assert - Verificação do resultado
  await expect(loginPage.alert).toHaveText('Informe a senha');
});

test('Deve falhar quando o e-mail não for fornecido', async () => {
  // Act - Execução da ação
  await loginPage.login('', DEMO_USER.password);

  // Assert - Verificação do resultado
  await expect(loginPage.alert).toHaveText('Informe um e-mail válido');
});
