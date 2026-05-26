import { Injectable, signal, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  verifyPasswordResetCode,
  confirmPasswordReset,
  applyActionCode,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { TranslocoService } from '@jsverse/transloco';
import { AppUser, Role } from '@data/models/user.model';
import { CoreFirebaseService } from '../firebase/core-firebase.service';
import { CoreThemeService } from '../services/core-theme.service';
import { CorePaletteService } from '../services/core-palette.service';

/**
 * Manages Firebase Authentication state and Firestore user profiles via Signals.
 *
 * Bootstrap: provided in root — inject anywhere, no setup needed.
 *
 * Key methods:
 *   login(email, password)               — signs in; checks email verification; navigates to role home
 *   register(email, password, name, role, phone?, lang?, logoUrl?) — creates user + Firestore profile (incl. current theme/palette) + sends verification email; navigates to /auth/verify-email
 *   logout()                             — signs out and navigates to /auth/login
 *   resendVerificationEmail()            — resends the verification email to the current Firebase user
 *   waitForAuthReady()                   — resolves once Firebase has determined initial auth state (use in guards)
 */
@Injectable({ providedIn: 'root' })
export class CoreAuthService {
  private firebase  = inject(CoreFirebaseService);
  private router    = inject(Router);
  private themeService   = inject(CoreThemeService);
  private paletteService = inject(CorePaletteService);
  private translocoSvc   = inject(TranslocoService);

  private _currentUser = signal<AppUser | null>(null);

  readonly currentUser = this._currentUser.asReadonly();
  readonly role = computed(() => this._currentUser()?.role ?? null);
  readonly isLoggedIn = computed(() => this._currentUser() !== null);

  constructor() {
    // Used only for cold-start restore (page reload). Login/register set _currentUser directly
    // to avoid the race where onAuthStateChanged fires before setDoc creates the Firestore doc.
    onAuthStateChanged(this.firebase.auth, async (firebaseUser) => {
      if (!firebaseUser) {
        this._currentUser.set(null);
        return;
      }
      // Skip fetch if we already have this user in memory (set by login/register)
      if (this._currentUser()?.id === firebaseUser.uid) return;

      if (!firebaseUser.emailVerified) return;

      const snapshot = await getDoc(doc(this.firebase.firestore, 'users', firebaseUser.uid));
      const appUser = snapshot.exists() ? (snapshot.data() as AppUser) : null;
      this._currentUser.set(appUser);
      if (appUser) this.applyUserPreferences(appUser);
    });
  }

  /** Resolves when Firebase has determined the initial auth state (handles cold start). */
  waitForAuthReady(): Promise<void> {
    return this.firebase.auth.authStateReady();
  }

  async login(email: string, password: string): Promise<void> {
    const cred = await signInWithEmailAndPassword(this.firebase.auth, email, password);

    if (!cred.user.emailVerified) {
      await signOut(this.firebase.auth);
      throw Object.assign(new Error('email-not-verified'), { code: 'auth/email-not-verified' });
    }

    const snapshot = await getDoc(doc(this.firebase.firestore, 'users', cred.user.uid));
    const user = snapshot.data() as AppUser;
    this._currentUser.set(user);
    this.applyUserPreferences(user);
    this.router.navigate([user.role === 'user' ? '/user/home' : '/admin/home']);
  }

  async register(email: string, password: string, name: string, role: Role, phone?: string, lang?: string, logoUrl?: string): Promise<void> {
    const cred = await createUserWithEmailAndPassword(this.firebase.auth, email, password);
    const user: AppUser = {
      id: cred.user.uid,
      name,
      email,
      role,
      theme:   this.themeService.mode(),
      palette: this.paletteService.palette(),
      ...(lang    ? { lang }    : {}),
      ...(phone   ? { phone }   : {}),
      ...(logoUrl ? { logoUrl } : {}),
    };
    await setDoc(doc(this.firebase.firestore, 'users', cred.user.uid), user);
    if (lang) this.firebase.auth.languageCode = lang;
    await sendEmailVerification(cred.user);
    // Do NOT set _currentUser — keeps isLoggedIn() false until email is verified.
    // Firebase user stays signed in so resendVerificationEmail() can use currentUser.
    this.router.navigate(['/auth/verify-email']);
  }

  private applyUserPreferences(user: AppUser): void {
    if (user.theme   && !localStorage.getItem('theme-mode')) this.themeService.setMode(user.theme);
    if (user.palette && !localStorage.getItem('palette'))    this.paletteService.setPalette(user.palette);
    if (user.lang    && !localStorage.getItem('lang')) {
      this.translocoSvc.setActiveLang(user.lang);
      localStorage.setItem('lang', user.lang);
    }
  }

  async resendVerificationEmail(lang?: string): Promise<void> {
    const user = this.firebase.auth.currentUser;
    if (!user) return;
    if (lang) this.firebase.auth.languageCode = lang;
    await sendEmailVerification(user);
  }

  async resetPassword(email: string, lang?: string): Promise<void> {
    if (lang) this.firebase.auth.languageCode = lang;
    await sendPasswordResetEmail(this.firebase.auth, email);
  }

  async verifyPasswordResetCode(oobCode: string): Promise<string> {
    return verifyPasswordResetCode(this.firebase.auth, oobCode);
  }

  async confirmPasswordReset(oobCode: string, newPassword: string): Promise<void> {
    await confirmPasswordReset(this.firebase.auth, oobCode, newPassword);
  }

  async applyEmailVerificationCode(oobCode: string): Promise<void> {
    await applyActionCode(this.firebase.auth, oobCode);
  }

  async logout(): Promise<void> {
    await signOut(this.firebase.auth);
    this.router.navigate(['/auth/login']);
  }
}
