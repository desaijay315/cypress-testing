beforeEach(()=>
{
    cy.fixture('example').then(function(data)
    {
this.data=data
    })
});