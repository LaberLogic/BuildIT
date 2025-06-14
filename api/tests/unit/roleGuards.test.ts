/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  canCreateUser,
  canManageUser,
  canViewUser,
  isAdmin,
  isAdminOrManager,
  isManager,
  isWorker,
} from "@src/plugins/roleGuards";
import { getUserUnsafe } from "@src/user/repositories/user.repository";
import { FastifyReply, FastifyRequest, RouteGenericInterface } from "fastify";

jest.mock("@src/user/repositories/user.repository");

const getUserMock = getUserUnsafe as jest.Mock;

const makeReply = (): FastifyReply =>
  ({
    status: jest.fn().mockReturnThis(),
    send: jest.fn().mockReturnThis(),
  }) as unknown as FastifyReply;

const makeRequest = <T extends RouteGenericInterface>(
  user: any = {},
  body: any = {},
  params: any = {},
): FastifyRequest<T> => {
  return {
    user,
    body,
    params,
  } as unknown as FastifyRequest<T>;
};

describe("Permission Functions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("isAdmin", () => {
    describe("Business Logic", () => {
      it("allows ADMIN", async () => {
        const req = makeRequest({ role: "ADMIN" });
        const reply = makeReply();
        await isAdmin(req, reply);
        expect(reply.status).not.toHaveBeenCalled();
      });
    });

    describe("Error Scenarios", () => {
      it("denies non-ADMIN", async () => {
        const req = makeRequest({ role: "MANAGER" });
        const reply = makeReply();
        await isAdmin(req, reply);
        expect(reply.send).toHaveBeenCalledWith({
          error: "Admin role required.",
        });
      });
    });

    describe("Edge Cases", () => {});
    describe("Data Transformation", () => {});
  });

  describe("isManager", () => {
    describe("Business Logic", () => {
      it("allows MANAGER", async () => {
        const req = makeRequest({ role: "MANAGER" });
        const reply = makeReply();
        await isManager(req, reply);
        expect(reply.status).not.toHaveBeenCalled();
      });
    });

    describe("Error Scenarios", () => {
      it("denies non-MANAGER", async () => {
        const req = makeRequest({ role: "WORKER" });
        const reply = makeReply();
        await isManager(req, reply);
        expect(reply.send).toHaveBeenCalledWith({
          error: "Manager role required.",
        });
      });
    });

    describe("Edge Cases", () => {});
    describe("Data Transformation", () => {});
  });

  describe("isAdminOrManager", () => {
    describe("Business Logic", () => {
      it("allows ADMIN", async () => {
        const req = makeRequest({ role: "ADMIN" });
        const reply = makeReply();
        await isAdminOrManager(req, reply);
        expect(reply.status).not.toHaveBeenCalled();
      });

      it("allows MANAGER", async () => {
        const req = makeRequest({ role: "MANAGER" });
        const reply = makeReply();
        await isAdminOrManager(req, reply);
        expect(reply.status).not.toHaveBeenCalled();
      });
    });

    describe("Error Scenarios", () => {
      it("denies WORKER", async () => {
        const req = makeRequest({ role: "WORKER" });
        const reply = makeReply();
        await isAdminOrManager(req, reply);
        expect(reply.send).toHaveBeenCalledWith({
          error: "Admin or Manager role required.",
        });
      });
    });

    describe("Edge Cases", () => {});
    describe("Data Transformation", () => {});
  });

  describe("isWorker", () => {
    describe("Business Logic", () => {
      it("allows WORKER", async () => {
        const req = makeRequest({ role: "WORKER" });
        const reply = makeReply();
        await isWorker(req, reply);
        expect(reply.status).not.toHaveBeenCalled();
      });
    });

    describe("Error Scenarios", () => {
      it("denies ADMIN", async () => {
        const req = makeRequest({ role: "ADMIN" });
        const reply = makeReply();
        await isWorker(req, reply);
        expect(reply.send).toHaveBeenCalledWith({
          error: "Worker role required.",
        });
      });
    });

    describe("Edge Cases", () => {});
    describe("Data Transformation", () => {});
  });

  describe("canCreateUser", () => {
    describe("Business Logic", () => {
      it("allows creating lower role", async () => {
        const req = makeRequest<{
          Body: { role?: string };
        }>({ role: "ADMIN" }, { role: "MANAGER" });
        const reply = makeReply();
        await canCreateUser(req, reply);
        expect(reply.status).not.toHaveBeenCalled();
      });
    });

    describe("Error Scenarios", () => {
      it("denies creating higher role", async () => {
        const req = makeRequest<{
          Body: { role?: string };
        }>({ role: "MANAGER" }, { role: "ADMIN" });
        const reply = makeReply();
        await canCreateUser(req, reply);
        expect(reply.send).toHaveBeenCalledWith({
          error: "Insufficient privileges to create role 'ADMIN'.",
        });
      });

      it("returns 400 for invalid role", async () => {
        const req = makeRequest<{
          Body: { role?: string };
        }>({ role: "ADMIN" }, { role: "INVALID" });
        const reply = makeReply();
        await canCreateUser(req, reply);
        expect(reply.status).toHaveBeenCalledWith(400);
      });

      it("returns 400 for missing user", async () => {
        const req = makeRequest<{
          Body: { role?: string };
        }>(undefined, { role: "WORKER" });
        const reply = makeReply();
        await canCreateUser(req, reply);
        expect(reply.status).toHaveBeenCalledWith(400);
      });
    });
  });

  describe("canManageUser", () => {
    describe("Business Logic", () => {
      it("allows managing lower role", async () => {
        getUserMock.mockResolvedValue({
          isErr: () => false,
          value: { id: "2", role: "WORKER" },
        });

        const req = makeRequest<{
          Params: { userId: string };
        }>({ id: "1", role: "MANAGER" }, {}, { userId: "2" });

        const reply = makeReply();
        await canManageUser(req, reply);
        expect(reply.status).not.toHaveBeenCalled();
      });
    });

    describe("Error Scenarios", () => {
      it("returns 404 if user not found", async () => {
        getUserMock.mockResolvedValue({ isErr: () => true });

        const req = makeRequest<{
          Params: { userId: string };
        }>({ id: "1", role: "MANAGER" }, {}, { userId: "2" });

        const reply = makeReply();
        await canManageUser(req, reply);
        expect(reply.status).toHaveBeenCalledWith(404);
      });

      it("denies same or higher role", async () => {
        getUserMock.mockResolvedValue({
          isErr: () => false,
          value: { id: "2", role: "MANAGER" },
        });

        const req = makeRequest<{
          Params: { userId: string };
        }>({ id: "1", role: "MANAGER" }, {}, { userId: "2" });

        const reply = makeReply();
        await canManageUser(req, reply);
        expect(reply.send).toHaveBeenCalledWith({
          error: "You cannot manage users with equal or higher roles.",
        });
      });

      it("denies assigning higher role", async () => {
        getUserMock.mockResolvedValue({
          isErr: () => false,
          value: { id: "2", role: "WORKER" },
        });

        const req = makeRequest<{
          Params: { userId: string };
          Body: { role?: string };
        }>({ id: "1", role: "MANAGER" }, { role: "ADMIN" }, { userId: "2" });

        const reply = makeReply();
        await canManageUser(req, reply);
        expect(reply.send).toHaveBeenCalledWith({
          error: "You cannot assign the role 'ADMIN' higher than your own.",
        });
      });
    });

    describe("Edge Cases", () => {
      it("denies WORKER from managing", async () => {
        getUserMock.mockResolvedValue({
          isErr: () => false,
          value: { id: "2", role: "WORKER" },
        });

        const req = makeRequest<{
          Params: { userId: string };
        }>({ id: "1", role: "WORKER" }, {}, { userId: "2" });

        const reply = makeReply();
        await canManageUser(req, reply);
        expect(reply.send).toHaveBeenCalledWith({
          error: "Workers cannot manage other users.",
        });
      });
    });

    describe("Data Transformation", () => {});
  });

  describe("canViewUser", () => {
    describe("Business Logic", () => {
      it("allows ADMIN to view", async () => {
        const req = makeRequest<{
          Params: { userId: string };
        }>({ id: "1", role: "ADMIN" }, {}, { userId: "2" });

        const reply = makeReply();
        await canViewUser(req, reply);
        expect(reply.status).not.toHaveBeenCalled();
      });

      it("allows MANAGER to view", async () => {
        const req = makeRequest<{
          Params: { userId: string };
        }>({ id: "1", role: "MANAGER" }, {}, { userId: "2" });

        const reply = makeReply();
        await canViewUser(req, reply);
        expect(reply.status).not.toHaveBeenCalled();
      });

      it("allows self-view", async () => {
        const req = makeRequest<{
          Params: { userId: string };
        }>({ id: "1", role: "WORKER" }, {}, { userId: "1" });

        const reply = makeReply();
        await canViewUser(req, reply);
        expect(reply.status).not.toHaveBeenCalled();
      });
    });

    describe("Error Scenarios", () => {
      it("denies unauthorized access", async () => {
        const req = makeRequest<{
          Params: { userId: string };
        }>({ id: "1", role: "WORKER" }, {}, { userId: "2" });

        const reply = makeReply();
        await canViewUser(req, reply);
        expect(reply.send).toHaveBeenCalledWith({
          error: "Missing Permissions.",
        });
      });
    });
  });
});
