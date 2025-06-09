import { Prisma, PrismaClient } from "@prisma/prisma";
import { ChainedError } from "@utils/chainedError";
import { prismaErrorCodeToHttpStatus } from "@utils/errorCodeMapper";
import { ResultAsync } from "neverthrow";
import { MaterialResponseDto } from "shared";

const prisma = new PrismaClient();

const materialSelect = {
  id: true,
  name: true,
  unit: true,
  amount: true,
  threshold: true,
};

export const createMaterial = (
  data: Prisma.MaterialCreateInput,
): ResultAsync<MaterialResponseDto, ChainedError> => {
  return ResultAsync.fromPromise(
    prisma.material.create({ data, select: materialSelect }),
    (e) => new ChainedError(e, prismaErrorCodeToHttpStatus(e)),
  );
};

export const updateMaterial = (
  where: Prisma.MaterialWhereUniqueInput,
  data: Prisma.MaterialUpdateInput,
): ResultAsync<MaterialResponseDto, ChainedError> => {
  return ResultAsync.fromPromise(
    prisma.material.update({ where, data, select: materialSelect }),
    (e) => new ChainedError(e, prismaErrorCodeToHttpStatus(e)),
  );
};

export const deleteMaterial = (
  where: Prisma.MaterialWhereUniqueInput,
): ResultAsync<{ id: string }, ChainedError> => {
  return ResultAsync.fromPromise(
    prisma.material.delete({ where }),
    (e) => new ChainedError(e, prismaErrorCodeToHttpStatus(e)),
  );
};

export const getMaterialById = (
  where: Prisma.MaterialWhereUniqueInput,
): ResultAsync<MaterialResponseDto, ChainedError> => {
  return ResultAsync.fromPromise(
    prisma.material.findUniqueOrThrow({ where, select: materialSelect }),
    (e) => new ChainedError(e, prismaErrorCodeToHttpStatus(e)),
  );
};
