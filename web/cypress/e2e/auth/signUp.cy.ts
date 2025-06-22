describe.skip("Sign Up Tests", () => {
  before(() => {
    cy.request("POST", `http://api:3001/test/reset-db`);
  });

  beforeEach(() => {
    cy.visit("http://localhost:3000/auth/register");
  });

  it("should redirect and show the form", () => {
    cy.getByCy("register-form").should("exist");
    cy.getByCy("email-input").should("exist");
    cy.getByCy("password-input").should("exist");
    cy.getByCy("continue-button").should("exist");
  });

  it("should fill user form, continue, fill company form and create", () => {
    cy.getByCy("first-name-input").type("John");
    cy.getByCy("last-name-input").type("Doe");
    cy.getByCy("email-input").type("john.doe@example.com");
    cy.getByCy("password-input").type("password123");
    cy.getByCy("continue-button").click();

    cy.getByCy("company-name-input").type("John Construction Ltd.");
    cy.getByCy("street-input").type("Main Street");
    cy.getByCy("street-number-input").type("123");
    cy.getByCy("city-input").type("New York");
    cy.getByCy("postal-code-input").type("10001");
    cy.getByCy("country-input").type("United States");
    cy.getByCy("create-button").click();

    cy.loginByApi("john.doe@example.com", "password123");
  });
});
