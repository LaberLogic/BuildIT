import { Prisma } from "@prisma/prisma";
import { CreateSiteDto, SiteResponseDto, UpdateSiteDto } from "shared";
import { ChainedError } from "@utils/chainedError";
import { UserObject } from "types";
import {
  createSite,
  getSite,
  getSites,
  updateSite,
} from "../repositories/site.repository";
import { extendSiteWhere, scopeCheckSite } from "@src/scopeCheck";
import { ResultAsync } from "neverthrow";
export const createNewSite = (
  currentUser: UserObject,
  data: CreateSiteDto,
): ResultAsync<SiteResponseDto, ChainedError> => {
  return scopeCheckSite(currentUser, data.companyId).andThen(() =>
    createSite(mapSiteCreatePayload(data)),
  );
};

export const updateSiteById = (
  currentUser: UserObject,
  id: string,
  data: UpdateSiteDto,
): ResultAsync<SiteResponseDto, ChainedError> => {
  return getSite({ id }).andThen((site) =>
    scopeCheckSite(currentUser, site.companyId).andThen(() =>
      updateSite({ id }, mapSiteUpdateUserPayload(id, data)),
    ),
  );
};

export const getSitesByUserId = (
  id: string,
  currentUser: UserObject,
): ResultAsync<SiteResponseDto[], ChainedError> => {
  return getSites(
    extendSiteWhere({ assignments: { some: { id } } }, currentUser),
  );
};

export const getSitesByCompanyId = (
  id: string,
  currentUser: UserObject,
): ResultAsync<SiteResponseDto[], ChainedError> => {
  return getSites(extendSiteWhere({ company: { id } }, currentUser));
};

export const getSiteById = (
  id: string,
  currentUser: UserObject,
): ResultAsync<SiteResponseDto, ChainedError> => {
  return getSite(
    extendSiteWhere({ id }, currentUser) as Prisma.SiteWhereUniqueInput,
  );
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
