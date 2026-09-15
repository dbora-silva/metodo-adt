import { Page, Locator } from '@playwright/test';

export class Toast {
  readonly page: Page;
  readonly message: Locator;

  constructor(page: Page) {
    this.page = page;
    // Escopa no region de notificações do Sonner para não colidir com outros
    // elementos role="status" da página (ex.: indicadores de carregamento).
    this.message = page.getByRole('region', { name: /Notifications/i }).getByRole('listitem');
  }
}
