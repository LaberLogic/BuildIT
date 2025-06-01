import { FastifyInstance } from "fastify";
import { isAdmin } from "@src/plugins/roleGuards";
import {
  getCompaniesController,
  getCompanyController,
} from "./company.controller";

const companyRoutes = async (app: FastifyInstance) => {
  app.route({
    method: "GET",
    url: "/",
    preHandler: [app.authenticate, isAdmin],
    schema: {
      tags: ["Company"],
    },
    handler: getCompaniesController,
  });
  app.route({
    method: "GET",
    url: "/:companyId",
    preHandler: [app.authenticate, isAdmin],
    schema: {
      tags: ["Company"],
    },
    handler: getCompanyController,
  });
};

export default companyRoutes;
