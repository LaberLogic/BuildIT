beforeEach(() => {
  cy.request("POST", "http://localhost:3001/test/reset-db");
});

describe("User Tests", () => {
  it("Update User Profile", () => {
    cy.loginByApi("manager@example.com", "secret");

    cy.getByCy("Profile").click();
    cy.getByCy("edit-profile-button").click();

    cy.getByCy("input-first-name").clear().type("New");
    cy.getByCy("input-last-name").clear().type("Manager");
    cy.getByCy("input-email").clear().type("new.manager@example.com");

    cy.getByCy("input-password").type("StrongPassword123!");
    cy.getByCy("input-confirm-password").type("StrongPassword123!");

    cy.getByCy("btn-submit").click();

    cy.contains("New").should("exist");
    cy.contains("Manager").should("exist");
    cy.contains("new.manager@example.com").should("exist");

    cy.loginByApi("new.manager@example.com", "StrongPassword123!");
    cy.contains("My Sites");
  });

  it("Update User", () => {
    cy.loginByApi("manager@example.com", "secret");

    cy.getByCy("Users").click();

    cy.getByCy("user-card")
      .contains("worker1@example.com")
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
    cy.loginByApi("manager@example.com", "secret");

    cy.getByCy("Users").click();
    cy.getByCy("create-user-button").click();

    cy.getByCy("input-first-name").clear().type("Some");
    cy.getByCy("input-last-name").clear().type("Worker");
    cy.getByCy("input-email").clear().type("some.worker@example.com");

    cy.getByCy("select-role").click();
    cy.getByCy("option-role-WORKER").click();

    cy.getByCy("btn-submit").click();

    cy.getByCy("user-card")
      .contains("some.worker@example.com")
      .parents('[data-cy="user-card"]')
      .within(() => {
        cy.contains("Some").should("exist");
        cy.contains("Worker").should("exist");
        cy.contains("INACTIVE").should("exist");
        cy.contains("some.worker@example.com").should("exist");
      });
  });

  it("Delete User", () => {
    cy.loginByApi("manager@example.com", "secret");

    cy.getByCy("Users").click();
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
