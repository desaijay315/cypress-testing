/// <reference types="Cypress" />

describe('My Intercept Test Suite', function(){

    before(() => {
        cy.fixture('example.json').as('data')
    })

    it('My Intercept test  case', function(){
        //requestobject, responseObject
        cy.visit('https://rahulshettyacademy.com/angularpractice/')
        cy.get('input[name="name"]:nth-child(2)').type(this.data.name)
        cy.get('select').select(this.data.gender)
        cy.get(':nth-child(4) > .ng-untouched').should("have.value", this.data.name)
        cy.get('input[name="name"]:nth-child(2)').should("have.attr", "minlength", 2)
    })
})