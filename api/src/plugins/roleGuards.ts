import { getUserUnsafe } from "@src/user/repositories/user.repository";
import { FastifyReply,FastifyRequest } from "fastify";
import httpStatus from "http-status";

const rolePriority: Record<string, number> = {
  ADMIN: 3,
  MANAGER: 2,
  WORKER: 1,
};

const sendForbidden = (reply: FastifyReply, message: string) => {
  return reply.status(httpStatus.FORBIDDEN).send({
    error: message,
  });
};

const sendBadRequest = (reply: FastifyReply, message: string) => {
  return reply.status(httpStatus.BAD_REQUEST).send({
    error: message,
  });
};

export const isAdmin = async (req: FastifyRequest, reply: FastifyReply) => {
  if (req.user?.role !== "ADMIN") {
    return sendForbidden(reply, "Admin role required.");
  }
};

export const isManager = async (req: FastifyRequest, reply: FastifyReply) => {
  if (req.user?.role !== "MANAGER") {
    return sendForbidden(reply, "Manager role required.");
  }
};

export const isAdminOrManager = async (
  req: FastifyRequest,
  reply: FastifyReply,
) => {
  if (req.user?.role !== "ADMIN" && req.user?.role !== "MANAGER") {
    return sendForbidden(reply, "Admin or Manager role required.");
  }
};

export const isWorker = async (req: FastifyRequest, reply: FastifyReply) => {
  if (req.user?.role !== "WORKER") {
    return sendForbidden(reply, "Worker role required.");
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
    return sendBadRequest(reply, "Invalid user role or request payload.");
  }

  const currentPriority = rolePriority[currentUser.role];
  const targetPriority = rolePriority[targetRole];

  if (currentPriority >= targetPriority) return;
  return sendForbidden(
    reply,
    `Insufficient privileges to create role '${targetRole}'.`,
  );
};

const isInvalidRole = (role?: string): boolean =>
  !role || !Object.hasOwn(rolePriority, role);

const hasHigherPriority = (a: string, b: string): boolean =>
  rolePriority[a] > rolePriority[b];

export const canManageUser = async (
  req: FastifyRequest<{
    Params: { userId: string };
    Body?: { role?: string; targetRole?: string };
  }>,
  reply: FastifyReply,
) => {
  const currentUser = req.user;
  const targetUserId = req.params.userId;
  const requestedRole = req.body?.role || req.body?.targetRole;

  if (!currentUser || !targetUserId) {
    return sendForbidden(reply, "Missing authentication or user ID.");
  }

  const isSelf = currentUser.id === targetUserId;
  const currentRole = currentUser.role;

  const targetUserResult = await getUserUnsafe({ id: targetUserId });
  if (targetUserResult.isErr() || !targetUserResult.value) {
    return reply.status(404).send({ error: "Target user not found." });
  }

  const targetRole = targetUserResult.value.role;

  if (isSelf) {
    if (requestedRole) {
      if (isInvalidRole(requestedRole)) {
        return sendBadRequest(reply, `Invalid role: '${requestedRole}'`);
      }
      if (!hasHigherPriority(currentRole, requestedRole)) {
        return sendForbidden(
          reply,
          "You cannot assign yourself a role equal or higher than your current role.",
        );
      }
    }
    return;
  }

  if (!hasHigherPriority(currentRole, targetRole)) {
    return sendForbidden(
      reply,
      "You cannot manage users with equal or higher roles.",
    );
  }

  if (requestedRole) {
    if (isInvalidRole(requestedRole)) {
      return sendBadRequest(reply, `Invalid role: '${requestedRole}'`);
    }
    if (!hasHigherPriority(currentRole, requestedRole)) {
      return sendForbidden(
        reply,
        `You cannot assign role '${requestedRole}' equal or higher than your own.`,
      );
    }
  }

  return;
};

export const canViewUser = async (
  req: FastifyRequest<{ Params: { userId: string } }>,
  reply: FastifyReply,
) => {
  const loggedInUser = req.user;
  const targetUserId = req.params.userId;

  if (["ADMIN", "MANAGER"].includes(loggedInUser.role)) {
    return;
  }

  if (loggedInUser.id === targetUserId) {
    return;
  }

  return sendForbidden(reply, "Missing Permissions.");
};
