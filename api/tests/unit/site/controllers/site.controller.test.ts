/* eslint-disable @typescript-eslint/no-explicit-any */
import { ROLE } from "@prisma/prisma";
import {
  createSiteController,
  getSiteByIdController,
  getSitesByCompanyIdController,
  getSitesByUserIdController,
  updateSiteController,
} from "@src/site/controllers/site.controller";
import {
  createNewSite,
  getSiteById,
  getSitesByCompanyId,
  getSitesByUserId,
  updateSiteById,
} from "@src/site/services/site.service";
import { ChainedError } from "@utils/chainedError";
import { sendChainedErrorReply } from "@utils/errorCodeMapper";
import { FastifyReply, FastifyRequest } from "fastify";
import httpStatus from "http-status";
import {
  CompanyIdParams,
  CreateSiteDto,
  SiteIdParams,
  UpdateSiteDto,
  UserIdParams,
} from "shared";

jest.mock("@src/site/services/site.service");
jest.mock("@utils/errorCodeMapper");

describe("createSiteController", () => {
  let mockReply: Partial<FastifyReply>;
  const mockUser = { id: "user1", role: ROLE.MANAGER, companyId: "company1" };
  const mockSite = { id: "site1", name: "Test Site" };
  const mockError = new ChainedError("Failure", 400);

  beforeEach(() => {
    mockReply = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
    (sendChainedErrorReply as jest.Mock).mockClear();
    jest.clearAllMocks();
  });

  describe("Business Logic", () => {
    it("should respond 201 and return created site on success", async () => {
      (createNewSite as jest.Mock).mockReturnValueOnce({
        match: (ok: any) => ok(mockSite),
      });

      const mockRequest = {
        user: mockUser,
        body: {
          name: "Test Site",
          companyId: "c1",
          address: {},
          userIds: [],
        },
        params: { companyId: "c1" },
      } as unknown as FastifyRequest<{
        Body: CreateSiteDto;
        Params: CompanyIdParams;
      }>;

      await createSiteController(mockRequest, mockReply as FastifyReply);

      expect(createNewSite).toHaveBeenCalledWith(
        mockUser,
        mockRequest.body,
        "c1",
      );
      expect(mockReply.status).toHaveBeenCalledWith(httpStatus.CREATED);
      expect(mockReply.send).toHaveBeenCalledWith(mockSite);
    });
  });

  describe("Error Scenarios", () => {
    it("should call sendChainedErrorReply on error", async () => {
      (createNewSite as jest.Mock).mockReturnValueOnce({
        match: (_ok: any, err: any) => err(mockError),
      });

      const mockRequest = {
        user: mockUser,
        body: {
          name: "",
          address: {
            street: "",
            streetNumber: "",
            city: "",
            postalCode: "",
            country: "",
          },
          users: [],
        },
        params: { companyId: "c1" },
      } as unknown as FastifyRequest<{
        Body: CreateSiteDto;
        Params: CompanyIdParams;
      }>;

      await createSiteController(mockRequest, mockReply as FastifyReply);

      expect(sendChainedErrorReply).toHaveBeenCalledWith(mockReply, mockError);
    });
  });

  describe("Edge Cases", () => {});
});

describe("updateSiteController", () => {
  let mockReply: Partial<FastifyReply>;
  const mockUser = { id: "user1", role: ROLE.MANAGER, companyId: "company1" };
  const mockSite = { id: "site1", name: "Test Site" };
  const mockError = new ChainedError("Failure", 400);

  beforeEach(() => {
    mockReply = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
    (sendChainedErrorReply as jest.Mock).mockClear();
    jest.clearAllMocks();
  });

  describe("Business Logic", () => {
    it("should respond 200 and return updated site on success", async () => {
      (updateSiteById as jest.Mock).mockReturnValueOnce({
        match: (ok: any) => ok(mockSite),
      });

      const mockRequest = {
        user: mockUser,
        params: { siteId: "site1", companyId: "company-1" },
        body: { name: "Updated Site" },
      } as FastifyRequest<{ Body: UpdateSiteDto; Params: SiteIdParams }>;

      await updateSiteController(mockRequest, mockReply as FastifyReply);

      expect(updateSiteById).toHaveBeenCalledWith(
        mockUser,
        "site1",
        mockRequest.body,
        "company-1",
      );
      expect(mockReply.status).toHaveBeenCalledWith(httpStatus.OK);
      expect(mockReply.send).toHaveBeenCalledWith(mockSite);
    });
  });

  describe("Error Scenarios", () => {
    it("should call sendChainedErrorReply on error", async () => {
      (updateSiteById as jest.Mock).mockReturnValueOnce({
        match: (_ok: any, err: any) => err(mockError),
      });

      const mockRequest = {
        user: mockUser,
        params: { siteId: "site1", companyId: "company1" },
        body: { name: "Updated Site" },
      } as FastifyRequest<{ Body: UpdateSiteDto; Params: SiteIdParams }>;

      await updateSiteController(mockRequest, mockReply as FastifyReply);

      expect(sendChainedErrorReply).toHaveBeenCalledWith(mockReply, mockError);
    });
  });
});

describe("getSitesByUserIdController", () => {
  let mockReply: Partial<FastifyReply>;
  const mockUser = { id: "user1", role: ROLE.MANAGER, companyId: "company1" };
  const mockSites = [
    { id: "site1", name: "Test Site" },
    { id: "site2", name: "Site 2" },
  ];
  const mockError = new ChainedError("Failure", 400);

  beforeEach(() => {
    mockReply = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
    (sendChainedErrorReply as jest.Mock).mockClear();
    jest.clearAllMocks();
  });

  describe("Business Logic", () => {
    it("should respond 200 and return sites on success", async () => {
      (getSitesByUserId as jest.Mock).mockReturnValueOnce({
        match: (ok: any) => ok(mockSites),
      });

      const mockRequest = {
        user: mockUser,
        params: { userId: "user1" },
      } as FastifyRequest<{ Params: UserIdParams }>;

      await getSitesByUserIdController(mockRequest, mockReply as FastifyReply);

      expect(getSitesByUserId).toHaveBeenCalledWith("user1", mockUser);
      expect(mockReply.status).toHaveBeenCalledWith(httpStatus.OK);
      expect(mockReply.send).toHaveBeenCalledWith(mockSites);
    });
  });

  describe("Error Scenarios", () => {
    it("should call sendChainedErrorReply on error", async () => {
      (getSitesByUserId as jest.Mock).mockReturnValueOnce({
        match: (_ok: any, err: any) => err(mockError),
      });

      const mockRequest = {
        user: mockUser,
        params: { userId: "user1" },
      } as FastifyRequest<{ Params: UserIdParams }>;

      await getSitesByUserIdController(mockRequest, mockReply as FastifyReply);

      expect(sendChainedErrorReply).toHaveBeenCalledWith(mockReply, mockError);
    });
  });
});

describe("getSitesByCompanyIdController", () => {
  let mockReply: Partial<FastifyReply>;
  const mockUser = { id: "user1", role: ROLE.MANAGER, companyId: "company1" };
  const mockSites = [
    { id: "site1", name: "Test Site" },
    { id: "site2", name: "Site 2" },
  ];
  const mockError = new ChainedError("Failure", 400);

  beforeEach(() => {
    mockReply = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
    (sendChainedErrorReply as jest.Mock).mockClear();
    jest.clearAllMocks();
  });

  describe("Business Logic", () => {
    it("should respond 200 and return sites on success", async () => {
      (getSitesByCompanyId as jest.Mock).mockReturnValueOnce({
        match: (ok: any) => ok(mockSites),
      });

      const mockRequest = {
        user: mockUser,
        params: { companyId: "company1" },
      } as FastifyRequest<{ Params: CompanyIdParams }>;

      await getSitesByCompanyIdController(
        mockRequest,
        mockReply as FastifyReply,
      );

      expect(getSitesByCompanyId).toHaveBeenCalledWith("company1", mockUser);
      expect(mockReply.status).toHaveBeenCalledWith(httpStatus.OK);
      expect(mockReply.send).toHaveBeenCalledWith(mockSites);
    });
  });

  describe("Error Scenarios", () => {
    it("should call sendChainedErrorReply on error", async () => {
      (getSitesByCompanyId as jest.Mock).mockReturnValueOnce({
        match: (_ok: any, err: any) => err(mockError),
      });

      const mockRequest = {
        user: mockUser,
        params: { companyId: "company1" },
      } as FastifyRequest<{ Params: CompanyIdParams }>;

      await getSitesByCompanyIdController(
        mockRequest,
        mockReply as FastifyReply,
      );

      expect(sendChainedErrorReply).toHaveBeenCalledWith(mockReply, mockError);
    });
  });
});

describe("getSiteByIdController", () => {
  let mockReply: Partial<FastifyReply>;
  const mockUser = { id: "user1", role: ROLE.MANAGER, companyId: "company1" };
  const mockSite = { id: "site1", name: "Test Site" };
  const mockError = new ChainedError("Failure", 400);

  beforeEach(() => {
    mockReply = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
    (sendChainedErrorReply as jest.Mock).mockClear();
    jest.clearAllMocks();
  });

  describe("Business Logic", () => {
    it("should respond 200 and return site on success", async () => {
      (getSiteById as jest.Mock).mockReturnValueOnce({
        match: (ok: any) => ok(mockSite),
      });

      const mockRequest = {
        user: mockUser,
        params: { companyId: "company1", siteId: "site1" },
      } as FastifyRequest<{ Params: SiteIdParams }>;

      await getSiteByIdController(mockRequest, mockReply as FastifyReply);

      expect(getSiteById).toHaveBeenCalledWith("site1", mockUser, "company1");
      expect(mockReply.status).toHaveBeenCalledWith(httpStatus.OK);
      expect(mockReply.send).toHaveBeenCalledWith(mockSite);
    });
  });

  describe("Error Scenarios", () => {
    it("should call sendChainedErrorReply on error", async () => {
      (getSitesByCompanyId as jest.Mock).mockReturnValueOnce({
        match: (_ok: any, err: any) => err(mockError),
      });

      const mockRequest = {
        user: mockUser,
        params: { companyId: "company1" },
      } as FastifyRequest<{ Params: CompanyIdParams }>;

      await getSitesByCompanyIdController(
        mockRequest,
        mockReply as FastifyReply,
      );

      expect(sendChainedErrorReply).toHaveBeenCalledWith(mockReply, mockError);
    });
  });
});
