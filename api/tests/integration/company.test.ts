import app from "@src/index";
import request from "supertest";

import { seedCompany, seedDatabase } from "../../prisma/seed";
import { getAdminToken, getManagerToken, getWorkerToken } from "../helpers";

describe("Company Endpoints", () => {
  let adminToken: string;
  let managerToken: string;
  let workerToken: string;

  const companyId = seedCompany.id;

  beforeAll(async () => {
    if (!app.server.listening) {
      await app.listen({ port: 0 });
    }

    await seedDatabase();
    adminToken = await getAdminToken();
    managerToken = await getManagerToken();
    workerToken = await getWorkerToken();
  });

  afterAll(async () => {
    await app.close();
  });

  describe("GET /companies", () => {
    describe("Business Logic", () => {
      it("should allow admin to fetch all companies", async () => {
        const res = await request(app.server)
          .get("/companies")
          .set("Authorization", `Bearer ${adminToken}`);

        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);

        const company = res.body.find(
          (c: { id: string }) => c.id === companyId,
        );
        expect(company).toHaveProperty("id");
        expect(company).toHaveProperty("name");
        expect(company).toHaveProperty("address");
        expect(company).toHaveProperty("siteCount");
        expect(company).toHaveProperty("userCount");
      });
    });

    describe("Error Scenarios", () => {
      it("should reject access for manager", async () => {
        const res = await request(app.server)
          .get("/companies")
          .set("Authorization", `Bearer ${managerToken}`);

        expect(res.status).toBe(403);
        expect(res.body.error).toContain("Admin role required");
      });

      it("should reject access for worker", async () => {
        const res = await request(app.server)
          .get("/companies")
          .set("Authorization", `Bearer ${workerToken}`);

        expect(res.status).toBe(403);
      });

      it("should reject access without token", async () => {
        const res = await request(app.server).get("/companies");
        expect(res.status).toBe(401);
      });
    });
  });

  describe("GET /companies/:companyId", () => {
    describe("Business Logic", () => {
      it("should allow admin to fetch a specific company", async () => {
        const res = await request(app.server)
          .get(`/companies/${companyId}`)
          .set("Authorization", `Bearer ${adminToken}`);

        expect(res.status).toBe(200);
        expect(res.body.id).toBe(companyId);
        expect(res.body).toHaveProperty("name");
        expect(res.body).toHaveProperty("address");
      });
    });

    describe("Error Scenarios", () => {
      it("should reject manager access to specific company", async () => {
        const res = await request(app.server)
          .get(`/companies/${companyId}`)
          .set("Authorization", `Bearer ${managerToken}`);

        expect(res.status).toBe(403);
      });

      it("should reject worker access to specific company", async () => {
        const res = await request(app.server)
          .get(`/companies/${companyId}`)
          .set("Authorization", `Bearer ${workerToken}`);

        expect(res.status).toBe(403);
      });

      it("should return 404 for non-existent company", async () => {
        const res = await request(app.server)
          .get(`/companies/clfakeid1234567890`)
          .set("Authorization", `Bearer ${adminToken}`);

        expect(res.status).toBe(404);
      });
    });
  });
});
