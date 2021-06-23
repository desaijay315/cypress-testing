// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })


Cypress.Commands.add('isVisible', {
    prevSubject: true
  }, (subject) => {
    const isVisible = (elem) => !!(
      elem.offsetWidth ||
      elem.offsetHeight ||
      elem.getClientRects().length
    )
    expect(isVisible(subject[0])).to.be.true
})


Cypress.Commands.add('selectProduct', (productName) => { 
  cy.get('h4.card-title').each(($el,index,$list) => {
    if($el.text().includes(productName)){
        cy.get('button.btn.btn-info').eq(index).click()
    }
  })
 })




//  Cypress.Commands.add('loginToApplication', () => {
//    cy.visit('https://angular.realworld.io/');
//    cy.get('.nav').contains('Sign in').click();
//    cy.fixture('example.json').as("data");

//    cy.get('@data').then((user) => {
//      cy.get('[placeholder="Email"]').type(user.email)
//      cy.get('[placeholder="Password"]').type(user.password);
//      cy.get('form').submit(); 
//   })
//  })

Cypress.Commands.add('loginToApplication', () => {
  const userCred = {
    "user": {
      "email": "desai26jay@gmail.com",
      "password": "admin123"
    }
  }

  cy.request('POST', 'https://conduit.productionready.io/api/users/login', userCred)
    .its('body').then(body => {
        const token = body.user.token
      cy.wrap(token).as('token')
      cy.visit('https://angular.realworld.io/',{
          onBeforeLoad(win){
            win.localStorage.setItem('jwtToken', token)
          }
      });
  })
})

