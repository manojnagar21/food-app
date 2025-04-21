import {z} from "zod";

export const userSignupSchema = z.object({
    fullname: z.string().min(5, "Full Name is required"),
    email: z.string().email("Invalid  Email id"),
    password: z.string().min(6, "Password must be atleast 6 characters"),
    contact: z.string().min(10, "Contact number must be atleast 10 digits"),
});

export type SignupInputState = z.infer<typeof userSignupSchema>;

export const userLoginSchema = z.object({
    email: z.string().email("Invalid  Email id"),
    password: z.string().min(6, "Password must be atleast 6 characters"),
});

export type LoginInputState = z.infer<typeof userLoginSchema>;