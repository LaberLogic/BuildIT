import {
  canCreateUser,
  canManageUser,
  isAdminOrManager,
} from "@src/plugins/roleGuards";
import { FastifyInstance } from "fastify";
import { siteRef, userRef as $ref } from "shared";

import {
  createUserController,
  deleteUserController,
  getAllUsersByCompanyController,
  updateUserController,
} from "../controllers/user.controller";

const userCompanyRoutes = async (app: FastifyInstance) => {
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
    url: "/",
    preHandler: [app.authenticate, isAdminOrManager],
    schema: {
      tags: ["Users"],
      response: {
        200: $ref("usersResponseSchema"),
      },
    },
    handler: getAllUsersByCompanyController,
  });
};

export default userCompanyRoutes;
