import { sendChainedErrorReply } from "@utils/errorCodeMapper";
import { FastifyReply, FastifyRequest } from "fastify";
import httpStatus from "http-status";

import { toCompanyDTO } from "./company.dto";
import { getCompany } from "./company.repository";
import { getAllCompanies } from "./company.service";

/**
 * Controller to handle fetching all companies.
 *
 * @param {FastifyRequest} req - The Fastify request object.
 * @param {FastifyReply} reply - The Fastify reply object.
 * @returns {Promise<void>} Sends a list of companies or an error response.
 */
export const getCompaniesController = async (
  req: FastifyRequest,
  reply: FastifyReply,
): Promise<void> => {
  return getAllCompanies().match(
    (companies) => reply.status(httpStatus.OK).send(companies),
    (error) => sendChainedErrorReply(reply, error),
  );
};

/**
 * Controller to handle fetching a single company by ID.
 *
 * @param {FastifyRequest<{ Params: { companyId: string } }>} req - The Fastify request object containing the company ID.
 * @param {FastifyReply} reply - The Fastify reply object.
 * @returns {Promise<void>} Sends the company DTO or an error response.
 */
export const getCompanyController = async (
  req: FastifyRequest<{ Params: { companyId: string } }>,
  reply: FastifyReply,
): Promise<void> => {
  return getCompany({ id: req.params.companyId })
    .map((company) => toCompanyDTO(company))
    .match(
      (company) => reply.status(httpStatus.OK).send(company),
      (error) => sendChainedErrorReply(reply, error),
    );
};
