import { test, expect } from '@playwright/test';

import { LoginPage } from '../pages/login.page';
import { DashPage } from '../pages/dash.page';
import { RegisterPage } from '../pages/register.page';
import { Toast } from '../pages/components/toast';
import { Navbar } from '../pages/components/navbar';
import { faker } from '@faker-js/faker';
import { Mission } from '../support/types';
import { DEMO_USER } from '../support/test-data';
import { deleteMission, deleteReservetion, deleteTicket, insertMission } from '../support/db';

let loginPage: LoginPage;
let dashPage: DashPage;
let registerPage: RegisterPage;
let navbar: Navbar;
let toast: Toast;

test.beforeEach(async ({ page }) => {
  loginPage = new LoginPage(page);
  dashPage = new DashPage(page);
  registerPage = new RegisterPage(page);
  navbar = new Navbar(page);
  toast = new Toast(page);

  // Arrange - Preparação do cenário
  await loginPage.go();
  await loginPage.login(DEMO_USER.email, DEMO_USER.password);
  await expect(navbar.logout).toBeVisible({ timeout: 10_000 });
});

test('Deve cadastrar uma nova missão', async () => {

  const mission: Mission = {
    id: 'LP-0128A',
    rocket: 'Starship',
    baseId: 'aurora',
    departureDate: '2028-01-20',
    returnDate: '27 de jan. de 2028',
    price: 1000.00,
  };

  await deleteReservetion(mission.id);
  await deleteTicket(mission.id);
  await deleteMission(mission.id);

  await dashPage.addButton.click();
  await expect(registerPage.title).toBeVisible();

  // Act - Execução da ação
  await registerPage.submit(mission);

  // Assert - Verificação do resultado
  await expect(toast.message).toContainText('A nova missão foi adicionada ao catálogo e já está disponível para reservas.');
});

test('Não deve cadastrar com código de missão incorreto', async () => {

  const mission: Mission = {
    id: faker.string.alphanumeric({ length: 5, casing: 'upper' }),
    rocket: 'Starship',
    baseId: 'aurora',
    departureDate: '2028-01-20',
    returnDate: '27 de jan. de 2028',
    price: 1000.00,
  };

  await dashPage.addButton.click();
  await expect(registerPage.title).toBeVisible();

  // Act - Execução da ação
  await registerPage.submit(mission);

  // Assert - Verificação do resultado
  await expect(registerPage.idFormatError).toBeVisible();
});

test('Não deve cadastrar com código duplicado', async () => {

  const mission: Mission = {
    id: 'LP-DUP01',
    rocket: 'Starship',
    baseId: 'aurora',
    departureDate: '2028-01-20',
    returnDate: '27 de jan. de 2028',
    price: 1000.00,
  };

  await deleteReservetion(mission.id);
  await deleteTicket(mission.id);
  await deleteMission(mission.id);
  await insertMission(mission);

  await dashPage.addButton.click();
  await expect(registerPage.title).toBeVisible();
  await registerPage.submit(mission);

  await expect(registerPage.alert).toHaveText('Já existe uma missão com este ID.');
});

