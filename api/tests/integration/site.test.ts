import app from "@src/index";
import request from "supertest";

import {
  seedCompany,
  seedDatabase,
  seedManager,
  seedSite1,
  seedWorker1,
} from "../../prisma/seed";
import { getAdminToken, getManagerToken, getWorkerToken } from "../helpers";

describe("Sites API", () => {
  let adminToken: string;
  let managerToken: string;
  let workerToken: string;
  const siteId = seedSite1.id;
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

  describe("GET /companies/:companyId/sites/user/:userId", () => {
    describe("Business Logic", () => {
      it("allows admin to fetch sites assigned to a user", async () => {
        const res = await request(app.server)
          .get(`/companies/${companyId}/sites/user/${seedWorker1.id}`)
          .set("Authorization", `Bearer ${adminToken}`);

        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        res.body.forEach((site: { assignments: { userId: string }[] }) => {
          const assigned = site.assignments.some(
            (a: { userId: string }) => a.userId === seedWorker1.id,
          );
          expect(assigned).toBe(true);
        });
      });

      it("allows manager to fetch sites assigned to a user", async () => {
        const res = await request(app.server)
          .get(`/companies/${companyId}/sites/user/${seedWorker1.id}`)
          .set("Authorization", `Bearer ${managerToken}`);

        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
      });

      it("allows a worker to fetch their own assigned sites", async () => {
        const res = await request(app.server)
          .get(`/companies/${companyId}/sites/user/${seedWorker1.id}`)
          .set("Authorization", `Bearer ${workerToken}`);

        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
      });
    });
  });

  describe("POST /companies/:companyId/sites", () => {
    describe("Business Logic", () => {
      it("should allow admin to create a site with users assigned", async () => {
        const res = await request(app.server)
          .post(`/companies/${companyId}/sites`)
          .set("Authorization", `Bearer ${adminToken}`)
          .send({
            name: "New Admin Site",
            address: {
              streetNumber: "100",
              street: "Admin St",
              city: "Admin City",
              country: "Countryland",
              postalCode: "11111",
            },
            startDate: "2025-06-14T08:08:18.997Z",
            endDate: "2025-07-14T08:08:18.997Z",
            notes: "Site created by admin",
            users: [seedManager.id, seedWorker1.id],
          });

        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty("id");
        expect(res.body.name).toBe("New Admin Site");
        expect(res.body.address).toBe(
          "100 Admin St, Admin City, Countryland 11111",
        );

        expect(
          res.body.assignments.map(
            (assignment: { userId: number }) => assignment.userId,
          ),
        ).toEqual(expect.arrayContaining([seedWorker1.id]));
      });

      it("should allow manager to create a site with users", async () => {
        const res = await request(app.server)
          .post(`/companies/${companyId}/sites`)
          .set("Authorization", `Bearer ${managerToken}`)
          .send({
            name: "Manager Site",
            address: {
              streetNumber: "200",
              street: "Manager Rd",
              city: "Manageville",
              country: "Countryland",
              postalCode: "22222",
            },
            startDate: "2025-07-01T00:00:00.000Z",
            endDate: "2025-08-01T00:00:00.000Z",
            notes: "Created by manager",
            users: [seedWorker1.id],
          });

        expect(res.status).toBe(201);
        expect(res.body.name).toBe("Manager Site");
        expect(res.body.address).toBe(
          "200 Manager Rd, Manageville, Countryland 22222",
        );

        expect(
          res.body.assignments.map(
            (assignment: { userId: number }) => assignment.userId,
          ),
        ).toEqual(expect.arrayContaining([seedWorker1.id]));
      });

      it("should NOT allow worker to create a site", async () => {
        const res = await request(app.server)
          .post(`/companies/${companyId}/sites`)
          .set("Authorization", `Bearer ${workerToken}`)
          .send({
            name: "Worker Site",
            address: {
              streetNumber: "300",
              street: "Worker Ln",
              city: "Worktown",
              country: "Countryland",
              postalCode: "33333",
            },
            startDate: "2025-08-01T00:00:00.000Z",
            endDate: "2025-09-01T00:00:00.000Z",
            notes: "Should fail",
            users: [],
          });

        expect(res.status).toBe(403);
        expect(res.body).toHaveProperty("error");
      });
    });

    describe("Error Scenarios", () => {
      it("should reject missing required fields", async () => {
        const res = await request(app.server)
          .post(`/companies/${companyId}/sites`)
          .set("Authorization", `Bearer ${adminToken}`)
          .send({
            notes: "Incomplete site",
          });

        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty("error");
      });

      it("should reject invalid date formats", async () => {
        const res = await request(app.server)
          .post(`/companies/${companyId}/sites`)
          .set("Authorization", `Bearer ${adminToken}`)
          .send({
            name: "Bad Date Site",
            address: {
              streetNumber: "10",
              street: "Bad Date St",
              city: "Date City",
              country: "Countryland",
              postalCode: "44444",
            },
            startDate: "not-a-date",
            endDate: "also-not-a-date",
            notes: "Invalid dates",
            users: [],
          });

        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty("error");
      });

      it("should reject assigning users not belonging to the company", async () => {
        const foreignUserId = "nonexistent-user-id";

        const res = await request(app.server)
          .post(`/companies/${companyId}/sites`)
          .set("Authorization", `Bearer ${adminToken}`)
          .send({
            name: "Foreign User Site",
            address: {
              streetNumber: "500",
              street: "Foreign St",
              city: "Outland",
              country: "Countryland",
              postalCode: "55555",
            },
            startDate: "2025-06-01T00:00:00.000Z",
            endDate: "2025-07-01T00:00:00.000Z",
            notes: "Invalid user assignment",
            users: [foreignUserId],
          });

        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty("error");
      });

      it("should reject request with wrong companyId in path", async () => {
        const wrongCompanyId = "wrong-company-id";

        const res = await request(app.server)
          .post(`/companies/${wrongCompanyId}/sites`)
          .set("Authorization", `Bearer ${adminToken}`)
          .send({
            name: "Wrong Company Site",
            address: {
              streetNumber: "600",
              street: "Wrong St",
              city: "Wrongtown",
              country: "Countryland",
              postalCode: "66666",
            },
            startDate: "2025-06-01T00:00:00.000Z",
            endDate: "2025-07-01T00:00:00.000Z",
            notes: "Company mismatch",
            users: [seedManager.id],
          });

        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty("error");
      });
    });
  });

  describe("PATCH /companies/:companyId/sites/:siteId", () => {
    describe("Business Logic", () => {
      it("should allow admin to update a site", async () => {
        const res = await request(app.server)
          .patch(`/companies/${companyId}/sites/${siteId}`)
          .set("Authorization", `Bearer ${adminToken}`)
          .send({
            name: "Updated Site Name",
            address: {
              streetNumber: "200",
              street: "New Blvd",
              city: "Admin City",
              country: "Countryland",
              postalCode: "22222",
            },
            startDate: "2025-06-15T08:00:00.000Z",
            endDate: "2025-09-15T08:00:00.000Z",
            notes: "Updated notes here",
            users: [seedManager.id, seedWorker1.id],
            priority: "medium",
            status: "ACTIVE",
          });

        expect(res.status).toBe(200);
        expect(res.body.name).toBe("Updated Site Name");
        expect(res.body.address).toContain("200 New Blvd");
        expect(res.body.priority).toBe("medium");
        expect(res.body.status).toBe("ACTIVE");
      });

      it("should allow manager to update a site", async () => {
        const res = await request(app.server)
          .patch(`/companies/${companyId}/sites/${siteId}`)
          .set("Authorization", `Bearer ${managerToken}`)
          .send({
            priority: "low",
          });

        expect(res.status).toBe(200);
        expect(res.body.priority).toBe("low");
      });
    });

    describe("Error Scenarios", () => {
      it("should reject update from worker", async () => {
        const res = await request(app.server)
          .patch(`/companies/${companyId}/sites/${siteId}`)
          .set("Authorization", `Bearer ${workerToken}`)
          .send({
            name: "Unauthorized Change",
          });

        expect(res.status).toBe(403);
        expect(res.body.error).toBe("Admin or Manager role required.");
      });

      it("should return 404 for non-existent site", async () => {
        const res = await request(app.server)
          .patch(`/companies/${companyId}/sites/nonexistent-id`)
          .set("Authorization", `Bearer ${managerToken}`)
          .send({
            name: "Ghost Site",
          });

        expect(res.status).toBe(404);
      });

      it("should reject update with invalid date format", async () => {
        const res = await request(app.server)
          .patch(`/companies/${companyId}/sites/${siteId}`)
          .set("Authorization", `Bearer ${managerToken}`)
          .send({
            startDate: "not-a-date",
          });

        expect(res.status).toBe(400);
        expect(res.body.error).toBe("Bad Request");
      });

      it("should reject update for site in different company", async () => {
        const res = await request(app.server)
          .patch(`/companies/123123/sites/${siteId}`)
          .set("Authorization", `Bearer ${managerToken}`)
          .send({
            name: "Wrong Company Update",
          });

        expect(res.status).toBe(403);
        expect(res.body.error).toContain(
          "Unauthorized - Invalid company scope",
        );
      });
    });
  });
});
