import { authRef } from "shared";
import { FastifyPluginAsync } from "fastify";
import {
  registerController,
  signInController,
} from "./controllers/auth.controller";

const authRoutes: FastifyPluginAsync = async (app) => {
  app.post("/register", {
    schema: {
      body: authRef("registerSchema"),
    },
    handler: registerController,
  });

  app.post("/signIn", {
    schema: {
      body: authRef("signInSchema"),
    },
    handler: signInController,
  });
};

export default authRoutes;
