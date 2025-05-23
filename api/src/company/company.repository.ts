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
