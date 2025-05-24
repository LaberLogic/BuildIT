// src/user/controllers/user.controller.ts
import { FastifyRequest, FastifyReply } from "fastify";
import httpStatus from "http-status";
import { CreateUserDto, UpdateUserDto } from "@src/schemas/userSchema";
import { userService } from "../services/user.service";

export const createUserController = async (
  req: FastifyRequest<{ Body: CreateUserDto }>,
  reply: FastifyReply,
) => {
  return userService.createUser(req.user, req.body).match(
    (result) =>
      reply
        .status(httpStatus.OK)
        .send({ message: "User created successfully", user: result }),
    (error) =>
      reply.status(httpStatus.BAD_REQUEST).send({ error: error.message }),
  );
};

export const updateUserController = async (
  req: FastifyRequest<{
    Params: { userId: string };
    Body: UpdateUserDto;
  }>,
  reply: FastifyReply,
) => {
  const id = req.params.userId;
  return userService.updateUser(req.user, id, req.body).match(
    (result) =>
      reply
        .status(httpStatus.OK)
        .send({ message: "User updated successfully", user: result }),
    (error) =>
      reply.status(httpStatus.BAD_REQUEST).send({ error: error.message }),
  );
};

export const deleteUserController = async (
  req: FastifyRequest<{ Params: { userId: string } }>,
  reply: FastifyReply,
) => {
  const id = req.params.userId;
  return userService.deleteUser(req.user, id).match(
    () => reply.status(httpStatus.NO_CONTENT).send(),
    (error) =>
      reply.status(httpStatus.BAD_REQUEST).send({ error: error.message }),
  );
};

export const getUserByIdController = async (
  req: FastifyRequest<{ Params: { userId: string } }>,
  reply: FastifyReply,
) => {
  const id = req.params.userId;
  return userService.getUserById(req.user, id).match(
    (user) => reply.status(httpStatus.OK).send(user),
    (error) =>
      reply.status(httpStatus.NOT_FOUND).send({ error: error.message }),
  );
};

export const getAllUsersByCompanyController = async (
  req: FastifyRequest<{ Params: { companyId: string } }>,
  reply: FastifyReply,
) => {
  const companyId = req.params.companyId;
  return userService.getAllUsersByCompany(req.user, companyId).match(
    (users) => reply.status(httpStatus.OK).send(users),
    (error) =>
      reply.status(httpStatus.FORBIDDEN).send({ error: error.message }),
  );
};
