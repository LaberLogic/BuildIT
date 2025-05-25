import { Prisma } from "@prisma/prisma";
import { ChainedError } from "@utils/chainedError";
import { ResultAsync, errAsync, okAsync } from "neverthrow";
import { UserObject } from "types";

export const scopeCheckSite = (
  currentUser: UserObject,
  companyId: string,
): ResultAsync<true, ChainedError> => {
  if (currentUser.companyId !== companyId) {
    return errAsync(new ChainedError("Unauthorized", 403));
  }
  return okAsync(true);
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
