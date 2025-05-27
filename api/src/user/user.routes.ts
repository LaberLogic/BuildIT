import { FastifyInstance } from "fastify";
import {
  createUserController,
  deleteUserController,
  getAllUsersByCompanyController,
  getCurrentUser,
  getUserByIdController,
  updateUserController,
} from "./controllers/user.controller";

import { userRef as $ref, siteRef } from "shared";

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
      tags: ["Users"],
      body: $ref("createUserSchema"),
      response: {
        201: $ref("userResponseSchema"),
        400: siteRef("errorResponseSchema"),
        403: siteRef("errorResponseSchema"),
      },
    },
    handler: createUserController,
  });

  app.route({
    method: "PUT",
    url: "/:userId",
    preHandler: [app.authenticate, canManageUser],
    schema: {
      tags: ["Users"],
      params: $ref("userIdParamsSchema"),
      body: $ref("updateUserSchema"),
      response: {
        200: $ref("userResponseSchema"),
        400: siteRef("errorResponseSchema"),
        403: siteRef("errorResponseSchema"),
      },
    },
    handler: updateUserController,
  });

  app.route({
    method: "DELETE",
    url: "/:userId",
    preHandler: [app.authenticate, canManageUser],
    schema: {
      tags: ["Users"],
      params: $ref("userIdParamsSchema"),
      response: {
        204: { type: "object" },
        403: siteRef("errorResponseSchema"),
        404: siteRef("errorResponseSchema"),
      },
    },
    handler: deleteUserController,
  });

  app.route({
    method: "GET",
    url: "/:userId",
    preHandler: [app.authenticate, canViewUser],
    schema: {
      tags: ["Users"],
      params: $ref("userIdParamsSchema"),
      response: {
        200: $ref("userResponseSchema"),
        404: siteRef("errorResponseSchema"),
      },
    },
    handler: getUserByIdController,
  });

  app.route({
    method: "GET",
    url: "/company/:companyId",
    preHandler: [app.authenticate, isAdminOrManager],
    schema: {
      tags: ["Users"],
      params: $ref("companyIdParamsSchema"),
      response: {
        200: $ref("usersResponseSchema"),
      },
    },
    handler: getAllUsersByCompanyController,
  });

  app.route({
    method: "GET",
    url: "/me",
    preHandler: [app.authenticate],
    schema: {
      tags: ["Users"],
      response: {
        200: $ref("userResponseSchema"),
      },
    },
    handler: getCurrentUser,
  });
};

export default userRoutes;
