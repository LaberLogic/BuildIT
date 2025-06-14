import { Prisma, PrismaClient } from "@prisma/prisma";
import { ChainedError } from "@utils/chainedError";
import { errAsync, okAsync, ResultAsync } from "neverthrow";
import { UserObject } from "types";

const prismaClient = new PrismaClient();

export const scopeCheckCompany = (
  currentUser: UserObject,
  passedCompanyId: string,
): ResultAsync<void, ChainedError> => {
  if (currentUser.role === "ADMIN") {
    return okAsync(undefined);
  }
  console.log(currentUser);
  console.log(passedCompanyId);

  if (!currentUser.companyId || currentUser.companyId !== passedCompanyId) {
    return errAsync(new ChainedError("Unauthorized - Invalid company scope"));
  }

  return okAsync(undefined);
};

export const scopeCheckSiteAccess = (
  currentUser: UserObject,
  siteId: string,
  passedCompanyId: string,
  prisma: PrismaClient = prismaClient,
): ResultAsync<void, ChainedError> => {
  if (currentUser.role === "ADMIN") {
    return okAsync(undefined);
  }

  if (!currentUser.companyId || currentUser.companyId !== passedCompanyId) {
    return errAsync(
      new ChainedError("Unauthorized - Invalid company scope", 403),
    );
  }

  if (currentUser.role === "MANAGER") {
    return okAsync(undefined);
  }

  return ResultAsync.fromPromise(
    prisma.site.findFirst({
      where: {
        id: siteId,
        companyId: passedCompanyId,
        assignments: {
          some: {
            userId: currentUser.id,
          },
        },
      },
    }),
    () => new ChainedError("Failed to validate site access"),
  ).andThen((site) =>
    site
      ? okAsync(undefined)
      : errAsync(new ChainedError("Unauthorized - Not assigned to site")),
  );
};

export const extendSiteWhere = (
  where: Prisma.SiteWhereInput,
  user: UserObject,
): Prisma.SiteWhereInput => {
  if (user.role === "ADMIN" || user.role === "MANAGER") {
    return {
      ...where,
      companyId: user.companyId ?? undefined,
    };
  }

  return {
    ...where,
    companyId: user.companyId ?? undefined,
    assignments: {
      some: {
        userId: user.id,
      },
    },
  };
};
