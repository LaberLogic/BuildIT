import { UserResponseDto } from "shared";

import { User } from "../repositories/user.repository";

export const toUserDTO = (user: User): UserResponseDto => ({
  id: user.id,
  email: user.email,
  firstName: user.firstName,
  lastName: user.lastName,
  role: user.role,
  createdAt: user.createdAt.toISOString(),
  updatedAt: user.updatedAt.toISOString(),
  status: user.status,
  companyId: user.companyId,
});
