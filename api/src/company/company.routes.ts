import { FastifyInstance } from "fastify";
import { getAllCompanies } from "./company.service";
import { isAdmin } from "@src/plugins/roleGuards";

const companyRoutes = async (app: FastifyInstance) => {
  app.route({
    method: "GET",
    url: "/",
    preHandler: [app.authenticate, isAdmin],
    schema: {
      tags: ["Company"],
    },
    handler: getAllCompanies,
  });
};

export default companyRoutes;
