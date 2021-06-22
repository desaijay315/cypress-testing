/// <reference types="Cypress" />

describe('My Intercept Test Suite', function(){

        it('My Intercept test  case', function(){
            //requestobject, responseObject

            cy.request('GET', 'https://conduit.productionready.io/api/tags')
            .its('body').then((body) => {
                cy.log(body);
            })
    })
})