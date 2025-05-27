import { PrismaClient, Prisma } from "@prisma/prisma";
import { SiteResponseDto } from "shared";
import { ChainedError } from "@utils/chainedError";
import { prismaErrorCodeToHttpStatus } from "@utils/errorCodeMapper";
import { ResultAsync } from "neverthrow";
const prisma = new PrismaClient();

const siteSelect = {
  id: true,
  name: true,
  address: {
    select: {
      streetNumber: true,
      street: true,
      city: true,
      country: true,
      postalCode: true,
    },
  },
  companyId: true,
  startDate: true,
  endDate: true,
  notes: true,
  assignments: {
    select: {
      userId: true,
      firstName: true,
      lastName: true,
    },
  },
};

export const createSite = (
  data: Prisma.SiteCreateInput,
): ResultAsync<SiteResponseDto, ChainedError> => {
  return ResultAsync.fromPromise(
    prisma.site.create({ data, select: siteSelect }),
    (e) => new ChainedError(e, prismaErrorCodeToHttpStatus(e)),
  );
};

export const updateSite = (
  where: Prisma.SiteWhereUniqueInput,
  data: Prisma.SiteUpdateInput,
) => {
  return ResultAsync.fromPromise(
    prisma.site.update({ where, data, select: siteSelect }),
    (e) => new ChainedError(e, prismaErrorCodeToHttpStatus(e)),
  );
};

export const getSites = (
  where: Prisma.SiteWhereInput,
): ResultAsync<SiteResponseDto[], ChainedError> => {
  return ResultAsync.fromPromise(
    prisma.site.findMany({ where, select: siteSelect }),
    (e) => new ChainedError(e, prismaErrorCodeToHttpStatus(e)),
  );
};

export const getSite = (
  where: Prisma.SiteWhereUniqueInput,
): ResultAsync<SiteResponseDto, ChainedError> => {
  return ResultAsync.fromPromise(
    prisma.site.findUniqueOrThrow({ where, select: siteSelect }),
    (e) => new ChainedError(e, prismaErrorCodeToHttpStatus(e)),
  );
};
