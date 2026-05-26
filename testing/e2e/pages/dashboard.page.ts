import { Page, Locator } from '@playwright/test';

export class DashboardPage {
  readonly welcomeMessage: Locator;
  readonly logoutButton: Locator;
  readonly openDrawerButton: Locator;
  readonly openBottomSheetButton: Locator;
  readonly openBannerButton: Locator;

  constructor(private page: Page) {
    this.welcomeMessage = page.getByText(/welcome,/i);
    this.logoutButton = page.getByRole('button', { name: /^logout$/i });
    this.openDrawerButton = page.getByRole('button', { name: /open drawer/i });
    this.openBottomSheetButton = page.getByRole('button', { name: /open bottom sheet/i });
    this.openBannerButton = page.getByRole('button', { name: /show banner/i });
  }

  async goto(role: 'user' | 'admin') {
    await this.page.goto(`/${role}`);
  }

  async logout() {
    await this.logoutButton.click();
  }
}
