Feature: Login

  Background:
    Given I am on the login page

  Scenario: Login form renders correctly
    Then the email input is visible
    And the password input is visible
    And the "Sign in" button is enabled
    And a "Forgot password?" link is visible
    And a "Sign up" link is visible

  Scenario: Empty form submission shows no navigation
    When I click the "Sign in" button
    Then I should remain on the login page

  Scenario: Invalid email format blocks submission
    When I fill in the email field with "notanemail"
    And I fill in the password field with "password123"
    And I click the "Sign in" button
    Then I should remain on the login page

  Scenario: Wrong credentials show an error
    When I fill in the email field with "wrong@email.com"
    And I fill in the password field with "wrongpassword"
    And I click the "Sign in" button
    Then I see the error "Incorrect email or password"

  Scenario: Successful login as a regular user
    When I fill in the email field with "user@app.com"
    And I fill in the password field with "user1234"
    And I click the "Sign in" button
    Then I am redirected to the user dashboard

  Scenario: Successful login as an admin
    When I fill in the email field with "admin@app.com"
    And I fill in the password field with "admin1234"
    And I click the "Sign in" button
    Then I am redirected to the admin dashboard

  Scenario: Forgot password link navigates to the correct page
    When I click the "Forgot password?" link
    Then I should be on the forgot password page

  Scenario: Sign up link navigates to the register page
    When I click the "Sign up" link
    Then I should be on the register page
