import { test, expect } from '@playwright/test';

test.use({ storageState: './tmp/admin.json' })
test.describe('injection flaws', () => {
    test('string sql injection', async ({ page }) => {
      await page.goto('/WebGoat/start.mvc#attack/538385464/1100');
      await page.locator('input[name="account_name"]').fill('John');

      await page.locator('input:has-text("Go!")').click();
      await expect(page.locator("text=No results matched.  Try Again.")).toHaveCount(1)
    })
  });