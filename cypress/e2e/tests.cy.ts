/// <reference types="cypress" />

beforeEach(() => {
  cy.exec('npm run db:seed')
})

// describe('Auth', () => {

//   const baseUrl = 'http://localhost:5173'
//   it('Should reach the login page', () => {
//     cy.visit(`${baseUrl}`)
//     cy.get('[id="login-button"]').click()
//     cy.url().should('include', '/login')
//   })

//   it('Should log the user in', () => {
//     cy.visit(`${baseUrl}/login`)
//     cy.get('input[name="email"]').type('admin@pietrocka.com')
//     cy.get('input[name="password"]').type('password')
//     cy.get('button[type="submit"]').click()
//     cy.url().should('be.equal', `${baseUrl}/`)
//   })

//   it('Should register a new user', () => {
//     cy.visit(`${baseUrl}/register`)
//     cy.get('input[name="email"]').type('test@test.com')
//     cy.get('input[name="username"]').type('test')
//     cy.get('input[name="password"]').type('password')
//     cy.get('button[type="submit"]').click()
//     cy.url().should('be.equal', `${baseUrl}/`)
//   })

//   it('Should log the user in', () => {
//     cy.visit(`${baseUrl}/login`)
//     cy.get('input[name="email"]').type('admin@pietrocka.com')
//     cy.get('input[name="password"]').type('password')
//     cy.get('button[type="submit"]').click()
//     cy.url().should('be.equal', `${baseUrl}/`)
//   })
// })

describe('Admin', () => {
  const baseUrl = 'http://localhost:5173'

  it('Should redirect to login page and back to admin page', () => {
    cy.visit(`${baseUrl}/admin`)

    cy.url().should('be.equal', `${baseUrl}/login?redirect=/admin`)

    cy.get('input[name="email"]').type('admin@pietrocka.com')
    cy.get('input[name="password"]').type('password')
    cy.get('button[type="submit"]').click()
    cy.url().should('be.equal', `${baseUrl}/admin`)
  })
})
