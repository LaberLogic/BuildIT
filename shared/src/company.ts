import { buildJsonSchemas } from "fastify-zod";
import z from "zod";

import { companyAddressSchema } from "./auth";

const companyResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  address: companyAddressSchema,
});

export const { schemas: companySchemas, $ref: companyRef } = buildJsonSchemas(
  { companyResponseSchema },
  { $id: "companySchema" },
);

export type CompanyResponseDto = z.infer<typeof companyResponseSchema>;
