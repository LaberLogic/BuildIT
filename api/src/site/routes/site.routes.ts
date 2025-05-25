import { FastifyInstance } from "fastify";

import { isAdminOrManager } from "@src/plugins/roleGuards";
import { $ref } from "@src/schemas/siteSchema";

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
    url: "/:siteId/users",
    preHandler: [app.authenticate, isAdminOrManager],
    schema: {
      params: $ref("siteIdParamsSchema"),
      body: $ref("updateSiteUsersSchema"),
      response: {
        200: $ref("siteResponseSchema"),
        400: $ref("errorResponseSchema"),
        403: $ref("errorResponseSchema"),
      },
      tags: ["Site"],
    },
    handler: updateSiteUsersController,
  });

  app.route({
    method: "PATCH",
    url: "/:siteId/deactivate",
    preHandler: [app.authenticate, isAdminOrManager],
    schema: {
      params: $ref("siteIdParamsSchema"),
      response: {
        204: { type: "object" },
        403: $ref("errorResponseSchema"),
        404: $ref("errorResponseSchema"),
      },
      tags: ["Site"],
    },
    handler: deactivateSiteController,
  });

  app.route({
    method: "GET",
    url: "/user/:userId",
    preHandler: [app.authenticate, canViewSite],
    schema: {
      params: $ref("userIdParamsSchema"),
      response: {
        200: $ref("siteResponseSchema"),
        404: $ref("errorResponseSchema"),
      },
      tags: ["Site"],
    },
    handler: getSitesByUserController,
  });

  app.route({
    method: "GET",
    url: "/company/:companyId",
    preHandler: [app.authenticate, isAdminOrManager],
    schema: {
      params: $ref("companyIdParamsSchema"),
      response: {
        200: $ref("sitesResponseSchema"),
      },
      tags: ["Site"],
    },
    handler: getSitesByCompanyController,
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
