import { FastifyRequest, FastifyReply } from "fastify";
import httpStatus from "http-status";
import { authService } from "../services/auth.service";
import { RegisterDto, SignInDto } from "shared";
import { sendChainedErrorReply } from "@utils/errorCodeMapper";

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
