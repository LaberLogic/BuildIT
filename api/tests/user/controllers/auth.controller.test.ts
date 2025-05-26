/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  registerController,
  signInController,
} from "@src/user/controllers/auth.controller";
import { authService } from "@src/user/services/auth.service";
import { okAsync, errAsync } from "neverthrow";
import { ROLE } from "@prisma/prisma";
import httpStatus from "http-status";

jest.mock("@src/user/services/auth.service");

const mockUser = {
  id: "userId",
  email: "test@example.com",
  companyId: "companyId",
  role: ROLE.ADMIN,
  accessToken: "fake-jwt-token",
};

describe("signInController", () => {
  let req: any;
  let reply: any;

  beforeEach(() => {
    req = {
      body: {
        email: "test@example.com",
        password: "password123",
      },
    };

    reply = {
      code: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should respond with 200 and return user on success", async () => {
    (authService.signIn as jest.Mock).mockReturnValue(okAsync(mockUser));

    await signInController(req, reply);

    expect(authService.signIn).toHaveBeenCalledWith(req.body);
    expect(reply.code).toHaveBeenCalledWith(httpStatus.OK);
    expect(reply.send).toHaveBeenCalledWith({
      message: "Signed in successfully",
      user: mockUser,
    });
  });

  it("should respond with 401 on failed sign in", async () => {
    const error = new Error("Invalid credentials");
    (authService.signIn as jest.Mock).mockReturnValue(errAsync(error));

    await signInController(req, reply);

    expect(authService.signIn).toHaveBeenCalledWith(req.body);
    expect(reply.status).toHaveBeenCalledWith(httpStatus.UNAUTHORIZED);
    expect(reply.send).toHaveBeenCalledWith({
      error: "Invalid credentials",
    });
  });
});

const mockUserCreate = {
  id: "userId",
  email: "newuser@example.com",
  companyId: "companyId",
  role: ROLE.MANAGER,
  accessToken: "new-jwt-token",
};

describe("registerController", () => {
  let req: any;
  let reply: any;

  beforeEach(() => {
    req = {
      body: {
        email: "newuser@example.com",
        password: "securepassword",
        companyId: "companyId",
        role: ROLE.MANAGER,
      },
    };

    reply = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should respond with 201 and return user on successful registration", async () => {
    (authService.register as jest.Mock).mockReturnValue(
      okAsync(mockUserCreate),
    );

    await registerController(req, reply);

    expect(authService.register).toHaveBeenCalledWith(req.body);
    expect(reply.status).toHaveBeenCalledWith(httpStatus.CREATED);
    expect(reply.send).toHaveBeenCalledWith({
      message: "User registered successfully",
      user: mockUserCreate,
    });
  });

  it("should respond with 500 on registration error", async () => {
    const error = new Error("Database connection failed");
    (authService.register as jest.Mock).mockReturnValue(errAsync(error));

    await registerController(req, reply);

    expect(authService.register).toHaveBeenCalledWith(req.body);
    expect(reply.status).toHaveBeenCalledWith(httpStatus.INTERNAL_SERVER_ERROR);
    expect(reply.send).toHaveBeenCalledWith({
      error: "Database connection failed",
    });
  });
});
