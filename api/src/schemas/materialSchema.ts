import { z } from "zod";
import { buildJsonSchemas } from "fastify-zod";

export const updateMaterialSchema = z.object({
  amount: z.number().int().nonnegative().optional(),
});

export const createMaterialSchema = z.object({
  name: z.string().min(1).optional(),
  unit: z.string().min(1).optional(),
  amount: z.number().int().nonnegative().optional(),
  threshold: z.number().int().nonnegative().optional(),
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

export const { schemas: materialSchemas, $ref } = buildJsonSchemas(
  {
    createMaterialSchema,
    updateMaterialSchema,
    deleteMaterialSchema,
    materialResponseSchema,
  },
  { $id: "siteSchema" },
);
export type CreateMaterialDto = z.infer<typeof createMaterialSchema>;
export type UpdateMaterialDto = z.infer<typeof updateMaterialSchema>;
export type DeleteMaterialDto = z.infer<typeof deleteMaterialSchema>;
export type MaterialResponseDto = z.infer<typeof materialResponseSchema>;
export type MaterialsResponseDto = z.infer<typeof materialsResponseSchema>;
