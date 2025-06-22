/* eslint-disable @typescript-eslint/no-explicit-any */
import { sendResetPasswordMail } from "@src/mail/mail.service";
import {
  registerController,
  resetPasswordRequestController,
  setPasswordController,
  signInController,
} from "@src/user/controllers/auth.controller";
import {
  getUserUnsafe,
  updateUser,
} from "@src/user/repositories/user.repository";
import { authService } from "@src/user/services/auth.service";
import { ChainedError } from "@utils/chainedError";
import { hash } from "bcryptjs";
import { FastifyReply } from "fastify";
import httpStatus from "http-status";
import { errAsync, okAsync } from "neverthrow";

jest.mock("@src/user/services/auth.service");
jest.mock("@src/user/repositories/user.repository");
jest.mock("@src/mail/mail.service");
jest.mock("bcryptjs", () => ({
  hash: jest.fn(),
}));
jest.mock("@utils/errorCodeMapper", () => ({
  sendChainedErrorReply: jest.fn((reply: any, error: any) =>
    reply.status(500).send({ error: error.message }),
  ),
}));

const mockReply = (): Partial<FastifyReply> & {
  status: jest.Mock;
  code: jest.Mock;
  send: jest.Mock;
} => ({
  status: jest.fn().mockReturnThis(),
  code: jest.fn().mockReturnThis(),
  send: jest.fn(),
});

describe("registerController", () => {
  describe("Business Logic", () => {
    it("should return 201 and user on success", async () => {
      (authService.register as jest.Mock).mockReturnValue(
        okAsync({ id: "123", email: "test@example.com" }),
      );
      const req: any = {
        body: { email: "test@example.com", password: "pass" },
      };
      const reply = mockReply();

      await registerController(req, reply as FastifyReply);

      expect(reply.status).toHaveBeenCalledWith(httpStatus.CREATED);
      expect(reply.send).toHaveBeenCalledWith({
        message: "User registered successfully",
        user: { id: "123", email: "test@example.com" },
      });
    });

    it("should call error reply on failure", async () => {
      const error = new ChainedError("Register error");
      (authService.register as jest.Mock).mockReturnValue(errAsync(error));
      const req: any = {
        body: { email: "fail@example.com", password: "fail" },
      };
      const reply = mockReply();

      await registerController(req, reply as FastifyReply);

      expect(reply.status).toHaveBeenCalledWith(500);
      expect(reply.send).toHaveBeenCalledWith({ error: error.message });
    });
  });

  describe("Error Scenarios", () => {
    it("should handle chained errors", async () => {
      const chainedError = new ChainedError("Chained error message");
      (authService.register as jest.Mock).mockReturnValue(
        errAsync(chainedError),
      );
      const req: any = {
        body: { email: "error@example.com", password: "err" },
      };
      const reply = mockReply();

      await registerController(req, reply as FastifyReply);

      expect(reply.status).toHaveBeenCalledWith(500);
      expect(reply.send).toHaveBeenCalledWith({
        error: chainedError.message,
      });
    });
  });
});

describe("signInController", () => {
  describe("Business Logic", () => {
    it("should return 200 and user info on success", async () => {
      const userInfo = { id: "u1", email: "test@example.com" };
      (authService.signIn as jest.Mock).mockReturnValue(okAsync(userInfo));
      const req: any = {
        body: { email: "test@example.com", password: "pass" },
      };
      const reply = mockReply();

      await signInController(req, reply as FastifyReply);

      expect(reply.code).toHaveBeenCalledWith(httpStatus.OK);
      expect(reply.send).toHaveBeenCalledWith(userInfo);
    });

    it("should call error reply on failure", async () => {
      const error = new ChainedError("Invalid credentials");
      (authService.signIn as jest.Mock).mockReturnValue(errAsync(error));
      const req: any = {
        body: { email: "fail@example.com", password: "fail" },
      };
      const reply = mockReply();

      await signInController(req, reply as FastifyReply);

      expect(reply.status).toHaveBeenCalledWith(500);
      expect(reply.send).toHaveBeenCalledWith({ error: error.message });
    });
  });

  describe("Error Scenarios", () => {
    it("should handle specific chained errors", async () => {
      const error = new ChainedError("Specific error");
      (authService.signIn as jest.Mock).mockReturnValue(errAsync(error));
      const req: any = {
        body: { email: "error@example.com", password: "err" },
      };
      const reply = mockReply();

      await signInController(req, reply as FastifyReply);

      expect(reply.status).toHaveBeenCalledWith(500);
      expect(reply.send).toHaveBeenCalledWith({ error: error.message });
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty body gracefully", async () => {
      const mockError = new ChainedError("Validation failed");
      (authService.signIn as jest.Mock).mockReturnValue(errAsync(mockError));

      const req: any = { body: {} };
      const reply = mockReply();

      await signInController(req, reply as FastifyReply);

      expect(reply.status).toHaveBeenCalledWith(500);
      expect(reply.send).toHaveBeenCalledWith({
        error: mockError.message,
      });
    });
  });
});

describe("setPasswordController", () => {
  describe("Business Logic", () => {
    it("should hash password and update user", async () => {
      (hash as jest.Mock).mockResolvedValue("hashedPass");
      (updateUser as jest.Mock).mockReturnValue(
        okAsync({ id: "user-id", status: "ACTIVE" }),
      );
      const req: any = {
        body: { password: "newPass123" },
        user: { id: "user-id" },
      };
      const reply = mockReply();

      await setPasswordController(req, reply as FastifyReply);

      expect(hash).toHaveBeenCalledWith("newPass123", 10);
      expect(updateUser).toHaveBeenCalledWith("user-id", {
        password: "hashedPass",
        status: "ACTIVE",
      });
      expect(reply.code).toHaveBeenCalledWith(httpStatus.OK);
      expect(reply.send).toHaveBeenCalledWith({
        id: "user-id",
        status: "ACTIVE",
      });
    });
  });

  describe("Error Scenarios", () => {
    it("should handle hashing errors", async () => {
      const mockError = new ChainedError("Hash failed");
      (hash as jest.Mock).mockRejectedValue(mockError);
      const req: any = {
        body: { password: "failPass" },
        user: { id: "user-id" },
      };
      const reply = mockReply();

      await setPasswordController(req, reply as FastifyReply);

      expect(reply.status).toHaveBeenCalledWith(500);
      expect(reply.send).toHaveBeenCalledWith({ error: mockError.message });
    });

    it("should handle update errors", async () => {
      (hash as jest.Mock).mockResolvedValue("hashedPass");
      const mockError = new ChainedError("Update failed");
      (updateUser as jest.Mock).mockReturnValue(errAsync(mockError));
      const req: any = {
        body: { password: "pass123" },
        user: { id: "user-id" },
      };
      const reply = mockReply();

      await setPasswordController(req, reply as FastifyReply);

      expect(reply.status).toHaveBeenCalledWith(500);
      expect(reply.send).toHaveBeenCalledWith({ error: mockError.message });
    });
  });
});

describe("resetPasswordRequestController", () => {
  describe("Business Logic", () => {
    it("should send reset email if user active", async () => {
      const user = { id: "u1", email: "test@example.com", status: "ACTIVE" };
      (getUserUnsafe as jest.Mock).mockReturnValue(okAsync(user));
      (sendResetPasswordMail as jest.Mock).mockReturnValue(okAsync(undefined));
      const req: any = { body: { email: "test@example.com" } };
      const reply = mockReply();

      await resetPasswordRequestController(req, reply as FastifyReply);

      expect(sendResetPasswordMail).toHaveBeenCalledWith(user);
      expect(reply.code).toHaveBeenCalledWith(httpStatus.OK);
      expect(reply.send).toHaveBeenCalledWith({ message: "Reset email sent" });
    });
  });

  describe("Error Scenarios", () => {
    it("should error if user inactive or missing", async () => {
      (getUserUnsafe as jest.Mock).mockReturnValue(
        okAsync({ status: "INACTIVE" }),
      );
      const req: any = { body: { email: "inactive@example.com" } };
      const reply = mockReply();

      await resetPasswordRequestController(req, reply as FastifyReply);

      expect(reply.status).toHaveBeenCalledWith(500);
      expect(reply.send).toHaveBeenCalledWith({
        error: new ChainedError("Something went wrong").message,
      });
    });

    it("should error if getUserUnsafe fails", async () => {
      const mockError = new Error("DB fail");
      (getUserUnsafe as jest.Mock).mockReturnValue(errAsync(mockError));
      const req: any = { body: { email: "fail@example.com" } };
      const reply = mockReply();

      await resetPasswordRequestController(req, reply as FastifyReply);

      expect(reply.status).toHaveBeenCalledWith(500);
      expect(reply.send).toHaveBeenCalledWith({ error: mockError.message });
    });
  });
});
