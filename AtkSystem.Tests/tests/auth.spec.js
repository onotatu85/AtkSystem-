// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Authentication Tests', () => {

    test('A-01: ログイン成功 (Login Success)', async ({ page }) => {
        await page.goto('/Account/Login');

        // Fill login form
        await page.fill('input[name="EmployeeId"]', 'EMP001');
        await page.fill('input[name="Password"]', 'admin123');
        await page.click('button[type="submit"]');

        // Verify redirect to Attendance Index
        await expect(page).toHaveURL(/.*Attendance/);
        // Verify "Dashboard" menu exists
        await expect(page.locator('.nav-link', { hasText: 'ダッシュボード' })).toBeVisible();

        await page.screenshot({ path: 'evidence/A-01_LoginSuccess.png' });
    });

    test('A-02: ログイン失敗 (Login Failure)', async ({ page }) => {
        await page.goto('/Account/Login');

        await page.fill('input[name="EmployeeId"]', 'EMP001');
        await page.fill('input[name="Password"]', 'wrongpassword');
        await page.click('button[type="submit"]');

        // Wait for validation summary to appear
        const validationSummary = page.locator('.validation-summary-errors ul li, .text-danger');
        await expect(validationSummary.first()).toBeVisible();

        // Log the text found for debugging if it fails
        const text = await validationSummary.first().textContent();
        console.log('Login Error Message Found:', text);

        await expect(validationSummary).toContainText('Invalid login attempt');

        await page.screenshot({ path: 'evidence/A-02_LoginFailure.png' });
    });

    test('A-03: ログアウト (Logout)', async ({ page }) => {
        // Login first
        await page.goto('/Account/Login');
        await page.fill('input[name="EmployeeId"]', 'EMP001');
        await page.fill('input[name="Password"]', 'admin123');
        await page.click('button[type="submit"]');
        await expect(page.locator('.nav-link', { hasText: 'ダッシュボード' })).toBeVisible();

        // Logout Flow: Click User Dropdown -> Click Logout
        await page.click('.dropdown-toggle');
        await page.click('button:has-text("ログアウト")');

        // Verify redirect to Login
        await expect(page).toHaveURL(/.*Account\/Login/);

        await page.screenshot({ path: 'evidence/A-03_Logout.png' });
    });
});
