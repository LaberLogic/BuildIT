import app from "@src/index";
import request from "supertest";

import { seedAdmin, seedDatabase } from "../../prisma/seed";

describe("Create Material Tests", () => {
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

describe("Update Material Tests", () => {
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

describe("Delete Material Tests", () => {
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

describe("Increment/Decrement Material Tests", () => {
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

describe("Get Sites By User Tests", () => {
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
