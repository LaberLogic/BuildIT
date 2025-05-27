import { FastifyRequest, FastifyReply } from "fastify";
import httpStatus from "http-status";
import { authService } from "../services/auth.service";
import { RegisterDto, SignInDto } from "shared";

export const registerController = async (
  req: FastifyRequest<{ Body: RegisterDto }>,
  reply: FastifyReply,
) => {
  return authService.register(req.body).match(
    (user) =>
      reply
        .status(httpStatus.CREATED)
        .send({ message: "User registered successfully", user }),
    (error) =>
      reply
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .send({ error: error.message }),
  );
};

export const signInController = async (
  req: FastifyRequest<{ Body: SignInDto }>,
  reply: FastifyReply,
) => {
  return authService.signIn(req.body).match(
    (user) =>
      reply
        .code(httpStatus.OK)
        .send({ message: "Signed in successfully", user }),
    (error) =>
      reply.status(httpStatus.UNAUTHORIZED).send({ error: error.message }),
  );
};
