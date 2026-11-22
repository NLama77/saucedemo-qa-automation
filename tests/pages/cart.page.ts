import { type Locator, type Page } from '@playwright/test';

/** Encapsulates checkout and continue-shopping actions on the cart page. */
export class CartPage {
  constructor(private readonly page: Page) {}

  get heading(): Locator {
    return this.page.getByText('Your Cart', { exact: true });
  }

  async checkout(): Promise<void> {
    await this.page.getByRole('button', { name: 'Checkout' }).click();
  }

  async continueShopping(): Promise<void> {
    await this.page.getByRole('button', { name: 'Continue Shopping' }).click();
  }
}
