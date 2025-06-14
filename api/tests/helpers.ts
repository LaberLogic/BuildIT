import { ROLE } from "@prisma/prisma";
import { User } from "@src/user/repositories/user.repository";
import { UserObject } from "types";

export const createMockUser = (
  overrides: Partial<UserObject> = {},
): UserObject => {
  return {
    id: "mock-id",
    role: "WORKER",
    companyId: "company-1",
    ...overrides,
  };
};

export const makeUser = (overrides: Partial<User> = {}): User => ({
  id: "user-id",
  email: "user@example.com",
  firstName: "First",
  lastName: "Last",
  role: ROLE.WORKER,
  status: "ACTIVE",
  companyId: "company-1",
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});
