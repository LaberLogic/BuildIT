import { getUserUnsafe } from "@src/user/repositories/user.repository";
import { FastifyReply, FastifyRequest } from "fastify";
import httpStatus from "http-status";

/**
 * Role priority levels for access control
 */
const rolePriority: Record<string, number> = {
  ADMIN: 3,
  MANAGER: 2,
  WORKER: 1,
};

/**
 * Sends an HTTP 403 Forbidden response with an error message.
 * @param reply - Fastify reply object
 * @param message - Error message to send
 */
const sendForbidden = (reply: FastifyReply, message: string) => {
  return reply.status(httpStatus.FORBIDDEN).send({ error: message });
};

/**
 * Sends an HTTP 400 Bad Request response with an error message.
 * @param reply - Fastify reply object
 * @param message - Error message to send
 */
const sendBadRequest = (reply: FastifyReply, message: string) => {
  return reply.status(httpStatus.BAD_REQUEST).send({ error: message });
};

/**
 * Middleware to check if the user has the ADMIN role.
 * @param req - Fastify request object (expects `req.user.role`)
 * @param reply - Fastify reply object
 * @returns {Promise<FastifyReply|void>} HTTP 403 if not admin, otherwise proceeds
 */
export const isAdmin = async (
  req: FastifyRequest,
  reply: FastifyReply,
): Promise<FastifyReply | void> => {
  if (req.user?.role !== "ADMIN") {
    return sendForbidden(reply, "Admin role required.");
  }
};

/**
 * Middleware to check if the user has the MANAGER role.
 * @param req - Fastify request object (expects `req.user.role`)
 * @param reply - Fastify reply object
 * @returns {Promise<FastifyReply|void>} HTTP 403 if not manager, otherwise proceeds
 */
export const isManager = async (
  req: FastifyRequest,
  reply: FastifyReply,
): Promise<FastifyReply | void> => {
  if (req.user?.role !== "MANAGER") {
    return sendForbidden(reply, "Manager role required.");
  }
};

/**
 * Middleware to check if the user has either ADMIN or MANAGER role.
 * @param req - Fastify request object (expects `req.user.role`)
 * @param reply - Fastify reply object
 * @returns {Promise<FastifyReply|void>} HTTP 403 if neither admin nor manager, otherwise proceeds
 */
export const isAdminOrManager = async (
  req: FastifyRequest,
  reply: FastifyReply,
): Promise<FastifyReply | void> => {
  if (req.user?.role !== "ADMIN" && req.user?.role !== "MANAGER") {
    return sendForbidden(reply, "Admin or Manager role required.");
  }
};

/**
 * Middleware to check if the user has the WORKER role.
 * @param req - Fastify request object (expects `req.user.role`)
 * @param reply - Fastify reply object
 * @returns {Promise<FastifyReply|void>} HTTP 403 if not worker, otherwise proceeds
 */
export const isWorker = async (
  req: FastifyRequest,
  reply: FastifyReply,
): Promise<FastifyReply | void> => {
  if (req.user?.role !== "WORKER") {
    return sendForbidden(reply, "Worker role required.");
  }
};

/**
 * Middleware to check if current user is allowed to create a user with the specified role.
 * The current user's role priority must be higher than the target role.
 * @param req - Fastify request with body containing optional `role` to create
 * @param reply - Fastify reply object
 * @returns {Promise<FastifyReply|void>} HTTP 400 if invalid role or request, HTTP 403 if insufficient privileges
 */
export const canCreateUser = async (
  req: FastifyRequest<{
    Body: { role?: string };
  }>,
  reply: FastifyReply,
): Promise<FastifyReply | void> => {
  const currentUser = req.user;
  const targetRole = req.body?.role;

  if (
    !currentUser ||
    Object.keys(currentUser).length === 0 ||
    !targetRole ||
    !rolePriority[targetRole]
  ) {
    return sendBadRequest(reply, "Invalid user role or request payload.");
  }

  const currentPriority = rolePriority[currentUser.role];
  const targetPriority = rolePriority[targetRole];

  if (currentPriority < targetPriority || currentUser.role === "WORKER") {
    return sendForbidden(
      reply,
      `Insufficient privileges to create role '${targetRole}'.`,
    );
  }
};

/**
 * Helper to check if a role is invalid (undefined or not known).
 * @param role - Role string to check
 * @returns {boolean} true if invalid, false otherwise
 */
const isInvalidRole = (role?: string): boolean =>
  !role || !Object.hasOwn(rolePriority, role);

/**
 * Validates if the requested role can be assigned by the current user role.
 * Sends HTTP responses if validation fails.
 * @param requestedRole - Role to be assigned
 * @param currentRole - Current user's role
 * @param reply - Fastify reply object
 * @returns {boolean} true if valid, false if validation failed (and response sent)
 */
const validateRequestedRole = (
  requestedRole: string,
  currentRole: string,
  reply: FastifyReply,
): boolean => {
  if (isInvalidRole(requestedRole)) {
    sendBadRequest(reply, `Invalid role: '${requestedRole}'`);
    return false;
  }
  if (rolePriority[requestedRole] > rolePriority[currentRole]) {
    sendForbidden(
      reply,
      `You cannot assign the role '${requestedRole}' higher than your own.`,
    );
    return false;
  }
  return true;
};

/**
 * Middleware to check if current user can manage (edit/delete) the target user.
 * Rules:
 * - User cannot manage users with equal or higher role priority.
 * - Workers cannot manage other users.
 * - User can only assign roles not higher than their own.
 * - Self-modification respects role priority rules.
 * @param req - Fastify request with params containing `userId`, optional body with `role` or `targetRole`
 * @param reply - Fastify reply object
 * @returns {Promise<FastifyReply|void>} HTTP 403 or 400 if unauthorized or invalid, otherwise proceeds
 */
export const canManageUser = async (
  req: FastifyRequest<{
    Params: { userId: string };
    Body?: { role?: string; targetRole?: string };
  }>,
  reply: FastifyReply,
): Promise<FastifyReply | void> => {
  const currentUser = req.user;
  const targetUserId = req.params.userId;
  const requestedRole = req.body?.role ?? req.body?.targetRole;

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

  if (isSelf && requestedRole) {
    if (!validateRequestedRole(requestedRole, currentRole, reply)) {
      return;
    }

    if (rolePriority[requestedRole] > rolePriority[currentRole]) {
      return sendForbidden(
        reply,
        "You cannot assign yourself a role higher than your current role.",
      );
    }
  }

  if (currentRole === "WORKER") {
    return sendForbidden(reply, "Workers cannot manage other users.");
  }

  if (rolePriority[currentRole] <= rolePriority[targetRole]) {
    return sendForbidden(
      reply,
      "You cannot manage users with equal or higher roles.",
    );
  }

  if (requestedRole) {
    if (!validateRequestedRole(requestedRole, currentRole, reply)) {
      return;
    }
  }
};

/**
 * Middleware to check if the logged-in user can view the target user's data.
 * Admins and Managers can view any user.
 * Workers can only view themselves.
 * @param req - Fastify request with params containing `userId`
 * @param reply - Fastify reply object
 * @returns {Promise<FastifyReply|void>} HTTP 403 if unauthorized, otherwise proceeds
 */
export const canViewUser = async (
  req: FastifyRequest<{ Params: { userId: string } }>,
  reply: FastifyReply,
): Promise<FastifyReply | void> => {
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
