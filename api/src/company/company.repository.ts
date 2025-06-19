import { Prisma, PrismaClient } from "@prisma/prisma";
import { ChainedError } from "@utils/chainedError";
import { prismaErrorCodeToHttpStatus } from "@utils/errorCodeMapper";
import { ResultAsync } from "neverthrow";
const prisma = new PrismaClient();

export type Company = Prisma.CompanyGetPayload<{
  select: typeof companySelect;
}>;

const companySelect = {
  id: true,
  createdAt: true,
  updatedAt: true,
  name: true,
  address: {
    include: {},
  },
  sites: {
    include: {},
  },
  users: {
    select: {
      id: true,
    },
  },
};

export const createCompany = (data: {
  name: string;
  address: Prisma.AddressCreateWithoutCompanyInput;
}) => {
  return ResultAsync.fromPromise(
    prisma.company.create({
      data: {
        name: data.name,
        address: {
          create: data.address,
        },
      },
      select: companySelect,
    }),
    (e) => new ChainedError(e),
  );
};

export const getCompanies = (where?: Prisma.CompanyWhereInput) => {
  return ResultAsync.fromPromise(
    prisma.company.findMany({
      where,
      select: companySelect,
    }),
    (e) => new ChainedError(e, prismaErrorCodeToHttpStatus(e)),
  );
};

export const getCompany = (where: Prisma.CompanyWhereUniqueInput) => {
  return ResultAsync.fromPromise(
    prisma.company.findUniqueOrThrow({
      where,
      select: companySelect,
    }),
    (e) => new ChainedError(e, prismaErrorCodeToHttpStatus(e)),
  );
};
