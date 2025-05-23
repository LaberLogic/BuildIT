import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import jwt from "jsonwebtoken";
import { env } from "../env";

const { verify } = jwt;

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers?.authorization;

  if (!authHeader || !authHeader?.startsWith("Bearer ")) {
    return res.sendStatus(httpStatus.UNAUTHORIZED);
  }

  const token: string | undefined = authHeader.split(" ")[1];

  if (!token) return res.sendStatus(httpStatus.UNAUTHORIZED);

  verify(token, env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.sendStatus(httpStatus.FORBIDDEN);
    }
    req.user = decoded as {
      companyId: string;
      id: string;
      role: string;
      exp: number;
      iat: number;
    };
    next();
  });
};
