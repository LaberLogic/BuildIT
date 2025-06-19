import { Prisma } from "@prisma/client";
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

export const mapErrorToPublicMessage = (error: ChainedError): string => {
  if (error.cause instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.cause.code) {
      case "P2002":
        return "Resource already exists.";
      case "P2003":
        return "Invalid foreign key reference.";
      case "P2025":
        return "Resource not found.";
      default:
        return "A database error occurred.";
    }
  }

  if (error.name === "UnauthorizedError") {
    return "Unauthorized access.";
  }

  if (error.name === "ValidationError") {
    return "Invalid input.";
  }

  return "Internal Server Error";
};

export const formatChainedError = (error: ChainedError) => {
  return {
    errorCode: error.errorCode ?? 500,
    summary: error.getMessageStack.at(-1) ?? "Unknown error",
    messageStack: error.getMessageStack,
    stack: error.stack,
    cause: formatCause(error.cause),
  };
};

const formatCause = (cause: unknown) => {
  if (!cause || typeof cause !== "object") return cause;

  if (cause instanceof Error) {
    return {
      type: cause.name,
      message: cause.message,
      stack: cause.stack,
    };
  }

  return cause;
};

export const sendChainedErrorReply = (
  reply: FastifyReply,
  error: ChainedError,
): FastifyReply => {
  const statusCode = error.errorCode ?? httpStatus.INTERNAL_SERVER_ERROR;
  const message = mapErrorToPublicMessage(error);

  reply.log.error({
    err: formatChainedError(error),
    msg: "Request failed with chained error",
  });

  return reply.status(statusCode).send({ error: message });
};
