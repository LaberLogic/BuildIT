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
/**
 * Creates a new site for a given company after scope validation.
 *
 * @param currentUser - The user performing the operation.
 * @param data - Site creation data.
 * @param companyId - The ID of the company to associate the site with.
 * @returns A ResultAsync containing the created SiteResponseDto or a ChainedError.
 */
export const createNewSite = (
  currentUser: UserObject,
  data: CreateSiteDto,
  companyId: string,
): ResultAsync<SiteResponseDto, ChainedError> => {
  return scopeCheckCompany(currentUser, companyId)
    .andThen(() => createSite(mapSiteCreatePayload(data, companyId)))
    .map((site) => toSiteDTO(site, currentUser));
};

/**
 * Updates an existing site by ID after verifying access and updating user assignments.
 *
 * @param currentUser - The user performing the operation.
 * @param siteId - The ID of the site to update.
 * @param data - Updated site data.
 * @param companyId - The ID of the company the site belongs to.
 * @returns A ResultAsync containing the updated SiteResponseDto or a ChainedError.
 */
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

/**
 * Retrieves all sites assigned to a specific user with proper access filtering.
 *
 * @param userId - ID of the user whose sites are to be retrieved.
 * @param currentUser - The user performing the operation.
 * @returns A ResultAsync of an array of SiteResponseDto or a ChainedError.
 */
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

/**
 * Retrieves all sites under a specific company after access validation.
 *
 * @param companyId - The ID of the company whose sites are to be retrieved.
 * @param currentUser - The user performing the operation.
 * @returns A ResultAsync of an array of SiteResponseDto or a ChainedError.
 */
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

/**
 * Retrieves a single site by ID and company scope, validating access first.
 *
 * @param siteId - The ID of the site to retrieve.
 * @param currentUser - The user performing the operation.
 * @param companyId - The ID of the company the site belongs to.
 * @returns A ResultAsync containing the SiteResponseDto or a ChainedError.
 */
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

/**
 * Maps CreateSiteDto and companyId into a Prisma.SiteCreateInput format.
 *
 * @param data - The site creation data.
 * @param companyId - The ID of the company to associate.
 * @returns A Prisma-compatible site creation payload.
 */
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

/**
 * Maps UpdateSiteDto and existing user IDs into a Prisma.SiteUpdateInput format.
 *
 * @param data - The updated site data.
 * @param existingUserIds - The IDs of users already assigned to the site.
 * @returns A Prisma-compatible site update payload.
 */
const mapSiteUpdateUserPayload = (
  data: UpdateSiteDto,
  existingUserIds: string[],
): Prisma.SiteUpdateInput => {
  const { users: userIds, address, status, startDate, endDate, ...rest } = data;
  const toAdd = userIds?.filter((id) => !existingUserIds.includes(id)) ?? [];

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
