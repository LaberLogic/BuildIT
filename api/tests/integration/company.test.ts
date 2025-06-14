import app from "@src/index";
import request from "supertest";

import { seedAdmin, seedDatabase } from "../../prisma/seed";

describe.skip("Get Companies Tests", () => {
  beforeAll(async () => {
    if (!app.server.listening) {
      await app.listen({ port: 0 });
    }
    await seedDatabase();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should create user", async () => {
    const response = await request(app.server).post("/auth/signin").send({
      email: seedAdmin.email,
      password: seedAdmin.password,
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("accessToken");
  });
});

describe.skip("Get Company Tests", () => {
  beforeAll(async () => {
    if (!app.server.listening) {
      await app.listen({ port: 0 });
    }
    await seedDatabase();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should create user", async () => {
    const response = await request(app.server).post("/auth/signin").send({
      email: seedAdmin.email,
      password: seedAdmin.password,
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("accessToken");
  });
});

describe.skip("Get Site By Id Tests", () => {
  beforeAll(async () => {
    if (!app.server.listening) {
      await app.listen({ port: 0 });
    }
    await seedDatabase();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should create user", async () => {
    const response = await request(app.server).post("/auth/signin").send({
      email: seedAdmin.email,
      password: seedAdmin.password,
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("accessToken");
  });
});

describe("Get Sites By Company Tests", () => {
  beforeAll(async () => {
    if (!app.server.listening) {
      await app.listen({ port: 0 });
    }
    await seedDatabase();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should create user", async () => {
    const response = await request(app.server).post("/auth/signin").send({
      email: seedAdmin.email,
      password: seedAdmin.password,
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("accessToken");
  });
});

describe.skip("Get Sites By User Tests", () => {
  beforeAll(async () => {
    if (!app.server.listening) {
      await app.listen({ port: 0 });
    }
    await seedDatabase();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should create user", async () => {
    const response = await request(app.server).post("/auth/signin").send({
      email: seedAdmin.email,
      password: seedAdmin.password,
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("accessToken");
  });
});
