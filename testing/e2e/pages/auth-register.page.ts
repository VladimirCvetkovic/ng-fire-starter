import { Page, Locator } from '@playwright/test';

export class AuthRegisterPage {
  readonly userRoleCard: Locator;
  readonly adminRoleCard: Locator;
  readonly continueButton: Locator;
  readonly logInLink: Locator;
  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly phoneInput: Locator;
  readonly passwordInput: Locator;
  readonly confirmPasswordInput: Locator;
  readonly logoUrlInput: Locator;
  readonly errorAlert: Locator;

  constructor(private page: Page) {
    this.userRoleCard = page.getByRole('button', { name: /user/i }).first();
    this.adminRoleCard = page.getByRole('button', { name: /administrator/i });
    this.continueButton = page.getByRole('button', { name: /continue/i });
    this.logInLink = page.getByRole('link', { name: /log in/i });
    this.nameInput = page.locator('#name');
    this.emailInput = page.locator('#reg-email');
    this.phoneInput = page.locator('#phone');
    this.passwordInput = page.locator('#reg-pwd');
    this.confirmPasswordInput = page.locator('#reg-confirm-pwd');
    this.logoUrlInput = page.locator('#logo-url');
    this.errorAlert = page.getByRole('alert').first();
  }

  async goto() {
    await this.page.goto('/auth/register');
  }

  async selectRole(role: 'user' | 'admin') {
    if (role === 'user') {
      await this.userRoleCard.click();
    } else {
      await this.adminRoleCard.click();
    }
  }
}
