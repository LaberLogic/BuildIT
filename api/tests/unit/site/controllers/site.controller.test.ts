/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";

import { sendChainedErrorReply } from "@utils/errorCodeMapper";
import { ChainedError } from "@utils/chainedError";
import {
  createSiteController,
  updateSiteController,
  getSitesByUserIdController,
  getSitesByCompanyIdController,
  getSiteByIdController,
} from "@src/site/controllers/site.controller";
import {
  createNewSite,
  updateSiteById,
  getSitesByUserId,
  getSitesByCompanyId,
  getSiteById,
} from "@src/site/services/site.service";

jest.mock("@src/site/services/site.service");
jest.mock("@utils/errorCodeMapper");

describe("Site Controllers", () => {
  let mockReply: any;

  beforeEach(() => {
    mockReply = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    (sendChainedErrorReply as jest.Mock).mockClear();
  });

  const mockUser = { id: "user1", email: "user1@example.com" };
  const mockSite = { id: "site1", name: "Test Site" };
  const mockSites = [mockSite, { id: "site2", name: "Site 2" }];
  const mockError = new ChainedError("Failure", 400);

  describe("createSiteController", () => {
    it("should respond 201 and return created site on success", async () => {
      (createNewSite as jest.Mock).mockReturnValueOnce({
        match: (ok: any) => ok(mockSite),
      });

      const mockRequest = {
        user: mockUser,
        body: { name: "Test Site", companyId: "c1", address: {}, userIds: [] },
      };

      await createSiteController(mockRequest as any, mockReply);

      expect(createNewSite).toHaveBeenCalledWith(mockUser, mockRequest.body);
      expect(mockReply.status).toHaveBeenCalledWith(httpStatus.CREATED);
      expect(mockReply.send).toHaveBeenCalledWith(mockSite);
      expect(sendChainedErrorReply).not.toHaveBeenCalled();
    });

    it("should call sendChainedErrorReply on error", async () => {
      (createNewSite as jest.Mock).mockReturnValueOnce({
        match: (_ok: any, err: any) => err(mockError),
      });

      const mockRequest = { user: mockUser, body: {} };

      await createSiteController(mockRequest as any, mockReply);

      expect(sendChainedErrorReply).toHaveBeenCalledWith(mockReply, mockError);
    });
  });

  describe("updateSiteController", () => {
    it("should respond 200 and return updated site on success", async () => {
      (updateSiteById as jest.Mock).mockReturnValueOnce({
        match: (ok: any) => ok(mockSite),
      });

      const mockRequest = {
        user: mockUser,
        params: { siteId: "site1" },
        body: { name: "Updated Site" },
      };

      await updateSiteController(mockRequest as any, mockReply);

      expect(updateSiteById).toHaveBeenCalledWith(
        mockUser,
        mockRequest.params.siteId,
        mockRequest.body,
      );
      expect(mockReply.status).toHaveBeenCalledWith(httpStatus.OK);
      expect(mockReply.send).toHaveBeenCalledWith(mockSite);
      expect(sendChainedErrorReply).not.toHaveBeenCalled();
    });

    it("should call sendChainedErrorReply on error", async () => {
      (updateSiteById as jest.Mock).mockReturnValueOnce({
        match: (_ok: any, err: any) => err(mockError),
      });

      const mockRequest = {
        user: mockUser,
        params: { siteId: "site1" },
        body: { name: "Updated Site" },
      };

      await updateSiteController(mockRequest as any, mockReply);

      expect(sendChainedErrorReply).toHaveBeenCalledWith(mockReply, mockError);
    });
  });

  describe("getSitesByUserIdController", () => {
    it("should respond 200 and return sites on success", async () => {
      (getSitesByUserId as jest.Mock).mockReturnValueOnce({
        match: (ok: any) => ok(mockSites),
      });

      const mockRequest = {
        user: mockUser,
        params: { userId: "user1" },
      };

      await getSitesByUserIdController(mockRequest as any, mockReply);

      expect(getSitesByUserId).toHaveBeenCalledWith(
        mockRequest.params.userId,
        mockUser,
      );
      expect(mockReply.status).toHaveBeenCalledWith(httpStatus.OK);
      expect(mockReply.send).toHaveBeenCalledWith(mockSites);
      expect(sendChainedErrorReply).not.toHaveBeenCalled();
    });

    it("should call sendChainedErrorReply on error", async () => {
      (getSitesByUserId as jest.Mock).mockReturnValueOnce({
        match: (_ok: any, err: any) => err(mockError),
      });

      const mockRequest = {
        user: mockUser,
        params: { userId: "user1" },
      };

      await getSitesByUserIdController(mockRequest as any, mockReply);

      expect(sendChainedErrorReply).toHaveBeenCalledWith(mockReply, mockError);
    });
  });

  describe("getSitesByCompanyIdController", () => {
    it("should respond 200 and return sites on success", async () => {
      (getSitesByCompanyId as jest.Mock).mockReturnValueOnce({
        match: (ok: any) => ok(mockSites),
      });

      const mockRequest = {
        user: mockUser,
        params: { companyId: "company1" },
      };

      await getSitesByCompanyIdController(mockRequest as any, mockReply);

      expect(getSitesByCompanyId).toHaveBeenCalledWith(
        mockRequest.params.companyId,
        mockUser,
      );
      expect(mockReply.status).toHaveBeenCalledWith(httpStatus.OK);
      expect(mockReply.send).toHaveBeenCalledWith(mockSites);
      expect(sendChainedErrorReply).not.toHaveBeenCalled();
    });

    it("should call sendChainedErrorReply on error", async () => {
      (getSitesByCompanyId as jest.Mock).mockReturnValueOnce({
        match: (_o: any, err: any) => err(mockError),
      });

      const mockRequest = {
        user: mockUser,
        params: { companyId: "company1" },
      };

      await getSitesByCompanyIdController(mockRequest as any, mockReply);

      expect(sendChainedErrorReply).toHaveBeenCalledWith(mockReply, mockError);
    });
  });

  describe("getSiteByIdController", () => {
    it("should respond 200 and return site on success", async () => {
      (getSiteById as jest.Mock).mockReturnValueOnce({
        match: (ok: any) => ok(mockSite),
      });

      const mockRequest = {
        user: mockUser,
        params: { siteId: "site1" },
      };

      await getSiteByIdController(mockRequest as any, mockReply);

      expect(getSiteById).toHaveBeenCalledWith(
        mockRequest.params.siteId,
        mockUser,
      );
      expect(mockReply.status).toHaveBeenCalledWith(httpStatus.OK);
      expect(mockReply.send).toHaveBeenCalledWith(mockSite);
      expect(sendChainedErrorReply).not.toHaveBeenCalled();
    });

    it("should call sendChainedErrorReply on error", async () => {
      (getSiteById as jest.Mock).mockReturnValueOnce({
        match: (ok: any, err: any) => err(mockError),
      });

      const mockRequest = {
        user: mockUser,
        params: { siteId: "site1" },
      };

      await getSiteByIdController(mockRequest as any, mockReply);

      expect(sendChainedErrorReply).toHaveBeenCalledWith(mockReply, mockError);
    });
  });
});
