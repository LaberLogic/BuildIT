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

/**
 * Controller to create a new user under a specific company.
 *
 * @param req - Fastify request containing user creation data and company ID.
 * @param reply - Fastify reply instance.
 */
export const createUserController = async (
  req: FastifyRequest<{ Body: CreateUserDto; Params: CompanyIdParams }>,
  reply: FastifyReply,
): Promise<void> => {
  const companyId = req.params.companyId;
  return userService.createUser(companyId, req.user, req.body).match(
    (user) => reply.status(httpStatus.CREATED).send(user),
    (error) => sendChainedErrorReply(reply, error),
  );
};

/**
 * Controller to update a user's data.
 *
 * @param req - Fastify request with user ID, update data, and optional company ID.
 * @param reply - Fastify reply instance.
 */
export const updateUserController = async (
  req: FastifyRequest<{ Params: UserIdParams; Body: UpdateUserDto }>,
  reply: FastifyReply,
): Promise<void> => {
  const { userId, companyId } = req.params;
  return userService.updateUser(req.user, userId, req.body, companyId).match(
    (user) => reply.status(httpStatus.OK).send(user),
    (error) => sendChainedErrorReply(reply, error),
  );
};

/**
 * Controller to allow current authenticated user to update their own profile.
 *
 * @param req - Fastify request with update data.
 * @param reply - Fastify reply instance.
 */
export const updateSelfController = async (
  req: FastifyRequest<{ Body: UpdateUserDto }>,
  reply: FastifyReply,
): Promise<void> => {
  const { id, companyId } = req.user;
  return userService
    .updateUser(req.user, id, req.body, companyId ?? "ADMIN")
    .match(
      (user) => reply.status(httpStatus.OK).send(user),
      (error) => sendChainedErrorReply(reply, error),
    );
};

/**
 * Controller to delete a user by ID.
 *
 * @param req - Fastify request with user ID and company ID.
 * @param reply - Fastify reply instance.
 */
export const deleteUserController = async (
  req: FastifyRequest<{ Params: UserIdParams }>,
  reply: FastifyReply,
): Promise<void> => {
  const { userId, companyId } = req.params;
  return userService.deleteUser(req.user, userId, companyId).match(
    ({ id }) => reply.status(httpStatus.NO_CONTENT).send({ id }),
    (error) => sendChainedErrorReply(reply, error),
  );
};

/**
 * Controller to retrieve a user by ID, scoped to the requester's company.
 *
 * @param req - Fastify request with user ID.
 * @param reply - Fastify reply instance.
 */
export const getUserByIdController = async (
  req: FastifyRequest<{ Params: UserIdParams }>,
  reply: FastifyReply,
): Promise<void> => {
  const id = req.params.userId;
  return userService.getUserById(req.user, id).match(
    (user) => reply.status(httpStatus.OK).send(user),
    (error) => sendChainedErrorReply(reply, error),
  );
};

/**
 * Controller to retrieve all users under a specific company.
 *
 * @param req - Fastify request with company ID.
 * @param reply - Fastify reply instance.
 */
export const getAllUsersByCompanyController = async (
  req: FastifyRequest<{ Params: CompanyIdParams }>,
  reply: FastifyReply,
): Promise<void> => {
  const companyId = req.params.companyId;
  return userService.getAllUsersByCompany(req.user, companyId).match(
    (users) => reply.status(httpStatus.OK).send(users),
    (error) => sendChainedErrorReply(reply, error),
  );
};

/**
 * Controller to fetch the currently authenticated user's information.
 *
 * @param req - Fastify request with user in context.
 * @param reply - Fastify reply instance.
 */
export const getCurrentUser = async (
  req: FastifyRequest,
  reply: FastifyReply,
): Promise<void> => {
  return userService.getUserById(req.user, req.user.id).match(
    (user) => reply.status(httpStatus.OK).send(user),
    (error) => sendChainedErrorReply(reply, error),
  );
};
