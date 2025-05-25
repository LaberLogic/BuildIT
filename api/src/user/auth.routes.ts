import { $ref } from "@src/schemas/authSchema";
import { FastifyPluginAsync } from "fastify";
import {
  registerController,
  signInController,
} from "./controllers/auth.controller";

const authRoutes: FastifyPluginAsync = async (app) => {
  app.post("/register", {
    schema: {
      body: $ref("registerSchema"),
    },
    handler: registerController,
  });

  app.post("/signIn", {
    schema: {
      body: $ref("signInSchema"),
    },
    handler: signInController,
  });
};

export default authRoutes;
