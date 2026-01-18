// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('User Management', () => {

    test.beforeEach(async ({ page }) => {
        // Login as Admin
        await page.goto('/Account/Login');
        await page.fill('input[name="EmployeeId"]', 'EMP001');
        await page.fill('input[name="Password"]', 'admin123');
        await page.click('button[type="submit"]');
    });

    test('D-01/02: ユーザー新規登録 (Create User)', async ({ page }) => {
        // Navigate to User List
        await page.goto('/User');

        // Verifying we are on the correct page
        await expect(page).toHaveTitle(/ユーザー管理/);
        await expect(page.locator('h2')).toContainText('ユーザー管理');

        await page.screenshot({ path: 'evidence/D-01_UserList_Access.png' });

        // Check if Create button is present
        await expect(page.locator('a[href*="Create"]')).toBeVisible();

        // Click Create
        await page.click('a[href*="Create"]');

        // Fill Form
        const uniqueId = `TEST${Math.floor(Math.random() * 1000)}`;
        await page.fill('input[name="EmployeeId"]', uniqueId);
        await page.fill('input[name="FullName"]', `AutoUser ${uniqueId}`);
        await page.fill('input[name="Password"]', 'password123');

        await page.click('button[type="submit"]');

        // Verify Redirect and List
        await expect(page).toHaveURL(/.*User/);
        await expect(page.locator('table')).toContainText(uniqueId);
        await page.screenshot({ path: 'evidence/D-02_CreateUser_Result.png' });
    });

    test('D-03: ユーザー無効化 (Deactivate User)', async ({ page }) => {
        await page.goto('/User');

        // Find a user to edit. Click the first "Edit" button
        await page.locator('a[href*="Edit"]').first().click();

        // Uncheck "IsActive" (Account有効)
        // Label is "アカウントを有効にする" -> id "flexSwitchCheckDefault"
        const toggle = page.locator('#flexSwitchCheckDefault');

        // If checked, click to uncheck
        if (await toggle.isChecked()) {
            await page.click('label[for="flexSwitchCheckDefault"]');
        }

        await page.click('button[type="submit"]');

        // Verify in list 
        await expect(page).toHaveURL(/.*User/);
        await page.screenshot({ path: 'evidence/D-03_Deactivate_Result.png' });
    });
});
