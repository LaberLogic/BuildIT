import { ROLE } from "@prisma/prisma";
import { buildJsonSchemas } from "fastify-zod";
import z from "zod";

const roleSchema = z.enum([ROLE.ADMIN, ROLE.MANAGER, ROLE.WORKER]);

export const createUserSchema = z.object({
  email: z.string().email(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  role: roleSchema,
  companyId: z.string(),
});

export const updateUserSchema = z
  .object({
    email: z.string().email(),
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    role: roleSchema.optional(),
    password: z.string().min(6).optional(),
    companyId: z.string().optional(),
  })
  .partial();

export const userResponseSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  firstName: z.string(),
  lastName: z.string(),
  role: roleSchema,
  companyId: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const usersResponseSchema = z.array(userResponseSchema);
export const userIdParamsSchema = z.object({
  userId: z.string(),
});

export const companyIdParamsSchema = z.object({
  companyId: z.string(),
});

export const errorResponseSchema = z.object({
  error: z.string(),
});

export const { schemas: userSchemas, $ref } = buildJsonSchemas(
  {
    createUserSchema,
    updateUserSchema,
    userResponseSchema,
    usersResponseSchema,
    userIdParamsSchema,
    companyIdParamsSchema,
    errorResponseSchema,
  },
  { $id: "userSchema" },
);

export type CreateUserDto = z.infer<typeof createUserSchema>;
export type UpdateUserDto = z.infer<typeof updateUserSchema>;
export type UserIdParams = z.infer<typeof userIdParamsSchema>;
export type CompanyIdParams = z.infer<typeof companyIdParamsSchema>;
