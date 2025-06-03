import { sendChainedErrorReply } from "@utils/errorCodeMapper";
import { FastifyReply,FastifyRequest } from "fastify";
import httpStatus from "http-status";
import { CreateSiteDto, SiteIdParams, UpdateSiteDto } from "shared";
import { CompanyIdParams, UserIdParams } from "shared";
import { UserObject } from "types";

import {
  createNewSite,
  getSiteById,
  getSitesByCompanyId,
  getSitesByUserId,
  updateSiteById,
} from "../services/site.service";

export const createSiteController = async (
  req: FastifyRequest<{ Body: CreateSiteDto }>,
  reply: FastifyReply,
) => {
  const data = req.body;
  const currentUser = req.user as UserObject;

  return createNewSite(currentUser, data).match(
    (site) => reply.status(httpStatus.CREATED).send(site),
    (error) => sendChainedErrorReply(reply, error),
  );
};

export const updateSiteController = async (
  req: FastifyRequest<{ Params: SiteIdParams; Body: UpdateSiteDto }>,
  reply: FastifyReply,
) => {
  const id = req.params.siteId;
  const data = req.body;
  const currentUser = req.user;

  return updateSiteById(currentUser, id, data).match(
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
  req: FastifyRequest<{ Params: { siteId: string } }>,
  reply: FastifyReply,
) => {
  const id = req.params.siteId;
  const currentUser = req.user;

  return getSiteById(id, currentUser).match(
    (site) => reply.status(httpStatus.OK).send(site),
    (error) => sendChainedErrorReply(reply, error),
  );
};
