Feature: Auth Guards and Navigation

  Scenario: Unauthenticated user is redirected from /user to login
    Given I am not logged in
    When I navigate to "/user"
    Then I should be on the login page

  Scenario: Unauthenticated user is redirected from /admin to login
    Given I am not logged in
    When I navigate to "/admin"
    Then I should be on the login page

  Scenario: Unknown route redirects to login
    Given I am not logged in
    When I navigate to "/some/unknown/route"
    Then I should be on the login page

  Scenario: Root path redirects to login when not authenticated
    Given I am not logged in
    When I navigate to "/"
    Then I should be on the login page
