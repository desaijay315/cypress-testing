/// <reference types="Cypress" />
import { Given,When,Then, And } from "cypress-cucumber-preprocessor/steps";

Given('I open new article page',()=>
{
    cy.contains('New Article').click();
})

When('I create the new article', () => {   
    const requestBody = {
        "article":
            {
                "tagList":[],
                "title":"testing the blog site",
                "description":"testing the blog site",
                "body":"testing the blog site"
            }
        }
    

    cy.get('@token').then(token => {
        cy.request({
            url: Cypress.env('apiUrl') + 'articles/',
            headers: {'Authorization': 'Token ' + token},
            method: 'POST',
            body: requestBody
        }).then(res =>{
            expect(res.status).to.equal(200);
        })
    })
})

Then('Validate the new article created & the forms behaviour', () =>{
    cy.get('.nav').contains('Home').click();
    cy.contains(/Global Feed/i).click()

    cy.get('.article-preview .preview-link h1').then(articleDetails => {
        cy.log(articleDetails[0])
        cy.get(articleDetails[0]).should('have.text','testing the blog site')
    })

})


Given('I open home page' , () =>{
    cy.get('.nav').contains('Home').click();
})

When('I check the tags', () =>{
    cy.intercept("GET", Cypress.env('apiUrl') + "tags", { fixture: 'tags.json' }).as("dataGetFirst");
})

Then('validate the tags generated' , () =>{
    cy.get('.tag-list')
    .should('contain', 'HuManIty')
    .and('contain', 'Gandhi')
    .and('contain', 'HITLER')
    .and('contain', 'SIDA')
})

Given('I open home page and go to global feed', () =>{
    cy.contains(/Global Feed/i).click()
})


And('I check the article count', () => {
    cy.get('app-article-list button').then(listOfButtons => {
        cy.log(listOfButtons)
        expect(listOfButtons[0]).to.contain('0')
    })
})


When('I click on the like button' ,() => {
    cy.fixture('articles').then(data => {
        const link  = data.articles[1].slug
        cy.intercept('POST', Cypress.env('apiUrl') + `articles/${link}/favorite`, data)
    })

    cy.get('app-article-list button').eq(0).click()
    
})


Then('Then like count of the article should increment by one', () => {
    cy.get('app-article-list button').eq(0).should('contain', '1')
})

Given('I open home page and go to global feed', () =>{
    cy.contains(/Global Feed/i).click()
})


When('I click on the newly created article', () =>{
    cy.get('.article-preview').first().click()
})

And('I delete the article', () => {
    cy.get('.article-actions').contains('Delete Article').click()
})

Then('validate the deleted article', () =>{
    cy.get('@token').then(token => {
        cy.request({
            url: Cypress.env('apiUrl') + 'articles?limit=10&offset=0',
            headers: {'Authorization': 'Token ' + token},
            method: 'GET'
        }).its('body')
        .then(body => {
            expect(body.articles[0].title).not.to.equal('testing the blog site')
        })
    })
})