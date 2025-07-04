import fastifyCors from "@fastify/cors";
import swagger from "@fastify/swagger";
import swaggerUI from "@fastify/swagger-ui";
import testRoutes from "@tests/test.routes";
import Fastify from "fastify";
import { withRefResolver } from "fastify-zod";
import { authSchemas, materialSchemas, siteSchemas, userSchemas } from "shared";

import { version } from "../package.json";
import companyRoutes from "./company/company.routes";
import { healthRoutes } from "./health/health.routes";
import jwtPlugin from "./plugins/jwt";
import materialRoutes from "./site/routes/material.routes";
import siteRoutes from "./site/routes/site.routes";
import authRoutes from "./user/routes/auth.routes";
import companyUserRoutes from "./user/routes/company.user.routes";
import userRoutes from "./user/routes/user.routes";

const app = Fastify({
  logger: {
    transport: {
      target: "pino-pretty",
    },
  },
});

app.register(fastifyCors, {
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
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
app.register(healthRoutes, { prefix: "/" });
app.register(authRoutes, { prefix: "/auth" });
app.register(companyRoutes, { prefix: "/companies" });

app.register(userRoutes, { prefix: "/users" });
app.register(companyUserRoutes, { prefix: "/companies/:companyId/users" });
app.register(siteRoutes, { prefix: "/companies/:companyId/sites" });
app.register(materialRoutes, {
  prefix: "/companies/:companyId/sites/:siteId/materials",
});
app.register(testRoutes, { prefix: "/test" });

app.register(swaggerUI, {
  routePrefix: "/docs",
  staticCSP: true,
});

export default app;
