import { Router } from "express";
import {
  createUserController,
  updateUserController,
  deleteUserController,
  getUserByIdController,
  getAllUsersByCompanyController,
} from "./controllers/user.controller";
import { secureRouteWithSchema } from "@utils/secureRoute";
import { createUserSchema, updateUserSchema } from "@src/schemas/userSchema";
import z from "zod";
import {
  canCreateUser,
  canManageUser,
  isAdmin,
  isManager,
} from "middlewares/authorize";

const router = Router();

router.post(
  "/",
  secureRouteWithSchema({ body: createUserSchema }, canCreateUser),
  createUserController,
);

router.put(
  "/:userId",
  secureRouteWithSchema(
    {
      body: updateUserSchema,
      params: z.object({ userId: z.string().uuid() }),
    },
    canManageUser,
  ),
  updateUserController,
);

router.delete(
  "/:userId",
  secureRouteWithSchema(
    {
      params: z.object({ userId: z.string().uuid() }),
    },
    canManageUser,
  ),
  deleteUserController,
);

router.get(
  "/:userId",
  secureRouteWithSchema(
    {
      params: z.object({ userId: z.string().uuid() }),
    },
    canManageUser,
  ),
  getUserByIdController,
);

router.get(
  "/company/:companyId",
  secureRouteWithSchema(
    {
      params: z.object({ companyId: z.string().uuid() }),
    },
    isAdmin,
    isManager,
  ),
  getAllUsersByCompanyController,
);

export default router;
