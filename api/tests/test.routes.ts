import { FastifyPluginAsync } from "fastify";

import { seedDatabase } from "../prisma/seed";

const testRoutes: FastifyPluginAsync = async (app) => {
  if (process.env.NODE_ENV !== "development") return;

  app.post("/reset-db", {
    schema: {
      tags: ["Test Utilities"],
      response: {
        200: {
          type: "object",
          properties: {
            status: { type: "string" },
          },
        },
        500: {
          type: "object",
          properties: {
            error: { type: "string" },
          },
        },
      },
    },
    handler: async (req, reply) => {
      try {
        await seedDatabase();
        return reply.send({ status: "ok" });
      } catch (err) {
        console.error("DB Reset Failed", err);
        return reply.status(500).send({ error: "Failed to reset database" });
      }
    },
  });
};

export default testRoutes;
