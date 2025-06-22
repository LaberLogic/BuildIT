import { env } from "@env";
import { User } from "@prisma/prisma";
import { createCompany } from "@src/company/company.repository";
import { ChainedError } from "@utils/chainedError";
import { compare, hash } from "bcryptjs";
import jwt from "jsonwebtoken";
import { errAsync, okAsync, ResultAsync } from "neverthrow";
import { RegisterDto, SignInDto, UserResponseDto } from "shared";

import { toUserDTO } from "../dtos/user.dto";
import { createUser, getUserUnsafe } from "../repositories/user.repository";

/**
 * Service responsible for user authentication and registration.
 */
export const authService = {
  /**
   * Authenticates a user and returns a signed JWT token on success.
   *
   * @param data - Sign-in credentials (email and password).
   * @returns A ResultAsync containing a token and user info, or an error.
   */
  signIn: (
    data: SignInDto,
  ): ResultAsync<
    { accessToken: string; user: Omit<User, "password"> },
    ChainedError
  > => {
    return getUserUnsafe({ email: data.email }).andThen((user) => {
      if (!user)
        return errAsync(new ChainedError("Cannot find related User", 401));

      return ResultAsync.fromPromise(
        compare(data.password, user?.password ?? ""),
        (e) => new ChainedError(e),
      )
        .map((isMatch) => ({ user, isMatch }))
        .andThen(({ user, isMatch }) => {
          if (!isMatch) return errAsync(new ChainedError("Invalid Password"));

          const token = jwt.sign(
            { id: user.id, role: user.role, companyId: user.companyId },
            env.JWT_SECRET,
            { expiresIn: 86400 }, // 1 day
          );

          // Remove password before returning the user object
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { password, ...rest } = user;

          return okAsync({
            accessToken: token,
            user: rest,
          });
        });
    });
  },

  /**
   * Registers a new company and a new manager-level user.
   *
   * @param data - Registration info, including company name, address, and user info.
   * @returns A ResultAsync containing the created user or an error.
   */
  register: (data: RegisterDto): ResultAsync<UserResponseDto, ChainedError> => {
    const { companyName, address, ...rest } = data;

    return createCompany({
      name: companyName,
      address,
    })
      .andThen(({ id }) => {
        return ResultAsync.fromPromise(
          hash(data.password, 10),
          (e) => new ChainedError(e),
        ).andThen((hashedPassword) => {
          return createUser({
            ...rest,
            password: hashedPassword,
            company: { connect: { id } },
            role: "MANAGER",
          });
        });
      })
      .map((user) => toUserDTO(user));
  },
};
