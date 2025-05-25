import { FastifyInstance } from "fastify";
import {
  createUserController,
  deleteUserController,
  getAllUsersByCompanyController,
  getUserByIdController,
  updateUserController,
} from "./controllers/user.controller";

import { $ref } from "@src/schemas/userSchema";

import { canCreateUser, canManageUser } from "@src/plugins/roleGuards";

const userRoutes = async (app: FastifyInstance) => {
  app.route({
    method: "POST",
    url: "/",
    preHandler: [app.authenticate, canCreateUser],
    schema: {
      body: $ref("createUserSchema"),
      response: {
        201: $ref("userResponseSchema"),
        400: {
          type: "object",
          properties: {
            error: { type: "string" },
          },
        },
        403: {
          type: "object",
          properties: {
            error: { type: "string" },
          },
        },
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
        400: {
          type: "object",
          properties: { error: { type: "string" } },
        },
        403: {
          type: "object",
          properties: { error: { type: "string" } },
        },
        404: {
          type: "object",
          properties: { error: { type: "string" } },
        },
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
        403: {
          type: "object",
          properties: {
            error: { type: "string" },
            message: { type: "string" },
            statusCode: { type: "string" },
          },
        },
        404: {
          type: "object",
          properties: { error: { type: "string" } },
        },
      },
    },
    handler: deleteUserController,
  });

  app.route({
    method: "GET",
    url: "/:userId",
    preHandler: [app.authenticate],
    schema: {
      params: $ref("userIdParamsSchema"),
      response: {
        200: $ref("userResponseSchema"),
        404: {
          type: "object",
          properties: { error: { type: "string" } },
        },
      },
    },
    handler: getUserByIdController,
  });

  app.route({
    method: "GET",
    url: "/company/:companyId",
    preHandler: [app.authenticate],
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
