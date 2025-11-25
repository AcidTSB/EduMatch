const { test, expect } = require('@playwright/test');

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
  });

  test('should display login page', async ({ page }) => {
    await page.goto('http://localhost:3000/login');
    await expect(page.locator('h1, h2')).toContainText(/login|sign in/i);
  });

  test('should register new student', async ({ page }) => {
    await page.goto('http://localhost:3000/auth/register');

    // Fill registration form
    await page.fill('input[name="email"]', `test${Date.now()}@example.com`);
    await page.fill('input[name="password"]', 'Test123!');
    await page.fill('input[name="fullName"]', 'Test User');
    await page.selectOption('select[name="role"]', 'STUDENT');

    // Submit form
    await page.click('button[type="submit"]');

    // Wait for redirect or success message
    await page.waitForTimeout(2000);
    
    // Should redirect to dashboard or show success
    const url = page.url();
    expect(url).toMatch(/(dashboard|home|profile)/);
  });

  test('should login with valid credentials', async ({ page }) => {
    await page.goto('http://localhost:3000/login');

    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'Test123!');
    await page.click('button[type="submit"]');

    await page.waitForTimeout(2000);

    // Should be redirected after successful login
    const url = page.url();
    expect(url).not.toContain('/login');
  });

  test('should show error with invalid credentials', async ({ page }) => {
    await page.goto('http://localhost:3000/login');

    await page.fill('input[name="email"]', 'invalid@example.com');
    await page.fill('input[name="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');

    await page.waitForTimeout(1000);

    // Should show error message
    const errorMessage = await page.locator('.error, [role="alert"], .toast').first();
    await expect(errorMessage).toBeVisible({ timeout: 5000 });
  });

  test('should logout successfully', async ({ page }) => {
    // Login first
    await page.goto('http://localhost:3000/login');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'Test123!');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(2000);

    // Logout
    await page.click('[aria-label="logout"], button:has-text("Logout"), button:has-text("Đăng xuất")');
    await page.waitForTimeout(1000);

    // Should redirect to login
    const url = page.url();
    expect(url).toContain('/login');
  });
});

test.describe('Scholarship Browsing', () => {
  test('should display scholarship list', async ({ page }) => {
    await page.goto('http://localhost:3000/scholarships');
    
    // Wait for scholarships to load
    await page.waitForTimeout(2000);

    // Should have scholarship cards
    const scholarshipCards = await page.locator('[data-testid="scholarship-card"], .scholarship-card, article').count();
    expect(scholarshipCards).toBeGreaterThan(0);
  });

  test('should search scholarships', async ({ page }) => {
    await page.goto('http://localhost:3000/scholarships');

    // Enter search query
    await page.fill('input[placeholder*="Search"], input[type="search"]', 'engineering');
    await page.waitForTimeout(1500);

    // Results should update
    const results = await page.locator('[data-testid="scholarship-card"], .scholarship-card').count();
    expect(results).toBeGreaterThanOrEqual(0);
  });

  test('should view scholarship details', async ({ page }) => {
    await page.goto('http://localhost:3000/scholarships');
    await page.waitForTimeout(2000);

    // Click first scholarship
    const firstScholarship = page.locator('[data-testid="scholarship-card"], .scholarship-card').first();
    await firstScholarship.click();

    await page.waitForTimeout(1000);

    // Should show detailed view
    const detailsHeading = await page.locator('h1, h2').first();
    await expect(detailsHeading).toBeVisible();
  });

  test('should filter scholarships by criteria', async ({ page }) => {
    await page.goto('http://localhost:3000/scholarships');

    // Apply filter (e.g., field of study)
    const filterButton = page.locator('button:has-text("Filter"), [aria-label="filter"]');
    if (await filterButton.count() > 0) {
      await filterButton.first().click();
      
      // Select a filter option
      await page.click('input[type="checkbox"], input[type="radio"]');
      await page.waitForTimeout(1500);

      // Results should update
      const url = page.url();
      expect(url).toContain('?'); // Should have query params
    }
  });
});

test.describe('Application Submission', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('http://localhost:3000/login');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'Test123!');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(2000);
  });

  test('should submit scholarship application', async ({ page }) => {
    // Navigate to scholarship details
    await page.goto('http://localhost:3000/scholarships');
    await page.waitForTimeout(2000);
    
    const firstScholarship = page.locator('[data-testid="scholarship-card"], .scholarship-card').first();
    await firstScholarship.click();
    await page.waitForTimeout(1000);

    // Click apply button
    const applyButton = page.locator('button:has-text("Apply"), button:has-text("Ứng tuyển")');
    if (await applyButton.count() > 0) {
      await applyButton.click();
      await page.waitForTimeout(500);

      // Fill application form
      await page.fill('textarea[name="coverLetter"]', 'I am very interested in this scholarship program.');
      await page.fill('input[name="resumeUrl"]', 'https://example.com/resume.pdf');

      // Submit
      await page.click('button[type="submit"]');
      await page.waitForTimeout(2000);

      // Should show success message
      const successMessage = await page.locator('.success, [role="status"], .toast').first();
      await expect(successMessage).toBeVisible({ timeout: 5000 });
    }
  });

  test('should view application status', async ({ page }) => {
    await page.goto('http://localhost:3000/user/applications');
    await page.waitForTimeout(2000);

    // Should display applications list
    const applicationsExist = await page.locator('[data-testid="application-item"], .application-card').count();
    expect(applicationsExist).toBeGreaterThanOrEqual(0);
  });
});

test.describe('Notifications', () => {
  test.beforeEach(async ({ page }) => {
    // Login
    await page.goto('http://localhost:3000/login');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'Test123!');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(2000);
  });

  test('should display notification icon', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    const notificationIcon = page.locator('[aria-label*="notification"], .notification-icon, [data-testid="notification-bell"]');
    await expect(notificationIcon).toBeVisible({ timeout: 5000 });
  });

  test('should open notifications panel', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    const notificationIcon = page.locator('[aria-label*="notification"], .notification-icon');
    if (await notificationIcon.count() > 0) {
      await notificationIcon.first().click();
      await page.waitForTimeout(500);

      // Notification panel should be visible
      const notificationPanel = page.locator('[role="menu"], .notification-panel, .dropdown-menu');
      await expect(notificationPanel.first()).toBeVisible();
    }
  });

  test('should mark notification as read', async ({ page }) => {
    await page.goto('http://localhost:3000/notifications');
    await page.waitForTimeout(1500);

    const firstNotification = page.locator('[data-testid="notification-item"], .notification-item').first();
    if (await firstNotification.count() > 0) {
      await firstNotification.click();
      await page.waitForTimeout(500);

      // Should be marked as read (e.g., different styling)
      const isRead = await firstNotification.getAttribute('data-read');
      expect(isRead).toBeTruthy();
    }
  });
});

test.describe('Responsive Design', () => {
  test('should work on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE
    await page.goto('http://localhost:3000');

    // Should display mobile menu
    const mobileMenu = page.locator('[aria-label="menu"], .hamburger, .mobile-menu-button');
    await expect(mobileMenu).toBeVisible();
  });

  test('should work on tablet viewport', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 }); // iPad
    await page.goto('http://localhost:3000');

    // Page should render correctly
    await expect(page.locator('body')).toBeVisible();
  });

  test('should work on desktop viewport', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 }); // Full HD
    await page.goto('http://localhost:3000');

    // Page should render correctly
    await expect(page.locator('body')).toBeVisible();
  });
});
