import { isAdminOrManager } from "@src/plugins/roleGuards";
import { FastifyInstance } from "fastify";
import { materialRef as $ref, siteRef as $general } from "shared";

import {
  adjustMaterialQuantityController,
  createMaterialController,
  deleteMaterialController,
  updateMaterialController,
} from "../controllers/material.controller";

const materialRoutes = async (app: FastifyInstance) => {
  app.route({
    method: "POST",
    url: "/",
    preHandler: [app.authenticate, isAdminOrManager],
    schema: {
      body: $ref("createMaterialSchema"),
      response: {
        201: $ref("materialResponseSchema"),
        400: $general("errorResponseSchema"),
        403: $general("errorResponseSchema"),
      },
      tags: ["Material"],
    },
    handler: createMaterialController,
  });

  app.route({
    method: "PATCH",
    url: "/:materialId",
    preHandler: [app.authenticate, isAdminOrManager],
    schema: {
      params: $ref("materialIdWithSiteParamsSchema"),
      body: $ref("updateMaterialSchema"),
      response: {
        200: $ref("materialResponseSchema"),
        400: $general("errorResponseSchema"),
        403: $general("errorResponseSchema"),
        404: $general("errorResponseSchema"),
      },
      tags: ["Material"],
    },
    handler: updateMaterialController,
  });

  app.route({
    method: "DELETE",
    url: "/:materialId",
    preHandler: [app.authenticate, isAdminOrManager],
    schema: {
      params: $ref("materialIdWithSiteParamsSchema"),
      response: {
        204: { type: "null" },
        403: $general("errorResponseSchema"),
        404: $general("errorResponseSchema"),
      },
      tags: ["Material"],
    },
    handler: deleteMaterialController,
  });

  app.route({
    method: "POST",
    url: "/:materialId/adjust-quantity",
    preHandler: [app.authenticate],
    schema: {
      params: $ref("materialIdWithSiteParamsSchema"),
      body: $ref("updateMaterialCountSchema"),
      response: {
        200: $ref("materialResponseSchema"),
        400: $general("errorResponseSchema"),
        403: $general("errorResponseSchema"),
        404: $general("errorResponseSchema"),
      },
      tags: ["Material"],
    },
    handler: adjustMaterialQuantityController,
  });
};

export default materialRoutes;
