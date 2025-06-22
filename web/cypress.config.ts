import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000",
    supportFile: "cypress/support/e2e.ts",
    specPattern: "web/cypress/e2e/site/manager.site.cy.ts",
    retries: {
      runMode: 1,
      openMode: 1,
    },
  },
});
