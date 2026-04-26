import { test, expect } from '@playwright/test';

test.describe('ShopSmart E2E Flow', () => {
  const testUser = {
    name: 'E2E User',
    email: `e2e_${Date.now()}@example.com`,
    password: 'password123',
  };

  test('should register, login, and add a product to cart', async ({ page }) => {
    // 1. Register
    await page.goto('/register');
    await page.getByPlaceholder('John Doe').fill(testUser.name);
    await page.getByPlaceholder('name@company.com').fill(testUser.email);
    await page.getByPlaceholder('••••••••').fill(testUser.password);
    await page.getByRole('button', { name: 'Get Started' }).click();

    // Wait for redirect to home
    await expect(page).toHaveURL('/');

    // 2. Add to Cart
    // Wait for products to load
    const addToCartBtn = page.getByRole('button', { name: 'Add' }).first();
    await expect(addToCartBtn).toBeVisible();
    await addToCartBtn.click();

    // 3. Verify Result
    const successToast = page.locator('text=added to cart!');
    await expect(successToast).toBeVisible();
  });

  test('should show warning when adding to cart as guest', async ({ page }) => {
    await page.goto('/');

    // Attempt to add to cart without logging in
    const addToCartBtn = page.getByRole('button', { name: 'Add' }).first();
    await expect(addToCartBtn).toBeVisible();
    await addToCartBtn.click();

    // Verify warning toast
    const warningToast = page.locator('text=Please sign in to add items to your cart');
    await expect(warningToast).toBeVisible();
  });
});
