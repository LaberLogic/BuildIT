import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000",
    supportFile: "cypress/support/e2e.ts",
    specPattern: "cypress/e2e/**/*.cy.{js,ts}",
    retries: {
      runMode: 2,
      openMode: 1,
    },
    env: {
      apiUrl: process.env.NUXT_API_BASE_URL,
    },
  },
});
