import { Prisma } from "@prisma/prisma";
import { ChainedError } from "@utils/chainedError";
import { extendSiteWhere, scopeCheckCompany } from "@utils/scopeCheck";
import { ResultAsync } from "neverthrow";
import { CreateSiteDto, SiteResponseDto, UpdateSiteDto } from "shared";
import { UserObject } from "types";

import {
  createSite,
  deleteSiteAssignment,
  getSite,
  getSites,
  updateSite,
} from "../repositories/site.repository";
import { toSiteDTO } from "../site.dto";
export const createNewSite = (
  currentUser: UserObject,
  data: CreateSiteDto,
): ResultAsync<SiteResponseDto, ChainedError> => {
  return scopeCheckCompany(currentUser, currentUser.companyId)
    .andThen(() =>
      createSite(mapSiteCreatePayload(data, currentUser.companyId)),
    )
    .map((site) => toSiteDTO(site, currentUser));
};

export const updateSiteById = (
  currentUser: UserObject,
  id: string,
  data: UpdateSiteDto,
): ResultAsync<SiteResponseDto, ChainedError> => {
  return getSite({ id })
    .andThen((site) => {
      return scopeCheckCompany(currentUser, site.companyId).map(() => site);
    })
    .andThen((site) => {
      const existingUserIds = site.assignments.map((a) => a.user.id);
      const toRemove = existingUserIds.filter(
        (id) => !data.users?.includes(id),
      );

      return ResultAsync.combine(
        toRemove.map((userId) =>
          deleteSiteAssignment({
            userId_siteId: { userId, siteId: id },
          }),
        ),
      ).andThen(() =>
        updateSite({ id }, mapSiteUpdateUserPayload(data, existingUserIds)),
      );
    })
    .map((site) => toSiteDTO(site, currentUser));
};

export const getSitesByUserId = (
  id: string,
  currentUser: UserObject,
): ResultAsync<SiteResponseDto[], ChainedError> => {
  return getSites(
    extendSiteWhere({ assignments: { some: { id } } }, currentUser),
  ).map((sites) => sites.map((site) => toSiteDTO(site, currentUser)));
};

export const getSitesByCompanyId = (
  id: string,
  currentUser: UserObject,
): ResultAsync<SiteResponseDto[], ChainedError> => {
  return getSites(extendSiteWhere({ company: { id } }, currentUser)).map(
    (sites) => sites.map((site) => toSiteDTO(site, currentUser)),
  );
};

export const getSiteById = (
  id: string,
  currentUser: UserObject,
): ResultAsync<SiteResponseDto, ChainedError> => {
  return getSite(
    extendSiteWhere({ id }, currentUser) as Prisma.SiteWhereUniqueInput,
  ).map((site) => toSiteDTO(site, currentUser));
};

const mapSiteCreatePayload = (
  data: CreateSiteDto,
  companyId: string,
): Prisma.SiteCreateInput => {
  const { users, address, ...rest } = data;
  return {
    company: {
      connect: { id: companyId },
    },
    address: {
      create: address,
    },
    assignments: {
      createMany: {
        data: users.map((userId) => ({ userId })),
      },
    },
    ...rest,
  };
};

const mapSiteUpdateUserPayload = (
  data: UpdateSiteDto,
  existingUserIds: string[],
): Prisma.SiteUpdateInput => {
  const { users: userIds, address, ...rest } = data;

  const toAdd = userIds?.filter((id) => !existingUserIds.includes(id)) || [];
  console.log(rest);
  return {
    ...rest,
    address: address ? { update: address } : undefined,
    assignments: {
      create: toAdd.map((userId) => ({
        user: { connect: { id: userId } },
      })),
    },
  };
};
