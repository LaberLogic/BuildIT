import { buildJsonSchemas } from "fastify-zod";
import z from "zod";

const roleSchema = z.enum(["ADMIN", "MANAGER", "WORKER"]);

export const createUserSchema = z.object({
  email: z.string().email(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  role: roleSchema,
});

export const updateUserSchema = z
  .object({
    email: z.string().email(),
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    role: roleSchema.optional(),
    password: z.string().min(6).optional(),
  })
  .partial();

export const userResponseSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  firstName: z.string(),
  lastName: z.string(),
  role: z.string(),
  companyId: z.string().nullable().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
  status: z.string(),
});

export const usersResponseSchema = z.array(userResponseSchema);
export const userIdParamsSchema = z.object({
  userId: z.string(),
  companyId: z.string(),
});

export const userIdParamsOnlyIdSchema = z.object({
  userId: z.string(),
});

export const companyIdParamsSchema = z.object({
  companyId: z.string(),
});

export const { schemas: userSchemas, $ref: userRef } = buildJsonSchemas(
  {
    createUserSchema,
    updateUserSchema,
    userResponseSchema,
    usersResponseSchema,
    userIdParamsSchema,
    companyIdParamsSchema,
    userIdParamsOnlyIdSchema,
  },
  { $id: "userSchema" },
);

export type CreateUserDto = z.infer<typeof createUserSchema>;
export type UpdateUserDto = z.infer<typeof updateUserSchema>;
export type UserIdParams = z.infer<typeof userIdParamsSchema>;
export type CompanyIdParams = z.infer<typeof companyIdParamsSchema>;
export type UserResponseDto = z.infer<typeof userResponseSchema>;
