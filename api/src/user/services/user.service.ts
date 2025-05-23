import { ResultAsync, errAsync, okAsync } from "neverthrow";
import {
  createUser,
  deleteUser,
  getAllUsers,
  getUser,
  getUsersByCompanyId,
  updateUser,
} from "../repositories/user.repository";
import { ChainedError } from "@utils/chainedError";
import { CreateUserDto, UpdateUserDto } from "@src/schemas/userSchema";
import { hash } from "bcryptjs";
import { Prisma } from "../../../generated/prisma";

const isSameCompany = (
  currentUser: Express.UserObject,
  targetCompanyId: string | null | undefined,
) => currentUser.role === "ADMIN" || currentUser.companyId === targetCompanyId;

const scopedUserWhere = (
  currentUser: Express.UserObject,
  baseWhere: Prisma.UserWhereUniqueInput,
) => {
  if (currentUser.role === "ADMIN") {
    return baseWhere;
  }
  return { ...baseWhere, companyId: currentUser.companyId };
};

export const userService = {
  createUser: (currentUser: Express.UserObject, data: CreateUserDto) => {
    if (!isSameCompany(currentUser, data.companyId)) {
      return errAsync(
        new ChainedError("Cannot create user in another company"),
      );
    }

    return createUser({
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      role: data.role,
      company: { connect: { id: data.companyId } },
    });
  },

  updateUser: (
    currentUser: Express.UserObject,
    id: string,
    data: UpdateUserDto,
  ) => {
    return ResultAsync.fromPromise(
      getUser(scopedUserWhere(currentUser, { id })),
      (e) => new ChainedError(e),
    ).andThen((targetUser) => {
      if (!targetUser) {
        return errAsync(new ChainedError("User not found or access denied"));
      }

      const updateData = { ...data };

      if (data.password) {
        return ResultAsync.fromPromise(
          hash(data.password, 12),
          (e) => new ChainedError(e),
        ).andThen((hashedPassword) => {
          updateData.password = hashedPassword;
          return updateUser(id, updateData);
        });
      } else {
        return ResultAsync.fromPromise(
          updateUser(id, updateData),
          (e) => new ChainedError(e),
        );
      }
    });
  },

  deleteUser: (currentUser: Express.UserObject, id: string) => {
    return ResultAsync.fromPromise(
      getUser(scopedUserWhere(currentUser, { id })),
      (e) => new ChainedError(e),
    ).andThen((targetUser) => {
      if (!targetUser) {
        return errAsync(new ChainedError("User not found or access denied"));
      }
      return deleteUser(id);
    });
  },

  getUserById: (currentUser: Express.UserObject, id: string) => {
    return ResultAsync.fromPromise(
      getUser(scopedUserWhere(currentUser, { id })),
      (e) => new ChainedError(e),
    ).andThen((user) => {
      if (!user) {
        return errAsync(new ChainedError("User not found or access denied"));
      }
      return okAsync(user);
    });
  },

  getAllUsers: () => getAllUsers(),

  getAllUsersByCompany: (
    currentUser: Express.UserObject,
    companyId: string,
  ) => {
    if (!isSameCompany(currentUser, companyId)) {
      return errAsync(
        new ChainedError("Cannot access users from another company"),
      );
    }
    return getUsersByCompanyId(companyId);
  },
};
