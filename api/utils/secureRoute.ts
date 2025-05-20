import { RequestHandler, Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";
import httpStatus from "http-status";
import { verifyToken } from "middlewares/authenticate";

const validateBody =
  <T>(schema: ZodSchema<T>): RequestHandler =>
  (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return res.status(httpStatus.BAD_REQUEST).json({
        message: "Validation failed",
        errors: result.error.flatten(),
      });
    }

    req.body = result.data;
    next();
  };

export const secureRouteWithSchema = <T>(
  schema: ZodSchema<T>,
  ...extraMiddlewares: RequestHandler[]
): RequestHandler[] => {
  return [verifyToken, ...extraMiddlewares, validateBody(schema)];
};

export const publicRouteWithSchema = <T>(
  schema: ZodSchema<T>,
  ...extraMiddlewares: RequestHandler[]
): RequestHandler[] => {
  return [...extraMiddlewares, validateBody(schema)];
};
