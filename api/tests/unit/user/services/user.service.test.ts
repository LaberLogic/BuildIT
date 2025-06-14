import { ROLE } from "@prisma/prisma";
import { sendInvitationMail } from "@src/mail/mail.service";
import {
  createUser,
  deleteUser,
  getUser,
  getUsers,
  updateUser,
} from "@src/user/repositories/user.repository";
import { userService } from "@src/user/services/user.service";
import { createMockUser, makeUser } from "@tests/helpers";
import { ChainedError } from "@utils/chainedError";
import { hash } from "bcryptjs";
import { errAsync, okAsync } from "neverthrow";

jest.mock("bcryptjs");
jest.mock("@src/user/repositories/user.repository");
jest.mock("@src/company/company.repository");
jest.mock("@src/mail/mail.service", () => ({
  sendInvitationMail: jest.fn(() => okAsync(undefined)),
}));

const mockUser = createMockUser();
const mockAdmin = createMockUser({
  id: "admin-1",
  role: ROLE.ADMIN,
  companyId: undefined,
}); // admin

const returnedUser = makeUser({ id: "w1" });

describe("userService.createUser", () => {
  describe("Business Logic", () => {
    it("sends invitation email on success", async () => {
      const fakeUser = makeUser({ id: "u1" });

      (createUser as jest.MockedFunction<typeof createUser>).mockReturnValue(
        okAsync(fakeUser),
      );

      const result = await userService.createUser("company-1", mockUser, {
        email: "test@test.com",
        firstName: "First",
        lastName: "Last",
        role: ROLE.WORKER,
      });

      expect(result.isOk()).toBe(true);
      expect(sendInvitationMail).toHaveBeenCalledWith(fakeUser);
    });
  });

  describe("Error Scenarios", () => {
    it("fails if user tries to create in another company", async () => {
      const result = await userService.createUser("another-company", mockUser, {
        email: "x@test.com",
        firstName: "X",
        lastName: "Y",
        role: ROLE.WORKER,
      });

      expect(result.isErr()).toBe(true);
      expect(result._unsafeUnwrapErr()).toBeInstanceOf(ChainedError);
    });

    it("fails if createUser repo throws", async () => {
      (createUser as jest.MockedFunction<typeof createUser>).mockReturnValue(
        errAsync(new ChainedError("Create failed")),
      );

      const result = await userService.createUser("company-1", mockUser, {
        email: "test@test.com",
        firstName: "Test",
        lastName: "User",
        role: ROLE.WORKER,
      });

      expect(result.isErr()).toBe(true);
    });
  });
});

describe("userService.updateUser", () => {
  describe("Business Logic", () => {
    it("updates user successfully without password", async () => {
      (getUser as jest.MockedFunction<typeof getUser>).mockReturnValue(
        okAsync(returnedUser),
      );
      (updateUser as jest.MockedFunction<typeof updateUser>).mockReturnValue(
        okAsync(returnedUser),
      );

      const result = await userService.updateUser(
        mockUser,
        "1",
        { firstName: "Updated" },
        "company-1",
      );

      expect(result.isOk()).toBe(true);
    });

    it("hashes password before update", async () => {
      (getUser as jest.MockedFunction<typeof getUser>).mockReturnValue(
        okAsync(returnedUser),
      );
      (hash as jest.Mock).mockResolvedValue("hashed");
      (updateUser as jest.MockedFunction<typeof updateUser>).mockReturnValue(
        okAsync(returnedUser),
      );

      const result = await userService.updateUser(
        mockUser,
        "1",
        { password: "secret" },
        "company-1",
      );

      expect(hash).toHaveBeenCalledWith("secret", 12);
      expect(result.isOk()).toBe(true);
    });
  });

  describe("Error Scenarios", () => {
    it("returns 404 if user not found", async () => {
      (getUser as jest.MockedFunction<typeof getUser>).mockReturnValue(
        okAsync(null),
      );

      const result = await userService.updateUser(
        mockUser,
        "1",
        { firstName: "Test" },
        "company-1",
      );

      expect(result.isErr()).toBe(true);
    });

    it("bubbles update repo failure", async () => {
      (getUser as jest.MockedFunction<typeof getUser>).mockReturnValue(
        okAsync(returnedUser),
      );
      (updateUser as jest.MockedFunction<typeof updateUser>).mockReturnValue(
        errAsync(new ChainedError("DB failure")),
      );

      const result = await userService.updateUser(
        mockUser,
        "1",
        { firstName: "Test" },
        "company-1",
      );

      expect(result.isErr()).toBe(true);
    });
  });
});

describe("userService.deleteUser", () => {
  describe("Business Logic", () => {
    it("deletes user successfully", async () => {
      (deleteUser as jest.MockedFunction<typeof deleteUser>).mockReturnValue(
        okAsync({ id: "mock-id" }),
      );

      const result = await userService.deleteUser(mockUser, "1", "company-1");

      expect(result.isOk()).toBe(true);
    });
  });

  describe("Error Scenarios", () => {
    it("bubbles delete repo failure", async () => {
      (deleteUser as jest.MockedFunction<typeof deleteUser>).mockReturnValue(
        errAsync(new ChainedError("Delete failed")),
      );

      const result = await userService.deleteUser(mockUser, "1", "company-1");

      expect(result.isErr()).toBe(true);
    });
  });
});

describe("userService.getUserById", () => {
  describe("Business Logic", () => {
    it("returns user for regular user", async () => {
      (getUser as jest.MockedFunction<typeof getUser>).mockReturnValue(
        okAsync(returnedUser),
      );

      const result = await userService.getUserById(mockUser, "1");

      expect(result.isOk()).toBe(true);
    });

    it("returns user for admin, no company scope", async () => {
      (getUser as jest.MockedFunction<typeof getUser>).mockReturnValue(
        okAsync(returnedUser),
      );

      const result = await userService.getUserById(mockAdmin, "1");

      expect(result.isOk()).toBe(true);
    });
  });

  describe("Error Scenarios", () => {
    it("returns 404 if user not found", async () => {
      (getUser as jest.MockedFunction<typeof getUser>).mockReturnValue(
        okAsync(null),
      );

      const result = await userService.getUserById(mockUser, "1");

      expect(result.isErr()).toBe(true);
    });

    it("bubbles repo error", async () => {
      (getUser as jest.MockedFunction<typeof getUser>).mockReturnValue(
        errAsync(new ChainedError("DB error")),
      );

      const result = await userService.getUserById(mockUser, "1");

      expect(result.isErr()).toBe(true);
    });
  });
});

describe("userService.getAllUsersByCompany", () => {
  describe("Business Logic", () => {
    it("returns users for same company", async () => {
      (getUsers as jest.MockedFunction<typeof getUsers>).mockReturnValue(
        okAsync([returnedUser]),
      );

      const result = await userService.getAllUsersByCompany(
        mockUser,
        "company-1",
      );

      expect(result.isOk()).toBe(true);
    });
  });

  describe("Error Scenarios", () => {
    it("rejects access to other company", async () => {
      const result = await userService.getAllUsersByCompany(
        mockUser,
        "other-co",
      );

      expect(result.isErr()).toBe(true);
    });

    it("bubbles repo error", async () => {
      (getUsers as jest.MockedFunction<typeof getUsers>).mockReturnValue(
        errAsync(new ChainedError("DB error")),
      );

      const result = await userService.getAllUsersByCompany(
        mockUser,
        "company-1",
      );

      expect(result.isErr()).toBe(true);
    });
  });
});
