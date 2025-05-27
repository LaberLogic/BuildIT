import { authService } from "@src/user/services/auth.service";
import jwt from "jsonwebtoken";
import { errAsync, okAsync } from "neverthrow";
import { ROLE } from "@prisma/prisma";
import { env } from "@env";
import {
  createUser,
  getUserUnsafe,
} from "@src/user/repositories/user.repository";
import { compare, hash } from "bcryptjs";
import { ChainedError } from "@utils/chainedError";
import { createCompany } from "@src/company/company.repository";

jest.mock("@src/user/repositories/user.repository");
jest.mock("@src/company/company.repository");
jest.mock("bcryptjs");
jest.mock("jsonwebtoken");

describe("Sign In tests", () => {
  const email = "user@example.com";
  const password = "securePassword";
  const hashedPassword = "hashedPassword";
  const user = {
    id: "userId",
    email,
    role: ROLE.MANAGER,
    password: hashedPassword,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("No related User", async () => {
    (getUserUnsafe as jest.Mock).mockReturnValue(okAsync(null));
    const error = new ChainedError("Cannot find related User");
    const result = await authService.signIn({ email, password });

    expect(result.isErr()).toBe(true);
    expect(result._unsafeUnwrapErr().message).toBe(error.message);
  });

  test("Unequal Passwords", async () => {
    (getUserUnsafe as jest.Mock).mockReturnValue(okAsync(user));
    (compare as jest.Mock).mockResolvedValue(false);
    const error = new ChainedError("Invalid Password");
    const result = await authService.signIn({ email, password });

    expect(compare).toHaveBeenCalledWith(password, hashedPassword);
    expect(result.isErr()).toBe(true);
    expect(result._unsafeUnwrapErr().message).toBe(error.message);
  });

  test("Compare Fails", async () => {
    const compareError = new ChainedError("bcrypt failure");

    (getUserUnsafe as jest.Mock).mockReturnValue(okAsync(user));
    (compare as jest.Mock).mockRejectedValue(compareError);

    const result = await authService.signIn({ email, password });

    expect(compare).toHaveBeenCalledWith(password, hashedPassword);
    expect(result.isErr()).toBe(true);
    expect(result._unsafeUnwrapErr().message).toBe(compareError.message);
  });

  test("Success Case token returned", async () => {
    (getUserUnsafe as jest.Mock).mockReturnValue(okAsync(user));
    (compare as jest.Mock).mockResolvedValue(true);
    (jwt.sign as jest.Mock).mockReturnValue("mock-jwt-token");

    const result = await authService.signIn({ email, password });

    expect(compare).toHaveBeenCalledWith(password, hashedPassword);
    expect(jwt.sign).toHaveBeenCalledWith(
      { id: user.id, role: user.role },
      env.JWT_SECRET,
      { expiresIn: 86400 },
    );
    const { password: _, ...userWithoutPassword } = user;
    expect(result.isOk()).toBe(true);
    expect(result._unsafeUnwrap()).toEqual({
      accessToken: "mock-jwt-token",
      user: userWithoutPassword,
    });
  });
});

describe("Sign Up tests", () => {
  const mockData = {
    email: "test@example.com",
    password: "secure123",
    firstName: "John",
    lastName: "Doe",
    companyName: "Acme Inc.",
    address: {
      streetNumber: "123",
      street: "Main St",
      city: "Metropolis",
      country: "USA",
      postalCode: "12345",
    },
  };

  const createdCompany = { id: "company-id" };
  const hashedPassword = "hashed-password";
  const createdUser = { id: "user-id", email: mockData.email };

  afterEach(() => {
    jest.clearAllMocks();
  });
  test("fails when createCompany fails", async () => {
    const error = new ChainedError("DB error in company");
    (createCompany as jest.Mock).mockReturnValue(errAsync(error));

    const result = await authService.register(mockData);

    expect(result.isErr()).toBe(true);
    expect(result._unsafeUnwrapErr().message).toBe(error.message);
    expect(createCompany).toHaveBeenCalledWith({
      name: mockData.companyName,
      address: mockData.address,
    });
  });

  test("fails when hash throws", async () => {
    const error = new ChainedError("Hash error");
    (createCompany as jest.Mock).mockReturnValue(okAsync(createdCompany));
    (hash as jest.Mock).mockRejectedValue(error);

    const result = await authService.register(mockData);

    expect(result.isErr()).toBe(true);
    expect(result._unsafeUnwrapErr().message).toBe(error.message);
    expect(hash).toHaveBeenCalledWith(mockData.password, 10);
  });

  test("fails when createUser fails", async () => {
    const error = new ChainedError("User creation failed");
    (createCompany as jest.Mock).mockReturnValue(okAsync(createdCompany));
    (hash as jest.Mock).mockResolvedValue(hashedPassword);
    (createUser as jest.Mock).mockReturnValue(errAsync(error));

    const result = await authService.register(mockData);

    expect(result.isErr()).toBe(true);
    expect(result._unsafeUnwrapErr().message).toBe(error.message);
    expect(createUser).toHaveBeenCalledWith({
      email: mockData.email,
      firstName: mockData.firstName,
      lastName: mockData.lastName,
      password: hashedPassword,
      company: { connect: { id: createdCompany.id } },
      role: "MANAGER",
    });
  });

  test("succeeds and returns user", async () => {
    (createCompany as jest.Mock).mockReturnValue(okAsync(createdCompany));
    (hash as jest.Mock).mockResolvedValue(hashedPassword);
    (createUser as jest.Mock).mockReturnValue(okAsync(createdUser));

    const result = await authService.register(mockData);

    expect(result.isOk()).toBe(true);
    expect(result._unsafeUnwrap()).toEqual(createdUser);
    expect(createUser).toHaveBeenCalledWith({
      email: mockData.email,
      firstName: mockData.firstName,
      lastName: mockData.lastName,
      password: hashedPassword,
      company: { connect: { id: createdCompany.id } },
      role: "MANAGER",
    });
  });
});
