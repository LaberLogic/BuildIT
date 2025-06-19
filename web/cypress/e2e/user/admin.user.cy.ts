beforeEach(() => {
  cy.request("POST", "http://localhost:3001/test/reset-db");
  cy.loginByApi("admin@example.com", "secret");
  cy.getByCy("company-overview-card").click();
  cy.get("#tab-users").click();
});

describe("User Tests", () => {
  it("Update User Profile", () => {
    cy.getByCy("Profile").click();
    cy.getByCy("edit-profile-button").click();

    cy.getByCy("input-first-name").clear().type("New");
    cy.getByCy("input-last-name").clear().type("admin");
    cy.getByCy("input-email").clear().type("new.admin@example.com");

    cy.getByCy("input-password").type("StrongPassword123!");
    cy.getByCy("input-confirm-password").type("StrongPassword123!");

    cy.getByCy("btn-submit").click();

    cy.contains("New").should("exist");
    cy.contains("admin").should("exist");
    cy.contains("new.admin@example.com").should("exist");

    cy.loginByApi("new.admin@example.com", "StrongPassword123!");
  });

  it("Update User", () => {
    cy.getByCy("user-card")
      .contains("manager@example.com")
      .parents('[data-cy="user-card"]')
      .within(() => {
        cy.getByCy("edit-user-button").click();
      });

    cy.getByCy("input-first-name").clear().type("John");
    cy.getByCy("input-last-name").clear().type("Doe");

    cy.getByCy("btn-submit").click();

    cy.contains("John").should("exist");
    cy.contains("Doe").should("exist");

    cy.getByCy("user-card").contains("John Doe").should("exist");
  });

  it("Create User", () => {
    cy.getByCy("create-user-button").click();

    cy.getByCy("input-first-name").clear().type("Some");
    cy.getByCy("input-last-name").clear().type("Manager");
    cy.getByCy("input-email").clear().type("some.manager@example.com");

    cy.getByCy("select-role").click();
    cy.getByCy("option-role-MANAGER").click();

    cy.getByCy("btn-submit").click();

    cy.getByCy("user-card")
      .contains("some.manager@example.com")
      .parents('[data-cy="user-card"]')
      .within(() => {
        cy.contains("Some").should("exist");
        cy.contains("Manager").should("exist");
        cy.contains("INACTIVE").should("exist");
        cy.contains("some.manager@example.com").should("exist");
      });
  });

  it("Delete User", () => {
    cy.getByCy("user-card")
      .contains("worker1@example.com")
      .parents('[data-cy="user-card"]')
      .within(() => {
        cy.getByCy("delete-user-button").click();
      });
    cy.getByCy("confirm-action-button").click();
    cy.loginByApi("worker1@example.com", "secret").then((resp) => {
      expect(resp.status).to.eq(401);
    });
  });
});
