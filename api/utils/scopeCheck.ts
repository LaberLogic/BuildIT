import { Prisma, PrismaClient } from "@prisma/prisma";
import { ChainedError } from "@utils/chainedError";
import { errAsync, okAsync,ResultAsync } from "neverthrow";
import { UserObject } from "types";

const prisma = new PrismaClient();

export const scopeCheckCompany = (
  currentUser: UserObject,
  companyId: string,
): ResultAsync<void, ChainedError> => {
  if (currentUser.companyId !== companyId) {
    return errAsync(new ChainedError("Unauthorized"));
  }
  return okAsync(undefined);
};

export const scopeCheckMaterial = (currentUser: UserObject, siteId: string) => {
  return ResultAsync.fromPromise(
    prisma.site.findFirst({
      where: {
        id: siteId,
        assignments: {
          some: {
            user: {
              id: currentUser.id,
            },
          },
        },
      },
    }),
    () => new ChainedError("Failed to check material scope"),
  );
};

export const scopeCheckSite = (currentUser: UserObject, siteId: string) => {
  return ResultAsync.fromPromise(
    prisma.site.findFirst({
      where: {
        id: siteId,
        company: {
          id: currentUser.companyId as string,
        },
      },
    }),
    () => new ChainedError("Failed to check material scope"),
  );
};

export const extendSiteWhere = (
  where: Prisma.SiteWhereUniqueInput | Prisma.SiteWhereInput,
  user: UserObject,
) => {
  if (user.role === "ADMIN") return where;

  return {
    ...where,
    company: {
      id: user.companyId as string,
    },
  };
};
