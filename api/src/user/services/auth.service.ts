import { errAsync, okAsync, ResultAsync } from "neverthrow";
import { compare, hash } from "bcryptjs";
import jwt from "jsonwebtoken";
import { ChainedError } from "@utils/chainedError";
import { env } from "@env";
import { createUser, getUserUnsafe } from "../repositories/user.repository";
import { RegisterDto, SignInDto } from "shared";
import { createCompany } from "@src/company/company.repository";

export const authService = {
  signIn: (data: SignInDto) => {
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
            {
              expiresIn: 86400,
            },
          );
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { password, updatedAt, ...rest } = user;
          return okAsync({
            accessToken: token,
            user: rest,
          });
        });
    });
  },

  register: (data: RegisterDto) => {
    const { companyName, address, ...rest } = data;
    return createCompany({
      name: companyName,
      address,
    }).andThen(({ id }) => {
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
    });
  },
};
