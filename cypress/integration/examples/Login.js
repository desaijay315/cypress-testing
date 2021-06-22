/// <reference types="Cypress" />

describe('My Intercept Login Suite', function(){
  
    beforeEach('login to the app ', () =>{
        cy.loginToApplication()
    })

    it('verify correct request and response', function(){
        cy.log('test passed')
        // cy.wait(["@dataGetFirst", "@feedArticle"]);
        cy.intercept('POST', 'https://conduit.productionready.io/api/articles/').as("postArticle")
        // cy.intercept('GET', 'https://conduit.productionready.io/api/articles/hello-n9cw5f', {fixture: 'singleArticle.json'}).as("singlePostArticle")

        cy.contains('New Article').click();
        cy.get('[formcontrolname="title"]').type('hello');
        cy.get('[formcontrolname="description"]').type('hello');
        cy.get('[formcontrolname="body"]').type('hello');
        cy.contains('Publish Article').click();

        cy.wait('@postArticle')
        cy.get('@postArticle').then((xhr) => {
          expect(xhr.response.statusCode).to.equal(200);
          expect(xhr.request.body.article.title).to.equal('hello')
          expect(xhr.request.body.article.body).to.equal('hello')
          expect(xhr.request.body.article.description).to.equal('hello')
        })


        // cy.wait('@postArticle')
        // cy.get('@postArticle').then(xhr => {
        //   cy.log(xhr.request.body)
        //   //expect(xhr.status).to.equal(200)
        //   expect(xhr.request.body.article.title).to.equal('hello')
        //   expect(xhr.request.body.article.body).to.equal('hello')
        //   expect(xhr.request.body.article.description).to.equal('hello')
        // })
        // cy.wait('@singlePostArticle')
    })
})
