import { Role } from "@prisma/prisma";
import z from "zod";
const roleSchema = z.enum([Role.ADMIN, Role.MANAGER, Role.WORKER]);

export type CreateUserDto = z.infer<typeof createUserSchema>;
export const createUserSchema = z.object({
  email: z.string().email(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  role: roleSchema,
  companyId: z.string(),
});

export type UpdateUserDto = z.infer<typeof updateUserSchema>;
export const updateUserSchema = z
  .object({
    email: z.string().email(),
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    role: roleSchema,
    password: z.string(),
    companyId: z.string(),
  })
  .partial();
