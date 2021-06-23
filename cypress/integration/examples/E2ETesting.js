/// <reference types="Cypress" />

describe('Fully automated end to end testing suite', function(){
  
    beforeEach('login to the app ', () =>{
        cy.loginToApplication()
    })

    it('verify correct request and response', function(){
        cy.log('After Login Successful')
        cy.intercept('POST', 'https://conduit.productionready.io/api/articles/').as("postArticle")
       
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
    })

    it('should show the tags as mentioned in the tags object', () => {
        cy.intercept("GET", "https://conduit.productionready.io/api/tags", { fixture: 'tags.json' }).as("dataGetFirst");
        cy.get('.tag-list')
        .should('contain', 'HuManIty')
        .and('contain', 'Gandhi')
        .and('contain', 'HITLER')
        .and('contain', 'SIDA')
    })
    
    it('verify the gobal feed articles like count', () =>{
        cy.intercept("GET", "https://conduit.productionready.io/api/articles/feed?limit=10&offset=0", { fixture: 'feed.json' }).as("feedArticles");
        cy.intercept("GET", "https://conduit.productionready.io/api/articles?limit=10&offset=0", { fixture: 'articles.json' }).as("globalArticles");

        cy.contains(/Global Feed/i).click()
        cy.get('app-article-list button').then(listOfButtons => {
            cy.log(listOfButtons)
            expect(listOfButtons[0]).to.contain('5')
            expect(listOfButtons[1]).to.contain('10')
        })

        cy.fixture('articles').then(data => {
            const link  = data.articles[1].slug
            cy.intercept('POST', `https://conduit.productionready.io/api/articles/${link}/favorite`, data)
        })

        cy.get('app-article-list button')
        .eq(0)
        .click()
        .should('contain', '6')
        cy.get('app-article-list button')
        .eq(1)
        .click()
        .should('contain', '10')
    })

    it('delete the newly created articles', () => {
        const userCred = {
            "user": {
                "email": "desai26jay@gmail.com",
                "password": "admin123"
            }
        }

        const requestBody = {
            "article":
                {
                    "tagList":[],
                    "title":"Testing the api",
                    "description":"Testing the api",
                    "body":"Testing the api"
                }
            }
        

        cy.request('POST', 'https://conduit.productionready.io/api/users/login', userCred)
        .its('body').then(body => {
            const token = body.user.token

            cy.request({
                url: 'https://conduit.productionready.io/api/articles/',
                headers: {'Authorization': 'Token ' + token},
                method: 'POST',
                body: requestBody
            }).then(res =>{
                expect(res.status).to.equal(200);
            })


            //delete the global feed latest post which is created
            cy.contains(/Global Feed/i).click()
            cy.get('.article-preview').first().click()
            cy.get('.article-actions').contains('Delete Article').click()


            //verify whether the title is actually delete from the API or Not
            cy.request({
                url: 'https://conduit.productionready.io/api/articles?limit=10&offset=0',
                headers: {'Authorization': 'Token ' + token},
                method: 'GET'
            }).its('body')
            .then(body => {
                expect(body.articles[0].title).not.to.equal('Testing the api')
            })
        })
    })
})
