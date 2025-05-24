import "@fastify/jwt";

declare module "fastify" {
  interface FastifyRequest {
    user: UserObject;
  }
  interface FastifyInstance {
    authenticate: (
      request: import("fastify").FastifyRequest,
      reply: import("fastify").FastifyReply,
    ) => Promise<void>;
  }
}

declare module "@fastify/jwt" {
  interface FastifyJWT {
    payload: {
      id: string;
      companyId: string;
      role: "ADMIN" | "MANAGER" | "WORKER";
    };
    user: UserObject;
  }
}

export interface UserObject {
  id: string;
  role: "ADMIN" | "MANAGER" | "WORKER";
  companyId?: string;
}
