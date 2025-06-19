/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }
//
Cypress.Commands.add("loginByApi", (email, password, expectFailure = false) => {
  return cy
    .request({
      method: "POST",
      url: "http://localhost:3001/auth/signin",
      body: { email, password },
      failOnStatusCode: false,
    })
    .then((resp) => {
      if (!expectFailure && resp.status === 200) {
        cy.setCookie("token", resp.body.accessToken);
        const redirectUrl = resp.body.user.companyId
          ? `/company/${resp.body.user.companyId}/sites`
          : "/company/";
        cy.visit(redirectUrl);
      }

      return cy.wrap(resp);
    });
});

Cypress.Commands.add("loginAsManager", () => {
  cy.loginByApi("manager@example.com", "secret");
});

Cypress.Commands.add("loginAsAdmin", () => {
  cy.loginByApi("admin@example.com", "secret");
});

Cypress.Commands.add("goToFirstSiteAsManager", () => {
  cy.loginAsManager();
  cy.getByCy("site-card").first().click();
});

Cypress.Commands.add("goToSitesTabAsAdmin", () => {
  cy.loginAsAdmin();
  cy.getByCy("company-overview-card").click();
  cy.get("#tab-sites").click();
});

Cypress.Commands.add("goToFirstSiteAsAdmin", () => {
  cy.goToSitesTabAsAdmin();
  cy.getByCy("site-card").first().click();
});

Cypress.Commands.add("getByCy", (dataCy) => {
  return cy.get(`[data-cy="${dataCy}"]`);
});
