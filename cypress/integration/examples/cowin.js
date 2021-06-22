


it.only('Cowin State Chooser', function () {

    cy.intercept('GET', '**/location/districts/2').as('Location');
    cy.visit('https://www.cowin.gov.in/home');
    cy.xpath("//div[text()='Search by District']")
        .scrollIntoView({ offset: { top: -200, left: 0 }, easing: 'linear', duration: 1000, })
        .should('be.visible').click();

    cy.xpath("//mat-select[@formcontrolname='state_id']//div[contains(@class,'mat-select-arrow-wrapper')]")
        .should('be.visible').click();

    cy.get("mat-option[id='mat-option-1']").should('be.visible').click();
    cy.wait("@Location");
    cy.get("@Location").then(xhr => {
        expect(xhr.response.statusCode).to.equal(200);
        this.nam = xhr.response.body.districts[0].district_name;

        cy.xpath("//mat-select[@formcontrolname='district_id']//div[contains(@class,'mat-select-arrow-wrapper')]")
        .should('be.visible').click();
      
        cy.xpath(`//span[normalize-space()='${this.nam}']/..`).should('be.visible').click();
    });

});