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

        cy.intercept('GET','https://rahulshettyacademy.com/Library/GetBook.php?AuthorName=shetty', (req) => {
        req.url='https://rahulshettyacademy.com/Library/GetBook.php?AuthorName=malhotra'
        req.continue((res)=>{
            expect(res.statusCode).to.equal(403)
        })
        req.on('response', (res) => {
            // Throttle the response to 1 Mbps to simulate a mobile 3G connection
            res.setThrottle(1000)
        })
        }).as("dummyUrl")

        cy.get("button[class='btn btn-primary']").click()
        cy.wait('@dummyUrl')


      
        
    })

});