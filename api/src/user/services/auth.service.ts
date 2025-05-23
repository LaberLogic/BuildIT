import { errAsync, okAsync, ResultAsync } from "neverthrow";
import { compare, hash } from "bcryptjs";
import jwt from "jsonwebtoken";
import { ChainedError } from "@utils/chainedError";
import { env } from "@env";
import { createUser, getUserUnsafe } from "../repositories/user.repository";
import { RegisterDto, SignInDto } from "@src/schemas/authSchema";

export const authService = {
  signIn: (data: SignInDto) => {
    return getUserUnsafe({ email: data.email }).andThen((user) => {
      if (!user) return errAsync(new ChainedError("Cannot find related User"));

      return ResultAsync.fromPromise(
        compare(data.password, user?.password || ""),
        (e) => new ChainedError(e),
      )
        .map((isMatch) => ({ user, isMatch }))
        .andThen(({ user, isMatch }) => {
          if (!isMatch) return errAsync(new ChainedError("Invalid Password"));

          const token = jwt.sign(
            { id: user.id, role: user.role },
            env.JWT_SECRET,
            {
              expiresIn: 86400,
            },
          );

          return okAsync({
            accessToken: token,
          });
        });
    });
  },

  register: (data: RegisterDto) => {
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
