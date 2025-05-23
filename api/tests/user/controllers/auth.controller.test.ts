import {
  registerController,
  signInController,
} from "@src/user/controllers/auth.controller";
import { authService } from "@src/user/services/auth.service";
import { Request, Response } from "express";
import { okAsync, errAsync } from "neverthrow";
import { Role } from "@prisma/prisma";
import httpStatus from "http-status";

jest.mock("@src/user/services/auth.service");

const mockUser = {
  id: "userId",
  email: "test@example.com",
  companyId: "companyId",
  role: Role.ADMIN,
  accessToken: "fake-jwt-token",
};

describe("signInController", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    req = {
      body: {
        email: "test@example.com",
        password: "password123",
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should respond with 200 and return user on success", async () => {
    (authService.signIn as jest.Mock).mockReturnValue(okAsync(mockUser));

    await signInController(req as Request, res as Response);

    expect(authService.signIn).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(httpStatus.OK);
    expect(res.json).toHaveBeenCalledWith({
      message: "Signed in successfully",
      user: mockUser,
    });
  });

  it("should respond with 401 on failed sign in", async () => {
    const error = new Error("Invalid credentials");
    (authService.signIn as jest.Mock).mockReturnValue(errAsync(error));

    await signInController(req as Request, res as Response);

    expect(authService.signIn).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(httpStatus.UNAUTHORIZED);
    expect(res.json).toHaveBeenCalledWith({
      error: "Invalid credentials",
    });
  });
});

const mockUserCreate = {
  id: "userId",
  email: "newuser@example.com",
  companyId: "companyId",
  role: Role.MANAGER,
  accessToken: "new-jwt-token",
};

describe("registerController", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    req = {
      body: {
        email: "newuser@example.com",
        password: "securepassword",
        companyId: "companyId",
        role: Role.MANAGER,
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should respond with 201 and return user on successful registration", async () => {
    (authService.register as jest.Mock).mockReturnValue(
      okAsync(mockUserCreate),
    );

    await registerController(req as Request, res as Response);

    expect(authService.register).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(httpStatus.CREATED);
    expect(res.json).toHaveBeenCalledWith({
      message: "User registered successfully",
      user: mockUserCreate,
    });
  });

  it("should respond with 500 on registration error", async () => {
    const error = new Error("Database connection failed");
    (authService.register as jest.Mock).mockReturnValue(errAsync(error));

    await registerController(req as Request, res as Response);

    expect(authService.register).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(httpStatus.INTERNAL_SERVER_ERROR);
    expect(res.json).toHaveBeenCalledWith({
      error: "Database connection failed",
    });
  });
});
