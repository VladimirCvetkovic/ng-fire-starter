/** Maps a Firebase Auth error code to a transloco key relative to the `auth.login` scope. */
export function mapLoginError(error: unknown): string {
  const code = (error as { code?: string })?.code ?? '';
  const map: Record<string, string> = {
    'auth/invalid-credential':    'errors.invalidCredential',
    'auth/wrong-password':        'errors.invalidCredential',
    'auth/user-not-found':        'errors.invalidCredential',
    'auth/email-not-verified':    'errors.emailNotVerified',
    'auth/too-many-requests':     'errors.tooManyRequests',
    'auth/network-request-failed': 'errors.networkError',
  };
  return map[code] ?? 'errors.unknown';
}

/** Maps a Firebase Auth error code to a transloco key relative to the `auth.forgotPassword` scope. */
export function mapForgotPasswordError(error: unknown): string {
  const code = (error as { code?: string })?.code ?? '';
  const map: Record<string, string> = {
    'auth/user-not-found':          'errors.userNotFound',
    'auth/invalid-email':           'errors.invalidEmail',
    'auth/too-many-requests':       'errors.tooManyRequests',
    'auth/network-request-failed':  'errors.networkError',
  };
  return map[code] ?? 'errors.unknown';
}

/** Maps a Firebase Auth error code to a transloco key relative to the `auth.resetPassword` scope. */
export function mapResetPasswordError(error: unknown): string {
  const code = (error as { code?: string })?.code ?? '';
  const map: Record<string, string> = {
    'auth/expired-action-code':     'errors.expiredCode',
    'auth/invalid-action-code':     'errors.invalidCode',
    'auth/weak-password':           'errors.weakPassword',
    'auth/too-many-requests':       'errors.tooManyRequests',
    'auth/network-request-failed':  'errors.networkError',
  };
  return map[code] ?? 'errors.unknown';
}

/** Maps a Firebase Auth error code to a transloco key relative to the `auth.register` scope. */
export function mapRegisterError(error: unknown): string {
  const code = (error as { code?: string })?.code ?? '';
  const map: Record<string, string> = {
    'auth/email-already-in-use':   'errors.emailAlreadyInUse',
    'auth/weak-password':          'errors.weakPassword',
    'auth/too-many-requests':      'errors.tooManyRequests',
    'auth/network-request-failed': 'errors.networkError',
  };
  return map[code] ?? 'errors.unknown';
}
