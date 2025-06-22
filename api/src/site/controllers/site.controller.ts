import { sendChainedErrorReply } from "@utils/errorCodeMapper";
import { FastifyReply, FastifyRequest } from "fastify";
import httpStatus from "http-status";
import {
  CompanyIdParams,
  CreateSiteDto,
  SiteIdParams,
  UpdateSiteDto,
  UserIdParams,
} from "shared";

import {
  createNewSite,
  getSiteById,
  getSitesByCompanyId,
  getSitesByUserId,
  updateSiteById,
} from "../services/site.service";

/**
 * Controller to create a new site under a specific company.
 *
 * @param {FastifyRequest<{ Body: CreateSiteDto; Params: CompanyIdParams }>} req - Request containing site data and company ID.
 * @param {FastifyReply} reply - Fastify reply object.
 * @returns {Promise<void>} Sends the created site or an error.
 */
export const createSiteController = async (
  req: FastifyRequest<{ Body: CreateSiteDto; Params: CompanyIdParams }>,
  reply: FastifyReply,
): Promise<void> => {
  const data = req.body;
  const companyId = req.params.companyId;
  const currentUser = req.user;

  return createNewSite(currentUser, data, companyId).match(
    (site) => reply.status(httpStatus.CREATED).send(site),
    (error) => sendChainedErrorReply(reply, error),
  );
};

/**
 * Controller to update an existing site by ID.
 *
 * @param {FastifyRequest<{ Params: SiteIdParams; Body: UpdateSiteDto }>} req - Request containing site ID, company ID, and update data.
 * @param {FastifyReply} reply - Fastify reply object.
 * @returns {Promise<void>} Sends the updated site or an error.
 */
export const updateSiteController = async (
  req: FastifyRequest<{ Params: SiteIdParams; Body: UpdateSiteDto }>,
  reply: FastifyReply,
): Promise<void> => {
  const { siteId, companyId } = req.params;
  const data = req.body;
  const currentUser = req.user;

  return updateSiteById(currentUser, siteId, data, companyId).match(
    (site) => reply.status(httpStatus.OK).send(site),
    (error) => sendChainedErrorReply(reply, error),
  );
};

/**
 * Controller to get all sites associated with a specific user ID.
 *
 * @param {FastifyRequest<{ Params: UserIdParams }>} req - Request containing the user ID.
 * @param {FastifyReply} reply - Fastify reply object.
 * @returns {Promise<void>} Sends a list of sites or an error.
 */
export const getSitesByUserIdController = async (
  req: FastifyRequest<{ Params: UserIdParams }>,
  reply: FastifyReply,
): Promise<void> => {
  const userId = req.params.userId;
  const currentUser = req.user;

  return getSitesByUserId(userId, currentUser).match(
    (sites) => reply.status(httpStatus.OK).send(sites),
    (error) => sendChainedErrorReply(reply, error),
  );
};

/**
 * Controller to get all sites under a specific company.
 *
 * @param {FastifyRequest<{ Params: CompanyIdParams }>} req - Request containing the company ID.
 * @param {FastifyReply} reply - Fastify reply object.
 * @returns {Promise<void>} Sends a list of sites or an error.
 */
export const getSitesByCompanyIdController = async (
  req: FastifyRequest<{ Params: CompanyIdParams }>,
  reply: FastifyReply,
): Promise<void> => {
  const companyId = req.params.companyId;
  const currentUser = req.user;

  return getSitesByCompanyId(companyId, currentUser).match(
    (sites) => reply.status(httpStatus.OK).send(sites),
    (error) => sendChainedErrorReply(reply, error),
  );
};

/**
 * Controller to get a single site by its ID and associated company ID.
 *
 * @param {FastifyRequest<{ Params: SiteIdParams }>} req - Request containing the site ID and company ID.
 * @param {FastifyReply} reply - Fastify reply object.
 * @returns {Promise<void>} Sends the site data or an error.
 */
export const getSiteByIdController = async (
  req: FastifyRequest<{ Params: SiteIdParams }>,
  reply: FastifyReply,
): Promise<void> => {
  const id = req.params.siteId;
  const companyId = req.params.companyId;
  const currentUser = req.user;

  return getSiteById(id, currentUser, companyId).match(
    (site) => reply.status(httpStatus.OK).send(site),
    (error) => sendChainedErrorReply(reply, error),
  );
};
