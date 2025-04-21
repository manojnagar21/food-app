import { z } from "zod";

// Define get restaurant validation schema

export const getOrdersSchema = z.object({
    userId: z.string().regex(/^[a-f\d]{24}$/i, { message: "Invalid ID format" }),
});

// Define the typescript type based on the schema

export type GetOrderInput = z.infer<typeof getOrdersSchema>;


// Define create checkout session validation schema

export const createCheckoutSessionSchema = z.object({
    menuId: z.string().regex(/^[a-f\d]{24}$/i, { message: "Invalid ID format" }),
    name: z.string({ message: "Menu name is required" }),
    image: z.string({ message: "Image url is required" }),
    price: z.number().gt(0, { message: "Price must be number greater than zero" }),
    quantity: z.number().gt(0, { message: "Quantity must be number greater than zero" }),
});

// Define the typescript type based on the schema

export type CreateCheckoutSessionInput = z.infer<typeof createCheckoutSessionSchema>;