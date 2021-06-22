/// <reference types="Cypress" />

describe('My Intercept Test Suite', function(){

    it('My Intercept test  case', function(){
        //requestobject, responseObject

        cy.visit('https://rahulshettyacademy.com/angularAppdemo/');

        cy.intercept({
            method: 'GET',
            url: 'https://rahulshettyacademy.com/Library/GetBook.php?AuthorName=shetty'
        },{
            statusCode: 200,
            body: [{"book_name":"RestAssured with Java","isbn":"RSU","aisle":"2301"}]
        }).as('bookRetrievals')

        cy.get("button[class='btn btn-primary']").click()
        cy.wait('@bookretrievals').should(({request,response})=>
        {
            cy.get('tr').should('have.length',response.body.length+1)
         
        })
        cy.get('p').should('have.text','Sorry we have only one book available')
        
    })

});