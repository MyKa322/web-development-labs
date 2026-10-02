const { test, expect } = require('@playwright/test');
test.beforeEach(async ({ page }) => { await page.goto('/lab3/'); });

test('decimal comma, reverse conversion and history clearing', async ({ page }) => {
  await page.locator('#from-unit').selectOption('km');
  await page.locator('#to-unit').selectOption('m');
  await page.getByLabel('Значення', { exact: true }).fill('2,5');
  await page.getByRole('button', { name: 'Перетворити', exact: true }).click();
  await expect(page.locator('#result')).toHaveValue(/2\s500/);
  await expect(page.locator('#history-count')).toHaveText('1');
  await expect(page.locator('#history-list li')).toHaveText(/2,5 км = 2\s500 м/);
  await page.locator('#swap-units').click();
  await expect(page.locator('#from-unit')).toHaveValue('m');
  await expect(page.locator('#to-unit')).toHaveValue('km');
  await page.locator('#input-value').fill('2500');
  await page.locator('#input-value').press('Enter');
  await expect(page.locator('#result')).toHaveValue('2,5');
  await expect(page.locator('#history-list li')).toHaveCount(2);
  await page.getByRole('button', { name: 'Очистити', exact: true }).click();
  await expect(page.locator('#history-list li')).toHaveCount(0);
  await expect(page.locator('#history-count')).toHaveText('0');
  await expect(page.locator('#empty-history')).toBeVisible();
  await expect(page.locator('#clear-history')).toBeDisabled();
});

test('zero, identical units and all sixteen unit pairs', async ({ page }) => {
  const factors = { mm: 0.001, cm: 0.01, m: 1, km: 1000 };
  for (const from of Object.keys(factors)) {
    for (const to of Object.keys(factors)) {
      await page.locator('#from-unit').selectOption(from);
      await page.locator('#to-unit').selectOption(to);
      await page.locator('#input-value').fill('10');
      await page.locator('#input-value').press('Enter');
      const displayed = (await page.locator('#result').inputValue()).replace(/\s/g, '').replace(',', '.');
      expect(Number(displayed)).toBeCloseTo(10 * factors[from] / factors[to], 8);
    }
  }
  await page.locator('#input-value').fill('0');
  await page.locator('#input-value').press('Enter');
  await expect(page.locator('#result')).toHaveValue('0');
  await expect(page.locator('#history-list li')).toHaveCount(17);
});

test('invalid input cannot add history and stale results are cleared', async ({ page }) => {
  await page.locator('#input-value').fill('1');
  await page.locator('#input-value').press('Enter');
  for (const invalid of ['', '-1', 'abc', '<img src=x onerror=alert(1)>', '1,2,3', 'Infinity', '0x10', '1e309', '1e-999']) {
    await page.locator('#input-value').fill(invalid);
    await page.locator('#input-value').press('Enter');
    await expect(page.locator('#error-message')).toBeVisible();
    await expect(page.locator('#input-value')).toHaveAttribute('aria-invalid', 'true');
    await expect(page.locator('#result')).toHaveValue('');
    await expect(page.locator('#history-list li')).toHaveCount(1);
  }
});

test('overflow and underflow are handled without invalid results', async ({ page }) => {
  await page.locator('#from-unit').selectOption('km');
  await page.locator('#to-unit').selectOption('mm');
  await page.locator('#input-value').fill('1e308');
  await page.locator('#input-value').press('Enter');
  await expect(page.locator('#error-message')).toBeVisible();
  await expect(page.locator('#history-list li')).toHaveCount(0);
  await page.locator('#from-unit').selectOption('mm');
  await page.locator('#to-unit').selectOption('km');
  await page.locator('#input-value').fill('5e-324');
  await page.locator('#input-value').press('Enter');
  await expect(page.locator('#error-message')).toBeVisible();
  await expect(page.locator('#history-list li')).toHaveCount(0);
});

test('responsive layouts, assets, navigation and no browser errors', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  for (const lab of ['lab2', 'lab3']) {
    for (const [width, columns] of [[320, 1], [375, 1], [768, 2], [1024, 4], [1440, 4]]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(`/${lab}/`);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
      expect(await page.locator('main > div.grid').evaluate(element => getComputedStyle(element).gridTemplateColumns.split(' ').length)).toBe(columns);
      expect(await page.locator('img').evaluate(image => image.complete && image.naturalWidth > 0)).toBeTruthy();
      await page.getByRole('link', { name: 'Одиниці', exact: true }).click();
      await expect(page).toHaveURL(/#units$/);
    }
  }
  expect(errors).toEqual([]);
});
