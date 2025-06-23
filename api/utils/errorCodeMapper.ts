import { Prisma } from "@prisma/prisma";
import { FastifyReply } from "fastify";
import httpStatus from "http-status";

import { ChainedError } from "./chainedError";

/**
 * Maps a Prisma error code to an HTTP status code.
 *
 * @param {error} error - error with code from prisma
 * @returns {number} an error code number
 */
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

/**
 * Sends an error response with status code and message from ChainedError,
 * and logs the error using Fastify's logger.
 *
 * @param {FastifyReply} reply - Fastify reply object to send response.
 * @param {ChainedError} error - Error object containing message and status code.
 * @returns {FastifyReply} The reply object.
 */
export const sendChainedErrorReply = (
  reply: FastifyReply,
  error: ChainedError,
): FastifyReply => {
  const statusCode = error.errorCode ?? httpStatus.INTERNAL_SERVER_ERROR;
  const message = error.message || "Internal Server Error";

  reply.log.error({ err: error }, `Error response with status ${statusCode}`);

  return reply.status(statusCode).send({ error: message });
};
