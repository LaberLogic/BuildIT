import { Prisma, PrismaClient } from "@prisma/prisma";
import { ChainedError } from "@utils/chainedError";
import { prismaErrorCodeToHttpStatus } from "@utils/errorCodeMapper";
import { ResultAsync } from "neverthrow";
const prisma = new PrismaClient();

const siteSelect = {
  id: true,
  name: true,
  priority: true,
  status: true,

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
      lastVisited: true,
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },
    },
  },
  material: {
    select: {
      id: true,
      name: true,
      unit: true,
      amount: true,
      threshold: true,
    },
  },
};

export const createSite = (data: Prisma.SiteCreateInput) => {
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

export const getSites = (where: Prisma.SiteWhereInput) => {
  return ResultAsync.fromPromise(
    prisma.site.findMany({
      where,
      select: siteSelect,
    }),
    (e) => new ChainedError(e, prismaErrorCodeToHttpStatus(e)),
  );
};

export const getSite = (where: Prisma.SiteWhereUniqueInput) => {
  return ResultAsync.fromPromise(
    prisma.site.findUniqueOrThrow({ where, select: siteSelect }),
    (e) => new ChainedError(e, prismaErrorCodeToHttpStatus(e)),
  );
};

export const deleteSiteAssignment = (
  where: Prisma.SiteAssignmentWhereUniqueInput,
) => {
  return ResultAsync.fromPromise(
    prisma.siteAssignment.delete({ where }),
    (e) => new ChainedError(e, prismaErrorCodeToHttpStatus(e)),
  );
};
