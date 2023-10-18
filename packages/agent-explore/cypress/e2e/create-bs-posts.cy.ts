describe('Create identifier and BrainShare post', () => {
  it('passes', () => {
    cy.viewport('ipad-mini', 'landscape')
    cy.visit('http://localhost:3456/')

    cy.contains('Identifiers').click()
    cy.wait(1000)
    cy.contains('New').click()
    cy.wait(1000)
    cy.contains('Next').click()
    cy.get('#form_in_form_name').clear();
    cy.get('#form_in_form_name').type('Alice Smith');
    cy.get('#form_in_form_name').blur();
    cy.wait(1000)
    cy.contains('Finish').click()
    cy.wait(1000)
    cy.contains('BrainShare').click()
    cy.wait(1000)
    cy.contains('Compose').click()
    cy.wait(1000)
    
    /* ==== Generated with Cypress Studio ==== */
    cy.get('.ant-input').clear();
    cy.get('.ant-input').type('Welcome');
    cy.wait(1000)
    cy.get('textarea').type( 'Welcome to BrainShare', {force: true} )
    cy.contains('Save to: Private').click()
    cy.wait(1000)
    // cy.get('.monaco-editor textarea:first').click().focused().type( 'Welcome to BrainShare' )
    // cy.get('.ant-btn-primary > span').click();
    /* ==== End Cypress Studio ==== */
  })
})