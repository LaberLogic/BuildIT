import { sendChainedErrorReply } from "@utils/errorCodeMapper";
import { FastifyReply,FastifyRequest } from "fastify";
import httpStatus from "http-status";

import { getCompanies, getCompany } from "./company.repository";

export const getCompaniesController = async (
  req: FastifyRequest,
  reply: FastifyReply,
) => {
  return getCompanies().match(
    (site) => reply.status(httpStatus.CREATED).send(site),
    (error) => sendChainedErrorReply(reply, error),
  );
};

export const getCompanyController = async (
  req: FastifyRequest<{ Params: { companyId: string } }>,
  reply: FastifyReply,
) => {
  return getCompany({ id: req.params.companyId }).match(
    (site) => reply.status(httpStatus.CREATED).send(site),
    (error) => sendChainedErrorReply(reply, error),
  );
};
