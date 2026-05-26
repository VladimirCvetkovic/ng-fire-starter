Feature: Dashboard

  Scenario: User dashboard renders after login
    Given I am logged in as a user
    When I navigate to "/home"
    Then I see a welcome message
    And the "Logout" button is visible
    And the "Open Drawer" button is visible
    And the "Open Bottom Sheet" button is visible
    And the "Show Banner" button is visible

  Scenario: Admin dashboard renders after login
    Given I am logged in as an admin
    When I navigate to "/home"
    Then I see a welcome message
    And the "Logout" button is visible

  Scenario: Logout redirects user to login
    Given I am logged in as a user
    When I navigate to "/home"
    And I click the "Logout" button
    Then I should be on the login page

  Scenario: Opening the drawer shows drawer content
    Given I am logged in as a user
    When I navigate to "/home"
    And I click the "Open Drawer" button
    Then the drawer is visible

  Scenario: Opening the bottom sheet shows bottom sheet content
    Given I am logged in as a user
    When I navigate to "/home"
    And I click the "Open Bottom Sheet" button
    Then the bottom sheet is visible

  Scenario: Opening the banner shows a banner notification
    Given I am logged in as a user
    When I navigate to "/home"
    And I click the "Show Banner" button
    Then the banner is visible
