describe('Discovery shows BrainShare home page', () => {
  it('passes', () => {
    cy.viewport('ipad-mini', 'landscape')
    cy.visit('http://localhost:3000/')
    cy.wait(2000)

    cy.get('#rc_select_0').click().type('{enter}')
    cy.wait(4000)

    cy.contains('DID Document').click()
    cy.wait(2000)
    cy.get(':nth-child(3) > .ant-list-item-action > li > .ant-btn > span').click();
    cy.wait(2000)
    cy.contains('Add connection').click()
    cy.wait(2000)
    cy.get(':nth-child(2) > .ant-pro-list-row-header > .ant-list-item-meta > .ant-list-item-meta-content > .ant-list-item-meta-title > .ant-pro-list-row-header-container > .ant-pro-list-row-title > .ant-btn > span').click();
    cy.wait(2000)
    
    // cy.contains('Discover').click() // FIXME: this is not working properly
    cy.visit('http://localhost:3000/')
    const input = cy.get('#rc_select_0').click().clear().type('Nick')
    cy.wait(3000)
    input.type('{downArrow}')
    cy.wait(1000)
    input.type('{enter}')
    cy.wait(2000)
    cy.contains('Gitcoin passport').click()
    cy.wait(8000)

  })
})
