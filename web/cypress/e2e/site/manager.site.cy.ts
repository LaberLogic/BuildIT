beforeEach(() => {
  cy.request("POST", "http://localhost:3001/test/reset-db");
});

describe("Site Overview (Manager)", () => {
  it.skip("logs in as manager and validates the first site card", () => {
    cy.loginAsManager();
    cy.wait(3000);
    cy.getByCy("create-site-button").should("exist");

    cy.getByCy("site-card")
      .first()
      .within(() => {
        cy.get("h2").should("not.be.empty");
        cy.get(".el-tag").should("exist").and("not.be.empty");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        cy.contains(/\d+%/).should(($progress: any) => {
          const progressNumber = parseInt($progress.text());
          expect(progressNumber).to.be.within(0, 100);
        });
        cy.contains("Team")
          .next()
          .should("match", "p,span")
          .and("not.be.empty");
        cy.contains("Deadline")
          .next()
          .should("match", "p,span")
          .and(($el) => {
            expect($el.text().trim()).to.match(/N\/A|[a-zA-Z]+ \d{1,2}/);
          });
      });
  });
});

describe("Site Details Page (Manager)", () => {
  it("accesses the first site and validates details", () => {
    cy.goToFirstSiteAsManager();

    cy.wait(500);

    cy.getByCy("site-name").should("not.be.empty");
    cy.getByCy("site-address").within(() => {
      cy.get("span").should("not.be.empty");
    });
    cy.getByCy("site-edit-button").should("exist");
    cy.get("body").then(($body) => {
      if ($body.find('[data-cy="material-warning-alert"]').length) {
        cy.getByCy("material-warning-alert").should("exist");
      }
    });
    cy.getByCy("progress-bar").should("exist");
    cy.getByCy("hours-logged").within(() => {
      cy.contains("Hours Logged");
      cy.get(".info-value").should("not.be.empty");
    });
    cy.getByCy("completion-date").within(() => {
      cy.contains("Completion");
      cy.get(".info-value").should("not.be.empty");
    });
    cy.getByCy("workers-count").within(() => {
      cy.contains("Workers");
      cy.get(".info-value").should("not.be.empty");
    });
    cy.getByCy("start-date").within(() => {
      cy.contains("Start Date");
      cy.get(".info-value").should("not.be.empty");
    });
    cy.getByCy("material-tracker").should("exist");
    cy.getByCy("add-material-button").should("exist");
    cy.getByCy("edit-material-button").should("exist");
    cy.getByCy("delete-material-button").should("exist");
  });
});

describe("Adjust Material (Manager)", () => {
  it("increments and decrements material amount", () => {
    cy.loginByApi("manager@example.com", "secret");
    cy.getByCy("site-card").first().click();

    cy.getByCy("material-card").first().as("card");

    cy.get("@card")
      .find("[data-cy=material-amount]")
      .invoke("text")
      .then((text) => {
        const [initial] = text.trim().split(" ");
        const initialAmount = parseInt(initial);

        cy.get("@card").find("[data-cy=material-increment]").click();

        cy.get("@card")
          .find("[data-cy=material-amount]")
          .should("contain", initialAmount + 1);

        cy.get("@card").find("[data-cy=material-decrement]").click();

        cy.get("@card")
          .find("[data-cy=material-amount]")
          .should("contain", initialAmount);
      });
  });
});

describe("Material Card - Long Press and Threshold Warning (Manager)", () => {
  it("increments material value with long press", () => {
    cy.loginByApi("manager@example.com", "secret");
    cy.getByCy("site-card").first().click();
    cy.getByCy("material-card").first().as("card");

    cy.get("@card")
      .find("[data-cy=material-amount]")
      .invoke("text")
      .then((text) => {
        const [initial] = text.trim().split(" ");
        const initialAmount = parseInt(initial);

        cy.get("@card")
          .find("[data-cy=material-increment]")
          .trigger("mousedown");
        cy.wait(800);
        cy.get("@card").find("[data-cy=material-increment]").trigger("mouseup");

        cy.get("@card")
          .find("[data-cy=material-amount]")
          .invoke("text")
          .then((newText) => {
            const [after] = newText.trim().split(" ");
            const afterAmount = parseInt(after);
            expect(afterAmount).to.be.greaterThan(initialAmount + 1);
          });
      });
  });

  it("decrements material to 0 and checks warning threshold", () => {
    cy.loginByApi("manager@example.com", "secret");
    cy.getByCy("site-card").first().click();
    cy.getByCy("material-card").first().as("card");

    const pressAndWait = () => {
      cy.get("@card").find("[data-cy=material-decrement]").trigger("mousedown");
      cy.wait(6000);
    };

    cy.get("@card")
      .find("[data-cy=material-decrement]")
      .then(($btn) => {
        if (!$btn.is(":disabled")) {
          pressAndWait();
        }
      });

    cy.get("@card").find("[data-cy=material-amount]").should("contain", "0");
  });
});

describe("Material Management", () => {
  beforeEach(() => {
    cy.loginByApi("manager@example.com", "secret");
    cy.getByCy("site-card").first().click();
  });

  it("creates a new material", () => {
    cy.getByCy("add-material-button").click();
    cy.getByCy("material-dialog").should("be.visible");

    cy.getByCy("input-name").type("Cement");
    cy.getByCy("input-amount").clear().type("100");
    cy.getByCy("input-unit").type("kg");
    cy.getByCy("input-threshold").clear().type("10");

    cy.getByCy("save-button").click();

    cy.contains("Material created successfully").should("exist");

    cy.getByCy("material-card")
      .should("contain", "Cement")
      .and("contain", "100 kg")
      .and("contain", "Threshold: 10");
  });

  it("updates an existing material", () => {
    cy.getByCy("material-card").first().as("card");

    cy.get("@card").find("[data-cy=edit-material-button]").click();
    cy.getByCy("material-dialog").should("be.visible");

    cy.getByCy("input-amount").clear().type("200");
    cy.getByCy("input-threshold").clear().type("20");

    cy.getByCy("save-button").click();

    cy.contains("Material updated successfully").should("exist");

    cy.getByCy("material-card")
      .last()
      .should("contain", "200")
      .and("contain", "Threshold: 20");
  });
});

describe("Site Management", () => {
  beforeEach(() => {
    cy.loginByApi("manager@example.com", "secret");
  });

  it("creates a new site", () => {
    const exampleSite = {
      name: "Main Office",
      status: "ACTIVE",
      priority: "High",
      startDate: "2025-06-01",
      endDate: "2026-06-01",
      address: {
        street: "Maple Avenue",
        number: "123",
        city: "Springfield",
        postalCode: "98765",
        country: "USA",
      },
      assignedUser: "Worker Two",
    };

    cy.createSite(exampleSite);
  });

  it("updates an existing site", () => {
    cy.updateSiteName("Main Construction Site", "Second Construction Site");
  });
});
