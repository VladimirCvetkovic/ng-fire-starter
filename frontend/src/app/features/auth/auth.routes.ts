import { Routes } from '@angular/router';

export const authRoutes: Routes = [
  { path: 'login',           title: 'auth.login.pageTitle',          loadComponent: () => import('./pages/auth-login/auth-login').then(m => m.AuthLoginComponent) },
  { path: 'register',        title: 'auth.register.pageTitle',       loadComponent: () => import('./pages/auth-register/auth-register').then(m => m.AuthRegisterComponent) },
  { path: 'verify-email',    title: 'auth.verifyEmail.pageTitle',    loadComponent: () => import('./pages/auth-verify-email/auth-verify-email').then(m => m.AuthVerifyEmailComponent) },
  { path: 'forgot-password', title: 'auth.forgotPassword.pageTitle', loadComponent: () => import('./pages/auth-forgot-password/auth-forgot-password').then(m => m.AuthForgotPasswordComponent) },
  { path: 'email-verified',  title: 'auth.emailVerified.pageTitle',  loadComponent: () => import('./pages/auth-email-verified/auth-email-verified').then(m => m.AuthEmailVerifiedComponent) },
  { path: 'reset-password',  title: 'auth.resetPassword.pageTitle',  loadComponent: () => import('./pages/auth-reset-password/auth-reset-password').then(m => m.AuthResetPasswordComponent) },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
];
