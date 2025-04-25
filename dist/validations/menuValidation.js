"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.editMenuRequestSchema = exports.editMenuSchema = exports.idParamSchema = exports.addMenuSchema = void 0;
const zod_1 = require("zod");
// Define add menu validation schema
exports.addMenuSchema = zod_1.z.object({
    name: zod_1.z.string().min(5, "Restaurant Name is required"),
    price: zod_1.z.preprocess((val) => Number(val), zod_1.z.number().gt(0, { message: "Price must be number greater than zero" })),
    description: zod_1.z.string({ message: "Description is required" }),
});
// Define add menu id validation schema
exports.idParamSchema = zod_1.z.object({
    id: zod_1.z.string().regex(/^[a-f\d]{24}$/i, { message: "Invalid ID format" }),
});
// Define edit menu validation schema
exports.editMenuSchema = zod_1.z.object({
    // id: z.string().regex(/^[a-f\d]{24}$/i, { message: "Invalid ID format" }),
    name: zod_1.z.string().min(5, "Restaurant Name is required"),
    price: zod_1.z.preprocess((val) => Number(val), zod_1.z.number().gt(0, { message: "Price must be number greater than zero" })),
    description: zod_1.z.string({ message: "Description is required" }),
});
// Combined schema for both params and body
exports.editMenuRequestSchema = zod_1.z.object({
    params: exports.idParamSchema,
    body: exports.editMenuSchema,
});
