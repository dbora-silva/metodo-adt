import { Page, Locator, expect } from '@playwright/test';

export class HomePage {
  readonly page: Page;
  readonly title: Locator;
  readonly searchButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.getByRole('heading', { name: 'Sua viagem para a Lua começa aqui.' });
    this.searchButton = page.getByRole('button', { name: 'Buscar missões' });
  }

  async go() {
    await this.page.goto('/');
    await expect(this.title).toBeVisible();
  }

  async selectBase(baseName: string) {
    await this.page.getByRole('checkbox', { name: baseName }).check();
  }

  async search() {
    await this.searchButton.click();
  }
}
