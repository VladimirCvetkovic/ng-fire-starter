Feature: Registration

  Background:
    Given I am on the register page

  # ─── Step 0: Role selection ───────────────────────────────────────────────────

  Scenario: Continue button is disabled until a role is selected
    Then the "Continue →" button is disabled

  Scenario: Selecting User role enables the Continue button
    When I select the "user" role
    Then the "Continue →" button is enabled

  Scenario: Selecting Admin role enables the Continue button
    When I select the "admin" role
    Then the "Continue →" button is enabled

  # ─── Step 1: User — basic info ────────────────────────────────────────────────

  Scenario: User step 1 — validation errors on empty submit
    When I select the "user" role
    And I click the "Continue →" button
    And I click the "Create account →" button
    Then I see at least one validation error

  Scenario: User step 1 — passwords do not match
    When I select the "user" role
    And I click the "Continue →" button
    And I fill in the name field with "John Smith"
    And I fill in the registration email field with "john@example.com"
    And I fill in the registration password field with "password123"
    And I fill in the confirm password field with "different123"
    And I click the "Create account →" button
    Then I see the validation error "Passwords do not match"

  Scenario: User step 1 — password too short
    When I select the "user" role
    And I click the "Continue →" button
    And I fill in the name field with "John Smith"
    And I fill in the registration email field with "john@example.com"
    And I fill in the registration password field with "abc"
    And I fill in the confirm password field with "abc"
    And I click the "Create account →" button
    Then I see the validation error "Password must be at least 6 characters"

  # ─── Step 1: Admin — phone field ──────────────────────────────────────────────

  Scenario: Admin step 1 — phone field is visible
    When I select the "admin" role
    And I click the "Continue →" button
    Then the phone number input is visible

  Scenario: Admin step 1 — invalid phone shows validation error
    When I select the "admin" role
    And I click the "Continue →" button
    And I fill in the name field with "Admin User"
    And I fill in the registration email field with "admin@example.com"
    And I fill in the phone field with "not-a-phone"
    And I fill in the registration password field with "password123"
    And I fill in the confirm password field with "password123"
    And I click the "Continue →" button
    Then I see the validation error "Enter a valid phone number"

  # ─── Navigation ───────────────────────────────────────────────────────────────

  Scenario: Log in link navigates back to login
    When I click the "Log in" link
    Then I should be on the login page
