import { Injectable } from '@angular/core';
import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, connectAuthEmulator, Auth } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator, Firestore } from 'firebase/firestore';
import { environment } from '@environments/environment';

/**
 * Initializes the Firebase SDK and exposes typed Auth and Firestore instances.
 * Automatically connects to local emulators when `environment.useEmulators` is true.
 *
 * Usage: inject(CoreFirebaseService) in any service that needs firebase.auth or firebase.firestore.
 * This singleton is created once at app bootstrap — do not call initializeApp elsewhere.
 */
@Injectable({ providedIn: 'root' })
export class CoreFirebaseService {
  readonly app: FirebaseApp;
  readonly auth: Auth;
  readonly firestore: Firestore;

  constructor() {
    this.app = getApps().length === 0
      ? initializeApp(environment.firebase)
      : getApps()[0];

    this.auth = getAuth(this.app);
    this.firestore = getFirestore(this.app);

    if (environment.useEmulators) {
      try { connectAuthEmulator(this.auth, 'http://localhost:9099', { disableWarnings: true }); } catch { /* already connected */ }
      try { connectFirestoreEmulator(this.firestore, 'localhost', 8080); } catch { /* already connected */ }
    }
  }
}
