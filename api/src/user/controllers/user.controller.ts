// src/user/controllers/user.controller.ts
import { sendChainedErrorReply } from "@utils/errorCodeMapper";
import { FastifyReply, FastifyRequest } from "fastify";
import httpStatus from "http-status";
import {
  CompanyIdParams,
  CreateUserDto,
  UpdateUserDto,
  UserIdParams,
} from "shared";

import { userService } from "../services/user.service";

export const createUserController = async (
  req: FastifyRequest<{ Body: CreateUserDto; Params: CompanyIdParams }>,
  reply: FastifyReply,
) => {
  const companyId = req.params.companyId;
  return userService.createUser(companyId, req.user, req.body).match(
    (user) => {
      return reply.status(httpStatus.CREATED).send(user);
    },
    (error) => sendChainedErrorReply(reply, error),
  );
};

export const updateUserController = async (
  req: FastifyRequest<{ Params: UserIdParams; Body: UpdateUserDto }>,
  reply: FastifyReply,
) => {
  const id = req.params.userId;
  return userService.updateUser(req.user, id, req.body).match(
    (user) => reply.status(httpStatus.OK).send(user),
    (error) => sendChainedErrorReply(reply, error),
  );
};

export const deleteUserController = async (
  req: FastifyRequest<{ Params: UserIdParams }>,
  reply: FastifyReply,
) => {
  const id = req.params.userId;
  return userService.deleteUser(req.user, id).match(
    ({ id }) => reply.status(httpStatus.NO_CONTENT).send({ id }),
    (error) => sendChainedErrorReply(reply, error),
  );
};

export const getUserByIdController = async (
  req: FastifyRequest<{ Params: UserIdParams }>,
  reply: FastifyReply,
) => {
  const id = req.params.userId;
  return userService.getUserById(req.user, id).match(
    (user) => reply.status(httpStatus.OK).send(user),
    (error) => sendChainedErrorReply(reply, error),
  );
};

export const getAllUsersByCompanyController = async (
  req: FastifyRequest<{ Params: CompanyIdParams }>,
  reply: FastifyReply,
) => {
  const companyId = req.params.companyId;
  return userService.getAllUsersByCompany(req.user, companyId).match(
    (users) => reply.status(httpStatus.OK).send(users),
    (error) => sendChainedErrorReply(reply, error),
  );
};

export const getCurrentUser = async (
  req: FastifyRequest,
  reply: FastifyReply,
) => {
  return userService.getUserById(req.user, req.user.id).match(
    (user) => {
      return reply.status(httpStatus.OK).send(user);
    },
    (error) => sendChainedErrorReply(reply, error),
  );
};
