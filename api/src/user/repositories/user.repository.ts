import { Prisma, PrismaClient } from "@prisma/prisma";
import { ChainedError } from "@utils/chainedError";
import { ResultAsync } from "neverthrow";
const prisma = new PrismaClient();

export const createUser = (
  data: Prisma.UserCreateInput,
): ResultAsync<unknown, Error> => {
  return ResultAsync.fromPromise(
    prisma.user.create({ data }),
    (e) => new ChainedError(e),
  );
};

export const getUser = async (where: Prisma.UserWhereUniqueInput) => {
  return prisma.user.findUnique({ where });
};

export const updateUser = async (id: string, data: Prisma.UserUpdateInput) => {
  return prisma.user.update({
    where: { id },
    data,
  });
};

export const deleteUser = async (id: string) => {
  return prisma.user.delete({ where: { id } });
};
