import {z} from "zod";

export const menuSchema = z.object({
    name: z.string().nonempty({message: "Name is required"}),
    description: z.string().nonempty({message: "Description is required"}),
    price: z.number().min(0, {message: "Price cannot be negative"}),
    image: z.instanceof(File).optional().refine((file) => file?.size !== 0, { message: "Menu name is required" })
});

export type MenuFormSchema = z.infer<typeof menuSchema>;