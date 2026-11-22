import { type Locator, type Page } from '@playwright/test';

export interface CustomerInformation {
  firstName: string;
  lastName: string;
  postalCode: string;
}

/** Encapsulates customer-information, overview, and completion checkout steps. */
export class CheckoutPage {
  constructor(private readonly page: Page) {}

  get informationHeading(): Locator {
    return this.page.getByText('Checkout: Your Information', { exact: true });
  }

  get firstNameInput(): Locator {
    return this.page.getByRole('textbox', { name: 'First Name' });
  }

  get lastNameInput(): Locator {
    return this.page.getByRole('textbox', { name: 'Last Name' });
  }

  get postalCodeInput(): Locator {
    return this.page.getByRole('textbox', { name: 'Zip/Postal Code' });
  }

  get continueButton(): Locator {
    return this.page.getByRole('button', { name: 'Continue' });
  }

  get cancelButton(): Locator {
    return this.page.getByRole('button', { name: 'Cancel' });
  }

  get overviewHeading(): Locator {
    return this.page.getByText('Checkout: Overview', { exact: true });
  }

  get validationMessage(): Locator {
    return this.page.getByRole('alert');
  }

  get itemTotal(): Locator {
    return this.page.getByText('Item total: $0', { exact: true });
  }

  get orderTotal(): Locator {
    return this.page.getByText('Total: $0.00', { exact: true });
  }

  get completionMessage(): Locator {
    return this.page.getByText('Thank you for your order!', { exact: true });
  }

  orderSummaryItem(productName: string): Locator {
    return this.page.getByText(productName, { exact: true });
  }

  async fillCustomerInformation(
    information: Partial<CustomerInformation>,
  ): Promise<void> {
    if (information.firstName !== undefined) {
      await this.firstNameInput.fill(information.firstName);
    }
    if (information.lastName !== undefined) {
      await this.lastNameInput.fill(information.lastName);
    }
    if (information.postalCode !== undefined) {
      await this.postalCodeInput.fill(information.postalCode);
    }
  }

  async continueToOverview(): Promise<void> {
    await this.continueButton.click();
  }

  async finishOrder(): Promise<void> {
    await this.page.getByRole('button', { name: 'Finish' }).click();
  }

  async cancel(): Promise<void> {
    await this.cancelButton.click();
  }
}
