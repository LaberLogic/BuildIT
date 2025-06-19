import { Prisma, SITE_STATUS } from "@prisma/prisma";
import { ChainedError } from "@utils/chainedError";
import {
  extendSiteWhere,
  scopeCheckCompany,
  scopeCheckSiteAccess,
} from "@utils/scopeCheck";
import { ResultAsync } from "neverthrow";
import { CreateSiteDto, SiteResponseDto, UpdateSiteDto } from "shared";
import { UserObject } from "types";

import { toSiteDTO } from "../dtos/site.dto";
import {
  createSite,
  deleteSiteAssignment,
  getSite,
  getSites,
  updateSite,
} from "../repositories/site.repository";

export const createNewSite = (
  currentUser: UserObject,
  data: CreateSiteDto,
  companyId: string,
): ResultAsync<SiteResponseDto, ChainedError> => {
  return scopeCheckCompany(currentUser, companyId)
    .andThen(() => createSite(mapSiteCreatePayload(data, companyId)))
    .map((site) => toSiteDTO(site, currentUser));
};

export const updateSiteById = (
  currentUser: UserObject,
  siteId: string,
  data: UpdateSiteDto,
  companyId: string,
): ResultAsync<SiteResponseDto, ChainedError> => {
  return scopeCheckSiteAccess(currentUser, siteId, companyId)
    .andThen(() => getSite({ id: siteId }))
    .andThen((site) => {
      const existingUserIds = site.assignments.map((a) => a.user.id);
      const toRemove = existingUserIds.filter(
        (id) => !data.users?.includes(id),
      );

      return ResultAsync.combine(
        toRemove.map((userId) =>
          deleteSiteAssignment({
            userId_siteId: { userId, siteId },
          }),
        ),
      ).andThen(() =>
        updateSite(
          { id: siteId },
          mapSiteUpdateUserPayload(data, existingUserIds),
        ),
      );
    })
    .map((site) => toSiteDTO(site, currentUser));
};

export const getSitesByUserId = (
  userId: string,
  currentUser: UserObject,
): ResultAsync<SiteResponseDto[], ChainedError> => {
  return getSites(
    extendSiteWhere(
      { assignments: { some: { user: { id: userId } } } },
      currentUser,
    ),
  ).map((sites) => sites.map((site) => toSiteDTO(site, currentUser)));
};

export const getSitesByCompanyId = (
  companyId: string,
  currentUser: UserObject,
): ResultAsync<SiteResponseDto[], ChainedError> => {
  return scopeCheckCompany(currentUser, companyId).andThen(() =>
    getSites(extendSiteWhere({ companyId }, currentUser)).map((sites) =>
      sites.map((site) => toSiteDTO(site, currentUser)),
    ),
  );
};

export const getSiteById = (
  siteId: string,
  currentUser: UserObject,
  companyId: string,
): ResultAsync<SiteResponseDto, ChainedError> => {
  return scopeCheckCompany(currentUser, companyId).andThen(() =>
    getSite(
      extendSiteWhere(
        { id: siteId },
        currentUser,
      ) as Prisma.SiteWhereUniqueInput,
    ).map((site) => toSiteDTO(site, currentUser)),
  );
};

const mapSiteCreatePayload = (
  data: CreateSiteDto,
  companyId: string,
): Prisma.SiteCreateInput => {
  const { users, address, startDate, endDate, ...rest } = data;
  return {
    company: { connect: { id: companyId } },
    address: { create: address },
    assignments: {
      createMany: {
        data: users.map((userId) => ({ userId })),
      },
    },
    startDate: new Date(startDate),
    endDate: new Date(endDate),
    ...rest,
  };
};

const mapSiteUpdateUserPayload = (
  data: UpdateSiteDto,
  existingUserIds: string[],
): Prisma.SiteUpdateInput => {
  const { users: userIds, address, status, startDate, endDate, ...rest } = data;
  const toAdd = userIds?.filter((id) => !existingUserIds.includes(id)) || [];

  return {
    ...rest,
    status: status as SITE_STATUS,
    address: address ? { update: address } : undefined,
    assignments: {
      create: toAdd.map((userId) => ({
        user: { connect: { id: userId } },
      })),
    },
    ...(startDate && { startDate: new Date(startDate) }),
    ...(endDate && { endDate: new Date(endDate) }),
  };
};
