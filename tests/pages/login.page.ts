import type { Page } from '@playwright/test';

/** Opens SauceDemo and performs a login using the configured demo credentials. */
export class LoginPage {
  constructor(private readonly page: Page) {}

  async open(): Promise<void> {
    await this.page.goto('/');
  }

  async login(
    username = process.env.SAUCEDEMO_USERNAME ?? 'standard_user',
    password = process.env.SAUCEDEMO_PASSWORD ?? 'secret_sauce',
  ): Promise<void> {
    await this.page.getByRole('textbox', { name: 'Username' }).fill(username);
    await this.page.getByRole('textbox', { name: 'Password' }).fill(password);
    await this.page.getByRole('button', { name: 'Login' }).click();
  }
}
