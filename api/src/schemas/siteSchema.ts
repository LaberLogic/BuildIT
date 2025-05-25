import { z } from "zod";
import { companyAddressSchema } from "./authSchema";
import { buildJsonSchemas } from "fastify-zod";
import { userResponseSchema } from "./userSchema";

export const createSiteSchema = z.object({
  name: z.string().min(1),
  address: companyAddressSchema,
  companyId: z.string().cuid(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  notes: z.string().optional(),
  userIds: z.array(z.string().cuid()).nonempty(),
});

export const updateSiteUsersSchema = z
  .object({
    name: z.string().min(1),
    address: companyAddressSchema,
    startDate: z.coerce.date(),
    endDate: z.coerce.date(),
    notes: z.string(),
    userIds: z.array(z.string().cuid()).nonempty(),
  })
  .partial();

export const siteResponseSchema = z.object({
  id: z.string().cuid(),
  name: z.string().min(1),
  address: companyAddressSchema,
  companyId: z.string().cuid(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  notes: z.string().optional(),
  users: userResponseSchema,
});

export const sitesResponseSchema = z.array(siteResponseSchema);

export const errorResponseSchema = z.object({
  error: z.string(),
});
export const userIdParamsSchema = z.object({
  userId: z.string(),
});

export const companyIdParamsSchema = z.object({
  companyId: z.string(),
});

export const siteIdParamsSchema = z.object({
  siteId: z.string(),
});

export const { schemas: siteSchemas, $ref } = buildJsonSchemas(
  {
    createSiteSchema,
    updateSiteUsersSchema,
    siteResponseSchema,
    errorResponseSchema,
    userIdParamsSchema,
    companyIdParamsSchema,
    siteIdParamsSchema,
    sitesResponseSchema,
  },
  { $id: "siteSchema" },
);

export type UpdateSiteUsersDto = z.infer<typeof updateSiteUsersSchema>;
export type CreateSiteDto = z.infer<typeof createSiteSchema>;
