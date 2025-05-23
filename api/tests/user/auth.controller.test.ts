import { okAsync } from "neverthrow";
import { Role } from "@prisma/prisma";
import { signInController } from "@src/user/controllers/auth.controller";
import { authService } from "@src/user/services/auth.service";
import { Request } from "express";
jest.mock("@src/user/services/auth.service");

const mockUser = {
  id: "userId",
  email: "test@example.com",
  role: Role.ADMIN,
  accessToken: "fake-jwt-token",
};

describe("signInController", () => {
  it("should respond 200 and return user on successful signIn", async () => {
    const req = {
      body: {
        email: "test@example.com",
        password: "password123",
      },
    } as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any;

    (authService.signIn as jest.Mock).mockReturnValue(okAsync(mockUser));

    await signInController(req, res);

    expect(authService.signIn).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Signed in successfully",
      user: mockUser,
    });
  });
});
