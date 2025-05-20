import { Request, Response } from "express";
import httpStatus from "http-status";
import { RegisterDto } from "@src/schemas/authSchema";
import { authService } from "../services/auth.service";

export const signInController = (
  req: Request<unknown, unknown, RegisterDto>,
  res: Response,
) => {
  authService.signIn(req.body).match(
    (result) =>
      res
        .status(httpStatus.OK)
        .json({ message: "Signed in successfully", user: result }),
    (error) =>
      res.status(httpStatus.UNAUTHORIZED).json({ error: error.message }),
  );
};

export const registerController = (
  req: Request<unknown, unknown, RegisterDto>,
  res: Response,
) => {
  authService.register(req.body).match(
    (user) =>
      res
        .status(httpStatus.CREATED)
        .json({ message: "User registered successfully", user }),
    (error) =>
      res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message }),
  );
};
