import { Prisma, PrismaClient } from "@prisma/prisma";
import { ChainedError } from "@utils/chainedError";
import { prismaErrorCodeToHttpStatus } from "@utils/errorCodeMapper";
import { ResultAsync } from "neverthrow";

const prisma = new PrismaClient();

const safeUserSelect = {
  id: true,
  email: true,
  firstName: true,
  lastName: true,
  role: true,
  companyId: true,
  createdAt: true,
  updatedAt: true,
};

export const createUser = (data: Prisma.UserCreateInput) => {
  return ResultAsync.fromPromise(
    prisma.user.create({
      data,
      select: safeUserSelect,
    }),
    (e) => new ChainedError(e, prismaErrorCodeToHttpStatus(e)),
  );
};

export const getUser = (where: Prisma.UserWhereUniqueInput) => {
  return ResultAsync.fromPromise(
    prisma.user.findUnique({
      where,
      select: safeUserSelect,
    }),
    (e) => new ChainedError(e, prismaErrorCodeToHttpStatus(e)),
  );
};

export const getUserUnsafe = (where: Prisma.UserWhereUniqueInput) => {
  return ResultAsync.fromPromise(
    prisma.user.findUnique({
      where,
    }),
    (e) => new ChainedError(e, prismaErrorCodeToHttpStatus(e)),
  );
};

export const getAllUsers = () => {
  return ResultAsync.fromPromise(
    prisma.user.findMany({
      select: safeUserSelect,
    }),
    (e) => new ChainedError(e, prismaErrorCodeToHttpStatus(e)),
  );
};

export const updateUser = (id: string, data: Prisma.UserUpdateInput) => {
  return ResultAsync.fromPromise(
    prisma.user.update({
      where: { id },
      data,
      select: safeUserSelect,
    }),
    (e) => new ChainedError(e, prismaErrorCodeToHttpStatus(e)),
  );
};

export const deleteUser = (id: string) => {
  return ResultAsync.fromPromise(
    prisma.user.delete({
      where: { id },
      select: { id: true },
    }),
    (e) => new ChainedError(e, prismaErrorCodeToHttpStatus(e)),
  );
};

export const getUsersByCompanyId = (companyId: string) => {
  return ResultAsync.fromPromise(
    prisma.user.findMany({
      where: { companyId },
      select: safeUserSelect,
    }),
    (e) => new ChainedError(e, prismaErrorCodeToHttpStatus(e)),
  );
};
