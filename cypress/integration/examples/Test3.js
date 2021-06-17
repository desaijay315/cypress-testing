/// <reference types="Cypress" />

describe('My Third Test Suite', function(){
    
    //check boxes
    it('My Third test  case', function(){
        cy.visit('https://rahulshettyacademy.com/AutomationPractice/')
        cy.get('#checkBoxOption1').check().should("be.checked").and('have.value', 'option1')
        cy.get('#checkBoxOption1').uncheck().should("not.be.checked")
        cy.get("input[type='checkbox']").check(["option2"])


        //dropdown

        cy.get("select").select('option2').should("have.value", "option2")

        //dynamic test

        cy.get('#autocomplete').type('ind')

        cy.get('.ui-menu-item div').each(($el, index, $list) => {
            if($el.text() === 'India'){
                cy.wrap($el).click()
            }
        })

        cy.get('#autocomplete').should("have.value", 'India')
    })
})