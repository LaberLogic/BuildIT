import { Prisma } from "@prisma/prisma";
import { ChainedError } from "@utils/chainedError";
import { extendSiteWhere, scopeCheckCompany } from "@utils/scopeCheck";
import { ResultAsync } from "neverthrow";
import { CreateSiteDto, SiteResponseDto, UpdateSiteDto } from "shared";
import { UserObject } from "types";

import {
  createSite,
  getSite,
  getSites,
  updateSite,
} from "../repositories/site.repository";
import { toSiteDTO } from "../site.dto";
export const createNewSite = (
  currentUser: UserObject,
  data: CreateSiteDto,
): ResultAsync<SiteResponseDto, ChainedError> => {
  return scopeCheckCompany(currentUser, data.companyId)
    .andThen(() => createSite(mapSiteCreatePayload(data)))
    .map((site) => toSiteDTO(site, currentUser));
};

export const updateSiteById = (
  currentUser: UserObject,
  id: string,
  data: UpdateSiteDto,
): ResultAsync<SiteResponseDto, ChainedError> => {
  return getSite({ id }).andThen((site) =>
    scopeCheckCompany(currentUser, site.companyId)
      .andThen(() => updateSite({ id }, mapSiteUpdateUserPayload(id, data)))
      .map((site) => toSiteDTO(site, currentUser)),
  );
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

const mapSiteCreatePayload = (data: CreateSiteDto): Prisma.SiteCreateInput => {
  const { userIds, address, companyId, ...rest } = data;
  return {
    company: {
      connect: { id: companyId },
    },
    address: {
      create: address,
    },
    assignments: {
      createMany: {
        data: userIds.map((userId) => ({ userId })),
      },
    },
    ...rest,
  };
};

const mapSiteUpdateUserPayload = (
  id: string,
  data: UpdateSiteDto,
): Prisma.SiteUpdateInput => {
  const { userIds, address, ...rest } = data;
  return {
    ...rest,
    address: {
      update: address,
    },
    assignments: {
      set: userIds?.map((userId) => ({
        userId_siteId: {
          userId,
          siteId: id,
        },
      })),
    },
  };
};
