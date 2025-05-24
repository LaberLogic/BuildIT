import { FastifyInstance } from "fastify";
import {
  createUserController,
  deleteUserController,
  getAllUsersByCompanyController,
  getUserByIdController,
  updateUserController,
} from "./controllers/user.controller";
import { $ref } from "@src/schemas/userSchema";

const userRoutes = async (app: FastifyInstance) => {
  app.route({
    method: "POST",
    url: "/",
    preHandler: [app.authenticate],
    schema: {
      body: $ref("createUserSchema"),
    },
    handler: createUserController,
  });

  app.route({
    method: "PUT",
    url: "/:userId",
    preHandler: [app.authenticate],
    schema: {
      body: $ref("updateUserSchema"),
    },
    handler: updateUserController,
  });

  app.route({
    method: "DELETE",
    url: "/:userId",
    preHandler: [app.authenticate],
    handler: deleteUserController,
  });

  app.route({
    method: "GET",
    url: "/:userId",
    preHandler: [app.authenticate],
    handler: getUserByIdController,
  });

  app.route({
    method: "GET",
    url: "/company/:companyId",
    preHandler: [app.authenticate],
    handler: getAllUsersByCompanyController,
  });
};

export default userRoutes;
