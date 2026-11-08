import { test, expect, type Page } from '@playwright/test';

async function login(page: Page) {
  await page.goto('/login');
  await page.getByRole('textbox', { name: 'Email address' }).fill('demo@example.com');
  await page.getByLabel('Password', { exact: true }).fill('demo12345');
  await page.getByRole('button', { name: /^Log in/ }).click();
  await expect(page).toHaveURL(/\/dashboard$/);
}

test('signed-out app routes redirect and mobile navigation remains usable', async ({ page }) => {
  await page.goto('/community');
  await expect(page).toHaveURL(/\/signup$/);
  await page.goto('/dashboard');
  await expect(page).toHaveURL(/\/signup$/);
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/');
  await page.getByRole('button', { name: 'Open navigation' }).click();
  await page.getByRole('navigation', { name: 'Mobile navigation' }).getByRole('link', { name: 'Docs', exact: true }).click();
  await expect(page).toHaveURL(/\/docs$/);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
  expect(overflow).toBe(false);
});

test('login and project mutations survive reload and cards open by stable ID', async ({ page }) => {
  await login(page);
  await page.reload();
  await expect(page.getByRole('button', { name: 'Options for Lumen Finance' })).toBeVisible();
  await page.getByRole('button', { name: 'Options for Lumen Finance' }).click();
  await page.getByRole('menuitem', { name: 'Rename', exact: true }).click();
  await page.getByRole('textbox', { name: 'Project name' }).fill('Renamed Finance');
  await page.getByRole('button', { name: 'Save', exact: true }).click();
  await page.getByRole('button', { name: 'Options for Renamed Finance', exact: true }).click();
  await page.getByRole('menuitem', { name: 'Duplicate', exact: true }).click();
  await page.reload();
  await expect(page.getByRole('button', { name: 'Options for Renamed Finance (copy)', exact: true })).toBeVisible();
  const ids = await page.evaluate(() => JSON.parse(localStorage.getItem('kodarcrystal:projects') || '[]').filter((project: { name: string }) => project.name.startsWith('Renamed Finance')).map((project: { id: string }) => project.id));
  expect(new Set(ids).size).toBe(2);
  await page.getByRole('link', { name: 'Open Renamed Finance', exact: true }).click();
  await expect(page).toHaveURL(/projectId=lumen-finance/);
  await expect(page.getByRole('heading', { name: 'Renamed Finance', exact: true })).toBeVisible();
});

test('system theme persists and navbar changes share root state', async ({ page }) => {
  await login(page);
  await page.emulateMedia({ colorScheme: 'light' });
  await page.goto('/settings');
  await page.getByRole('button', { name: 'Appearance', exact: true }).click();
  await page.getByRole('button', { name: /^System/ }).click();
  await expect.poll(() => page.evaluate(() => localStorage.getItem('kodarcrystal:theme'))).toBe('system');
  await page.reload();
  await expect(page.locator('html')).not.toHaveClass(/dark/);
  await page.getByRole('button', { name: 'Switch to dark theme' }).click();
  await expect(page.locator('html')).toHaveClass(/dark/);
  await page.getByRole('button', { name: 'Appearance', exact: true }).click();
  await expect(page.getByRole('button', { name: /^Dark/ })).toHaveClass(/ring-ring/);
});

test('results tabs control the visible panel and preview hash selects the right page', async ({ page }) => {
  await login(page);
  await page.goto('/results');
  await page.getByRole('button', { name: 'Features', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Feature checklist' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'UI Mockups' })).not.toBeVisible();
  await page.goto('/preview/brewly#/pricing');
  await expect(page.getByText('Your perfect coffee plan.')).toBeVisible();
});

test('a build creates a local project and carries its prompt into the workspace', async ({ page }) => {
  await login(page);
  await page.goto('/builder?prompt=Build%20a%20portfolio%20called%20Nova&name=Nova&mode=build');
  await page.getByRole('button', { name: /^Generate/ }).click();
  await expect(page).toHaveURL(/\/workspace\?projectId=/);
  await expect(page.getByRole('heading', { name: 'Nova', exact: true })).toBeVisible();
  await expect(page.getByText(/Build a portfolio called Nova/)).toBeVisible();
});
