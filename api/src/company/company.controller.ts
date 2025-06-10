import { sendChainedErrorReply } from "@utils/errorCodeMapper";
import { FastifyReply, FastifyRequest } from "fastify";
import httpStatus from "http-status";

import { getCompany } from "./company.repository";
import { getAllCompanies } from "./company.service";

export const getCompaniesController = async (
  req: FastifyRequest,
  reply: FastifyReply,
) => {
  return getAllCompanies().match(
    (companies) => reply.status(httpStatus.OK).send(companies),
    (error) => sendChainedErrorReply(reply, error),
  );
};

export const getCompanyController = async (
  req: FastifyRequest<{ Params: { companyId: string } }>,
  reply: FastifyReply,
) => {
  return getCompany({ id: req.params.companyId }).match(
    (site) => reply.status(httpStatus.OK).send(site),
    (error) => sendChainedErrorReply(reply, error),
  );
};
