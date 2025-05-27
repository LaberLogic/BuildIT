import app from "@src/index";
import request from "supertest";

describe("POST /auth/signIn", () => {
  beforeAll(async () => {
    if (!app.server.listening) {
      await app.listen({ port: 0 });
    }
  });

  afterAll(async () => {
    await app.close();
  });

  it("should login successfully with valid credentials", async () => {
    const response = await request(app.server).post("/auth/signIn").send({
      email: "john.doe@example.com",
      password: "Testerino",
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("accessToken");
  });

  it("should fail with 401 for invalid credentials", async () => {
    const response = await request(app.server).post("/auth/signIn").send({
      email: "wrong@example.com",
      password: "wrongpassword",
    });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("error");
  });

  it("should return 400 if email or password is missing", async () => {
    const response = await request(app.server)
      .post("/auth/signIn")
      .send({ email: "testuser@example.com" });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");
  });
});
