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
import httpStatus from "http-status";

jest.mock("@src/site/services/material.service");
jest.mock("@utils/errorCodeMapper");

describe("Material Controllers", () => {
  let mockReply: any;

  const mockUser = { id: "user1", companyId: "c1" };
  const mockMaterial = { id: "mat1", name: "Steel", amount: 10 };
  const mockError = new ChainedError("Something went wrong", 400);

  beforeEach(() => {
    mockReply = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    jest.clearAllMocks();
  });

  describe("createMaterialController", () => {
    it("should respond 201 and return created material on success", async () => {
      (createNewMaterial as jest.Mock).mockReturnValueOnce({
        match: (ok: any) => ok(mockMaterial),
      });

      const req = {
        user: mockUser,
        params: { siteId: "site1" },
        body: { name: "Steel", unit: "kg", amount: 10, threshold: 2 },
      };

      await createMaterialController(req as any, mockReply);

      expect(createNewMaterial).toHaveBeenCalledWith(
        mockUser,
        "site1",
        req.body,
      );
      expect(mockReply.status).toHaveBeenCalledWith(httpStatus.CREATED);
      expect(mockReply.send).toHaveBeenCalledWith(mockMaterial);
      expect(sendChainedErrorReply).not.toHaveBeenCalled();
    });

    it("should call sendChainedErrorReply on error", async () => {
      (createNewMaterial as jest.Mock).mockReturnValueOnce({
        match: (_ok: any, err: any) => err(mockError),
      });

      const req = {
        user: mockUser,
        params: { siteId: "site1" },
        body: {},
      };

      await createMaterialController(req as any, mockReply);

      expect(sendChainedErrorReply).toHaveBeenCalledWith(mockReply, mockError);
    });
  });

  describe("updateMaterialController", () => {
    it("should respond 200 and return updated material on success", async () => {
      (updateMaterialProperties as jest.Mock).mockReturnValueOnce({
        match: (ok: any) => ok(mockMaterial),
      });

      const req = {
        user: mockUser,
        params: { siteId: "site1", materialId: "mat1" },
        body: { name: "Steel", unit: "kg", amount: 20, threshold: 3 },
      };

      await updateMaterialController(req as any, mockReply);

      expect(updateMaterialProperties).toHaveBeenCalledWith(
        mockUser,
        "site1",
        "mat1",
        req.body,
      );
      expect(mockReply.status).toHaveBeenCalledWith(httpStatus.OK);
      expect(mockReply.send).toHaveBeenCalledWith(mockMaterial);
    });

    it("should call sendChainedErrorReply on error", async () => {
      (updateMaterialProperties as jest.Mock).mockReturnValueOnce({
        match: (_ok: any, err: any) => err(mockError),
      });

      const req = {
        user: mockUser,
        params: { siteId: "site1", materialId: "mat1" },
        body: {},
      };

      await updateMaterialController(req as any, mockReply);

      expect(sendChainedErrorReply).toHaveBeenCalledWith(mockReply, mockError);
    });
  });

  describe("deleteMaterialController", () => {
    it("should respond 204 on success", async () => {
      (deleteMaterialFromSite as jest.Mock).mockReturnValueOnce({
        match: (ok: any) => ok(undefined),
      });

      const req = {
        user: mockUser,
        params: { siteId: "site1", materialId: "mat1" },
      };

      await deleteMaterialController(req as any, mockReply);

      expect(deleteMaterialFromSite).toHaveBeenCalledWith(
        mockUser,
        "site1",
        "mat1",
      );
      expect(mockReply.status).toHaveBeenCalledWith(httpStatus.NO_CONTENT);
      expect(mockReply.send).toHaveBeenCalledWith();
    });

    it("should call sendChainedErrorReply on error", async () => {
      (deleteMaterialFromSite as jest.Mock).mockReturnValueOnce({
        match: (_ok: any, err: any) => err(mockError),
      });

      const req = {
        user: mockUser,
        params: { siteId: "site1", materialId: "mat1" },
      };

      await deleteMaterialController(req as any, mockReply);

      expect(sendChainedErrorReply).toHaveBeenCalledWith(mockReply, mockError);
    });
  });

  describe("adjustMaterialQuantityController", () => {
    it("should respond 200 and return updated material on success", async () => {
      (incrementDecrementMaterial as jest.Mock).mockReturnValueOnce({
        match: (ok: any) => ok(mockMaterial),
      });

      const req = {
        user: mockUser,
        params: { siteId: "site1", materialId: "mat1" },
        body: { delta: 5 },
      };

      await adjustMaterialQuantityController(req as any, mockReply);

      expect(incrementDecrementMaterial).toHaveBeenCalledWith(
        mockUser,
        "site1",
        "mat1",
        { delta: 5 },
      );
      expect(mockReply.status).toHaveBeenCalledWith(httpStatus.OK);
      expect(mockReply.send).toHaveBeenCalledWith(mockMaterial);
    });

    it("should call sendChainedErrorReply on error", async () => {
      (incrementDecrementMaterial as jest.Mock).mockReturnValueOnce({
        match: (_ok: any, err: any) => err(mockError),
      });

      const req = {
        user: mockUser,
        params: { siteId: "site1", materialId: "mat1" },
        body: { delta: -10 },
      };

      await adjustMaterialQuantityController(req as any, mockReply);

      expect(sendChainedErrorReply).toHaveBeenCalledWith(mockReply, mockError);
    });
  });
});
