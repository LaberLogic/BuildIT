import { Prisma } from "@prisma/prisma";
import { ChainedError } from "@utils/chainedError";
import {
  prismaErrorCodeToHttpStatus,
  sendChainedErrorReply,
} from "@utils/errorCodeMapper";
import { FastifyReply } from "fastify";
import httpStatus from "http-status";

describe("prismaErrorCodeToHttpStatus", () => {
  it("should return 409 for Prisma error code P2002", () => {
    const error = new Prisma.PrismaClientKnownRequestError(
      "Unique constraint failed",
      { code: "P2002", clientVersion: "some_client_version" },
    );
    expect(prismaErrorCodeToHttpStatus(error)).toBe(409);
  });

  it("should return 400 for Prisma error code P2003", () => {
    const error = new Prisma.PrismaClientKnownRequestError(
      "Foreign key constraint failed",
      { code: "P2003", clientVersion: "some_client_version" },
    );
    expect(prismaErrorCodeToHttpStatus(error)).toBe(400);
  });

  it("should return 404 for Prisma error code P2025", () => {
    const error = new Prisma.PrismaClientKnownRequestError("Record not found", {
      code: "P2025",
      clientVersion: "some_client_version",
    });
    expect(prismaErrorCodeToHttpStatus(error)).toBe(404);
  });

  it("should return 400 for unknown Prisma error codes", () => {
    const error = new Prisma.PrismaClientKnownRequestError("Unknown error", {
      code: "P9999",
      clientVersion: "some_client_version",
    });
    expect(prismaErrorCodeToHttpStatus(error)).toBe(400);
  });

  it("should return 500 for non-Prisma errors", () => {
    expect(prismaErrorCodeToHttpStatus(new Error("random error"))).toBe(500);
    expect(prismaErrorCodeToHttpStatus(null)).toBe(500);
    expect(prismaErrorCodeToHttpStatus(undefined)).toBe(500);
  });
});

describe("sendChainedErrorReply", () => {
  let reply: Partial<FastifyReply>;

  beforeEach(() => {
    reply = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
      log: {
        error: jest.fn(),
        child: jest.fn(),
        fatal: jest.fn(),
        debug: jest.fn(),
        info: jest.fn(),
        warn: jest.fn(),
        trace: jest.fn(),
        level: "",
        silent: jest.fn(),
      },
    };
  });

  it("should send the error message with the errorCode status", () => {
    const error = new ChainedError("Test error", 418);
    sendChainedErrorReply(reply as FastifyReply, error);

    expect(reply.status).toHaveBeenCalledWith(418);
    expect(reply.send).toHaveBeenCalledWith({ error: error.message });
  });

  it("should default to 500 if errorCode is not set", () => {
    const error = new ChainedError("No code error");
    delete error.errorCode;
    sendChainedErrorReply(reply as FastifyReply, error);

    expect(reply.status).toHaveBeenCalledWith(httpStatus.INTERNAL_SERVER_ERROR);
    expect(reply.send).toHaveBeenCalledWith({ error: error.message });
  });
});
