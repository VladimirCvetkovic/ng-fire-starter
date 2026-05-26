import { createBdd } from 'playwright-bdd';
import { test } from '../fixtures/app.fixture';

const { Given } = createBdd(test);

Given('I am logged in as a user', async ({ userPage: _page }) => {
  // fixture handles login — step just declares the dependency
});

Given('I am logged in as an admin', async ({ adminPage: _page }) => {
  // fixture handles login — step just declares the dependency
});
