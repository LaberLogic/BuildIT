import { Request, Response } from "express";
import httpStatus from "http-status";
import { CreateUserDto, UpdateUserDto } from "@src/schemas/userSchema";
import { userService } from "../services/user.service";

export const createUserController = (
  req: Request<unknown, unknown, CreateUserDto>,
  res: Response,
) => {
  userService.createUser(req.user, req.body).match(
    (result) =>
      res
        .status(httpStatus.OK)
        .json({ message: "User created successfully", user: result }),
    (error) =>
      res.status(httpStatus.BAD_REQUEST).json({ error: error.message }),
  );
};

export const updateUserController = (
  req: Request<{ userId: string }, unknown, UpdateUserDto>,
  res: Response,
) => {
  const id = req.params.userId;
  userService.updateUser(req.user, id, req.body).match(
    (result) =>
      res
        .status(httpStatus.OK)
        .json({ message: "User updated successfully", user: result }),
    (error) =>
      res.status(httpStatus.BAD_REQUEST).json({ error: error.message }),
  );
};

export const deleteUserController = (
  req: Request<{ userId: string }>,
  res: Response,
) => {
  const id = req.params.userId;
  userService.deleteUser(req.user, id).match(
    () => res.status(httpStatus.NO_CONTENT).send(),
    (error) =>
      res.status(httpStatus.BAD_REQUEST).json({ error: error.message }),
  );
};

export const getUserByIdController = (
  req: Request<{ userId: string }>,
  res: Response,
) => {
  const id = req.params.userId;
  userService.getUserById(req.user, id).match(
    (user) => res.status(httpStatus.OK).json(user),
    (error) => res.status(httpStatus.NOT_FOUND).json({ error: error.message }),
  );
};

export const getAllUsersByCompanyController = (
  req: Request<{ companyId: string }>,
  res: Response,
) => {
  const companyId = req.params.companyId;
  userService.getAllUsersByCompany(req.user, companyId).match(
    (users) => res.status(httpStatus.OK).json(users),
    (error) => res.status(httpStatus.FORBIDDEN).json({ error: error.message }),
  );
};
