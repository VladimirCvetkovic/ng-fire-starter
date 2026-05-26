---
name: add-environment
description: Adds a new deployment environment (e.g. staging, preview) — creates the Angular environment file, updates angular.json, package.json, .firebaserc, firebase.json, and the GitHub Actions workflow.
---

# Add New Environment Guide

You are guiding a developer through adding a new deployment environment to this Angular + Firebase project. Follow each step in order. Use the tools at your disposal (Read, Edit, Write, Bash, AskUserQuestion) to complete each step.

---

## Step 1 — Environment Name & Branch

Ask the user:

> "What is the name of the new environment? (e.g. `staging`, `preview`, `uat`)"

Call this value `ENV_NAME`.

**Reserved name check:**

- If `ENV_NAME` is `production`, stop and tell the user:
  > "`production` is a reserved environment name already configured in this project. Please choose a different name (e.g. `staging`, `preview`, `uat`)."
  Then ask for a new name and repeat the check before continuing.

- If `ENV_NAME` is `develop`, note it as `IS_DEVELOP=true`. The Angular build configuration for `develop` already exists in `angular.json`, so **Step 5 will be skipped** for this environment.

Then ask:

> "Which Git branch should trigger this environment's deployment? (e.g. `staging`, `develop`)"

Call this value `ENV_BRANCH`.

---

## Step 2 — Create Firebase Project

Tell the user:

> "You need a separate Firebase project for the `<ENV_NAME>` environment. Open Firebase Console and set it up now."

Show them exactly what to do:

```
Go to: https://console.firebase.google.com

1. Click "Add project" → enter a name (e.g. "my-app-staging") → create the project

2. Enable Hosting:
   Build → Hosting → Get started
   Follow the setup wizard. Note the projectId shown (e.g. "my-app-staging-12345").

3. Enable Firestore Database:
   Build → Firestore Database → Create database
   Choose a region, start in "test mode".

4. Enable Authentication:
   Build → Authentication → Get started
   Go to Sign-in method → Enable "Email/Password".
```

Ask:

> "Have you created the Firebase project for `<ENV_NAME>`? Reply with **yes** to continue."

Wait for confirmation.

---

## Step 3 — Firebase App Config

Tell the user:

> "Go to Firebase Console → select your **`<ENV_NAME>`** Firebase project → Project Settings (gear icon) → General → scroll to 'Your apps' → select your web app → copy the **firebaseConfig** object."

Ask them to paste it. It looks like:

```js
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "my-app-staging.firebaseapp.com",
  projectId: "my-app-staging-12345",
  storageBucket: "my-app-staging.firebasestorage.app",
  messagingSenderId: "540246278279",
  appId: "1:540246278279:web:abc123",
  measurementId: "G-XXXXXXX"
};
```

Parse these 7 values from the pasted config:
- `apiKey`
- `authDomain`
- `projectId` — call this `ENV_PROJECT_ID`
- `storageBucket`
- `messagingSenderId`
- `appId`
- `measurementId`

---

## Step 4 — Create or Update Angular Environment File

**If `IS_DEVELOP=true`**, the file `frontend/src/environments/environment.develop.ts` already exists. Use the Edit tool to replace all 7 Firebase values inside the `firebase:` block of that file. Leave all other fields (`production`, `useEmulators`, `recaptchaSiteKey`) and the fake placeholder values for non-Firebase fields exactly as they are — only the 7 `firebase:` sub-keys should be updated. Confirm to the user which values were replaced.

**Otherwise**, create the file `frontend/src/environments/environment.<ENV_NAME>.ts` with the following content, substituting all 7 Firebase values:

```typescript
export const environment = {
    production: true,
    useEmulators: false,
    recaptchaSiteKey: '',
    firebase: {
        apiKey: '<apiKey>',
        authDomain: '<authDomain>',
        projectId: '<projectId>',
        storageBucket: '<storageBucket>',
        messagingSenderId: '<messagingSenderId>',
        appId: '<appId>',
        measurementId: '<measurementId>'
    }
};
```

Use the Write tool to create the file. Confirm creation to the user.

---

## Step 5 — Update angular.json

**If `IS_DEVELOP=true`, skip this entire step** — the `develop` configuration already exists in `angular.json`. Inform the user:
> "`angular.json` already contains a `develop` build and serve configuration — skipping."

Otherwise, read `frontend/angular.json`. Add the following two entries using the Edit tool.

**A) Under `projects.frontend.architect.build.configurations`**, add a new config after the existing `develop` block:

```json
"<ENV_NAME>": {
    "fileReplacements": [
        {
            "replace": "src/environments/environment.ts",
            "with": "src/environments/environment.<ENV_NAME>.ts"
        }
    ],
    "outputHashing": "all"
}
```

**B) Under `projects.frontend.architect.serve.configurations`**, add a new entry after the existing `develop` block:

```json
"<ENV_NAME>": {
    "buildTarget": "frontend:build:<ENV_NAME>"
}
```

After editing, confirm to the user that `angular.json` was updated.

---

## Step 6 — Update package.json Scripts

Read `frontend/package.json`. The `scripts` block currently contains `build:prod` and `deploy:prod`. Use the Edit tool to add two new scripts after `deploy:prod`:

```json
"build:<ENV_NAME>": "ng build --configuration <ENV_NAME>",
"deploy:<ENV_NAME>": "npm run build:<ENV_NAME> && firebase deploy --only hosting:<ENV_NAME> --project <ENV_PROJECT_ID>",
```

After editing, confirm to the user that `package.json` was updated.

---

## Step 7 — Update .firebaserc

Read `.firebaserc`. The file currently has a `projects` object and a `targets` object. Use the Edit tool to:

**A) Add the new project alias** inside `"projects"`:

```json
"<ENV_NAME>": "<ENV_PROJECT_ID>"
```

**B) Add a new hosting target** inside `"targets"`:

```json
"<ENV_PROJECT_ID>": {
    "hosting": {
        "<ENV_NAME>": [
            "<ENV_PROJECT_ID>"
        ]
    }
}
```

After editing, confirm to the user that `.firebaserc` was updated.

---

## Step 8 — Update firebase.json

Read `firebase.json`. The `hosting` array currently has one entry with `"target": "production"`. Use the Edit tool to add a second hosting entry **after the closing `}` of the existing entry** and **before the closing `]`** of the `hosting` array:

```json
,
{
    "target": "<ENV_NAME>",
    "public": "frontend/dist/frontend/browser",
    "ignore": [
        "firebase.json",
        "**/.*",
        "**/node_modules/**"
    ],
    "headers": [
        {
            "source": "/i18n/**",
            "headers": [
                { "key": "Cache-Control", "value": "no-cache, no-store, must-revalidate" }
            ]
        }
    ],
    "rewrites": [
        {
            "source": "**",
            "destination": "/index.html"
        }
    ]
}
```

After editing, confirm to the user that `firebase.json` was updated.

---

## Step 9 — Update GitHub Actions Workflow

First check if `.github/workflows/deploy.yml` exists. If it does NOT exist, skip this step and tell the user:

> "No GitHub Actions workflow found — skipping CI/CD configuration. You can deploy manually with `npm run deploy:<ENV_NAME>` from the `frontend/` folder."

If it DOES exist, read the file. Then use the Edit tool to make two changes:

**A) Add the new branch** to the `on.push.branches` list so the workflow triggers on pushes to `<ENV_BRANCH>`:

The current `on` block looks like:
```yaml
on:
  push:
    branches:
      - main
```

Change it to:
```yaml
on:
  push:
    branches:
      - main
      - <ENV_BRANCH>
```

**B) Add three new jobs** at the end of the file. Where `<ENV_NAME_UPPER>` is `ENV_NAME` converted to uppercase (e.g. `staging` → `STAGING`):

```yaml
  build-<ENV_NAME>:
    name: Build Angular app (<ENV_NAME>)
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/<ENV_BRANCH>'

    steps:
      - name: Checkout code
        uses: actions/checkout@v6
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
          fetch-depth: 0

      - name: Setup Node.js
        uses: actions/setup-node@v6
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: frontend/package-lock.json

      - name: Install dependencies
        working-directory: frontend
        run: npm ci

      - name: Bump patch version (local only)
        working-directory: frontend
        run: npm version patch --no-git-tag-version

      - name: Build Angular app
        working-directory: frontend
        run: npm run build -- --configuration <ENV_NAME>

      - name: Upload build artifact
        uses: actions/upload-artifact@v6
        with:
          name: build-output-<ENV_NAME>
          path: frontend/dist/frontend/browser
          retention-days: 1

      - name: Upload bumped version files
        uses: actions/upload-artifact@v6
        with:
          name: version-bump-files-<ENV_NAME>
          path: |
            frontend/package.json
            frontend/package-lock.json
          retention-days: 1

  deploy-<ENV_NAME>:
    name: "Deploy - <ENV_NAME> (<ENV_PROJECT_ID>)"
    runs-on: ubuntu-latest
    needs: build-<ENV_NAME>
    if: github.ref == 'refs/heads/<ENV_BRANCH>'

    steps:
      - name: Checkout code
        uses: actions/checkout@v6

      - name: Download build artifact
        uses: actions/download-artifact@v7
        with:
          name: build-output-<ENV_NAME>
          path: frontend/dist/frontend/browser

      - name: Deploy Firestore rules to <ENV_NAME>
        env:
          FIREBASE_SA: ${{ secrets.FIREBASE_SERVICE_ACCOUNT_<ENV_NAME_UPPER> }}
        run: |
          npm install -g firebase-tools
          echo "$FIREBASE_SA" > /tmp/sa.json
          GOOGLE_APPLICATION_CREDENTIALS=/tmp/sa.json firebase deploy --only firestore:rules --project ${{ vars.FIREBASE_PROJECT_ID_<ENV_NAME_UPPER> }}
          rm -f /tmp/sa.json

      - name: "Deploy to <ENV_NAME> (target: <ENV_NAME>)"
        uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: ${{ secrets.GITHUB_TOKEN }}
          firebaseServiceAccount: ${{ secrets.FIREBASE_SERVICE_ACCOUNT_<ENV_NAME_UPPER> }}
          projectId: ${{ vars.FIREBASE_PROJECT_ID_<ENV_NAME_UPPER> }}
          target: <ENV_NAME>
          channelId: live

  bump-version-<ENV_NAME>:
    name: Commit version bump (<ENV_NAME>)
    runs-on: ubuntu-latest
    needs: deploy-<ENV_NAME>
    if: github.ref == 'refs/heads/<ENV_BRANCH>'
    permissions:
      contents: write

    steps:
      - name: Checkout code
        uses: actions/checkout@v6
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
          fetch-depth: 0

      - name: Download bumped version files
        uses: actions/download-artifact@v7
        with:
          name: version-bump-files-<ENV_NAME>
          path: frontend/

      - name: Commit and push version bump
        run: |
          git config user.name "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"
          git add frontend/package.json frontend/package-lock.json
          git commit -m "chore: bump patch version [skip ci]"
          git push
```

After editing, confirm to the user that `.github/workflows/deploy.yml` was updated.

---

## Step 10 — GitHub Actions Secret & Variable

Tell the user they need to add one GitHub secret and one GitHub variable for the new environment:

**1. Repository secret** (for authentication):

```
Go to your GitHub repository:
Settings → Secrets and variables → Actions → Secrets tab → New repository secret

Secret name:  FIREBASE_SERVICE_ACCOUNT_<ENV_NAME_UPPER>
Secret value: (a JSON service account key — see below)
```

**2. Repository variable** (for the Firebase project ID):

```
Settings → Secrets and variables → Actions → Variables tab → New repository variable

Variable name:  FIREBASE_PROJECT_ID_<ENV_NAME_UPPER>
Variable value: (the Firebase project ID from Step 3, e.g. "my-app-staging-12345")
```

Explain how to get the service account JSON from the **`<ENV_NAME>` Firebase project**:

```
Option A — Firebase Console:
  Project Settings → Service accounts → Generate new private key
  Download the JSON file and paste its entire contents as the secret value.

Option B — Google Cloud Console:
  console.cloud.google.com → IAM & Admin → Service Accounts
  Find the Firebase Admin SDK service account → Keys → Add Key → JSON
```

**Required IAM roles** — the service account must have these roles in Google Cloud Console for the `<ENV_NAME>` project:

```
Go to: console.cloud.google.com → IAM & Admin → IAM
Select the <ENV_NAME> project → find the service account → Edit → Add another role

Required roles:
  1. Service Usage Consumer      (roles/serviceusage.serviceUsageConsumer)
  2. Firebase Rules Admin        (roles/firebaserules.admin)
  3. Firebase Hosting Admin      (roles/firebasehosting.admin)
  4. Cloud Datastore Index Admin (roles/datastore.indexAdmin)
```

After adding all roles, click **Save**. If the key was generated before the roles were added, delete the old key and generate a new one — then update the GitHub secret.

---

## Step 11 — Done

Print a summary of all changes made:

```
Environment "<ENV_NAME>" added successfully! Here is what was configured:

✓ Angular environment file created:
  - frontend/src/environments/environment.<ENV_NAME>.ts

✓ angular.json updated:
  - Build configuration: <ENV_NAME>
  - Serve configuration: <ENV_NAME>

✓ package.json updated:
  - build:<ENV_NAME>
  - deploy:<ENV_NAME>

✓ .firebaserc updated:
  - Project alias: <ENV_NAME> → <ENV_PROJECT_ID>
  - Hosting target: <ENV_NAME>

✓ firebase.json updated:
  - Hosting target "<ENV_NAME>" added

✓ GitHub Actions: <updated with build-<ENV_NAME>, deploy-<ENV_NAME>, and bump-version-<ENV_NAME> jobs / skipped>

✓ GitHub secret & variable added:
  - Secret:   FIREBASE_SERVICE_ACCOUNT_<ENV_NAME_UPPER>
  - Variable: FIREBASE_PROJECT_ID_<ENV_NAME_UPPER> → <ENV_PROJECT_ID>
```

Then tell the user how to deploy manually:

```bash
cd frontend
npm run deploy:<ENV_NAME>
```

And how to serve the app locally against the new environment's Firebase (three separate terminals):

```bash
# Terminal 1 — start Firebase emulators
cd frontend
npm run start:emulators

# Terminal 2 — seed emulators with test users (first time, or for a fresh start)
cd frontend
npm run seed

# Terminal 3 — start Angular dev server against the new environment
cd frontend
npm start -- --configuration <ENV_NAME>
```

Note: `npm run seed` creates two test users in the running emulators (`user@app.com` / `user` and `admin@app.com` / `admin`). The emulators use `--export-on-exit` so the data persists across restarts — the seed only needs to be run once.

---

## Notes for Claude

- Always Read a file before Editing it.
- Never skip a step — each step requires user confirmation or input.
- `ENV_NAME_UPPER` is always the uppercase version of `ENV_NAME` (e.g. `staging` → `STAGING`, `preview` → `PREVIEW`).
- When editing `angular.json`, be careful with JSON commas — the last entry in each `configurations` object must not have a trailing comma.
- When editing `.firebaserc`, be careful with JSON commas — add a comma before the new entry if one already exists in the same object.
- When editing `package.json`, maintain valid JSON — add a comma after the preceding script entry before inserting the new ones.
- When adding jobs to `deploy.yml`, maintain consistent 2-space YAML indentation.
- The `firebase.json` hosting array supports multiple entries — each is identified by its `target` field.
- If the user already ran `/setup`, this skill adds on top of the existing production configuration without touching it.
- The skill can be run multiple times to add additional environments — each run is fully independent.
