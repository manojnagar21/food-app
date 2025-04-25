"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSingleRestaurantSchema = exports.searchRestaurantSchema = exports.updateOrderStatusSchema = exports.getRestaurantOrdersSchema = exports.updateRestaurantSchema = exports.getRestaurantSchema = exports.createRestaurantSchema = void 0;
const zod_1 = require("zod");
// Define create restaurant validation schema
exports.createRestaurantSchema = zod_1.z.object({
    restaurantName: zod_1.z.string().min(5, "Restaurant Name is required"),
    city: zod_1.z.string({ message: "City is required" }),
    country: zod_1.z.string({ message: "Country is required" }),
    // price: z.number().gt(0, { message: "Price must be number greater than zero" }),
    deliveryTime: zod_1.z.preprocess((val) => Number(val), zod_1.z.number().min(0, { message: "Delivery time must be number greater than zero" })),
    cuisines: zod_1.z.string({ message: "Cuisines is required" }),
});
// Define get restaurant validation schema
exports.getRestaurantSchema = zod_1.z.object({
    id: zod_1.z.string().nonempty("User ID is required"), // Ensure req.id is a non-empty string,
});
// Define update restaurant validation schema
exports.updateRestaurantSchema = zod_1.z.object({
    restaurantName: zod_1.z.string().min(5, "Restaurant Name is required"),
    city: zod_1.z.string({ message: "City is required" }),
    country: zod_1.z.string({ message: "Country is required" }),
    // deliveryTime: z.number().gt(0, { message: "Delivery time must be number greater than zero" }),
    deliveryTime: zod_1.z.preprocess((val) => Number(val), zod_1.z.number().min(0, { message: "Delivery time must be number greater than zero" })),
    cuisines: zod_1.z.string({ message: "Cuisines is required" }),
});
// Define get restaurant orders validation schema
exports.getRestaurantOrdersSchema = zod_1.z.object({
    userId: zod_1.z.string({ message: "Restaurant Id is required" }),
});
// Define update order status validation schema
exports.updateOrderStatusSchema = zod_1.z.object({
    orderId: zod_1.z.string({ message: "Order Id is required" }), // From URL params
    status: zod_1.z.string({ message: "Order status is required" }), // From request body
});
// Define search restaurant validation schema
exports.searchRestaurantSchema = zod_1.z.object({
    searchText: zod_1.z.string().optional(),
    searchQuery: zod_1.z.string().optional(),
    selectedCuisines: zod_1.z.array(zod_1.z.string()).optional(),
});
// Define get single restaurant orders validation schema
exports.getSingleRestaurantSchema = zod_1.z.object({
    restaurantId: zod_1.z.string({ message: "Restaurant Id is required" }),
});
