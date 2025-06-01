import { getCurrentUser } from "@src/user/controllers/user.controller";
import { UserObject } from "types";
import { getCompanies } from "./company.repository";
import httpStatus from "http-status";
import { sendChainedErrorReply } from "@utils/errorCodeMapper";
import { FastifyRequest, FastifyReply } from "fastify";

export const getCompaniesController = async (
  req: FastifyRequest,
  reply: FastifyReply,
) => {
  return getCompanies().match(
    (site) => reply.status(httpStatus.CREATED).send(site),
    (error) => sendChainedErrorReply(reply, error),
  );
};
