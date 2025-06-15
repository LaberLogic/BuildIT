import { buildJsonSchemas } from "fastify-zod";
import { z } from "zod";
export const materialIdWithSiteParamsSchema = z.object({
  siteId: z.string().cuid2(),
  materialId: z.string().cuid2(),
  companyId: z.string().cuid2(),
});

export const updateMaterialSchema = z.object({
  name: z.string().min(1).optional(),
  unit: z.string().min(1).optional(),
  amount: z.number().int().nonnegative().optional(),
  threshold: z.number().int().nonnegative().optional(),
});

export const updateMaterialCountSchema = z.object({
  delta: z.number().int(),
});

export const createMaterialSchema = z.object({
  name: z.string().min(1),
  unit: z.string().min(1),
  amount: z.number().int().nonnegative(),
  threshold: z.number().int().nonnegative(),
});

export const deleteMaterialSchema = z.object({
  id: z.string().cuid(),
});

export const materialResponseSchema = z.object({
  id: z.string().cuid(),
  name: z.string().min(1),
  unit: z.string().min(1),
  amount: z.number().int().nonnegative(),
  threshold: z.number().int().nonnegative(),
});

export const materialsResponseSchema = z.array(materialResponseSchema);

const { schemas: materialSchemas, $ref: materialRef } = buildJsonSchemas(
  {
    createMaterialSchema,
    updateMaterialSchema,
    deleteMaterialSchema,
    materialResponseSchema,
    updateMaterialCountSchema,
    materialIdWithSiteParamsSchema,
  },
  { $id: "materialSchema" },
);

export { materialRef, materialSchemas };

export type CreateMaterialDto = z.infer<typeof createMaterialSchema>;
export type UpdateMaterialDto = z.infer<typeof updateMaterialSchema>;
export type DeleteMaterialDto = z.infer<typeof deleteMaterialSchema>;
export type MaterialResponseDto = z.infer<typeof materialResponseSchema>;
export type UpdateMaterialCountDto = z.infer<typeof updateMaterialCountSchema>;

export type MaterialIdWithSiteParams = z.infer<
  typeof materialIdWithSiteParamsSchema
>;
