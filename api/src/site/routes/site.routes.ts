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
      body: $ref("createSiteSchema"),
      response: {
        201: $ref("siteResponseSchema"),
        400: $ref("errorResponseSchema"),
        403: $ref("errorResponseSchema"),
      },
      tags: ["Site"],
    },
    handler: createSiteController,
  });

  app.route({
    method: "PATCH",
    url: "/:siteId",
    preHandler: [app.authenticate, isAdminOrManager],
    schema: {
      params: $ref("siteIdParamsSchema"),
      body: $ref("updateSiteSchema"),
      response: {
        200: $ref("siteResponseSchema"),
        400: $ref("errorResponseSchema"),
        403: $ref("errorResponseSchema"),
      },
      tags: ["Site"],
    },
    handler: updateSiteController,
  });

  app.route({
    method: "GET",
    url: "/user/:userId",
    preHandler: [app.authenticate],
    schema: {
      params: userRef("userIdParamsSchema"),
      response: {
        200: $ref("sitesResponseSchema"),
        404: $ref("errorResponseSchema"),
      },
      tags: ["Site"],
    },
    handler: getSitesByUserIdController,
  });

  app.route({
    method: "GET",
    url: "/company/:companyId",
    preHandler: [app.authenticate, isAdminOrManager],
    schema: {
      params: userRef("companyIdParamsSchema"),
      response: {
        200: $ref("sitesResponseSchema"),
        404: $ref("errorResponseSchema"),
      },
      tags: ["Site"],
    },
    handler: getSitesByCompanyIdController,
  });

  app.route({
    method: "GET",
    url: "/:siteId",
    preHandler: [app.authenticate],
    schema: {
      params: $ref("siteIdParamsSchema"),
      response: {
        200: $ref("siteResponseSchema"),
        404: $ref("errorResponseSchema"),
      },
      tags: ["Site"],
    },
    handler: getSiteByIdController,
  });
};

export default siteRoutes;
