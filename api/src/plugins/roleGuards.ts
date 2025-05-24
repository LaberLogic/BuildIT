import { FastifyRequest, FastifyReply } from "fastify";
import httpStatus from "http-status";

const rolePriority: Record<string, number> = {
  ADMIN: 3,
  MANAGER: 2,
  WORKER: 1,
};

export const isAdmin = async (req: FastifyRequest, reply: FastifyReply) => {
  if (req.user?.role !== "ADMIN") {
    return reply.status(httpStatus.FORBIDDEN).send();
  }
};

export const isManager = async (req: FastifyRequest, reply: FastifyReply) => {
  if (req.user?.role !== "MANAGER") {
    return reply.status(httpStatus.FORBIDDEN).send();
  }
};

export const isWorker = async (req: FastifyRequest, reply: FastifyReply) => {
  if (req.user?.role !== "WORKER") {
    return reply.status(httpStatus.FORBIDDEN).send();
  }
};

export const canCreateUser = async (
  req: FastifyRequest<{
    Body: { role?: string };
  }>,
  reply: FastifyReply,
) => {
  const currentUser = req.user;
  const targetRole = req.body?.role;

  if (!currentUser || !targetRole || !rolePriority[targetRole]) {
    return reply.status(httpStatus.BAD_REQUEST).send();
  }

  const currentPriority = rolePriority[currentUser.role];
  const targetPriority = rolePriority[targetRole];

  if (currentPriority > targetPriority) return;
  return reply.status(httpStatus.FORBIDDEN).send();
};

export const canManageUser = async (
  req: FastifyRequest<{
    Params: { userId: string };
    Body?: { role?: string; targetRole?: string };
  }>,
  reply: FastifyReply,
) => {
  const currentUser = req.user;
  const targetUserId = req.params.userId;
  const targetRole = req.body?.role || req.body?.targetRole;

  if (!currentUser || !targetUserId) {
    return reply.status(httpStatus.BAD_REQUEST).send();
  }

  const isSelf = currentUser.id === targetUserId;
  const currentPriority = rolePriority[currentUser.role];
  const targetPriority = targetRole ? rolePriority[targetRole] : undefined;

  if (isSelf || (targetPriority && currentPriority > targetPriority)) return;
  return reply.status(httpStatus.FORBIDDEN).send();
};
