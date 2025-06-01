import { FastifyInstance } from "fastify";
import {
  getCurrentUser,
  getUserByIdController,
} from "./controllers/user.controller";

import { userRef as $ref, siteRef } from "shared";
import { isAdmin } from "@src/plugins/roleGuards";

const userRoutes = async (app: FastifyInstance) => {
  app.route({
    method: "GET",
    url: "/:userId",
    preHandler: [app.authenticate, isAdmin],
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
