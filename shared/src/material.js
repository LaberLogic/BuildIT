"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.materialRef = exports.materialSchemas = exports.materialsResponseSchema = exports.materialResponseSchema = exports.deleteMaterialSchema = exports.createMaterialSchema = exports.updateMaterialSchema = void 0;
var zod_1 = require("zod");
var fastify_zod_1 = require("fastify-zod");
// Zod schemas
exports.updateMaterialSchema = zod_1.z.object({
    amount: zod_1.z.number().int().nonnegative().optional(),
});
exports.createMaterialSchema = zod_1.z.object({
    name: zod_1.z.string().min(1).optional(),
    unit: zod_1.z.string().min(1).optional(),
    amount: zod_1.z.number().int().nonnegative().optional(),
    threshold: zod_1.z.number().int().nonnegative().optional(),
});
exports.deleteMaterialSchema = zod_1.z.object({
    id: zod_1.z.string().cuid(),
});
exports.materialResponseSchema = zod_1.z.object({
    id: zod_1.z.string().cuid(),
    name: zod_1.z.string().min(1),
    unit: zod_1.z.string().min(1),
    amount: zod_1.z.number().int().nonnegative(),
    threshold: zod_1.z.number().int().nonnegative(),
});
exports.materialsResponseSchema = zod_1.z.array(exports.materialResponseSchema);
// JSON Schemas
var _a = (0, fastify_zod_1.buildJsonSchemas)({
    createMaterialSchema: exports.createMaterialSchema,
    updateMaterialSchema: exports.updateMaterialSchema,
    deleteMaterialSchema: exports.deleteMaterialSchema,
    materialResponseSchema: exports.materialResponseSchema,
}, { $id: "materialSchema" }), materialSchemas = _a.schemas, materialRef = _a.$ref;
exports.materialSchemas = materialSchemas;
exports.materialRef = materialRef;
