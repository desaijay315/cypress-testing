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




 Cypress.Commands.add('loginToApplication', () => {
   
  
    // cy.intercept("GET", "https://conduit.productionready.io/api/tags", { fixture: 'tags.json' }).as("dataGetFirst");
  
    // cy.intercept("GET", "https://conduit.productionready.io/api/articles?limit=10&offset=0", {fixture: 'articles.json'}).as("dataGetFirstArticle");


    //cy.intercept({method: "POST", url: "https://conduit.productionready.io/api/users/login"}, {fixture: 'user.json'}).as("loginIntercept"); //real -> fixture (remove)
    // cy.intercept({method: "GET", url: "https://conduit.productionready.io/api/articles/feed?limit=10&offset=0"}, {fixture: 'articles.json'}).as("feedArticle"); //after login
 

   cy.visit('https://angular.realworld.io/'); //site
  //  cy.wait(["@dataGetFirst", "@dataGetFirstArticle"]);
   cy.get('.nav').contains('Sign in').click();
   cy.fixture('example.json').as("data");

   cy.get('@data').then((user) => {
     cy.get('[placeholder="Email"]').type(user.email)
     cy.get('[placeholder="Password"]').type(user.password);
     cy.get('form').submit(); 
    //  cy.wait("@loginIntercept");
  })
 })

