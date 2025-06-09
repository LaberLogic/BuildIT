import { isAdmin } from "@src/plugins/roleGuards";
import { FastifyInstance } from "fastify";
import { siteRef,userRef as $ref } from "shared";

import {
  getCurrentUser,
  getUserByIdController,
} from "./controllers/user.controller";

const userRoutes = async (app: FastifyInstance) => {
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

  // (admin only)
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
};

export default userRoutes;
