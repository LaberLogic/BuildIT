import Fastify from "fastify";

import { signInController } from "./user/controllers/auth.controller";
import userRoutes from "./user/user.routes";
import authRoutes from "./user/auth.routes";
import jwtPlugin from "./plugins/jwt";
import swagger from "@fastify/swagger";
import swaggerUI from "@fastify/swagger-ui";
import { withRefResolver } from "fastify-zod";
import { authSchemas, materialSchemas, siteSchemas, userSchemas } from "shared";
import fastifyCors from "@fastify/cors";
import { version } from "../package.json";
import siteRoutes from "./site/routes/site.routes";
import materialRoutes from "./site/routes/material.routes";

const app = Fastify({
  logger: {
    transport: {
      target: "pino-pretty",
    },
  },
});

app.register(fastifyCors, {
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
});

app.register(
  swagger,
  withRefResolver({
    openapi: {
      info: {
        title: "Costrux API",
        description: "Costrux API Documentation",
        version,
      },
    },
  }),
);

userSchemas.forEach((schema) => app.addSchema(schema));
authSchemas.forEach((schema) => app.addSchema(schema));
siteSchemas.forEach((schema) => app.addSchema(schema));
materialSchemas.forEach((schema) => app.addSchema(schema));

app.register(jwtPlugin);

app.register(userRoutes, { prefix: "/users" });
app.register(authRoutes, { prefix: "/auth" });
app.register(siteRoutes, { prefix: "/sites" });
app.register(materialRoutes, { prefix: "/materials" });

app.post("/auth/signin", signInController);

app.get("/moderator", async (req, reply) => {
  return reply.status(200).send("Moderator Content.");
});

app.register(swaggerUI, {
  routePrefix: "/docs",
  staticCSP: true,
});

export default app;
