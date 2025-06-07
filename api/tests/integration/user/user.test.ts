import app from "@src/index";

import { seedDatabase } from "../../../prisma/seed";
describe("Get My User tests", () => {
  beforeAll(async () => {
    if (!app.server.listening) {
      await app.listen({ port: 0 });
    }
    await seedDatabase();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should get users successfully for own company", async () => {});

  it("should be error on malformed token", async () => {});
});
