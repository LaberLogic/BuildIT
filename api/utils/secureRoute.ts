/* eslint-disable @typescript-eslint/no-explicit-any */
import { RequestHandler, Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";
import httpStatus from "http-status";
import { verifyToken } from "middlewares/authenticate";

type ValidationSchemas<TBody, TParams, TQuery> = {
  body?: ZodSchema<TBody>;
  params?: ZodSchema<TParams>;
  query?: ZodSchema<TQuery>;
};

export const validateRequest =
  <TBody = unknown, TParams = unknown, TQuery = unknown>(
    schemas: ValidationSchemas<TBody, TParams, TQuery>,
  ): RequestHandler =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      if (schemas.body) {
        const bodyResult = schemas.body.safeParse(req.body);
        if (!bodyResult.success) {
          return res.status(httpStatus.BAD_REQUEST).json({
            message: "Body validation failed",
            errors: bodyResult.error.flatten(),
          });
        }
        req.body = bodyResult.data;
      }

      if (schemas.params) {
        const paramsResult = schemas.params.safeParse(req.params);
        if (!paramsResult.success) {
          return res.status(httpStatus.BAD_REQUEST).json({
            message: "Params validation failed",
            errors: paramsResult.error.flatten(),
          });
        }
        req.params = paramsResult.data as any;
      }

      if (schemas.query) {
        const queryResult = schemas.query.safeParse(req.query);
        if (!queryResult.success) {
          return res.status(httpStatus.BAD_REQUEST).json({
            message: "Query validation failed",
            errors: queryResult.error.flatten(),
          });
        }
        req.query = queryResult.data as any;
      }

      next();
    } catch (error) {
      next(error);
    }
  };

export const secureRouteWithSchema = <
  TBody = unknown,
  TParams = unknown,
  TQuery = unknown,
>(
  schemas: ValidationSchemas<TBody, TParams, TQuery>,
  ...extraMiddlewares: RequestHandler[]
): RequestHandler[] => {
  return [verifyToken, ...extraMiddlewares, validateRequest(schemas)];
};

export const publicRouteWithSchema = <
  TBody = unknown,
  TParams = unknown,
  TQuery = unknown,
>(
  schemas: ValidationSchemas<TBody, TParams, TQuery>,
  ...extraMiddlewares: RequestHandler[]
): RequestHandler[] => {
  return [...extraMiddlewares, validateRequest(schemas)];
};
