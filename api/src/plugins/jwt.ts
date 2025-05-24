import { env } from "@env";
import fastifyJwt from "@fastify/jwt";
import { FastifyPluginAsync, FastifyRequest } from "fastify";
import fp from "fastify-plugin";
import { FastifyReply } from "fastify/types/reply";

export const jwtPlugin: FastifyPluginAsync = fp(async (fastify) => {
  fastify.register(fastifyJwt, {
    secret: env.JWT_SECRET,
  });

  fastify.decorate(
    "authenticate",
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        await request.jwtVerify();
      } catch (err) {
        reply.send(err);
      }
    },
  );
});

export default jwtPlugin;
