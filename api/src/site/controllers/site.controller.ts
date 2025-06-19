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

export const createSiteController = async (
  req: FastifyRequest<{ Body: CreateSiteDto; Params: CompanyIdParams }>,
  reply: FastifyReply,
) => {
  const data = req.body;
  const companyId = req.params.companyId;
  const currentUser = req.user;

  return createNewSite(currentUser, data, companyId).match(
    (site) => reply.status(httpStatus.CREATED).send(site),
    (error) => sendChainedErrorReply(reply, error),
  );
};

export const updateSiteController = async (
  req: FastifyRequest<{ Params: SiteIdParams; Body: UpdateSiteDto }>,
  reply: FastifyReply,
) => {
  const { siteId, companyId } = req.params;
  const data = req.body;
  const currentUser = req.user;

  return updateSiteById(currentUser, siteId, data, companyId).match(
    (site) => reply.status(httpStatus.OK).send(site),
    (error) => sendChainedErrorReply(reply, error),
  );
};

export const getSitesByUserIdController = async (
  req: FastifyRequest<{ Params: UserIdParams }>,
  reply: FastifyReply,
) => {
  const userId = req.params.userId;
  const currentUser = req.user;

  return getSitesByUserId(userId, currentUser).match(
    (sites) => reply.status(httpStatus.OK).send(sites),
    (error) => sendChainedErrorReply(reply, error),
  );
};

export const getSitesByCompanyIdController = async (
  req: FastifyRequest<{ Params: CompanyIdParams }>,
  reply: FastifyReply,
) => {
  const companyId = req.params.companyId;
  const currentUser = req.user;

  return getSitesByCompanyId(companyId, currentUser).match(
    (sites) => reply.status(httpStatus.OK).send(sites),
    (error) => sendChainedErrorReply(reply, error),
  );
};

export const getSiteByIdController = async (
  req: FastifyRequest<{ Params: SiteIdParams }>,
  reply: FastifyReply,
) => {
  const id = req.params.siteId;
  const companyId = req.params.companyId;
  const currentUser = req.user;

  return getSiteById(id, currentUser, companyId).match(
    (site) => reply.status(httpStatus.OK).send(site),
    (error) => sendChainedErrorReply(reply, error),
  );
};
