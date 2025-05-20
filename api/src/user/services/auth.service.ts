import { errAsync, okAsync, ResultAsync } from "neverthrow";
import { compare, hash } from "bcryptjs";
import jwt from "jsonwebtoken";
import { ChainedError } from "@utils/chainedError";
import { env } from "@env";
import { createUser, getUser } from "../repositories/user.repository";

export const authService = {
  signIn: (data: { email: string; password: string }) =>
    ResultAsync.fromPromise(
      getUser({ email: data.email }),
      (e) => new ChainedError(e),
    ).andThen((user) => {
      if (!user) return errAsync(new ChainedError("Cannot find related User"));

      return ResultAsync.fromPromise(
        compare(data.password, user.password),
        (e) => new ChainedError(e),
      )
        .map((isMatch) => ({ user, isMatch }))
        .andThen(({ user, isMatch }) => {
          if (!isMatch) return errAsync(new ChainedError("Invalid Password"));

          const token = jwt.sign({ id: user.id }, env.JWT_SECRET, {
            expiresIn: 86400,
          });

          return okAsync({
            id: user.id,
            email: user.email,
            role: user.role,
            accessToken: token,
          });
        });
    }),

  register: (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) => {
    console.log(data);
    return ResultAsync.fromPromise(
      hash(data.password, 10),
      (e) => new ChainedError(e),
    ).andThen((hashedPassword) => {
      return createUser({
        email: data.email,
        password: hashedPassword,
        firstName: data.firstName,
        lastName: data.lastName,
      });
    });
  },
};
