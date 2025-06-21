import { sendChainedErrorReply } from "@utils/errorCodeMapper";
import { FastifyReply, FastifyRequest } from "fastify";
import httpStatus from "http-status";

import { toCompanyDTO } from "./company.dto";
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
  return getCompany({ id: req.params.companyId })
    .map((company) => toCompanyDTO(company))
    .match(
      (company) => reply.status(httpStatus.OK).send(company),
      (error) => sendChainedErrorReply(reply, error),
    );
};
