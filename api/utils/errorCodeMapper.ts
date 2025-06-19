import { Prisma } from "@prisma/prisma";
import { FastifyReply } from "fastify";
import httpStatus from "http-status";

import { ChainedError } from "./chainedError";

export const prismaErrorCodeToHttpStatus = (error: unknown): number => {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case "P2002":
        return httpStatus.CONFLICT;
      case "P2003":
        return httpStatus.BAD_REQUEST;
      case "P2025":
        return httpStatus.NOT_FOUND;
      default:
        return httpStatus.BAD_REQUEST;
    }
  }
  return httpStatus.INTERNAL_SERVER_ERROR;
};

export function sendChainedErrorReply(
  reply: FastifyReply,
  error: ChainedError,
) {
  const statusCode = error.errorCode ?? httpStatus.INTERNAL_SERVER_ERROR;
  const message = error.message || "Internal Server Error";
  return reply.status(statusCode).send({ error: message });
}
