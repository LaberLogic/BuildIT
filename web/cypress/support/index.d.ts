/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// cypress/support/index.d.ts

/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable<Subject = any> {
    loginByApi(
      email: string,
      password: string,
      expectFailure?: boolean,
    ): Chainable<Response>;
    loginAsManager(): Chainable<void>;
    loginAsAdmin(): Chainable<void>;
    goToFirstSiteAsManager(): Chainable<void>;
    goToSitesTabAsAdmin(): Chainable<void>;
    goToFirstSiteAsAdmin(): Chainable<void>;
    getByCy(dataCy: string): Chainable<JQuery<HTMLElement>>;
    createSite(site: Site): Chainable<void>;
    updateSiteName(oldName: string, newName: string): Chainable<void>;
    createMaterial(material: Material): Chainable<void>;
    updateMaterial(
      amount: string | number,
      threshold: string | number,
    ): Chainable<void>;
  }
}
