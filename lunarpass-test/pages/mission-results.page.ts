import { Page, Locator } from '@playwright/test';

export class MissionResultsPage {
  readonly page: Page;
  readonly resultsHeading: Locator;
  readonly baseFilterButton: Locator;
  readonly missionCards: Locator;

  constructor(page: Page) {
    this.page = page;
    this.resultsHeading = page.getByRole('heading', { level: 1 });
    this.baseFilterButton = page.getByRole('button', { name: 'Bases lunares' });
    this.missionCards = page.getByRole('listitem');
  }

  missionBaseHeadings(): Locator {
    return this.missionCards.getByRole('heading', { level: 3 });
  }
}
