import Fastify from "fastify";

import { signInController } from "./user/controllers/auth.controller";
import userRoutes from "./user/user.routes";
import authRoutes from "./user/auth.routes";
import { env } from "@env";
import jwtPlugin from "./plugins/jwt";
import {
  authSchemas,
  materialSchemas,
  siteSchemas,
  userSchemas,
} from "./schemas";

const app = Fastify({
  logger: {
    transport: {
      target: "pino-pretty",
    },
  },
});
userSchemas.forEach((schema) => app.addSchema(schema));
authSchemas.forEach((schema) => app.addSchema(schema));
siteSchemas.forEach((schema) => app.addSchema(schema));
materialSchemas.forEach((schema) => app.addSchema(schema));

app.register(jwtPlugin);

app.register(userRoutes, { prefix: "/users" });
app.register(authRoutes, { prefix: "/auth" });
app.post("/auth/signin", signInController);

app.get("/moderator", async (req, reply) => {
  return reply.status(200).send("Moderator Content.");
});

app.listen({ port: env.PORT }, (err) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
});
