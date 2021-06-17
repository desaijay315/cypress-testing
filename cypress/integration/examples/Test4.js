/// <reference types="Cypress" />

describe('My Foruth Test Suite', function(){
    
    //check boxes
    it('My Foruth test  case', function(){
        cy.visit('https://react-select.com/cypress-tests')
        //dynamic test

        cy.get('#basic-select-single').as('basicSeelctSingleId')
        cy.get('@basicSeelctSingleId').type('oce')

        cy.get('div .react-select__menu').each(($el, index, $list) => {
            if($el.text() === 'Ocean'){
                cy.wrap($el).click()
            }
        })

        cy.get('@basicSeelctSingleId').find('.css-1uccc91-singleValue').contains('Ocean');
    })

    // it('react-select', () => {

    //     cy.visit('https://react-select.com/cypress-tests')
    //     cy.get('#basic-select-single').as('basicSeelctSingleId')
    //     cy.get('@basicSeelctSingleId').type('oce').click().find('input').focus()
    //     cy.focused().type('{downarrow}{enter}', {force:true}) 
    //     cy.get('@basicSeelctSingleId').find('.css-1uccc91-singleValue').contains('Ocean');
      
    //   })
      
      
})