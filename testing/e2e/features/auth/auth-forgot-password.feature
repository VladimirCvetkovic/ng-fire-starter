Feature: Forgot Password

  Background:
    Given I am on the forgot password page

  Scenario: Forgot password form renders correctly
    Then the email input is visible
    And the "Send reset link" button is enabled
    And a "Back to login" link is visible

  Scenario: Empty email shows no navigation
    When I click the "Send reset link" button
    Then I should remain on the forgot password page

  Scenario: Invalid email format shows no navigation
    When I fill in the email field with "notanemail"
    And I click the "Send reset link" button
    Then I should remain on the forgot password page

  Scenario: Unknown email shows an error message
    When I fill in the email field with "nobody@nowhere.com"
    And I click the "Send reset link" button
    Then I see the error "No account found with this email"

  Scenario: Valid email shows success state
    When I fill in the email field with "user@app.com"
    And I click the "Send reset link" button
    Then I see the success message "Reset link sent!"

  Scenario: Back to login link navigates to the login page
    When I click the "Back to login" link
    Then I should be on the login page
