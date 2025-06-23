/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  adjustMaterialQuantityController,
  createMaterialController,
  deleteMaterialController,
  updateMaterialController,
} from "@src/site/controllers/material.controller";
import {
  createNewMaterial,
  deleteMaterialFromSite,
  incrementDecrementMaterial,
  updateMaterialProperties,
} from "@src/site/services/material.service";
import { ChainedError } from "@utils/chainedError";
import { sendChainedErrorReply } from "@utils/errorCodeMapper";
import { FastifyReply, FastifyRequest } from "fastify";
import httpStatus from "http-status";
import {
  CreateMaterialDto,
  UpdateMaterialCountDto,
  UpdateMaterialDto,
} from "shared";
import { UserObject } from "types";

jest.mock("@src/site/services/material.service");
jest.mock("@utils/errorCodeMapper");

type SiteIdParams = { companyId: string; siteId: string };
type MaterialParams = { companyId: string; siteId: string; materialId: string };

describe("createMaterialController", () => {
  const mockUser: UserObject = {
    id: "user1",
    companyId: "c1",
    role: "MANAGER",
  };
  const mockMaterial = { id: "mat1", name: "Steel", amount: 10 };
  const mockError = new ChainedError("Something went wrong", 400);
  let mockReply: Partial<FastifyReply>;

  beforeEach(() => {
    mockReply = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
    jest.clearAllMocks();
  });

  describe("Business Logic", () => {
    it("should respond 201 and return created material on success", async () => {
      (createNewMaterial as jest.Mock).mockReturnValueOnce({
        match: (ok: (mat: unknown) => unknown) => ok(mockMaterial),
      });

      const req = {
        user: mockUser,
        params: { companyId: "c1", siteId: "site1" },
        body: { name: "Steel", unit: "kg", amount: 10, threshold: 2 },
      } as FastifyRequest<{ Params: SiteIdParams; Body: CreateMaterialDto }>;

      await createMaterialController(req, mockReply as FastifyReply);

      expect(createNewMaterial).toHaveBeenCalledWith(
        mockUser,
        "site1",
        "c1",
        req.body,
      );
      expect(mockReply.status).toHaveBeenCalledWith(httpStatus.CREATED);
      expect(mockReply.send).toHaveBeenCalledWith(mockMaterial);
    });
  });

  describe("Error Scenarios", () => {
    it("should call sendChainedErrorReply on error", async () => {
      (createNewMaterial as jest.Mock).mockReturnValueOnce({
        match: (_ok: any, err: (e: unknown) => unknown) => err(mockError),
      });

      const req = {
        user: mockUser,
        params: { companyId: "c1", siteId: "site1" },
        body: { name: "Concrete", unit: "kg", amount: 10, threshold: 10 },
      } as FastifyRequest<{ Params: SiteIdParams; Body: CreateMaterialDto }>;

      await createMaterialController(req, mockReply as FastifyReply);

      expect(sendChainedErrorReply).toHaveBeenCalledWith(mockReply, mockError);
    });
  });
});

describe("updateMaterialController", () => {
  const mockUser: UserObject = {
    id: "user1",
    companyId: "c1",
    role: "MANAGER",
  };
  const mockMaterial = { id: "mat1", name: "Steel", amount: 10 };
  const mockError = new ChainedError("Something went wrong", 400);
  let mockReply: Partial<FastifyReply>;

  beforeEach(() => {
    mockReply = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
    jest.clearAllMocks();
  });

  describe("Business Logic", () => {
    it("should respond 200 and return updated material on success", async () => {
      (updateMaterialProperties as jest.Mock).mockReturnValueOnce({
        match: (ok: (mat: unknown) => unknown) => ok(mockMaterial),
      });

      const req = {
        user: mockUser,
        params: { companyId: "c1", siteId: "site1", materialId: "mat1" },
        body: { name: "Steel", unit: "kg", amount: 20, threshold: 3 },
      } as FastifyRequest<{ Params: MaterialParams; Body: UpdateMaterialDto }>;

      await updateMaterialController(req, mockReply as FastifyReply);

      expect(updateMaterialProperties).toHaveBeenCalledWith(
        mockUser,
        "c1",
        "site1",
        "mat1",
        req.body,
      );
      expect(mockReply.status).toHaveBeenCalledWith(httpStatus.OK);
      expect(mockReply.send).toHaveBeenCalledWith(mockMaterial);
    });
  });

  describe("Error Scenarios", () => {
    it("should call sendChainedErrorReply on error", async () => {
      (updateMaterialProperties as jest.Mock).mockReturnValueOnce({
        match: (_ok: any, err: (e: unknown) => unknown) => err(mockError),
      });

      const req = {
        user: mockUser,
        params: { companyId: "c1", siteId: "site1", materialId: "mat1" },
        body: {},
      } as FastifyRequest<{
        Params: MaterialParams;
        Body: Partial<UpdateMaterialDto>;
      }>;

      await updateMaterialController(req, mockReply as FastifyReply);

      expect(sendChainedErrorReply).toHaveBeenCalledWith(mockReply, mockError);
    });
  });
});

describe("deleteMaterialController", () => {
  const mockUser: UserObject = {
    id: "user1",
    companyId: "c1",
    role: "MANAGER",
  };
  const mockError = new ChainedError("Something went wrong", 400);
  let mockReply: Partial<FastifyReply>;

  beforeEach(() => {
    mockReply = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
    jest.clearAllMocks();
  });

  describe("Business Logic", () => {
    it("should respond 204 on success", async () => {
      (deleteMaterialFromSite as jest.Mock).mockReturnValueOnce({
        match: (ok: () => void) => ok(),
      });

      const req = {
        user: mockUser,
        params: { companyId: "c1", siteId: "site1", materialId: "mat1" },
      } as FastifyRequest<{ Params: MaterialParams }>;

      await deleteMaterialController(req, mockReply as FastifyReply);

      expect(deleteMaterialFromSite).toHaveBeenCalledWith(
        mockUser,
        "c1",
        "site1",
        "mat1",
      );
      expect(mockReply.status).toHaveBeenCalledWith(httpStatus.NO_CONTENT);
      expect(mockReply.send).toHaveBeenCalledWith();
    });
  });

  describe("Error Scenarios", () => {
    it("should call sendChainedErrorReply on error", async () => {
      (deleteMaterialFromSite as jest.Mock).mockReturnValueOnce({
        match: (_ok: any, err: (e: unknown) => unknown) => err(mockError),
      });

      const req = {
        user: mockUser,
        params: { companyId: "c1", siteId: "site1", materialId: "mat1" },
      } as FastifyRequest<{ Params: MaterialParams }>;

      await deleteMaterialController(req, mockReply as FastifyReply);

      expect(sendChainedErrorReply).toHaveBeenCalledWith(mockReply, mockError);
    });
  });
});

describe("adjustMaterialQuantityController", () => {
  const mockUser: UserObject = {
    id: "user1",
    companyId: "c1",
    role: "MANAGER",
  };
  const mockMaterial = { id: "mat1", name: "Steel", amount: 10 };
  const mockError = new ChainedError("Something went wrong", 400);
  let mockReply: Partial<FastifyReply>;

  beforeEach(() => {
    mockReply = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
    jest.clearAllMocks();
  });

  describe("Business Logic", () => {
    it("should respond 200 and return updated material on success", async () => {
      (incrementDecrementMaterial as jest.Mock).mockReturnValueOnce({
        match: (ok: (mat: unknown) => unknown) => ok(mockMaterial),
      });

      const req = {
        user: mockUser,
        params: { companyId: "c1", siteId: "site1", materialId: "mat1" },
        body: { delta: 5 },
      } as FastifyRequest<{
        Params: MaterialParams;
        Body: UpdateMaterialCountDto;
      }>;

      await adjustMaterialQuantityController(req, mockReply as FastifyReply);

      expect(incrementDecrementMaterial).toHaveBeenCalledWith(
        mockUser,
        "c1",
        "site1",
        "mat1",
        { delta: 5 },
      );
      expect(mockReply.status).toHaveBeenCalledWith(httpStatus.OK);
      expect(mockReply.send).toHaveBeenCalledWith(mockMaterial);
    });
  });

  describe("Error Scenarios", () => {
    it("should call sendChainedErrorReply on error", async () => {
      (incrementDecrementMaterial as jest.Mock).mockReturnValueOnce({
        match: (_ok: any, err: (e: unknown) => unknown) => err(mockError),
      });

      const req = {
        user: mockUser,
        params: { companyId: "c1", siteId: "site1", materialId: "mat1" },
        body: { delta: -10 },
      } as FastifyRequest<{
        Params: MaterialParams;
        Body: UpdateMaterialCountDto;
      }>;

      await adjustMaterialQuantityController(req, mockReply as FastifyReply);

      expect(sendChainedErrorReply).toHaveBeenCalledWith(mockReply, mockError);
    });
  });
});
