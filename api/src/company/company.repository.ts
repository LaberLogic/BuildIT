import { Prisma, PrismaClient } from "@prisma/prisma";
import { ChainedError } from "@utils/chainedError";
import { ResultAsync } from "neverthrow";
const prisma = new PrismaClient();

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
      select: { id: true },
    }),
    (e) => new ChainedError(e),
  );
};

export const getCompanies = (where?: Prisma.CompanyWhereInput) => {
  return ResultAsync.fromPromise(
    prisma.company.findMany({
      where,
      select: {
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
      },
    }),
    (e) => new ChainedError(e),
  );
};

export const getCompany = (where: Prisma.CompanyWhereUniqueInput) => {
  return ResultAsync.fromPromise(
    prisma.company.findUnique({
      where,
      select: {
        name: true,
        id: true,
        createdAt: true,
        updatedAt: true,
        address: {
          select: {
            streetNumber: true,
            street: true,
            city: true,
            country: true,
            postalCode: true,
          },
        },
      },
    }),
    (e) => new ChainedError(e),
  );
};
