describe('Discovery shows BrainShare home page', () => {
  it('passes', () => {
    cy.visit('http://localhost:3456/')
    cy.get('#rc_select_0').click().type('{enter}')
    cy.wait(3000)
    cy.contains('BrainShare')
  })
})
