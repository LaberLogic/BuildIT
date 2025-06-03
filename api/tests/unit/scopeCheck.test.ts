import { PrismaClient, ROLE } from "@prisma/prisma";
import { ChainedError } from "@utils/chainedError";
import {
  extendSiteWhere,
  scopeCheckCompany,
  scopeCheckMaterial,
  scopeCheckSite,
} from "@utils/scopeCheck";

jest.mock("@prisma/prisma", () => {
  const mPrisma = {
    site: {
      findFirst: jest.fn(),
    },
  };
  return { PrismaClient: jest.fn(() => mPrisma) };
});

const prismaMock = new PrismaClient() as jest.Mocked<PrismaClient>;

describe("Scope Check Unit Tests", () => {
  const mockUser = { id: "user1", companyId: "comp1", role: "WORKER" as ROLE };
  const mockAdmin = { id: "user1", companyId: "comp1", role: "ADMIN" as ROLE };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("scopeCheckCompany", () => {
    it("should pass if companyId matches", async () => {
      const result = await scopeCheckCompany(mockUser, "comp1");
      expect(result.isOk()).toBe(true);
    });

    it("should fail if companyId mismatches", async () => {
      const result = await scopeCheckCompany(mockUser, "wrong-comp");
      expect(result.isErr()).toBe(true);
      expect(result._unsafeUnwrapErr()).toBeInstanceOf(ChainedError);
    });
  });

  describe("scopeCheckMaterial", () => {
    it("should resolve successfully when user is assigned to site", async () => {
      (prismaMock.site.findFirst as jest.Mock).mockResolvedValueOnce({
        id: "site1",
      });
      const result = await scopeCheckMaterial(mockUser, "site1");
      expect(prismaMock.site.findFirst).toHaveBeenCalledWith({
        where: {
          id: "site1",
          assignments: {
            some: {
              user: {
                id: "user1",
              },
            },
          },
        },
      });
      expect(result.isOk()).toBe(true);
    });

    it("should fail if prisma throws", async () => {
      (prismaMock.site.findFirst as jest.Mock).mockRejectedValueOnce(
        new Error("DB error"),
      );
      const result = await scopeCheckMaterial(mockUser, "site1");
      expect(result.isErr()).toBe(true);
      expect(result._unsafeUnwrapErr()).toBeInstanceOf(ChainedError);
    });
  });

  describe("scopeCheckSite", () => {
    it("should resolve successfully when site belongs to user's company", async () => {
      (prismaMock.site.findFirst as jest.Mock).mockResolvedValueOnce({
        id: "site1",
      });
      const result = await scopeCheckSite(mockUser, "site1");
      expect(prismaMock.site.findFirst).toHaveBeenCalledWith({
        where: {
          id: "site1",
          company: {
            id: "comp1",
          },
        },
      });
      expect(result.isOk()).toBe(true);
    });

    it("should fail if prisma rejects", async () => {
      (prismaMock.site.findFirst as jest.Mock).mockRejectedValueOnce(
        new Error("fail"),
      );

      const result = await scopeCheckSite(mockUser, "site1");
      expect(result.isErr()).toBe(true);
      expect(result._unsafeUnwrapErr()).toBeInstanceOf(ChainedError);
    });
  });

  describe("extendSiteWhere", () => {
    it("should return original where if role is ADMIN", () => {
      const baseWhere = { id: "site1" };

      const result = extendSiteWhere(baseWhere, mockAdmin);
      expect(result).toEqual(baseWhere);
    });

    it("should add company filter if role is not ADMIN", () => {
      const baseWhere = { id: "site1" };

      const result = extendSiteWhere(baseWhere, mockUser);
      expect(result).toEqual({
        ...baseWhere,
        company: {
          id: "comp1",
        },
      });
    });
  });
});
