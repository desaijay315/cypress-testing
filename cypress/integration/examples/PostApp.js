/// <reference types="Cypress" />

describe('My Intercept Test Suite', function(){

    it('My Intercept test  case', function(){
        //requestobject, responseObject
        cy.request('POST', 'http://216.10.245.166/Library/Addbook.php', {

            "name":"Learn Appium Automation with Java",
            "isbn":"bcd",
            "aisle":"227",
            "author":"John foe"
            }
        ).then(function(response){
            expect(response.status).to.eq(200)
            expect(response.body).to.have.property("Msg", "successfully added")
        })
    })

})