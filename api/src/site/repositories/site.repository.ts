import { PrismaClient, Prisma } from "@prisma/prisma";
import { ChainedError } from "@utils/chainedError";
import { prismaErrorCodeToHttpStatus } from "@utils/errorCodeMapper";
import { ResultAsync } from "neverthrow";
const prisma = new PrismaClient();

export const createSite = (data: Prisma.SiteCreateInput) => {
  return ResultAsync.fromPromise(
    prisma.site.create({ data }),
    (e) => new ChainedError(e, prismaErrorCodeToHttpStatus(e)),
  );
};

export const updateSite = (
  where: Prisma.SiteWhereUniqueInput,
  data: Prisma.SiteUpdateInput,
) => {
  return ResultAsync.fromPromise(
    prisma.site.update({ where, data }),
    (e) => new ChainedError(e, prismaErrorCodeToHttpStatus(e)),
  );
};
