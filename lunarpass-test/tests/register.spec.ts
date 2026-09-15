import { test, expect } from '@playwright/test';

import { LoginPage } from '../pages/components/login.page';
import { DashPage } from '../pages/components/dash.page';
import { RegisterPage } from '../pages/components/register.page';
import { Toast } from '../pages/components/toast';
import { faker } from '@faker-js/faker';
import { Mission } from '../support/mission';

test('Deve cadastrar uma nova missão', async ({ page }) => {

  const mission: Mission = {
    id: 'LP-' + faker.string.alphanumeric({ length: { min: 5, max: 5 } }),
    rocket: 'Starshitp',
    lunarBase: 'aurora',
    departureDate: '2028-01-20',
    returnDate: '27 de jan. de 2028',
    price: '1000'
  };

  const loginPage = new LoginPage(page);
  const dashPage = new DashPage(page);
  const registerPage = new RegisterPage(page);
  const toast = new Toast(page);

  // Arrange - Preparação do cenário
  await loginPage.go();
  await loginPage.login('buzz@lunarpass.dev', 'pwd123');

  await dashPage.goToNewMission();
  await expect(registerPage.title).toBeVisible();

  // Act - Execução da ação
  await registerPage.submit(mission);

  // Assert - Verificação do resultado
  await expect(toast.message).toContainText('A nova missão foi adicionada ao catálogo e já está disponível para reservas.');
});


