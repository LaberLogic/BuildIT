import app from "@src/index";
import { UserResponseDto } from "shared";
import request from "supertest";

import {
  seedCompany,
  seedDatabase,
  seedManager,
  seedWorker1,
  seedWorker2,
} from "../../../prisma/seed";
import { getAdminToken, getManagerToken, getWorkerToken } from "../../helpers";

describe("User Management", () => {
  let adminToken: string;
  let managerToken: string;
  let workerToken: string;
  const companyId = seedCompany.id;
  const userIdToUpdate = seedWorker1.id;

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

  describe("GET /users/me", () => {
    describe("Business Logic", () => {
      it("should return info for authenticated admin", async () => {
        const res = await request(app.server)
          .get("/users/me")
          .set("Authorization", `Bearer ${adminToken}`);

        expect(res.status).toBe(200);
        expect(res.body.email).toBe("admin@example.com");
        expect(res.body.role).toBe("ADMIN");
      });

      it("should return info for authenticated manager", async () => {
        const res = await request(app.server)
          .get("/users/me")
          .set("Authorization", `Bearer ${managerToken}`);

        expect(res.status).toBe(200);
        expect(res.body.email).toBe("manager@example.com");
        expect(res.body.role).toBe("MANAGER");
      });

      it("should return info for authenticated worker", async () => {
        const res = await request(app.server)
          .get("/users/me")
          .set("Authorization", `Bearer ${workerToken}`);

        expect(res.status).toBe(200);
        expect(res.body.email).toBe("worker1@example.com");
        expect(res.body.role).toBe("WORKER");
      });
    });

    describe("Error Scenarios", () => {
      it("should return 401 if not authenticated", async () => {
        const res = await request(app.server).get("/users/me");

        expect(res.status).toBe(401);
      });
    });
  });

  describe("GET /companies/:companyId/users", () => {
    describe("Business Logic", () => {
      it("should allow admin to view all users", async () => {
        const res = await request(app.server)
          .get(`/companies/${companyId}/users`)
          .set("Authorization", `Bearer ${adminToken}`);

        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThanOrEqual(3);
      });

      it("should allow manager to view users in their company", async () => {
        const res = await request(app.server)
          .get(`/companies/${companyId}/users`)
          .set("Authorization", `Bearer ${managerToken}`);

        expect(res.status).toBe(200);
        expect(
          res.body.every(
            (user: UserResponseDto) => user.companyId === companyId,
          ),
        ).toBe(true);
      });
    });

    describe("Error Scenarios", () => {
      it("should return 403 for workers trying to view company users", async () => {
        const res = await request(app.server)
          .get(`/companies/${companyId}/users`)
          .set("Authorization", `Bearer ${workerToken}`);

        expect(res.status).toBe(403);
        expect(res.body).toHaveProperty("error");
      });
    });
  });

  describe("GET /users/:userId", () => {
    describe("Business Logic", () => {
      it("should allow admin to get any user by ID", async () => {
        const res = await request(app.server)
          .get(`/users/${seedWorker1.id}`)
          .set("Authorization", `Bearer ${adminToken}`);

        expect(res.status).toBe(200);
        expect(res.body.id).toBe(seedWorker1.id);
      });
    });

    describe("Error Scenarios", () => {
      it("should return 403 for worker accessing another user", async () => {
        const res = await request(app.server)
          .get(`/users/${seedWorker2.id}`)
          .set("Authorization", `Bearer ${workerToken}`);

        expect(res.status).toBe(403);
        expect(res.body).toHaveProperty("error");
      });

      it("should return 403 for manager", async () => {
        const res = await request(app.server)
          .get(`/users/${seedWorker2.id}`)
          .set("Authorization", `Bearer ${managerToken}`);

        expect(res.status).toBe(403);
        expect(res.body).toHaveProperty("error");
      });

      it("should return 404 for non-existent user ID", async () => {
        const res = await request(app.server)
          .get(`/users/nonexistent-id`)
          .set("Authorization", `Bearer ${adminToken}`);

        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty("error");
      });
    });
  });

  describe("DELETE /companies/:companyId/users/:userId", () => {
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

    describe("Business Logic", () => {
      it("should allow admin to delete a manager", async () => {
        // Create a manager to delete
        const createRes = await request(app.server)
          .post(`/companies/${companyId}/users`)
          .set("Authorization", `Bearer ${adminToken}`)
          .send({
            email: "deletemanager@example.com",
            firstName: "Delete",
            lastName: "Manager",
            role: "MANAGER",
          });

        const userIdToDelete = createRes.body.id;

        const res = await request(app.server)
          .delete(`/companies/${companyId}/users/${userIdToDelete}`)
          .set("Authorization", `Bearer ${adminToken}`);

        expect(res.status).toBe(204);
      });

      it("should allow manager to delete a worker", async () => {
        const createRes = await request(app.server)
          .post(`/companies/${companyId}/users`)
          .set("Authorization", `Bearer ${managerToken}`)
          .send({
            email: "deleteworker@example.com",
            firstName: "Delete",
            lastName: "Worker",
            role: "WORKER",
          });

        const userIdToDelete = createRes.body.id;

        const res = await request(app.server)
          .delete(`/companies/${companyId}/users/${userIdToDelete}`)
          .set("Authorization", `Bearer ${managerToken}`);

        expect(res.status).toBe(204);
      });
    });

    describe("Error Scenarios", () => {
      it("should not allow worker to delete anyone", async () => {
        const res = await request(app.server)
          .delete(`/companies/${companyId}/users/${seedWorker2.id}`)
          .set("Authorization", `Bearer ${workerToken}`);

        expect(res.status).toBe(403);
        expect(res.body.error).toEqual("Workers cannot manage other users.");
      });

      it("should return 404 for non-existent user", async () => {
        const res = await request(app.server)
          .delete(`/companies/${companyId}/users/nonexistent-id`)
          .set("Authorization", `Bearer ${adminToken}`);

        expect(res.status).toBe(404);
      });

      it("should not allow deletion if unauthorized (no token)", async () => {
        const res = await request(app.server).delete(
          `/companies/${companyId}/users/${seedWorker1.id}`,
        );

        expect(res.status).toBe(401);
      });
    });
  });

  describe("POST /companies/:companyId/users", () => {
    describe("Business Logic", () => {
      it("should allow admin to create a manager", async () => {
        const res = await request(app.server)
          .post(`/companies/${companyId}/users`)
          .set("Authorization", `Bearer ${adminToken}`)
          .send({
            email: "newmanager@example.com",
            firstName: "New",
            lastName: "Manager",
            role: "MANAGER",
          });

        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty("id");
        expect(res.body.email).toBe("newmanager@example.com");
        expect(res.body.role).toBe("MANAGER");
        expect(res.body.companyId).toBe(companyId);
      });

      it("should allow manager to create a manager", async () => {
        const res = await request(app.server)
          .post(`/companies/${companyId}/users`)
          .set("Authorization", `Bearer ${managerToken}`)
          .send({
            email: "peer@example.com",
            firstName: "Same",
            lastName: "Level",
            role: "MANAGER",
          });

        expect(res.status).toBe(201);
        expect(res.body.role).toBe("MANAGER");
        expect(res.body.companyId).toBe(companyId);
      });

      it("should allow manager to create a worker", async () => {
        const res = await request(app.server)
          .post(`/companies/${companyId}/users`)
          .set("Authorization", `Bearer ${managerToken}`)
          .send({
            email: "newworker@example.com",
            firstName: "New",
            lastName: "Worker",
            role: "WORKER",
          });

        expect(res.status).toBe(201);
        expect(res.body.role).toBe("WORKER");
        expect(res.body.companyId).toBe(companyId);
      });
    });

    describe("Error Scenarios", () => {
      it("should reject creating a user with missing fields", async () => {
        const res = await request(app.server)
          .post(`/companies/${companyId}/users`)
          .set("Authorization", `Bearer ${adminToken}`)
          .send({
            email: "incomplete@example.com",
          });

        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty("error");
      });

      it("should return 403 if worker tries to create user", async () => {
        const res = await request(app.server)
          .post(`/companies/${companyId}/users`)
          .set("Authorization", `Bearer ${workerToken}`)
          .send({
            email: "forbidden@example.com",
            firstName: "No",
            lastName: "Access",
            role: "WORKER",
          });

        expect(res.status).toBe(403);
        expect(res.body).toHaveProperty("error");
      });

      it("should return 403 if manager tries to create an admin", async () => {
        const res = await request(app.server)
          .post(`/companies/${companyId}/users`)
          .set("Authorization", `Bearer ${managerToken}`)
          .send({
            email: "tooHigh@example.com",
            firstName: "Too",
            lastName: "High",
            role: "ADMIN",
          });

        expect(res.status).toBe(403);
        expect(res.body.error).toMatch(/Insufficient privileges/i);
      });
    });

    describe("Edge Cases", () => {
      it("should reject unknown role", async () => {
        const res = await request(app.server)
          .post(`/companies/${companyId}/users`)
          .set("Authorization", `Bearer ${adminToken}`)
          .send({
            email: "unknown@example.com",
            firstName: "Ghost",
            lastName: "User",
            role: "SUPERADMIN", // invalid
          });

        expect(res.status).toBe(400);
        expect(res.body.error).toEqual("Bad Request");
      });

      it("should reject duplicate email", async () => {
        const res = await request(app.server)
          .post(`/companies/${companyId}/users`)
          .set("Authorization", `Bearer ${adminToken}`)
          .send({
            email: seedManager.email, // email already seeded
            firstName: "Dup",
            lastName: "Email",
            role: "MANAGER",
          });

        expect(res.status).toBe(409);
        expect(res.body).toHaveProperty("error");
      });
    });
  });

  describe("PUT /companies/:companyId/users/:userId", () => {
    describe("Business Logic", () => {
      it("should allow admin to update a user", async () => {
        const res = await request(app.server)
          .put(`/companies/${companyId}/users/${userIdToUpdate}`)
          .set("Authorization", `Bearer ${adminToken}`)
          .send({
            email: "updatedworker@example.com",
            firstName: "Updated",
            lastName: "Worker",
            role: "WORKER",
          });

        expect(res.status).toBe(200);
        expect(res.body.email).toBe("updatedworker@example.com");
        expect(res.body.firstName).toBe("Updated");
      });

      it("should allow manager to update their own worker", async () => {
        const res = await request(app.server)
          .put(`/companies/${companyId}/users/${userIdToUpdate}`)
          .set("Authorization", `Bearer ${managerToken}`)
          .send({
            firstName: "ManagerUpdated",
          });

        expect(res.status).toBe(200);
        expect(res.body.firstName).toBe("ManagerUpdated");
      });
    });

    describe("Error Scenarios", () => {
      it("should reject invalid role update by manager", async () => {
        const res = await request(app.server)
          .put(`/companies/${companyId}/users/${userIdToUpdate}`)
          .set("Authorization", `Bearer ${managerToken}`)
          .send({
            role: "ADMIN",
          });

        expect(res.status).toBe(403);
        expect(res.body.error).toEqual(
          "You cannot assign the role 'ADMIN' higher than your own.",
        );
      });

      it("should return 404 for non-existent user", async () => {
        const res = await request(app.server)
          .put(`/companies/${companyId}/users/nonexistent-user-id`)
          .set("Authorization", `Bearer ${adminToken}`)
          .send({
            firstName: "Ghost",
          });

        expect(res.status).toBe(404);
      });

      it("should return 400 for invalid email format", async () => {
        const res = await request(app.server)
          .put(`/companies/${companyId}/users/${userIdToUpdate}`)
          .set("Authorization", `Bearer ${adminToken}`)
          .send({
            email: "not-an-email",
          });

        expect(res.status).toBe(400);
        expect(res.body.error).toEqual("Bad Request");
      });
    });
  });
});
