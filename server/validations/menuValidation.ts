import { z } from "zod";

// Define add menu validation schema

export const addMenuSchema = z.object({
    name: z.string().min(5, "Restaurant Name is required"),
    price: z.preprocess((val) => Number(val), z.number().gt(0, { message: "Price must be number greater than zero" })),
    description: z.string({ message: "Description is required" }),
});

// Define the typescript type based on the schema

export type AddMenuInput = z.infer<typeof addMenuSchema>;

// Define add menu id validation schema

export const idParamSchema = z.object({
    id: z.string().regex(/^[a-f\d]{24}$/i, { message: "Invalid ID format" }),
});

// Define edit menu validation schema

export const editMenuSchema = z.object({
    // id: z.string().regex(/^[a-f\d]{24}$/i, { message: "Invalid ID format" }),
    name: z.string().min(5, "Restaurant Name is required"),
    price: z.preprocess((val) => Number(val), z.number().gt(0, { message: "Price must be number greater than zero" })),
    description: z.string({ message: "Description is required" }),
});

// Combined schema for both params and body
export const editMenuRequestSchema = z.object({
    params: idParamSchema,
    body: editMenuSchema,
});


// Define the typescript type based on the schema
// Inferred type (optional, for strong typing)
export type EditMenuRequest = z.infer<typeof editMenuRequestSchema>;