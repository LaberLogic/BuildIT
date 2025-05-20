import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../env";

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const tokenFromHeader = req.headers["authorization"];

  if (!tokenFromHeader) {
    return res.status(403).json({ message: "No token provided!" });
  }
  const token = tokenFromHeader.startsWith("Bearer ")
    ? tokenFromHeader.slice(7, tokenFromHeader.length)
    : tokenFromHeader;

  jwt.verify(token, env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Unauthorized!" });
    }
    console.log(decoded);
    next();
  });
};
