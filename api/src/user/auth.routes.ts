import { FastifyPluginAsync } from "fastify";
import { authRef, siteRef } from "shared";

import {
  registerController,
  resetPasswordRequestController,
  setPasswordController,
  signInController,
} from "./controllers/auth.controller";

const authRoutes: FastifyPluginAsync = async (app) => {
  app.post("/register", {
    schema: {
      body: authRef("registerSchema"),
      tags: ["Authentication"],
    },
    handler: registerController,
  });

  app.post("/signin", {
    schema: {
      body: authRef("signInSchema"),
      tags: ["Authentication"],
      response: {
        200: authRef("signInResponseSchema"),
        400: siteRef("errorResponseSchema"),
        403: siteRef("errorResponseSchema"),
      },
    },
    handler: signInController,
  });

  app.post("/set-password", {
    preHandler: [app.authenticate],
    schema: {
      body: authRef("setPasswordSchema"),
      tags: ["Authentication"],
      response: {
        400: siteRef("errorResponseSchema"),
        403: siteRef("errorResponseSchema"),
      },
    },
    handler: setPasswordController,
  });
  app.post("/reset-password", {
    schema: {
      body: authRef("resetPasswordSchema"),
      tags: ["Authentication"],
      response: {
        400: siteRef("errorResponseSchema"),
        403: siteRef("errorResponseSchema"),
      },
    },
    handler: resetPasswordRequestController,
  });
};

export default authRoutes;
