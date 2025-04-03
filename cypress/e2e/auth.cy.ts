/// <reference types="cypress" />

describe('Auth', () => {
  const baseUrl = 'http://localhost:5173'
  it('Should see login page ', () => {
    cy.visit(`${baseUrl}/login`)
    cy.get('input[name="email"]').type('test@test.com')
    cy.get('input[name="password"]').type('test')
    cy.get('button[type="submit"]').click()
  })
})