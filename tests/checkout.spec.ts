import { expect, test } from './fixtures/test.fixture';

const customer = {
  firstName: 'Taylor',
  lastName: 'Tester',
  postalCode: '12345',
};

// Complete customer details should advance to the overview with the selected item.
test('submits checkout information for a cart with a product', async ({
  page,
  inventoryPage,
  cartPage,
  checkoutPage,
}) => {
  await expect(page).toHaveURL(/\/inventory\.html$/);
  await expect(inventoryPage.productsHeading).toBeVisible();
  await inventoryPage.addProductToCart('Sauce Labs Backpack');
  await inventoryPage.openCart();
  await expect(page).toHaveURL(/\/cart\.html$/);
  await expect(cartPage.heading).toBeVisible();
  await cartPage.checkout();
  await expect(page).toHaveURL(/\/checkout-step-one\.html$/);
  await expect(checkoutPage.informationHeading).toBeVisible();
  await checkoutPage.fillCustomerInformation(customer);
  await checkoutPage.continueToOverview();
  await expect(page).toHaveURL(/\/checkout-step-two\.html$/);
  await expect(checkoutPage.overviewHeading).toBeVisible();
  await expect(checkoutPage.orderSummaryItem('Sauce Labs Backpack')).toBeVisible();
});

// Required customer fields and both checkout actions should be available on step one.
test('verifies checkout customer information fields and buttons are displayed', async ({
  page,
  inventoryPage,
  cartPage,
  checkoutPage,
}) => {
  await expect(page).toHaveURL(/\/inventory\.html$/);
  await inventoryPage.openCart();
  await expect(page).toHaveURL(/\/cart\.html$/);
  await cartPage.checkout();
  await expect(page).toHaveURL(/\/checkout-step-one\.html$/);

  await expect(checkoutPage.firstNameInput).toBeVisible();
  await expect(checkoutPage.lastNameInput).toBeVisible();
  await expect(checkoutPage.postalCodeInput).toBeVisible();
  await expect(checkoutPage.continueButton).toBeVisible();
  await expect(checkoutPage.continueButton).toBeEnabled();
  await expect(checkoutPage.cancelButton).toBeVisible();
  await expect(checkoutPage.cancelButton).toBeEnabled();
});

// With all fields empty, checkout should report the first missing required field.
test('requires a first name', async ({
  page,
  inventoryPage,
  cartPage,
  checkoutPage,
}) => {
  await expect(page).toHaveURL(/\/inventory\.html$/);
  await inventoryPage.openCart();
  await expect(page).toHaveURL(/\/cart\.html$/);
  await cartPage.checkout();
  await expect(page).toHaveURL(/\/checkout-step-one\.html$/);
  await checkoutPage.continueToOverview();
  await expect(page).toHaveURL(/\/checkout-step-one\.html$/);
  await expect(checkoutPage.validationMessage).toContainText(
    'First Name is required',
  );
});

// A first name alone is insufficient; checkout should request the last name next.
test('requires a last name', async ({
  page,
  inventoryPage,
  cartPage,
  checkoutPage,
}) => {
  await expect(page).toHaveURL(/\/inventory\.html$/);
  await inventoryPage.openCart();
  await expect(page).toHaveURL(/\/cart\.html$/);
  await cartPage.checkout();
  await expect(page).toHaveURL(/\/checkout-step-one\.html$/);
  await checkoutPage.fillCustomerInformation({ firstName: customer.firstName });
  await checkoutPage.continueToOverview();
  await expect(page).toHaveURL(/\/checkout-step-one\.html$/);
  await expect(checkoutPage.validationMessage).toContainText(
    'Last Name is required',
  );
});

// First and last names without a postal code should keep checkout on the form.
test('requires a postal code', async ({
  page,
  inventoryPage,
  cartPage,
  checkoutPage,
}) => {
  await expect(page).toHaveURL(/\/inventory\.html$/);
  await inventoryPage.openCart();
  await expect(page).toHaveURL(/\/cart\.html$/);
  await cartPage.checkout();
  await expect(page).toHaveURL(/\/checkout-step-one\.html$/);
  await checkoutPage.fillCustomerInformation({
    firstName: customer.firstName,
    lastName: customer.lastName,
  });
  await checkoutPage.continueToOverview();
  await expect(page).toHaveURL(/\/checkout-step-one\.html$/);
  await expect(checkoutPage.validationMessage).toContainText(
    'Postal Code is required',
  );
});

// Cancel returns to the cart; Continue Shopping returns to the product listing.
test('navigates through checkout and cancels back to products', async ({
  page,
  inventoryPage,
  cartPage,
  checkoutPage,
}) => {
  await expect(page).toHaveURL(/\/inventory\.html$/);
  await inventoryPage.openCart();
  await expect(page).toHaveURL(/\/cart\.html$/);
  await expect(cartPage.heading).toBeVisible();
  await cartPage.checkout();
  await expect(page).toHaveURL(/\/checkout-step-one\.html$/);
  await expect(checkoutPage.informationHeading).toBeVisible();
  await checkoutPage.cancel();
  await expect(page).toHaveURL(/\/cart\.html$/);
  await expect(cartPage.heading).toBeVisible();
  await cartPage.continueShopping();
  await expect(page).toHaveURL(/\/inventory\.html$/);
  await expect(inventoryPage.productsHeading).toBeVisible();
});

// This stays an expected failure until the known empty-cart checkout bug is fixed.
test('prevents completing an order with an empty cart', async ({
  page,
  inventoryPage,
  cartPage,
  checkoutPage,
}) => {
  test.fail(
    true,
    'Known Jira bug: SauceDemo allows an order to complete with an empty cart.',
  );
  await expect(page).toHaveURL(/\/inventory\.html$/);
  await inventoryPage.openCart();
  await expect(page).toHaveURL(/\/cart\.html$/);
  await cartPage.checkout();
  await expect(page).toHaveURL(/\/checkout-step-one\.html$/);
  await expect(checkoutPage.informationHeading).toBeVisible();
  await checkoutPage.fillCustomerInformation(customer);
  await checkoutPage.continueToOverview();
  await expect(page).toHaveURL(/\/checkout-step-two\.html$/);
  await expect(checkoutPage.overviewHeading).toBeVisible();
  await expect(checkoutPage.itemTotal).toBeVisible();
  await expect(checkoutPage.orderTotal).toBeVisible();
  await checkoutPage.finishOrder();
  await expect(page).toHaveURL(/\/checkout-step-two\.html$/);
  await expect(checkoutPage.overviewHeading).toBeVisible();
});
