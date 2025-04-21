import { z } from "zod";

// Define create restaurant validation schema

export const createRestaurantSchema = z.object({
    restaurantName: z.string().min(5, "Restaurant Name is required"),
    city: z.string({ message: "City is required" }),
    country: z.string({ message: "Country is required" }),
    // price: z.number().gt(0, { message: "Price must be number greater than zero" }),
    deliveryTime: z.preprocess((val) => Number(val), z.number().min(0, { message: "Delivery time must be number greater than zero" })),
    cuisines: z.string({ message: "Cuisines is required" }),
});

// Define the typescript type based on the schema

export type CreateRestaurantInput = z.infer<typeof createRestaurantSchema>;

// Define get restaurant validation schema

export const getRestaurantSchema = z.object({
    id: z.string().nonempty("User ID is required"), // Ensure req.id is a non-empty string,
});

// Define the typescript type based on the schema

export type GetRestaurantInput = z.infer<typeof getRestaurantSchema>;

// Define update restaurant validation schema

export const updateRestaurantSchema = z.object({
    restaurantName: z.string().min(5, "Restaurant Name is required"),
    city: z.string({ message: "City is required" }),
    country: z.string({ message: "Country is required" }),
    // deliveryTime: z.number().gt(0, { message: "Delivery time must be number greater than zero" }),
    deliveryTime: z.preprocess((val) => Number(val), z.number().min(0, { message: "Delivery time must be number greater than zero" })),
    cuisines: z.string({ message: "Cuisines is required" }),
});

// Define the typescript type based on the schema

export type UpdateRestaurantInput = z.infer<typeof updateRestaurantSchema>;

// Define get restaurant orders validation schema

export const getRestaurantOrdersSchema = z.object({
    userId: z.string({message: "Restaurant Id is required"}),
});

// Define the typescript type based on the schema

export type GetRestaurantOrdersInput = z.infer<typeof getRestaurantOrdersSchema>;

// Define update order status validation schema

export const updateOrderStatusSchema = z.object({
    orderId: z.string({ message: "Order Id is required" }), // From URL params
    status: z.string({ message: "Order status is required" }), // From request body
});

// Define the typescript type based on the schema

export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;

// Define search restaurant validation schema

export const searchRestaurantSchema = z.object({
    searchText: z.string().optional(),
    searchQuery: z.string().optional(),
    selectedCuisines: z.array(z.string()).optional(),
});

// Define the typescript type based on the schema

export type SearchRestaurantInput = z.infer<typeof searchRestaurantSchema>;

// Define get single restaurant orders validation schema

export const getSingleRestaurantSchema = z.object({
    restaurantId: z.string({message: "Restaurant Id is required"}),
});

// Define the typescript type based on the schema

export type GetSingleRestaurantInput = z.infer<typeof getSingleRestaurantSchema>;