import { FastifyInstance } from "fastify";
import {
  createUserController,
  deleteUserController,
  getAllUsersByCompanyController,
  getUserByIdController,
  updateUserController,
} from "./controllers/user.controller";

import { userRef as $ref } from "shared";

import {
  canCreateUser,
  canManageUser,
  canViewUser,
  isAdminOrManager,
} from "@src/plugins/roleGuards";

const userRoutes = async (app: FastifyInstance) => {
  app.route({
    method: "POST",
    url: "/",
    preHandler: [app.authenticate, canCreateUser],
    schema: {
      body: $ref("createUserSchema"),
      response: {
        201: $ref("userResponseSchema"),
        400: $ref("errorResponseSchema"),
        403: $ref("errorResponseSchema"),
      },
    },
    handler: createUserController,
  });

  app.route({
    method: "PUT",
    url: "/:userId",
    preHandler: [app.authenticate, canManageUser],
    schema: {
      params: $ref("userIdParamsSchema"),
      body: $ref("updateUserSchema"),
      response: {
        200: $ref("userResponseSchema"),
        400: $ref("errorResponseSchema"),
        403: $ref("errorResponseSchema"),
      },
    },
    handler: updateUserController,
  });

  app.route({
    method: "DELETE",
    url: "/:userId",
    preHandler: [app.authenticate, canManageUser],
    schema: {
      params: $ref("userIdParamsSchema"),
      response: {
        204: { type: "object" },
        403: $ref("errorResponseSchema"),
        404: $ref("errorResponseSchema"),
      },
    },
    handler: deleteUserController,
  });

  app.route({
    method: "GET",
    url: "/:userId",
    preHandler: [app.authenticate, canViewUser],
    schema: {
      params: $ref("userIdParamsSchema"),
      response: {
        200: $ref("userResponseSchema"),
        404: $ref("errorResponseSchema"),
      },
    },
    handler: getUserByIdController,
  });

  app.route({
    method: "GET",
    url: "/company/:companyId",
    preHandler: [app.authenticate, isAdminOrManager],
    schema: {
      params: $ref("companyIdParamsSchema"),
      response: {
        200: $ref("usersResponseSchema"),
      },
    },
    handler: getAllUsersByCompanyController,
  });
};

export default userRoutes;
