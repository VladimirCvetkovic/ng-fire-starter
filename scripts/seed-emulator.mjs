#!/usr/bin/env node
/**
 * Seeds the Firebase emulators with two test users.
 *
 * Prerequisites: emulators must already be running.
 *   cd frontend && npm run start:emulators
 *
 * Usage:
 *   cd frontend && npm run seed
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Read the Firebase project ID from the environment config so seed always
// writes to the same Firestore namespace the app reads from.
function readProjectId() {
  const envFile = readFileSync(
    path.join(__dirname, '../frontend/src/environments/environment.develop.ts'),
    'utf8',
  );
  const match = envFile.match(/projectId:\s*['"]([^'"]+)['"]/);
  return match ? match[1] : 'default';
}

const AUTH = 'http://localhost:9099';
const FIRESTORE = 'http://localhost:8080';
const PROJECT = readProjectId();

const USERS = [
  { email: 'user@app.com', password: 'User1234', name: 'User', role: 'user' },
  { email: 'admin@app.com', password: 'Admin1234', name: 'Admin', role: 'admin' },
];

async function checkEmulators() {
  try {
    await fetch(`${AUTH}/`);
  } catch {
    console.error('Auth emulator not reachable at', AUTH);
    console.error('Start emulators first:  cd frontend && npm run start:emulators');
    process.exit(1);
  }
}

async function clearAuth() {
  // Clear both "default" and the real project ID — singleProjectMode can route under either namespace
  for (const proj of [PROJECT, 'default']) {
    const res = await fetch(`${AUTH}/emulator/v1/projects/${proj}/accounts`, { method: 'DELETE' });
    if (!res.ok) throw new Error(`Clear auth failed for ${proj}: ${res.status}`);
  }
}

async function createAuthUser(email, password, displayName) {
  // "Bearer owner" is the emulator admin bypass — skips password policy validation
  const signUpRes = await fetch(
    `${AUTH}/identitytoolkit.googleapis.com/v1/accounts:signUp?key=fake-key`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer owner' },
      body: JSON.stringify({ email, password, displayName, returnSecureToken: false }),
    },
  );
  if (!signUpRes.ok) {
    throw new Error(`signUp failed for ${email}: ${JSON.stringify(await signUpRes.json())}`);
  }
  const { localId } = await signUpRes.json();

  // Mark email as verified — emulator allows this via "Bearer owner" admin bypass
  const verifyRes = await fetch(
    `${AUTH}/identitytoolkit.googleapis.com/v1/accounts:update?key=fake-key`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer owner' },
      body: JSON.stringify({ localId, emailVerified: true }),
    },
  );
  if (!verifyRes.ok) {
    throw new Error(`emailVerified update failed: ${JSON.stringify(await verifyRes.json())}`);
  }

  return localId;
}

async function clearFirestore() {
  const res = await fetch(
    `${FIRESTORE}/emulator/v1/projects/${PROJECT}/databases/(default)/documents`,
    { method: 'DELETE' },
  );
  if (!res.ok) throw new Error(`Clear Firestore failed: ${res.status} ${await res.text()}`);
}

async function setFirestoreUser(uid, data) {
  const fields = Object.fromEntries(
    Object.entries(data).map(([k, v]) => [k, { stringValue: String(v) }]),
  );
  // "Bearer owner" bypasses Firestore security rules in the emulator
  const res = await fetch(
    `${FIRESTORE}/v1/projects/${PROJECT}/databases/(default)/documents/users/${uid}`,
    {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer owner' },
      body: JSON.stringify({ fields }),
    },
  );
  if (!res.ok) throw new Error(`setDoc users/${uid} failed: ${await res.text()}`);
}

async function seed() {
  await checkEmulators();

  console.log('Clearing existing emulator data...');
  await clearAuth();
  await clearFirestore();

  console.log('\nCreating seed users:');
  for (const u of USERS) {
    const uid = await createAuthUser(u.email, u.password, u.name);
    await setFirestoreUser(uid, {
      id: uid,
      name: u.name,
      email: u.email,
      role: u.role,
      theme: 'system',
      palette: 'blue',
    });
    console.log(`  [${u.role.padEnd(5)}]  ${u.email.padEnd(28)}  password: ${u.password}`);
  }

  console.log('\nSeed complete.');
}

seed().catch((err) => {
  console.error('\nSeed failed:', err.message);
  process.exit(1);
});
