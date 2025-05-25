/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChainedError } from "@utils/chainedError";
import httpStatus from "http-status";
import {
  createUserController,
  updateUserController,
  deleteUserController,
  getUserByIdController,
  getAllUsersByCompanyController,
} from "@src/user/controllers/user.controller";
import { userService } from "@src/user/services/user.service";

jest.mock("@src/user/services/user.service");

describe("User Controllers", () => {
  let mockReply: any;
  let mockRequest: any;

  beforeEach(() => {
    mockReply = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
  });

  describe("createUserController", () => {
    it("should respond 200 and return user on success", async () => {
      const mockUser = { id: "user1", email: "test@example.com" };
      mockRequest = {
        user: { id: "admin" },
        body: { email: "test@example.com" },
      };

      (userService.createUser as jest.Mock).mockReturnValueOnce({
        match: (ok: any) => ok(mockUser),
      });

      await createUserController(mockRequest, mockReply);

      expect(userService.createUser).toHaveBeenCalledWith(
        mockRequest.user,
        mockRequest.body,
      );
      expect(mockReply.status).toHaveBeenCalledWith(httpStatus.CREATED);
      expect(mockReply.send).toHaveBeenCalledWith(mockUser);
    });

    it("should respond with errorCode from ChainedError", async () => {
      const error = new ChainedError("Invalid data", 400);
      mockRequest = { user: {}, body: {} };

      (userService.createUser as jest.Mock).mockReturnValueOnce({
        match: (_ok: any, err: any) => err(error),
      });

      await createUserController(mockRequest, mockReply);

      expect(mockReply.status).toHaveBeenCalledWith(400);
      expect(mockReply.send).toHaveBeenCalledWith({ error: error.message });
    });
  });

  describe("updateUserController", () => {
    it("should respond 200 and return updated user on success", async () => {
      const mockUser = { id: "user1", email: "updated@example.com" };
      mockRequest = {
        user: { id: "admin" },
        params: { userId: "user1" },
        body: { email: "updated@example.com" },
      };

      (userService.updateUser as jest.Mock).mockReturnValueOnce({
        match: (ok: any) => ok(mockUser),
      });

      await updateUserController(mockRequest, mockReply);

      expect(userService.updateUser).toHaveBeenCalledWith(
        mockRequest.user,
        mockRequest.params.userId,
        mockRequest.body,
      );
      expect(mockReply.status).toHaveBeenCalledWith(httpStatus.OK);
      expect(mockReply.send).toHaveBeenCalledWith(mockUser);
    });

    it("should respond with errorCode from ChainedError", async () => {
      const error = new ChainedError("Update failed", 403);
      mockRequest = {
        user: {},
        params: { userId: "user1" },
        body: {},
      };

      (userService.updateUser as jest.Mock).mockReturnValueOnce({
        match: (_ok: any, err: any) => err(error),
      });

      await updateUserController(mockRequest, mockReply);

      expect(mockReply.status).toHaveBeenCalledWith(403);
      expect(mockReply.send).toHaveBeenCalledWith({ error: error.message });
    });
  });

  describe("deleteUserController", () => {
    it("should respond 204 on success", async () => {
      mockRequest = {
        user: { id: "admin" },
        params: { userId: "user1" },
      };

      (userService.deleteUser as jest.Mock).mockReturnValueOnce({
        match: (ok: any) => ok({ id: "user1" }),
      });

      await deleteUserController(mockRequest, mockReply);

      expect(userService.deleteUser).toHaveBeenCalledWith(
        mockRequest.user,
        "user1",
      );
      expect(mockReply.status).toHaveBeenCalledWith(httpStatus.NO_CONTENT);
      expect(mockReply.send).toHaveBeenCalledWith({ id: "user1" });
    });

    it("should respond with errorCode from ChainedError", async () => {
      const error = new ChainedError("Delete failed", 403);
      mockRequest = {
        user: {},
        params: { userId: "user1" },
      };

      (userService.deleteUser as jest.Mock).mockReturnValueOnce({
        match: (_ok: unknown, err: any) => err(error),
      });

      await deleteUserController(mockRequest, mockReply);

      expect(mockReply.status).toHaveBeenCalledWith(403);
      expect(mockReply.send).toHaveBeenCalledWith({ error: error.message });
    });
  });

  describe("getUserByIdController", () => {
    it("should respond 200 with user on success", async () => {
      const mockUser = { id: "user1", email: "user@example.com" };
      mockRequest = {
        user: { id: "admin" },
        params: { userId: "user1" },
      };

      (userService.getUserById as jest.Mock).mockReturnValueOnce({
        match: (ok: any) => ok(mockUser),
      });

      await getUserByIdController(mockRequest, mockReply);

      expect(userService.getUserById).toHaveBeenCalledWith(
        mockRequest.user,
        "user1",
      );
      expect(mockReply.status).toHaveBeenCalledWith(httpStatus.OK);
      expect(mockReply.send).toHaveBeenCalledWith(mockUser);
    });

    it("should respond with errorCode from ChainedError", async () => {
      const error = new ChainedError("Not found", 404);
      mockRequest = {
        user: {},
        params: { userId: "user1" },
      };

      (userService.getUserById as jest.Mock).mockReturnValueOnce({
        match: (_ok: any, err: any) => err(error),
      });

      await getUserByIdController(mockRequest, mockReply);

      expect(mockReply.status).toHaveBeenCalledWith(404);
      expect(mockReply.send).toHaveBeenCalledWith({ error: error.message });
    });
  });

  describe("getAllUsersByCompanyController", () => {
    it("should respond 200 with users on success", async () => {
      const mockUsers = [
        { id: "user1", email: "user1@example.com" },
        { id: "user2", email: "user2@example.com" },
      ];
      mockRequest = {
        user: { id: "admin" },
        params: { companyId: "company1" },
      };

      (userService.getAllUsersByCompany as jest.Mock).mockReturnValueOnce({
        match: (ok: any) => ok(mockUsers),
      });

      await getAllUsersByCompanyController(mockRequest, mockReply);

      expect(userService.getAllUsersByCompany).toHaveBeenCalledWith(
        mockRequest.user,
        "company1",
      );
      expect(mockReply.status).toHaveBeenCalledWith(httpStatus.OK);
      expect(mockReply.send).toHaveBeenCalledWith(mockUsers);
    });

    it("should respond with errorCode from ChainedError", async () => {
      const error = new ChainedError("Forbidden", 403);
      mockRequest = {
        user: {},
        params: { companyId: "company1" },
      };

      (userService.getAllUsersByCompany as jest.Mock).mockReturnValueOnce({
        match: (_ok: unknown, err: any) => err(error),
      });

      await getAllUsersByCompanyController(mockRequest, mockReply);

      expect(mockReply.status).toHaveBeenCalledWith(403);
      expect(mockReply.send).toHaveBeenCalledWith({ error: error.message });
    });
  });
});
