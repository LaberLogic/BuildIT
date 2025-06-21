import { FastifyInstance } from "fastify";

import { healthCheck } from "./health.controller";

export const healthRoutes = async (fastify: FastifyInstance) => {
  fastify.route({
    method: "GET",
    url: "/health",
    handler: healthCheck,
    schema: {
      tags: ["Health"],
      response: {
        200: {
          type: "object",
        },
      },
    },
  });
};
