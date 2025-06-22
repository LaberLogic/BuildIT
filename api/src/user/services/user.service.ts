import { Prisma } from "@prisma/prisma";
import { sendInvitationMail } from "@src/mail/mail.service";
import { ChainedError } from "@utils/chainedError";
import { scopeCheckCompany } from "@utils/scopeCheck";
import { hash } from "bcryptjs";
import { errAsync, okAsync, ResultAsync } from "neverthrow";
import { CreateUserDto, UpdateUserDto, UserResponseDto } from "shared";
import { UserObject } from "types";

import { toUserDTO } from "../dtos/user.dto";
import {
  createUser,
  deleteUser,
  getUser,
  getUsers,
  updateUser,
} from "../repositories/user.repository";

/**
 * Applies scoping logic to restrict user queries based on current user's role and company.
 *
 * @param currentUser - The currently authenticated user.
 * @param baseWhere - Base Prisma filter input for user lookup.
 * @returns A scoped Prisma filter input.
 */
const scopedUserWhere = (
  currentUser: UserObject,
  baseWhere: Prisma.UserWhereUniqueInput,
): Prisma.UserWhereUniqueInput => {
  if (currentUser.role === "ADMIN") {
    return baseWhere;
  }
  return { ...baseWhere, companyId: currentUser.companyId };
};

/**
 * Service layer for user operations, with access control and DTO mapping.
 */
export const userService = {
  /**
   * Creates a new user and sends them an invitation email.
   *
   * @param companyId - ID of the company the user will belong to.
   * @param currentUser - Authenticated user performing the action.
   * @param data - User creation data.
   * @returns A ResultAsync resolving to the created user DTO or a ChainedError.
   */
  createUser: (
    companyId: string,
    currentUser: UserObject,
    data: CreateUserDto,
  ): ResultAsync<UserResponseDto, ChainedError> => {
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
            () => console.log("Email sent successfully"),
            (err) => console.warn("Failed to send invitation email", err),
          );
          return okAsync(user);
        })
        .map((user) => toUserDTO(user));
    });
  },

  /**
   * Updates a user’s information, optionally hashing their new password.
   *
   * @param currentUser - Authenticated user performing the update.
   * @param id - ID of the user to update.
   * @param data - New user data.
   * @param companyId - ID of the company the user belongs to.
   * @returns A ResultAsync with the updated user DTO or a ChainedError.
   */
  updateUser: (
    currentUser: UserObject,
    id: string,
    data: UpdateUserDto,
    companyId: string,
  ): ResultAsync<UserResponseDto, ChainedError> => {
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

  /**
   * Deletes a user by ID after verifying access scope.
   *
   * @param currentUser - Authenticated user performing the action.
   * @param id - ID of the user to delete.
   * @param companyId - Company ID the user should belong to.
   * @returns A ResultAsync returning id when deletion is complete.
   */
  deleteUser: (
    currentUser: UserObject,
    id: string,
    companyId: string,
  ): ResultAsync<{ id: string }, ChainedError> => {
    return scopeCheckCompany(currentUser, companyId).andThen(() => {
      return deleteUser(id);
    });
  },

  /**
   * Retrieves a single user by ID, applying access scoping.
   *
   * @param currentUser - Authenticated user requesting the data.
   * @param id - ID of the user to retrieve.
   * @returns A ResultAsync resolving to the user DTO or an error if not found.
   */
  getUserById: (
    currentUser: UserObject,
    id: string,
  ): ResultAsync<UserResponseDto, ChainedError> => {
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

  /**
   * Retrieves all users associated with a specific company.
   *
   * @param currentUser - The user performing the request.
   * @param companyId - Company ID to filter users by.
   * @returns A ResultAsync resolving to a list of user DTOs.
   */
  getAllUsersByCompany: (
    currentUser: UserObject,
    companyId: string,
  ): ResultAsync<UserResponseDto[], ChainedError> => {
    return scopeCheckCompany(currentUser, companyId).andThen(() => {
      return getUsers({ companyId }).map((users) =>
        users.map((user) => toUserDTO(user)),
      );
    });
  },
};
