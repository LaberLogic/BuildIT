import { Prisma } from "@prisma/prisma";
import { sendInvitationMail } from "@src/mail/mail.service";
import { ChainedError } from "@utils/chainedError";
import { scopeCheckCompany } from "@utils/scopeCheck";
import { hash } from "bcryptjs";
import { errAsync, okAsync, ResultAsync } from "neverthrow";
import { CreateUserDto, UpdateUserDto } from "shared";
import { UserObject } from "types";

import { toUserDTO } from "../dtos/user.dto";
import {
  createUser,
  deleteUser,
  getUser,
  getUsers,
  updateUser,
} from "../repositories/user.repository";

const scopedUserWhere = (
  currentUser: UserObject,
  baseWhere: Prisma.UserWhereUniqueInput,
): Prisma.UserWhereUniqueInput => {
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
    return scopeCheckCompany(currentUser, companyId).andThen(() => {
      return createUser({
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role,
        status: "INACTIVE",
        company: { connect: { id: companyId } },
      })
        .andThen((user) => {
          sendInvitationMail(user).match(
            () => {
              console.log("Email sent successfully");
            },
            (err) => console.warn("Failed to send invitation email", err),
          );

          return okAsync(user);
        })
        .map((user) => toUserDTO(user));
    });
  },

  updateUser: (
    currentUser: UserObject,
    id: string,
    data: UpdateUserDto,
    companyId: string,
  ) => {
    console.log("REACHED");
    return scopeCheckCompany(currentUser, companyId).andThen(() => {
      return getUser(scopedUserWhere(currentUser, { id }))
        .andThen((targetUser) => {
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
              return updateUser(id, updateData);
            });
          } else {
            return updateUser(id, updateData);
          }
        })
        .map((user) => toUserDTO(user));
    });
  },

  deleteUser: (currentUser: UserObject, id: string, companyId: string) => {
    return scopeCheckCompany(currentUser, companyId).andThen(() => {
      return deleteUser(id);
    });
  },

  getUserById: (currentUser: UserObject, id: string) => {
    return getUser(scopedUserWhere(currentUser, { id }))
      .andThen((user) => {
        if (!user) {
          return errAsync(
            new ChainedError("User not found or not part of your company", 404),
          );
        }
        return okAsync(user);
      })
      .map((user) => toUserDTO(user));
  },

  getAllUsers: () => getUsers(),

  getAllUsersByCompany: (currentUser: UserObject, companyId: string) => {
    return scopeCheckCompany(currentUser, companyId).andThen(() => {
      return getUsers({ companyId }).map((users) =>
        users.map((user) => toUserDTO(user)),
      );
    });
  },
};
