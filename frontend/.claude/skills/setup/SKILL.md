---
name: setup
description: Step-by-step project setup — installs prerequisites, configures Firebase, replaces template placeholders, and optionally sets up GitHub Actions CI/CD.
---

# Install & Setup Guide

You are guiding a developer through the first-time setup of this Angular + Firebase starter project. Follow each step in order. Do not skip ahead. Use the tools at your disposal (Read, Edit, Bash, AskUserQuestion) to complete each step.

---

## Step 1 — Prerequisites

Tell the user what needs to be installed before the project can run, and show the exact commands:

```
Required tools:

1. Node.js v20+
   Download: https://nodejs.org
   Or via nvm: nvm install 20 && nvm use 20
   Verify: node --version

2. Angular CLI
   npm install -g @angular/cli
   Verify: ng version

3. Firebase Tools
   npm install -g firebase-tools
   Verify: firebase --version
```

Then tell the user to log in to Firebase:

```bash
firebase login
```

Ask them to confirm they are logged in and all three tools are installed before continuing.

---

## Step 2 — Create Firebase Project

Tell the user to open the Firebase Console and complete the following setup. Show them exactly where to go:

```
Go to: https://console.firebase.google.com

1. Click "Add project" → enter a name → create the project

2. Enable Hosting:
   Build → Hosting → Get started
   Follow the setup wizard. Note the projectId shown (e.g. "my-app-12345").

3. Enable Firestore Database:
   Build → Firestore Database → Create database
   Choose a region, start in "test mode" (you can secure it later).

4. Enable Authentication:
   Build → Authentication → Get started
   Go to Sign-in method → Enable "Email/Password".
```

Then ask:

> "Have you created the Firebase project and enabled Hosting, Firestore, and Authentication? Reply with **yes** to continue."

Wait for the user to confirm before proceeding to Step 3.

---

## Step 3 — Application Name

Ask the user:

> "What is your application name? (e.g. `My App`)"

Once the user provides the value (call it `APP_NAME`), use the Edit tool to replace **every occurrence** of `#{ProjectName}#` with the user's value in these three files:

- `.github/workflows/deploy.yml` (job display labels only)
- `frontend/public/i18n/en.json`
- `frontend/public/i18n/sr.json`

Read each file first, then apply the replacement. After editing, tell the user which files were updated.

---

## Step 4 — Firebase App Config

Tell the user:

> "Go to Firebase Console → Project Settings (gear icon) → General → scroll to 'Your apps' → select your web app → copy the **firebaseConfig** object."

Ask them to paste it. It looks like this:

```js
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "my-app.firebaseapp.com",
  projectId: "my-app-12345",
  storageBucket: "my-app.firebasestorage.app",
  messagingSenderId: "540246278279",
  appId: "1:540246278279:web:abc123",
  measurementId: "G-XXXXXXX"
};
```

Parse the following 7 values from the pasted config:
- `apiKey`
- `authDomain`
- `projectId`
- `storageBucket`
- `messagingSenderId`
- `appId`
- `measurementId`

Then use the Edit tool to:

**A) Replace the 7 Firebase config values** in the `firebase:` block of `frontend/src/environments/environment.ts`.

Leave all other fields (`production`, `useEmulators`, `recaptchaSiteKey`) exactly as they are.

**B) Replace only `projectId`** in `frontend/src/environments/environment.develop.ts`.

The develop environment uses emulators with fake placeholder values for all other Firebase fields — do NOT replace those. Only update the `projectId` line to match the user's project ID from the pasted config.

**B) Replace `#{FirebaseProjectId}#`** with the `projectId` value from the config in:
- `.firebaserc` (all occurrences)

Read each file before editing. After editing all files, confirm which were updated.

---

## Step 5 — reCAPTCHA

Ask the user:

> "Do you use reCAPTCHA? If yes, paste your reCAPTCHA v3 site key. If no, press Enter to skip."

If the user provides a key, replace the empty `recaptchaSiteKey` value in both environment files:
- `frontend/src/environments/environment.ts`
- `frontend/src/environments/environment.develop.ts`

To get the site key: Google reCAPTCHA Admin Console → register a new site → choose reCAPTCHA v3 → copy the **Site Key**.

If the user skips, leave `recaptchaSiteKey: ''` as-is and continue.

---

## Step 6 — GitHub Actions Pipeline


Ask the user:

> "Do you want to use the GitHub Actions deployment pipeline? It automatically builds and deploys to Firebase Hosting on every push to `main`. Reply **yes** or **no**."

### If YES:

Tell the user the pipeline is already configured in `.github/workflows/deploy.yml`. They need to add one GitHub secret and one GitHub variable to make it work:

**1. Repository secret** (for authentication):

```
Go to your GitHub repository:
Settings → Secrets and variables → Actions → Secrets tab → New repository secret

Secret name:  FIREBASE_SERVICE_ACCOUNT_PROD
Secret value: (a JSON service account key — see below)
```

**2. Repository variable** (for the Firebase project ID):

```
Settings → Secrets and variables → Actions → Variables tab → New repository variable

Variable name:  FIREBASE_PROJECT_ID
Variable value: (your Firebase project ID, e.g. "my-app-12345")
```

Explain how to get the service account JSON:

```
Option A — Firebase Console:
  Project Settings → Service accounts → Generate new private key
  Download the JSON file and paste its entire contents as the secret value.

Option B — Google Cloud Console:
  console.cloud.google.com → IAM & Admin → Service Accounts
  Find the Firebase Admin SDK service account → Keys → Add Key → JSON
```

**Important — required IAM roles:**

The service account must have the following roles in Google Cloud Console, otherwise the pipeline will fail with 403 errors:

```
Go to: console.cloud.google.com → IAM & Admin → IAM
Select your project → find the service account → click the pencil (Edit) icon → Add another role

Required roles:
  1. Service Usage Consumer     (roles/serviceusage.serviceUsageConsumer)
     → lets Firebase CLI check which APIs are enabled

  2. Firebase Rules Admin       (roles/firebaserules.admin)
     → allows deploying and validating Firestore security rules

  3. Firebase Hosting Admin     (roles/firebasehosting.admin)
     → allows deploying to Firebase Hosting

  4. Cloud Datastore Index Admin (roles/datastore.indexAdmin)
     → allows deploying Firestore indexes
```

After adding all roles, click **Save**. If the service account key was generated *before* the roles were added, delete the old key and generate a new one — then update the GitHub secret.

Tell them the pipeline will trigger on push to `main` and deploy Firestore rules + the Angular build to Firebase Hosting.

### If NO:

Delete the file `.github/workflows/deploy.yml` using the Bash tool:

```bash
# Windows (PowerShell)
Remove-Item -Force .github/workflows/deploy.yml

# Or on Linux/Mac
rm .github/workflows/deploy.yml
```

Confirm to the user that the pipeline file has been removed.

---

## Step 7 — Done

Print a summary of all changes made, for example:

```
Setup complete! Here is what was configured:

✓ App name "<APP_NAME>" set in:
  - .github/workflows/deploy.yml
  - frontend/public/i18n/en.json
  - frontend/public/i18n/sr.json

✓ Firebase project "<FIREBASE_PROJECT_ID>" set in:
  - .firebaserc

✓ Firebase config updated in:
  - frontend/src/environments/environment.ts
  - frontend/src/environments/environment.develop.ts

✓ reCAPTCHA: configured / skipped   (match what happened)

✓ GitHub Actions: enabled / removed   (match what happened)
```

Then tell the user to install dependencies and start the app:

```bash
# Install dependencies
cd frontend
npm install
```

Then open three separate terminals, all from the `frontend/` directory:

```bash
# Terminal 1 — start Firebase emulators
npm run start:emulators

# Terminal 2 — seed emulators with test users (first time only)
npm run seed

# Terminal 3 — start Angular dev server
npm start
```

The app will be available at `http://localhost:4200`.

Explain the seed step:
- `npm run seed` creates two pre-configured test users in the running emulators:
  - `user@app.com` / password: `user1234` (role: user)
  - `admin@app.com` / password: `admin1234` (role: admin)
- The emulators are configured with `--export-on-exit`, so the data is saved when emulators stop and automatically restored on the next `npm run start:emulators`. The seed only needs to be run once (or when you want a fresh start).

---

## Notes for Claude

- Always Read a file before Editing it.
- Never skip a step — each step requires user confirmation or input.
- The app name (Step 3) can be any string — it is used as a display name in the UI (i18n files) and as the identifier in Firebase config files. The Firebase projectId from the pasted config (Step 4) is the authoritative technical identifier.
- The `#{ProjectName}#` placeholder may appear multiple times per file — replace all occurrences, not just the first.
- When replacing Firebase config values, match the exact string currently in the file (e.g. `"ng-fire-starter"`) and replace it with the user's value. Use the Edit tool's `replace_all: true` if the same value appears more than once in a file.
