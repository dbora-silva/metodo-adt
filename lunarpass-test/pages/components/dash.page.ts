import { Page, Locator } from '@playwright/test';

export class DashPage {
  readonly page: Page;
  readonly newMissionLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.newMissionLink = page.getByRole('link', { name: 'Nova Missão' });
  }

  async goToNewMission() {
    await this.newMissionLink.click();
  }
}
