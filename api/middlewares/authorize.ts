import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
const rolePriority: Record<string, number> = {
  ADMIN: 3,
  MANAGER: 2,
  WORKER: 1,
};
export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.user?.role !== "ADMIN") {
    return res.sendStatus(httpStatus.FORBIDDEN);
  }
  next();
};

export const isManager = (req: Request, res: Response, next: NextFunction) => {
  if (req.user?.role !== "MANAGER") {
    return res.sendStatus(httpStatus.FORBIDDEN);
  }
  next();
};

export const isWorker = (req: Request, res: Response, next: NextFunction) => {
  if (req.user?.role !== "WORKER") {
    return res.sendStatus(httpStatus.FORBIDDEN);
  }
  next();
};

export const canCreateUser = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const currentUser = req.user;
  const targetRole = req.body.role;

  if (!currentUser || !targetRole || !rolePriority[targetRole]) {
    return res.sendStatus(httpStatus.BAD_REQUEST);
  }

  const currentPriority = rolePriority[currentUser.role];
  const targetPriority = rolePriority[targetRole];

  if (currentPriority > targetPriority) {
    return next();
  }

  return res.sendStatus(httpStatus.FORBIDDEN);
};

export const canManageUser = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const currentUser = req.user;
  const targetUserId = req.params.userId;
  const targetUserRole = req.body.role || req.body.targetRole;

  if (!currentUser || !targetUserId) {
    return res.sendStatus(httpStatus.BAD_REQUEST);
  }

  const isSelf = currentUser.id === targetUserId;
  const currentPriority = rolePriority[currentUser.role];
  const targetPriority = rolePriority[targetUserRole];

  if (isSelf || (targetPriority && currentPriority > targetPriority)) {
    return next();
  }

  return res.sendStatus(httpStatus.FORBIDDEN);
};
