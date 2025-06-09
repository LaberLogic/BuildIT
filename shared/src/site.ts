import { buildJsonSchemas } from "fastify-zod";
import { z } from "zod";

import { companyAddressSchema } from "./auth";

export const createSiteSchema = z.object({
  name: z.string().min(1),
  address: companyAddressSchema,
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  notes: z.string().optional(),
  users: z.array(z.string()),
});

export const updateSiteSchema = z
  .object({
    name: z.string().min(1),
    address: companyAddressSchema,
    startDate: z.coerce.date(),
    endDate: z.coerce.date(),
    notes: z.string(),
    users: z.array(z.string()),
    priority: z.string(),
    status: z.string(),
  })
  .partial();

const assignmentsSchema = z.array(
  z.object({
    lastVisited: z.coerce.date().nullable().optional(),
    userId: z.string().cuid(),
    firstName: z.string().min(1),
    lastName: z.string().min(1),
  }),
);

const materialSchema = z.array(
  z.object({
    id: z.string().cuid(),
    name: z.string(),
    unit: z.string(),
    amount: z.number(),
    threshold: z.number(),
  }),
);

export const siteResponseSchema = z.object({
  id: z.string().cuid(),
  name: z.string().min(1),
  priority: z.string(),
  status: z.string(),
  address: z.string(),
  startDate: z.coerce.date().nullable().optional(),
  endDate: z.coerce.date().nullable().optional(),
  notes: z.string().nullable().optional(),
  lastVisited: z.coerce.date().nullable().optional(),

  progress: z.number().min(0).max(100), // From DTO
  hoursLogged: z.number().nonnegative(), // Dummy for now

  chat: z.object({
    unreadCount: z.number().nonnegative(),
    lastMessage: z.string(),
  }),

  materialInfo: z.object({
    total: z.number().nonnegative(),
    warnings: z.number().nonnegative(),
  }),

  assignments: assignmentsSchema,
  material: materialSchema,
});

export const sitesResponseSchema = z.array(siteResponseSchema);

export const errorResponseSchema = z.object({
  error: z.string(),
});

export const siteIdParamsSchema = z.object({
  siteId: z.string(),
  companyId: z.string(),
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
export { siteRef, siteSchemas };

export type UpdateSiteDto = z.infer<typeof updateSiteSchema>;
export type CreateSiteDto = z.infer<typeof createSiteSchema>;
export type SiteResponseDto = z.infer<typeof siteResponseSchema>;
export type SiteIdParams = z.infer<typeof siteIdParamsSchema>;
