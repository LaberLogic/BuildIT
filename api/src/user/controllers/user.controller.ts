import { authService } from "../services/auth.service";
import { Request, Response } from "express";
export const signInController = (req: Request, res: Response) => {
  authService.signIn(req.body).match(
    (result) =>
      res.status(200).json({ message: "Signed in successfully", user: result }),
    (error) => res.status(401).json({ error: error.message }),
  );
};

export const registerController = (req: Request, res: Response) => {
  authService.register(req.body).match(
    (user) =>
      res.status(200).json({ message: "User registered successfully", user }),
    (error) => res.status(500).json({ error: error.message }),
  );
};
