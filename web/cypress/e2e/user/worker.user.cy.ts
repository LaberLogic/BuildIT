before(() => {
  cy.request("POST", "http://localhost:3000/test/reset-db");
});

describe("User Tests", () => {
  it("should not show users link and page", () => {
    cy.loginByApi("worker1@example.com", "secret");
    cy.getByCy("create-site-button").should("not.exist");
    cy.getByCy("Users").should("not.exist");
    cy.url().then((currentUrl) => {
      const url = new URL(currentUrl);
      const pathSegments = url.pathname.split("/");

      pathSegments[pathSegments.length - 1] = "users";

      const newPath = pathSegments.join("/");
      cy.visit(`${url.origin}${newPath}`);
    });

    cy.contains("0");
  });
  it("Update User Profile", () => {
    cy.loginByApi("worker1@example.com", "secret");

    cy.getByCy("Profile").click();
    cy.getByCy("edit-profile-button").click();

    cy.getByCy("input-first-name").clear().type("John");
    cy.getByCy("input-last-name").clear().type("Doe");
    cy.getByCy("input-email").clear().type("john.doe@example.com");

    cy.getByCy("input-password").type("StrongPassword123!");
    cy.getByCy("input-confirm-password").type("StrongPassword123!");

    cy.getByCy("btn-submit").click();

    cy.contains("John").should("exist");
    cy.contains("Doe").should("exist");
    cy.contains("john.doe@example.com").should("exist");

    cy.loginByApi("john.doe@example.com", "StrongPassword123!");
    cy.contains("My Sites");
  });
});
