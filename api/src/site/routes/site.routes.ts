import { FastifyInstance } from "fastify";

import { isAdminOrManager } from "@src/plugins/roleGuards";
import { siteRef as $ref, userRef } from "shared";
import {
  createSiteController,
  getSiteByIdController,
  getSitesByCompanyIdController,
  getSitesByUserIdController,
  updateSiteController,
} from "../controllers/site.controller";

const siteRoutes = async (app: FastifyInstance) => {
  app.route({
    method: "POST",
    url: "/",
    preHandler: [app.authenticate, isAdminOrManager],
    schema: {
      tags: ["Site"],
      body: $ref("createSiteSchema"),
      response: {
        201: $ref("siteResponseSchema"),
        400: $ref("errorResponseSchema"),
        403: $ref("errorResponseSchema"),
      },
    },
    handler: createSiteController,
  });

  app.route({
    method: "PATCH",
    url: "/:siteId",
    preHandler: [app.authenticate, isAdminOrManager],
    schema: {
      tags: ["Site"],
      params: $ref("siteIdParamsSchema"),
      body: $ref("updateSiteSchema"),
      response: {
        200: $ref("siteResponseSchema"),
        400: $ref("errorResponseSchema"),
        403: $ref("errorResponseSchema"),
      },
    },
    handler: updateSiteController,
  });

  app.route({
    method: "GET",
    url: "/user/:userId",
    preHandler: [app.authenticate],
    schema: {
      tags: ["Site"],
      params: userRef("userIdParamsSchema"),
      response: {
        200: $ref("sitesResponseSchema"),
        404: $ref("errorResponseSchema"),
      },
    },
    handler: getSitesByUserIdController,
  });

  app.route({
    method: "GET",
    url: "/",
    preHandler: [app.authenticate, isAdminOrManager],
    schema: {
      tags: ["Site"],
      response: {
        200: $ref("sitesResponseSchema"),
        404: $ref("errorResponseSchema"),
      },
    },
    handler: getSitesByCompanyIdController,
  });

  app.route({
    method: "GET",
    url: "/:siteId",
    preHandler: [app.authenticate],
    schema: {
      tags: ["Site"],
      params: $ref("siteIdParamsSchema"),
      response: {
        200: $ref("siteResponseSchema"),
        404: $ref("errorResponseSchema"),
      },
    },
    handler: getSiteByIdController,
  });
};

export default siteRoutes;
