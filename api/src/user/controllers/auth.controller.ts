import { sendResetPasswordMail } from "@src/mail/mail.service";
import { ChainedError } from "@utils/chainedError";
import { sendChainedErrorReply } from "@utils/errorCodeMapper";
import { hash } from "bcryptjs";
import { FastifyReply, FastifyRequest } from "fastify";
import httpStatus from "http-status";
import { errAsync, okAsync, ResultAsync } from "neverthrow";
import {
  RegisterDto,
  SetPasswordDto,
  SetPasswordRequestDto,
  SignInDto,
} from "shared";

import { getUserUnsafe, updateUser } from "../repositories/user.repository";
import { authService } from "../services/auth.service";

export const registerController = async (
  req: FastifyRequest<{ Body: RegisterDto }>,
  reply: FastifyReply,
) => {
  return authService.register(req.body).match(
    (user) =>
      reply
        .status(httpStatus.CREATED)
        .send({ message: "User registered successfully", user }),
    (error) => sendChainedErrorReply(reply, error),
  );
};

export const signInController = async (
  req: FastifyRequest<{ Body: SignInDto }>,
  reply: FastifyReply,
) => {
  return authService.signIn(req.body).match(
    (userInfo) => reply.code(httpStatus.OK).send(userInfo),
    (error) => sendChainedErrorReply(reply, error),
  );
};

export const setPasswordController = async (
  req: FastifyRequest<{ Body: SetPasswordDto }>,
  reply: FastifyReply,
) => {
  return ResultAsync.fromPromise(
    hash(req.body.password, 10),
    (e) => new ChainedError(e),
  )
    .andThen((hashedPassword) => {
      return updateUser(req.user.id, {
        password: hashedPassword,
        status: "ACTIVE",
      });
    })
    .match(
      (userInfo) => reply.code(httpStatus.OK).send(userInfo),
      (error) => sendChainedErrorReply(reply, error),
    );
};

export const resetPasswordRequestController = async (
  req: FastifyRequest<{ Body: SetPasswordRequestDto }>,
  reply: FastifyReply,
) => {
  return getUserUnsafe({ email: req.body.email })
    .andThen((user) => {
      if (!user || user.status === "INACTIVE")
        return errAsync(new ChainedError("Something went wrong"));
      sendResetPasswordMail(user);
      return okAsync(true);
    })
    .match(
      (userInfo) => reply.code(httpStatus.OK).send(userInfo),
      (error) => sendChainedErrorReply(reply, error),
    );
};
