"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRef = exports.userSchemas = exports.companyIdParamsSchema = exports.userIdParamsSchema = exports.usersResponseSchema = exports.userResponseSchema = exports.updateUserSchema = exports.createUserSchema = void 0;
var fastify_zod_1 = require("fastify-zod");
var zod_1 = require("zod");
var roleSchema = zod_1.default.enum(["ADMIN", "MANAGER", "WORKER"]);
exports.createUserSchema = zod_1.default.object({
    email: zod_1.default.string().email(),
    firstName: zod_1.default.string().min(1),
    lastName: zod_1.default.string().min(1),
    role: roleSchema,
    companyId: zod_1.default.string(),
});
exports.updateUserSchema = zod_1.default
    .object({
    email: zod_1.default.string().email(),
    firstName: zod_1.default.string().min(1),
    lastName: zod_1.default.string().min(1),
    role: roleSchema.optional(),
    password: zod_1.default.string().min(6).optional(),
    companyId: zod_1.default.string().optional(),
})
    .partial();
exports.userResponseSchema = zod_1.default.object({
    id: zod_1.default.string(),
    email: zod_1.default.string().email(),
    firstName: zod_1.default.string(),
    lastName: zod_1.default.string(),
    role: roleSchema,
    companyId: zod_1.default.string(),
    createdAt: zod_1.default.string(),
    updatedAt: zod_1.default.string(),
});
exports.usersResponseSchema = zod_1.default.array(exports.userResponseSchema);
exports.userIdParamsSchema = zod_1.default.object({
    userId: zod_1.default.string(),
});
exports.companyIdParamsSchema = zod_1.default.object({
    companyId: zod_1.default.string(),
});
exports.userSchemas = (_a = (0, fastify_zod_1.buildJsonSchemas)({
    createUserSchema: exports.createUserSchema,
    updateUserSchema: exports.updateUserSchema,
    userResponseSchema: exports.userResponseSchema,
    usersResponseSchema: exports.usersResponseSchema,
    userIdParamsSchema: exports.userIdParamsSchema,
    companyIdParamsSchema: exports.companyIdParamsSchema,
}, { $id: "userSchema" }), _a.schemas), exports.userRef = _a.$ref;
