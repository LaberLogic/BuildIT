import { FastifyInstance } from "fastify";

import { healthCheck } from "./health.controller";

export const healthRoutes = async (fastify: FastifyInstance) => {
  fastify.get("/health", healthCheck);
};
