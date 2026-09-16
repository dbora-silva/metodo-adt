import { test, expect } from '@playwright/test';

import { HomePage } from '../pages/home.page';
import { MissionResultsPage } from '../pages/mission-results.page';

let homePage: HomePage;
let resultsPage: MissionResultsPage;

test.beforeEach(async ({ page }) => {
  homePage = new HomePage(page);
  resultsPage = new MissionResultsPage(page);

  // Arrange - Preparação do cenário
  await homePage.go();
});

test('Deve buscar missões filtrando por uma base lunar', async ({ page }) => {
  // Act - Execução da ação
  await homePage.selectBase('Base Lunar Alpha');
  await homePage.search();

  // Assert - Verificação do resultado
  await expect(page).toHaveURL(/\/missions\?base=alpha/);
  await expect(resultsPage.baseFilterButton).toContainText('Base Lunar Alpha');

  const baseHeadings = await resultsPage.missionBaseHeadings().allTextContents();
  expect(baseHeadings.length).toBeGreaterThan(0);
  for (const baseName of baseHeadings) {
    expect(baseName).toBe('Base Lunar Alpha');
  }

  const resultsCount = await resultsPage.missionCards.count();
  await expect(resultsPage.resultsHeading).toContainText(String(resultsCount));
});
