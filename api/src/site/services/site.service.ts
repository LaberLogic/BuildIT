import { CreateSiteDto, UpdateSiteUsersDto } from "@src/schemas/siteSchema";

export const createSite = (data: CreateSiteDto) => {};

export const updateSiteUsers = () => {};

export const deactivateSite = () => {};

export const getSitesByUser = () => {};

export const getSitesByCompany = () => {};

export const getSiteById = () => {};

const mapSiteUsersToConnectPayload = (
  data: CreateSiteDto | UpdateSiteUsersDto,
) => {};
