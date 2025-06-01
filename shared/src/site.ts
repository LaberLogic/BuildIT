import { z } from "zod";
import { companyAddressSchema } from "./auth";
import { buildJsonSchemas } from "fastify-zod";

export const createSiteSchema = z.object({
  name: z.string().min(1),
  address: companyAddressSchema,
  companyId: z.string().cuid(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  notes: z.string().optional(),
  userIds: z.array(z.string().cuid()),
});

export const updateSiteSchema = z
  .object({
    name: z.string().min(1),
    address: companyAddressSchema,
    startDate: z.coerce.date(),
    endDate: z.coerce.date(),
    notes: z.string(),
    userIds: z.array(z.string().cuid()),
  })
  .partial();

const assignmentsSchema = z.array(
  z.object({
    userId: z.string().cuid(),
  }),
);

export const siteResponseSchema = z.object({
  id: z.string().cuid(),
  name: z.string().min(1),
  address: companyAddressSchema.nullable(),
  companyId: z.string().cuid(),
  startDate: z.coerce.date().optional().nullable(),
  endDate: z.coerce.date().optional().nullable(),
  notes: z.string().optional().nullable(),
  assignments: assignmentsSchema,
});

export const sitesResponseSchema = z.array(siteResponseSchema);

export const errorResponseSchema = z.object({
  error: z.string(),
});

export const siteIdParamsSchema = z.object({
  siteId: z.string(),
});

const { schemas: siteSchemas, $ref: siteRef } = buildJsonSchemas(
  {
    createSiteSchema,
    updateSiteSchema,
    siteResponseSchema,
    errorResponseSchema,
    siteIdParamsSchema,
    sitesResponseSchema,
  },
  { $id: "siteSchema" },
);
export { siteSchemas, siteRef };

export type UpdateSiteDto = z.infer<typeof updateSiteSchema>;
export type CreateSiteDto = z.infer<typeof createSiteSchema>;
export type SiteResponseDto = z.infer<typeof siteResponseSchema>;
export type SiteIdParams = z.infer<typeof siteIdParamsSchema>;
