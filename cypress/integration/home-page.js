
describe('Homepage', () => {
  before(() => {
    cy.visit('/')
    cy.injectAxe()
  })

  it('has no detectable acessibility violations on load', () => {
    cy.checkA11y()
  })

  it('should contain the app heading', () => {
    cy.get('[data-cy=title]')
      .should('be.visible')
      .and('contain', 'Monzo App')
  })
})
