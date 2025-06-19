import { ChainedError } from "@utils/chainedError";
import {
  extendSiteWhere,
  scopeCheckCompany,
  scopeCheckSiteAccess,
} from "@utils/scopeCheck";
import { UserObject } from "types";

jest.mock("@prisma/prisma", () => {
  return {
    PrismaClient: jest.fn().mockImplementation(() => ({
      site: {
        findFirst: jest.fn(),
      },
    })),
  };
});

beforeEach(() => {
  jest.clearAllMocks();
});

describe("scopeCheckCompany", () => {
  describe("Business Logic", () => {
    it("allows ADMIN regardless of companyId", async () => {
      const adminUser = {
        id: "u1",
        companyId: "any",
        role: "ADMIN",
      } as UserObject;
      const result = await scopeCheckCompany(adminUser, "otherCompany");
      expect(result.isOk()).toBe(true);
    });

    it("allows user with matching companyId", async () => {
      const user = {
        id: "u1",
        companyId: "comp1",
        role: "WORKER",
      } as UserObject;
      const result = await scopeCheckCompany(user, "comp1");
      expect(result.isOk()).toBe(true);
    });
  });

  describe("Error Scenarios", () => {
    it("errors if companyId does not match", async () => {
      const user = {
        id: "u1",
        companyId: "comp1",
        role: "WORKER",
      } as UserObject;
      const result = await scopeCheckCompany(user, "comp2");
      expect(result.isErr()).toBe(true);
      expect(result._unsafeUnwrapErr()).toBeInstanceOf(ChainedError);
    });

    it("errors if user has no companyId", async () => {
      const user = {
        id: "u1",
        companyId: undefined,
        role: "WORKER",
      } as UserObject;
      const result = await scopeCheckCompany(user, "comp2");
      expect(result.isErr()).toBe(true);
    });
  });

  describe("Edge Cases", () => {
    it("errors if passedCompanyId is empty string", async () => {
      const user = {
        id: "u1",
        companyId: "comp1",
        role: "WORKER",
      } as UserObject;
      const result = await scopeCheckCompany(user, "");
      expect(result.isErr()).toBe(true);
    });
  });
});

describe("scopeCheckSiteAccess", () => {
  const mockUser = {
    id: "u1",
    companyId: "comp1",
    role: "WORKER",
  } as UserObject;
  const mockManager = {
    id: "u1",
    companyId: "comp1",
    role: "MANAGER",
  } as UserObject;
  const mockAdmin = {
    id: "u1",
    companyId: "comp1",
    role: "ADMIN",
  } as UserObject;

  let mockFindFirst: jest.Mock;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockPrismaClient: any;

  beforeEach(() => {
    jest.clearAllMocks();
    mockFindFirst = jest.fn();
    mockPrismaClient = {
      site: {
        findFirst: mockFindFirst,
      },
    };
  });

  describe("Business Logic", () => {
    it("allows ADMIN without DB check", async () => {
      const result = await scopeCheckSiteAccess(
        mockAdmin,
        "site1",
        "comp1",
        mockPrismaClient,
      );
      expect(result.isOk()).toBe(true);
      expect(mockFindFirst).not.toHaveBeenCalled();
    });

    it("allows MANAGER if companyId matches without DB check", async () => {
      const result = await scopeCheckSiteAccess(
        mockManager,
        "site1",
        "comp1",
        mockPrismaClient,
      );
      expect(result.isOk()).toBe(true);
      expect(mockFindFirst).not.toHaveBeenCalled();
    });

    it("errors if companyId mismatch for MANAGER", async () => {
      const result = await scopeCheckSiteAccess(
        mockManager,
        "site1",
        "other",
        mockPrismaClient,
      );
      expect(result.isErr()).toBe(true);
      expect(mockFindFirst).not.toHaveBeenCalled();
    });

    it("WORKER access: mocks findFirst to resolve a site", async () => {
      mockFindFirst.mockResolvedValueOnce({
        id: "site1",
        companyId: "comp1",
      });

      const user = {
        id: "u1",
        companyId: "comp1",
        role: "WORKER",
      };

      const result = await scopeCheckSiteAccess(
        user as UserObject,
        "site1",
        "comp1",
        mockPrismaClient,
      );

      expect(mockFindFirst).toHaveBeenCalledTimes(1);
      expect(mockFindFirst).toHaveBeenCalledWith({
        where: {
          id: "site1",
          companyId: "comp1",
          assignments: {
            some: {
              userId: "u1",
            },
          },
        },
      });
      expect(result.isOk()).toBe(true);
    });
  });

  describe("Error Scenarios", () => {
    it("errors if companyId mismatch for WORKER", async () => {
      const result = await scopeCheckSiteAccess(
        mockUser,
        "site1",
        "other",
        mockPrismaClient,
      );
      expect(result.isErr()).toBe(true);
      expect(mockFindFirst).not.toHaveBeenCalled();
    });

    it("errors if DB rejects", async () => {
      mockFindFirst.mockRejectedValueOnce(new Error("DB fail"));
      const result = await scopeCheckSiteAccess(
        mockUser,
        "site1",
        "comp1",
        mockPrismaClient,
      );
      expect(result.isErr()).toBe(true);
      expect(result._unsafeUnwrapErr()).toBeInstanceOf(ChainedError);
    });

    it("errors if WORKER is not assigned to site", async () => {
      mockFindFirst.mockResolvedValueOnce(null);
      const result = await scopeCheckSiteAccess(
        mockUser,
        "site1",
        "comp1",
        mockPrismaClient,
      );
      expect(result.isErr()).toBe(true);
    });

    it("errors if siteId is empty", async () => {
      mockFindFirst.mockResolvedValueOnce(null);
      const result = await scopeCheckSiteAccess(
        mockUser,
        "",
        "comp1",
        mockPrismaClient,
      );
      expect(result.isErr()).toBe(true);
    });

    it("errors if user has no companyId", async () => {
      const userNoCompany = {
        id: "u1",
        companyId: undefined,
        role: "WORKER",
      } as UserObject;
      const result = await scopeCheckSiteAccess(
        userNoCompany,
        "site1",
        "comp1",
        mockPrismaClient,
      );
      expect(result.isErr()).toBe(true);
      expect(mockFindFirst).not.toHaveBeenCalled();
    });
  });
});

describe("extendSiteWhere", () => {
  const baseWhere = { id: "site1" };

  describe("Data Transformation", () => {
    it("returns where with companyId only for ADMIN", () => {
      const adminUser = {
        id: "u1",
        companyId: "comp1",
        role: "ADMIN",
      } as UserObject;
      expect(extendSiteWhere(baseWhere, adminUser)).toEqual({
        ...baseWhere,
        companyId: "comp1",
      });
    });

    it("returns where with companyId only for MANAGER", () => {
      const managerUser = {
        id: "u1",
        companyId: "comp1",
        role: "MANAGER",
      } as UserObject;
      expect(extendSiteWhere(baseWhere, managerUser)).toEqual({
        ...baseWhere,
        companyId: "comp1",
      });
    });

    it("returns where with companyId and assignments for WORKER", () => {
      const workerUser = {
        id: "u1",
        companyId: "comp1",
        role: "WORKER",
      } as UserObject;
      expect(extendSiteWhere(baseWhere, workerUser)).toEqual({
        ...baseWhere,
        companyId: "comp1",
        assignments: {
          some: {
            userId: "u1",
          },
        },
      });
    });

    it("handles missing companyId gracefully", () => {
      const user = {
        id: "u1",
        companyId: undefined,
        role: "WORKER",
      } as UserObject;
      expect(extendSiteWhere(baseWhere, user)).toEqual({
        ...baseWhere,
        companyId: undefined,
        assignments: {
          some: {
            userId: "u1",
          },
        },
      });
    });
  });

  describe("Edge Cases", () => {
    it("handles empty where object", () => {
      const user = {
        id: "u1",
        companyId: "comp1",
        role: "WORKER",
      } as UserObject;
      expect(extendSiteWhere({}, user)).toEqual({
        companyId: "comp1",
        assignments: {
          some: {
            userId: "u1",
          },
        },
      });
    });
  });
});
