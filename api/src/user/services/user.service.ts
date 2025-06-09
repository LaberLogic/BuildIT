import { sendInvitationMail } from "@src/mail/mail.service";
import { ChainedError } from "@utils/chainedError";
import { hash } from "bcryptjs";
import { errAsync, okAsync, ResultAsync } from "neverthrow";
import { CreateUserDto, UpdateUserDto } from "shared";
import { UserObject } from "types";

import { Prisma } from "../../../generated/prisma";
import {
  createUser,
  deleteUser,
  getAllUsers,
  getUser,
  getUsersByCompanyId,
  updateUser,
} from "../repositories/user.repository";

const isSameCompany = (
  currentUser: UserObject,
  targetCompanyId: string | null | undefined,
) => currentUser.role === "ADMIN" || currentUser.companyId === targetCompanyId;

const scopedUserWhere = (
  currentUser: UserObject,
  baseWhere: Prisma.UserWhereUniqueInput,
) => {
  if (currentUser.role === "ADMIN") {
    return baseWhere;
  }
  return { ...baseWhere, companyId: currentUser.companyId };
};

export const userService = {
  createUser: (
    companyId: string,
    currentUser: UserObject,
    data: CreateUserDto,
  ) => {
    if (!isSameCompany(currentUser, companyId)) {
      return errAsync(
        new ChainedError("Cannot create user in another company", 403),
      );
    }
    return createUser({
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      role: data.role,
      status: "INACTIVE",
      company: { connect: { id: companyId } },
    }).andThen((result) => {
      sendInvitationMail(result).match(
        () => {
          console.log("Email sent successfully");
        },
        (err) => console.warn("Failed to send invitation email", err),
      );

      return okAsync(result);
    });
  },

  updateUser: (currentUser: UserObject, id: string, data: UpdateUserDto) => {
    return getUser(scopedUserWhere(currentUser, { id })).andThen(
      (targetUser) => {
        if (!targetUser) {
          return errAsync(
            new ChainedError("User not found or access denied", 404),
          );
        }

        const updateData = { ...data };

        if (data.password) {
          return ResultAsync.fromPromise(
            hash(data.password, 12),
            (e) => new ChainedError(e, 500),
          ).andThen((hashedPassword) => {
            updateData.password = hashedPassword;
            return ResultAsync.fromPromise(
              updateUser(id, updateData),
              (e) => new ChainedError(e, 500),
            );
          });
        } else {
          return updateUser(id, updateData);
        }
      },
    );
  },

  deleteUser: (currentUser: UserObject, id: string) => {
    return getUser(scopedUserWhere(currentUser, { id })).andThen(
      (targetUser) => {
        if (!targetUser) {
          return errAsync(
            new ChainedError("User not found or access denied", 404),
          );
        }

        return deleteUser(id);
      },
    );
  },

  getUserById: (currentUser: UserObject, id: string) => {
    return getUser(scopedUserWhere(currentUser, { id })).andThen((user) => {
      if (!user) {
        return errAsync(
          new ChainedError("User not found or access denied", 404),
        );
      }
      return okAsync(user);
    });
  },

  getAllUsers: () => getAllUsers(),

  getAllUsersByCompany: (currentUser: UserObject, companyId: string) => {
    if (!isSameCompany(currentUser, companyId)) {
      return errAsync(
        new ChainedError("Cannot access users from another company", 403),
      );
    }
    return getUsersByCompanyId(companyId);
  },
};
