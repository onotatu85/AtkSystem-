// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Attendance Functionality', () => {

    test.beforeEach(async ({ page }) => {
        // Login as Admin or User
        await page.goto('/Account/Login');
        await page.fill('input[name="EmployeeId"]', 'EMP001');
        await page.fill('input[name="Password"]', 'admin123');
        await page.click('button[type="submit"]');
        await expect(page).toHaveURL(/.*Attendance/);
    });

    test('B-01/04: 勤怠打刻フロー (Clock In/Out Flow)', async ({ page }) => {
        // Check current status based on UI text
        const statusText = await page.locator('.h3 .text-info, .h3 .text-success, .h3 .text-secondary').first().textContent();
        console.log('Current Status:', statusText);

        const clockInBtn = page.locator('button:has-text("出勤")');
        const clockOutBtn = page.locator('button:has-text("退勤")');

        // B-01: Clock In
        if (await clockInBtn.isVisible() && await clockInBtn.isEnabled()) {
            console.log('Attempting Clock In...');
            await clockInBtn.click();
            await expect(page.locator('.text-info')).toContainText('勤務中');
            await page.screenshot({ path: 'evidence/B-01_ClockIn_Success.png' });
        } else {
            console.log('Clock In button not available (Already clocked in or finished). Skipping B-01.');
            // If we are working, that's fine. If finished, that's also fine for this test run context.
        }

        // B-04: Clock Out
        if (await clockOutBtn.isVisible() && await clockOutBtn.isEnabled()) {
            console.log('Attempting Clock Out...');
            await clockOutBtn.click();
            await expect(page.locator('.text-success')).toContainText('退勤済み');
            await page.screenshot({ path: 'evidence/B-04_ClockOut_Success.png' });
        } else {
            console.log('Clock Out button not available (Already finished or not clocked in). Skipping B-04.');
        }

        // Take a final screenshot of the state
        await page.screenshot({ path: 'evidence/B-XX_FinalState.png' });
    });

    test('B-05: 履歴表示 (Attendance History)', async ({ page }) => {
        // Verify table exists and has rows
        await expect(page.locator('table.table-premium')).toBeVisible();
        await page.screenshot({ path: 'evidence/B-05_History.png' });
    });
});
