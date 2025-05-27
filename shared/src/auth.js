"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRef = exports.authSchemas = exports.signInSchema = exports.registerSchema = exports.companyAddressSchema = void 0;
var fastify_zod_1 = require("fastify-zod");
var zod_1 = require("zod");
exports.companyAddressSchema = zod_1.z.object({
    streetNumber: zod_1.z.string().min(1),
    street: zod_1.z.string().min(1),
    city: zod_1.z.string().min(1),
    country: zod_1.z.string().min(1),
    postalCode: zod_1.z.string().min(1),
});
exports.registerSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6),
    firstName: zod_1.z.string().min(1),
    lastName: zod_1.z.string().min(1),
    companyName: zod_1.z.string().min(1),
    address: exports.companyAddressSchema,
});
exports.signInSchema = zod_1.z.object({
    email: zod_1.z.string(),
    password: zod_1.z.string(),
});
exports.authSchemas = (_a = (0, fastify_zod_1.buildJsonSchemas)({
    signInSchema: exports.signInSchema,
    registerSchema: exports.registerSchema,
}, { $id: "authSchema" }), _a.schemas), exports.authRef = _a.$ref;
