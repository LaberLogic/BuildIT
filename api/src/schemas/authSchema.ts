import { z } from "zod";

export type RegisterDto = z.infer<typeof registerSchema>;
export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  companyName: z.string().min(1),
});

export type SignInDto = z.infer<typeof signInSchema>;
export const signInSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});
