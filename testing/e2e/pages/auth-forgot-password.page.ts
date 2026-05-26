import { Page, Locator } from '@playwright/test';

export class AuthForgotPasswordPage {
  readonly emailInput: Locator;
  readonly submitButton: Locator;
  readonly backToLoginLink: Locator;
  readonly errorAlert: Locator;
  readonly successStatus: Locator;

  constructor(private page: Page) {
    this.emailInput = page.locator('#email');
    this.submitButton = page.getByRole('button', { name: /send reset link/i });
    this.backToLoginLink = page.getByRole('link', { name: /back to login/i });
    this.errorAlert = page.getByRole('alert').first();
    this.successStatus = page.getByRole('status');
  }

  async goto() {
    await this.page.goto('/auth/forgot-password');
  }

  async requestReset(email: string) {
    await this.emailInput.fill(email);
    await this.submitButton.click();
  }
}
