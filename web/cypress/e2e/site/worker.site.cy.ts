before(() => {
  cy.request("POST", "http://localhost:3000/test/reset-db");
});

describe("Site Overview", () => {
  it("should log in as worker and validate the first site card", () => {
    cy.loginByApi("worker1@example.com", "secret").then(() => {
      cy.getByCy("create-site-button").should("not.exist");

      cy.getByCy("site-card")
        .first()
        .within(() => {
          cy.get("h2").should("not.be.empty");

          cy.get(".el-tag").should("exist").and("not.be.empty");

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          cy.contains(/\d+%/).should(($progress: any) => {
            const progressText = $progress!.text();
            const progressNumber = parseInt(progressText);
            expect(progressNumber).to.be.gte(0).and.lte(100);
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
});

describe("Site details page", () => {
  it("should access first site and validate site details", () => {
    cy.loginByApi("worker1@example.com", "secret").then(() => {
      cy.getByCy("site-card").first().click();

      cy.getByCy("site-name").should("not.be.empty");

      cy.getByCy("site-address").within(() => {
        cy.get("span").should("not.be.empty");
      });

      cy.getByCy("edit-site-btn").should("not.exist");

      cy.get("body").then(($body) => {
        if ($body.find('[data-cy="material-warning-alert"]').length) {
          cy.getByCy("material-warning-alert")
            .should("have.attr", "type", "warning")
            .and("contain.text", /material(s)? low or out of stock/);
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

      cy.getByCy("add-material-button").should("not.exist");
    });
  });
});

describe("Adjust Material", () => {
  it("increments and decrements material amount", () => {
    cy.loginByApi("worker1@example.com", "secret").then(() => {
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
});

describe("Material Card - Long Press and Threshold Warning", () => {
  it("increments material value with long press", () => {
    cy.loginByApi("worker1@example.com", "secret").then(() => {
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
          cy.get("@card")
            .find("[data-cy=material-increment]")
            .trigger("mouseup");

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
  });

  it("decrements material to 0 and checks warning threshold", () => {
    cy.loginByApi("worker1@example.com", "secret").then(() => {
      cy.getByCy("site-card").first().click();
      cy.getByCy("material-card").first().as("card");

      const pressAndWait = () => {
        cy.get("@card")
          .find("[data-cy=material-decrement]")
          .trigger("mousedown");
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
});
