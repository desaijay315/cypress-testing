Feature: End to end Blog Site validation

    application Regression
    @Regression
    Scenario: Create a new article
    Given I open new article page 
    When I create the new article
    |title | description | body |
    |testing the blog site | testing the blog site   | testing the blog site   |

    Then Validate the new article created & the forms behaviour

    @Regression
    Scenario: Check the tags on the home page
    Given I open home page
    When I check the tags
    Then validate the tags generated


    @Regression
    Scenario: Verify the global feed article likes count
    Given I open home page and go to global feed
    And I check the article count
    When I click on the like button
    Then Then like count of the article should increment by one


    @Regression
    Scenario: Delete the newly created article
    Given I open home page and go to global feed
    When I click on the newly created article
    And I delete the article
    Then validate the deleted article
    




