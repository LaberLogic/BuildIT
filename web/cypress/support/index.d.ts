/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// cypress/support/index.d.ts

/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable<Subject = any> {
    /**
     * Custom command to select elements by data-cy attribute.
     * @example cy.getByCy('submit-button')
     */
    getByCy(selector: string, ...args: any[]): Chainable<JQuery<HTMLElement>>;
    /**
     * Logs in by sending a POST request and sets a token cookie.
     * @param email User email
     * @param password User password
     */
    loginByApi(email: string, password: string): Chainable<void>;
  }
}
