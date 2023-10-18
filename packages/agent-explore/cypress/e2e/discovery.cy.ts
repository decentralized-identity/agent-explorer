describe('Discovery shows BrainShare home page', () => {
  it('passes', () => {
    cy.viewport('ipad-mini', 'landscape')
    cy.visit('http://localhost:3456/')
    cy.get('#rc_select_0').click().type('{enter}')
    cy.wait(2000)

    cy.contains('DID Document').click()
    cy.wait(2000)
    cy.get(':nth-child(3) > .ant-list-item-action > li > .ant-btn > span').click();
    cy.wait(2000)
    cy.contains('Add connection').click()
    cy.wait(2000)
    cy.get(':nth-child(2) > .ant-pro-list-row-header > .ant-list-item-meta > .ant-list-item-meta-content > .ant-list-item-meta-title > .ant-pro-list-row-header-container > .ant-pro-list-row-title > .ant-btn > span').click();
    cy.wait(2000)
    cy.contains('Contacts').click()
    cy.wait(2000)
    cy.contains('VeramoLabs').click()
    cy.wait(2000)

    cy.contains('Veramo community').click()
    cy.wait(2000)
    cy.contains('Private').click()
    cy.wait(2000)
    cy.contains('Identifiers').click()
    cy.wait(2000)
    cy.contains('New').click()
    cy.wait(2000)
    cy.get('#form_in_form_alias').clear();
    cy.get('#form_in_form_alias').type('alice');
    cy.wait(2000)
    cy.contains('Next').click()
    cy.wait(2000)
    cy.contains('Finish').click()
    cy.wait(2000)
    cy.contains('alice').click()
    cy.wait(2000)
    cy.contains('Profile').click();
    cy.wait(1000)
    cy.contains('Edit').click();
    cy.wait(1000)
    cy.get('#form_in_form_name').clear();
    cy.wait(1000)
    cy.get('#form_in_form_name').type('Alice');
    cy.wait(1000)
    cy.get('#form_in_form_email').clear();
    cy.wait(1000)
    cy.get('#form_in_form_email').type('alice@wonderland.com');
    cy.contains('Save to: Private').click();
    cy.wait(1000)
  })
})
