import { buildJsonSchemas } from "fastify-zod";
import { z } from "zod";

import { userResponseSchema } from "./user";

export const companyAddressSchema = z.object({
  streetNumber: z.string().min(1),
  street: z.string().min(1),
  city: z.string().min(1),
  country: z.string().min(1),
  postalCode: z.string().min(1),
});

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  companyName: z.string().min(1),
  address: companyAddressSchema,
});

export const signInResponseSchema = z.object({
  accessToken: z.string(),
  user: userResponseSchema,
});

export const registerResponseSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
});

export const signInSchema = z.object({
  email: z.string(),
  password: z.string(),
});

export const { schemas: authSchemas, $ref: authRef } = buildJsonSchemas(
  {
    signInSchema,
    registerSchema,
    registerResponseSchema,
    signInResponseSchema,
  },
  { $id: "authSchema" },
);

export type SignInResponseDto = z.infer<typeof signInResponseSchema>;
export type RegisterResponseDto = z.infer<typeof registerResponseSchema>;
export type SignInDto = z.infer<typeof signInSchema>;
export type RegisterDto = z.infer<typeof registerSchema>;
