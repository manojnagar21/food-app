"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCheckoutSessionSchema = exports.getOrdersSchema = void 0;
const zod_1 = require("zod");
// Define get restaurant validation schema
exports.getOrdersSchema = zod_1.z.object({
    userId: zod_1.z.string().regex(/^[a-f\d]{24}$/i, { message: "Invalid ID format" }),
});
// Define create checkout session validation schema
exports.createCheckoutSessionSchema = zod_1.z.object({
    menuId: zod_1.z.string().regex(/^[a-f\d]{24}$/i, { message: "Invalid ID format" }),
    name: zod_1.z.string({ message: "Menu name is required" }),
    image: zod_1.z.string({ message: "Image url is required" }),
    price: zod_1.z.number().gt(0, { message: "Price must be number greater than zero" }),
    quantity: zod_1.z.number().gt(0, { message: "Quantity must be number greater than zero" }),
});
