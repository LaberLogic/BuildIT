import { ROLE } from "@prisma/prisma";
import {
  createUser,
  deleteUser,
  getUser,
  getUsersByCompanyId,
  updateUser,
} from "@src/user/repositories/user.repository";
import { userService } from "@src/user/services/user.service";
import { ChainedError } from "@utils/chainedError";
import { hash } from "bcryptjs";
import { okAsync, errAsync } from "neverthrow";

jest.mock("bcryptjs");
jest.mock("@src/user/repositories/user.repository");
jest.mock("@src/company/company.repository");

const mockUser = {
  id: "1",
  role: ROLE.WORKER,
  companyId: "company-1",
};

const mockAdmin = {
  id: "admin-1",
  role: ROLE.ADMIN,
  companyId: "admin-company",
};

describe("userService.createUser", () => {
  it("should succeed when user is in same company", async () => {
    (createUser as jest.Mock).mockReturnValue(okAsync({ id: "u1" }));

    const result = await userService.createUser(mockUser, {
      email: "test@test.com",
      firstName: "First",
      lastName: "Last",
      role: ROLE.WORKER,
      companyId: "company-1",
    });

    expect(result.isOk()).toBe(true);
  });

  it("should fail if user tries to create in another company", async () => {
    const result = await userService.createUser(mockUser, {
      email: "x@test.com",
      firstName: "X",
      lastName: "Y",
      role: ROLE.WORKER,
      companyId: "another-company",
    });

    expect(result.isErr()).toBe(true);
    expect(result._unsafeUnwrapErr()).toBeInstanceOf(ChainedError);
    expect(result._unsafeUnwrapErr().message).toMatch(/another company/);
  });

  it("should fail if createUser repository throws", async () => {
    (createUser as jest.Mock).mockReturnValue(
      errAsync(new ChainedError("Create failed")),
    );

    const result = await userService.createUser(mockUser, {
      email: "test@test.com",
      firstName: "Test",
      lastName: "User",
      role: ROLE.WORKER,
      companyId: "company-1",
    });

    expect(result.isErr()).toBe(true);
    expect(result._unsafeUnwrapErr().message).toMatch(/Create failed/);
  });
});

describe("userService.updateUser", () => {
  it("should update user successfully without password", async () => {
    (getUser as jest.Mock).mockReturnValue(okAsync(mockUser));
    (updateUser as jest.Mock).mockReturnValue(okAsync(mockUser));

    const result = await userService.updateUser(mockUser, "1", {
      firstName: "Updated",
    });

    expect(result.isOk()).toBe(true);
  });

  it("should update user with hashed password", async () => {
    (getUser as jest.Mock).mockReturnValue(okAsync(mockUser));
    (hash as jest.Mock).mockResolvedValue("hashed");
    (updateUser as jest.Mock).mockReturnValue(okAsync(mockUser));

    const result = await userService.updateUser(mockUser, "1", {
      password: "secret",
    });

    expect(hash).toHaveBeenCalledWith("secret", 12);
    expect(result.isOk()).toBe(true);
  });

  it("should fail if user not found", async () => {
    (getUser as jest.Mock).mockReturnValue(okAsync(null));

    const result = await userService.updateUser(mockUser, "VAR", {
      firstName: "Name",
    });

    expect(result.isErr()).toBe(true);
    expect(result._unsafeUnwrapErr().message).toMatch(/not found/);
  });

  it("should fail if update throws", async () => {
    (getUser as jest.Mock).mockReturnValue(okAsync(mockUser));
    (updateUser as jest.Mock).mockReturnValue(
      errAsync(new ChainedError("DB failure")),
    );

    const result = await userService.updateUser(mockUser, "1", {
      firstName: "Name",
    });

    expect(result.isErr()).toBe(true);
    expect(result._unsafeUnwrapErr().message).toMatch(/DB failure/);
  });
});

describe("userService.deleteUser", () => {
  it("should delete user successfully", async () => {
    (getUser as jest.Mock).mockReturnValue(okAsync(mockUser));
    (deleteUser as jest.Mock).mockReturnValue(okAsync(undefined));

    const result = await userService.deleteUser(mockUser, "1");

    expect(result.isOk()).toBe(true);
  });

  it("should fail if user not found", async () => {
    (getUser as jest.Mock).mockReturnValue(okAsync(null));

    const result = await userService.deleteUser(mockUser, "1");

    expect(result.isErr()).toBe(true);
    expect(result._unsafeUnwrapErr().message).toMatch(/not found/);
  });

  it("should fail if deleteUser throws", async () => {
    (getUser as jest.Mock).mockReturnValue(okAsync(mockUser));
    (deleteUser as jest.Mock).mockReturnValue(
      errAsync(new ChainedError("Delete failed")),
    );

    const result = await userService.deleteUser(mockUser, "1");
    expect(result.isErr()).toBe(true);
    expect(result._unsafeUnwrapErr().message).toMatch(/Delete failed/);
  });
});

describe("userService.getUserById", () => {
  it("should return user successfully", async () => {
    (getUser as jest.Mock).mockReturnValue(okAsync(mockUser));

    const result = await userService.getUserById(mockUser, "1");

    expect(result.isOk()).toBe(true);
    expect(result._unsafeUnwrap()).toEqual(mockUser);
  });

  it("should return user successfully no scope check if admin", async () => {
    (getUser as jest.Mock).mockReturnValue(okAsync(mockAdmin));

    const result = await userService.getUserById(mockAdmin, "1");

    expect(result.isOk()).toBe(true);
    expect(result._unsafeUnwrap()).toEqual(mockAdmin);
  });

  it("should return error if user not found", async () => {
    (getUser as jest.Mock).mockReturnValue(okAsync(null));

    const result = await userService.getUserById(mockUser, "1");

    expect(result.isErr()).toBe(true);
    expect(result._unsafeUnwrapErr().message).toMatch(/not found/);
  });

  it("should fail if getUser throws", async () => {
    (getUser as jest.Mock).mockReturnValue(
      errAsync(new ChainedError("DB error")),
    );

    const result = await userService.getUserById(mockUser, "1");

    expect(result.isErr()).toBe(true);
    expect(result._unsafeUnwrapErr().message).toMatch(/DB error/);
  });
});

describe("userService.getAllUsersByCompany", () => {
  it("should return users for same company", async () => {
    (getUsersByCompanyId as jest.Mock).mockReturnValue(okAsync([mockUser]));

    const result = await userService.getAllUsersByCompany(
      mockUser,
      "company-1",
    );

    expect(result.isOk()).toBe(true);
  });

  it("should fail if accessing another company", async () => {
    const result = await userService.getAllUsersByCompany(mockUser, "other-co");

    expect(result.isErr()).toBe(true);
    expect(result._unsafeUnwrapErr().message).toMatch(/another company/);
  });

  it("should fail if getUsersByCompanyId throws", async () => {
    (getUsersByCompanyId as jest.Mock).mockReturnValue(
      errAsync(new ChainedError("DB error")),
    );

    const result = await userService.getAllUsersByCompany(
      mockUser,
      "company-1",
    );

    expect(result.isErr()).toBe(true);
    expect(result._unsafeUnwrapErr().message).toMatch(/DB error/);
  });
});
