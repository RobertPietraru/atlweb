/// <reference types="cypress" />

beforeEach(() => {
  cy.exec('npm run db:seed')
})
  const baseUrl = 'http://localhost:5173'

describe('Auth', () => {

  it('Should reach the login page', () => {
    cy.visit(`${baseUrl}`)
    cy.get('[id="login-button"]').click()
    cy.url().should('include', '/login')
  })

  it('Should log the user in', () => {
    cy.visit(`${baseUrl}/login`)
    cy.get('input[name="email"]').type('admin@pietrocka.com')
    cy.get('input[name="password"]').type('password')
    cy.get('button[type="submit"]').click()
    cy.url().should('be.equal', `${baseUrl}/`)
  })

  it('Should register a new user', () => {
    cy.visit(`${baseUrl}/register`)
    cy.get('input[name="email"]').type('test@test.com')
    cy.get('input[name="username"]').type('test')
    cy.get('input[name="password"]').type('password')
    cy.get('button[type="submit"]').click()
    cy.url().should('be.equal', `${baseUrl}/`)
  })

  it('Should log the user in', () => {
    cy.visit(`${baseUrl}/login`)
    cy.get('input[name="email"]').type('admin@pietrocka.com')
    cy.get('input[name="password"]').type('password')
    cy.get('button[type="submit"]').click()
    cy.url().should('be.equal', `${baseUrl}/`)
  })
})

describe('Admin', () => {

  it('Should redirect to login page and back to admin page', () => {
    cy.visit(`${baseUrl}/admin/courses`)
    cy.url().should('be.equal', `${baseUrl}/login?redirect=/admin/courses`)

    cy.get('input[name="email"]').type('admin@pietrocka.com')
    cy.get('input[name="password"]').type('password')
    cy.get('button[type="submit"]').click()
    cy.url().should('be.equal', `${baseUrl}/admin/courses`)
  })

  it('Should create a new course', () => {
    cy.visit(`${baseUrl}/admin/courses`)
    cy.url().should('be.equal', `${baseUrl}/login?redirect=/admin/courses`)

    cy.get('input[name="email"]').type('admin@pietrocka.com')
    cy.get('input[name="password"]').type('password')
    cy.get('button[type="submit"]').click()
    cy.url().should('be.equal', `${baseUrl}/admin/courses`)

    cy.get('#create-course-button').click()
    cy.url().should('be.equal', `${baseUrl}/admin/courses/create`)

    cy.get('input[name="name"]').type('Test Course')
    cy.get('input[name="description"]').type('Test Description')
    cy.get('button[type="submit"]').click()
    cy.url().should('be.equal', `${baseUrl}/admin/courses`)

    cy.get('table tbody tr').should('have.length', 1)
    cy.get('table tbody tr').should('contain', 'Test Course')

    cy.get('table tbody tr').find('.view-course-button').click()
    cy.url().should('include', `${baseUrl}/admin/course/`)

    cy.get('h1').should('contain', 'Test Course')
    cy.get('p').should('contain', 'Test Description')

    cy.get('button[id="edit-course-button"]').click();
    
  })
})