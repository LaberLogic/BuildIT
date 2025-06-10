import { buildJsonSchemas } from "fastify-zod";
import z from "zod";

const companyResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  address: z.string(),
  siteCount: z.number(),
  userCount: z.number(),
});
const companiesResponseSchema = z.array(companyResponseSchema);

export const { schemas: companySchemas, $ref: companyRef } = buildJsonSchemas(
  { companyResponseSchema, companiesResponseSchema },
  { $id: "companySchema" },
);

export type CompanyResponseDto = z.infer<typeof companyResponseSchema>;
