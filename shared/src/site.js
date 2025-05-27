"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.siteRef = exports.siteSchemas = exports.siteIdParamsSchema = exports.errorResponseSchema = exports.sitesResponseSchema = exports.siteResponseSchema = exports.updateSiteSchema = exports.createSiteSchema = void 0;
var zod_1 = require("zod");
var auth_1 = require("./auth");
var fastify_zod_1 = require("fastify-zod");
exports.createSiteSchema = zod_1.z.object({
    name: zod_1.z.string().min(1),
    address: auth_1.companyAddressSchema,
    companyId: zod_1.z.string().cuid(),
    startDate: zod_1.z.coerce.date().optional(),
    endDate: zod_1.z.coerce.date().optional(),
    notes: zod_1.z.string().optional(),
    userIds: zod_1.z.array(zod_1.z.string().cuid()),
});
exports.updateSiteSchema = zod_1.z
    .object({
    name: zod_1.z.string().min(1),
    address: auth_1.companyAddressSchema,
    startDate: zod_1.z.coerce.date(),
    endDate: zod_1.z.coerce.date(),
    notes: zod_1.z.string(),
    userIds: zod_1.z.array(zod_1.z.string().cuid()),
})
    .partial();
var assignmentsSchema = zod_1.z.array(zod_1.z.object({
    userId: zod_1.z.string().cuid(),
    firstName: zod_1.z.string().min(1),
    lastName: zod_1.z.string().min(1),
}));
exports.siteResponseSchema = zod_1.z.object({
    id: zod_1.z.string().cuid(),
    name: zod_1.z.string().min(1),
    address: auth_1.companyAddressSchema.nullable(),
    companyId: zod_1.z.string().cuid(),
    startDate: zod_1.z.coerce.date().optional().nullable(),
    endDate: zod_1.z.coerce.date().optional().nullable(),
    notes: zod_1.z.string().optional().nullable(),
    assignments: assignmentsSchema,
});
exports.sitesResponseSchema = zod_1.z.array(exports.siteResponseSchema);
exports.errorResponseSchema = zod_1.z.object({
    error: zod_1.z.string(),
});
exports.siteIdParamsSchema = zod_1.z.object({
    siteId: zod_1.z.string(),
});
var _a = (0, fastify_zod_1.buildJsonSchemas)({
    createSiteSchema: exports.createSiteSchema,
    updateSiteSchema: exports.updateSiteSchema,
    siteResponseSchema: exports.siteResponseSchema,
    errorResponseSchema: exports.errorResponseSchema,
    siteIdParamsSchema: exports.siteIdParamsSchema,
    sitesResponseSchema: exports.sitesResponseSchema,
}, { $id: "siteSchema" }), siteSchemas = _a.schemas, siteRef = _a.$ref;
exports.siteSchemas = siteSchemas;
exports.siteRef = siteRef;
