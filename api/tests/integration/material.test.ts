import app from "@src/index";
import request from "supertest";

import {
  seedCompany,
  seedDatabase,
  seedMaterials,
  seedSite1,
} from "../../prisma/seed";
import { getAdminToken, getManagerToken, getWorkerToken } from "../helpers";

describe("Materials API", () => {
  let adminToken: string;
  let managerToken: string;
  let workerToken: string;
  const companyId = seedCompany.id;
  const siteId = seedSite1.id;

  let materialId: string = seedMaterials[1].id;
  const materialId2: string = seedMaterials[0].id;

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

  describe("POST /companies/:companyId/sites/:siteId/materials", () => {
    describe("Business Logic", () => {
      it("should allow admin to create a material", async () => {
        const res = await request(app.server)
          .post(`/companies/${companyId}/sites/${siteId}/materials`)
          .set("Authorization", `Bearer ${adminToken}`)
          .send({
            name: "Cement",
            unit: "bags",
            amount: 100,
            threshold: 10,
          });

        expect(res.status).toBe(201);
        expect(res.body.name).toBe("Cement");
        expect(res.body.amount).toBe(100);
        materialId = res.body.id;
      });

      it("should allow manager to create a material", async () => {
        const res = await request(app.server)
          .post(`/companies/${companyId}/sites/${siteId}/materials`)
          .set("Authorization", `Bearer ${managerToken}`)
          .send({
            name: "Bricks",
            unit: "pcs",
            amount: 500,
            threshold: 50,
          });

        expect(res.status).toBe(201);
        expect(res.body.name).toBe("Bricks");
      });
    });

    describe("Error Scenarios", () => {
      it("should reject creation by worker", async () => {
        const res = await request(app.server)
          .post(`/companies/${companyId}/sites/${siteId}/materials`)
          .set("Authorization", `Bearer ${workerToken}`)
          .send({
            name: "Tiles",
            unit: "boxes",
            amount: 30,
            threshold: 5,
          });

        expect(res.status).toBe(403);
        expect(res.body.error).toContain("Admin or Manager role required.");
      });
    });
  });

  describe("PATCH /companies/:companyId/sites/:siteId/materials/:materialId", () => {
    describe("Business Logic", () => {
      it("should allow admin to update a material", async () => {
        const res = await request(app.server)
          .patch(
            `/companies/${companyId}/sites/${siteId}/materials/${materialId}`,
          )
          .set("Authorization", `Bearer ${adminToken}`)
          .send({ amount: 200 });

        expect(res.status).toBe(200);
        expect(res.body.amount).toBe(200);
      });

      it("should allow manager to update a material", async () => {
        const res = await request(app.server)
          .patch(
            `/companies/${companyId}/sites/${siteId}/materials/${materialId}`,
          )
          .set("Authorization", `Bearer ${managerToken}`)
          .send({ threshold: 20 });

        expect(res.status).toBe(200);
        expect(res.body.threshold).toBe(20);
      });
    });

    describe("Error Scenarios", () => {
      it("should reject updates by worker", async () => {
        const res = await request(app.server)
          .patch(
            `/companies/${companyId}/sites/${siteId}/materials/${materialId}`,
          )
          .set("Authorization", `Bearer ${workerToken}`)
          .send({ name: "Steel" });

        expect(res.status).toBe(403);
        expect(res.body.error).toContain("Admin or Manager role required.");
      });
    });
  });

  describe("POST /companies/:companyId/sites/:siteId/materials/:materialId/adjust-quantity", () => {
    describe("Business Logic", () => {
      it("should allow worker to increase material amount", async () => {
        const res = await request(app.server)
          .post(
            `/companies/${companyId}/sites/${siteId}/materials/${materialId}/adjust-quantity`,
          )
          .set("Authorization", `Bearer ${workerToken}`)
          .send({ delta: 10 });

        expect(res.status).toBe(200);
        expect(res.body.amount).toBe(210);
      });

      it("should allow worker to decrease material amount", async () => {
        const res = await request(app.server)
          .post(
            `/companies/${companyId}/sites/${siteId}/materials/${materialId}/adjust-quantity`,
          )
          .set("Authorization", `Bearer ${workerToken}`)
          .send({ delta: -10 });

        expect(res.status).toBe(200);
        expect(res.body.amount).toBe(200);
      });
    });

    describe("Edge Cases", () => {
      it("should reject adjustment that makes amount negative", async () => {
        const res = await request(app.server)
          .post(
            `/companies/${companyId}/sites/${siteId}/materials/${materialId}/adjust-quantity`,
          )
          .set("Authorization", `Bearer ${workerToken}`)
          .send({ delta: -999 });

        expect(res.status).toBe(403);
        expect(res.body.error).toContain("Material amount cannot be negative");
      });
    });
  });

  describe("DELETE /companies/:companyId/sites/:siteId/materials/:materialId", () => {
    describe("Business Logic", () => {
      it("should allow admin to delete a material", async () => {
        const res = await request(app.server)
          .delete(
            `/companies/${companyId}/sites/${siteId}/materials/${materialId}`,
          )
          .set("Authorization", `Bearer ${adminToken}`);

        expect(res.status).toBe(204);
      });
      it("should accept delete from manager", async () => {
        const res = await request(app.server)
          .delete(
            `/companies/${companyId}/sites/${siteId}/materials/${materialId2}`,
          )
          .set("Authorization", `Bearer ${managerToken}`);

        expect(res.status).toBe(204);
      });
    });

    describe("Error Scenarios", () => {
      it("should reject delete from worker", async () => {
        const res = await request(app.server)
          .delete(
            `/companies/${companyId}/sites/${siteId}/materials/${materialId}`,
          )
          .set("Authorization", `Bearer ${workerToken}`);

        expect(res.status).toBe(403);
      });
    });
  });
});
