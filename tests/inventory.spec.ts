import { expect, test } from './fixtures/test.fixture';

test('displays the expected product count and visible product details', async ({
  page,
  inventoryPage,
}) => {
  await expect(page).toHaveURL(/\/inventory\.html$/);
  await expect(inventoryPage.productsHeading).toBeVisible();

  await expect(inventoryPage.productItems).toHaveCount(6);

  await expect(inventoryPage.productNames).toHaveCount(6);
  for (const productName of await inventoryPage.productNames.all()) {
    await expect(productName).toBeVisible();
  }

  await expect(inventoryPage.productPrices).toHaveCount(6);
  for (const productPrice of await inventoryPage.productPrices.all()) {
    await expect(productPrice).toBeVisible();
  }
});
