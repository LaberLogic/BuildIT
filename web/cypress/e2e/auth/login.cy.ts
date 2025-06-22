describe("Base Cases", () => {
  before(() => {
    cy.request("POST", `http://localhost:3001/test/reset-db`);
  });

  beforeEach(() => {
    cy.visit("http://localhost:3000/auth/login");
  });

  it("should display the form", () => {
    cy.getByCy("signin-form").should("exist");
    cy.getByCy("email-input").should("exist");
    cy.getByCy("password-input").should("exist");
    cy.getByCy("submit-button").should("exist");
  });

  it("shows error on invalid login", () => {
    cy.getByCy("email-input").type("wrong@example.com");
    cy.getByCy("password-input").type("wrongpassword");
    cy.getByCy("submit-button").click();

    cy.getByCy("error-message")
      .should("be.visible")
      .and("contain", "Wrong email or password.");
  });
});

describe("Sign In: Seeded User Roles", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/auth/login");
  });

  const users = [
    {
      email: "admin@example.com",
      password: "secret",
      shouldRedirectTo: "/company/",
    },
    {
      email: "manager@example.com",
      password: "secret",
      shouldMatch: /^\/company\/[^/]+\/sites$/,
    },
    {
      email: "worker1@example.com",
      password: "secret",
      shouldMatch: /^\/company\/[^/]+\/sites$/,
    },
    {
      email: "worker2@example.com",
      password: "secret",
      shouldMatch: /^\/company\/[^/]+\/sites$/,
    },
  ];

  users.forEach(({ email, password, shouldRedirectTo, shouldMatch }) => {
    it(`logs in ${email} and redirects correctly`, () => {
      cy.getByCy("email-input").type(email);
      cy.getByCy("password-input").type(password);
      cy.getByCy("submit-button").click();

      cy.wait(1000);

      if (shouldRedirectTo) {
        cy.url().should("include", shouldRedirectTo);
      }

      if (shouldMatch) {
        cy.location("pathname").should("match", shouldMatch);
      }
    });
  });
});
