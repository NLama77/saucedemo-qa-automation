import { type Locator, type Page } from '@playwright/test';

/** Encapsulates product selection and cart navigation on the inventory page. */
export class InventoryPage {
  constructor(private readonly page: Page) {}

  get productsHeading(): Locator {
    return this.page.getByText('Products', { exact: true });
  }

  async addProductToCart(productName: string): Promise<void> {
    const product = this.page
      .locator('.inventory_item')
      .filter({ hasText: productName });
    await product.getByRole('button', { name: 'Add to cart' }).click();
  }

  async openCart(): Promise<void> {
    await this.page.getByRole('button', { name: /Cart/ }).click();
  }
}
