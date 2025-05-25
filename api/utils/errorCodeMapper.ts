import { Prisma } from "@prisma/prisma";
import { FastifyReply } from "fastify";
import { ChainedError } from "./chainedError";
import httpStatus from "http-status";
export const prismaErrorCodeToHttpStatus = (error: unknown): number => {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case "P2002":
        return 409;
      case "P2003":
        return 400;
      case "P2025":
        return 404;
      default:
        return 400;
    }
  }
  return 500;
};

export function sendChainedErrorReply(
  reply: FastifyReply,
  error: ChainedError,
) {
  const statusCode = error.errorCode ?? httpStatus.INTERNAL_SERVER_ERROR;
  const message = error.message || "Internal Server Error";
  return reply.status(statusCode).send({ error: message });
}
