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

/**
 * Controller for registering a new user and company.
 *
 * @param req - Fastify request containing registration body.
 * @param reply - Fastify reply instance.
 */
export const registerController = async (
  req: FastifyRequest<{ Body: RegisterDto }>,
  reply: FastifyReply,
): Promise<void> => {
  return authService.register(req.body).match(
    (user) =>
      reply
        .status(httpStatus.CREATED)
        .send({ message: "User registered successfully", user }),
    (error) => sendChainedErrorReply(reply, error),
  );
};

/**
 * Controller for user login.
 *
 * @param req - Fastify request containing sign-in body.
 * @param reply - Fastify reply instance.
 */
export const signInController = async (
  req: FastifyRequest<{ Body: SignInDto }>,
  reply: FastifyReply,
): Promise<void> => {
  return authService.signIn(req.body).match(
    (userInfo) => reply.code(httpStatus.OK).send(userInfo),
    (error) => sendChainedErrorReply(reply, error),
  );
};

/**
 * Controller for setting a new password (activation).
 *
 * @param req - Fastify request with password body and authenticated user in context.
 * @param reply - Fastify reply instance.
 */
export const setPasswordController = async (
  req: FastifyRequest<{ Body: SetPasswordDto }>,
  reply: FastifyReply,
): Promise<void> => {
  return ResultAsync.fromPromise(
    hash(req.body.password, 10),
    (e) => new ChainedError(e),
  )
    .andThen((hashedPassword) =>
      updateUser(req.user.id, {
        password: hashedPassword,
        status: "ACTIVE",
      }),
    )
    .match(
      (userInfo) => reply.code(httpStatus.OK).send(userInfo),
      (error) => sendChainedErrorReply(reply, error),
    );
};

/**
 * Controller to request a password reset via email.
 *
 * @param req - Fastify request containing user email.
 * @param reply - Fastify reply instance.
 */
export const resetPasswordRequestController = async (
  req: FastifyRequest<{ Body: SetPasswordRequestDto }>,
  reply: FastifyReply,
): Promise<void> => {
  return getUserUnsafe({ email: req.body.email })
    .andThen((user) => {
      if (!user || user.status === "INACTIVE") {
        return errAsync(new ChainedError("Something went wrong", 404));
      }

      // Fire and forget - log result
      sendResetPasswordMail(user).match(
        () => console.log("Email sent successfully"),
        (err) => console.warn("Failed to send reset email", err),
      );

      return okAsync(true);
    })
    .match(
      () => reply.code(httpStatus.OK).send({ message: "Reset email sent" }),
      (error) => sendChainedErrorReply(reply, error),
    );
};
