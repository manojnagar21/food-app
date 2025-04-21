import { z } from "zod";

// Define signup validation schema

export const signupSchema = z.object({
    fullname: z.string().min(5, "Full Name is required"),
    email: z.string().email("Invalid  Email id"),
    password: z.string().min(6, "Password must be atleast 6 characters"),
    contact: z.string().min(10, "Contact number must be atleast 10 digits"),
});

// Define the typescript type based on the schema

export type SignupInput = z.infer<typeof signupSchema>;

// Define login validation schema

export const loginSchema = z.object({
    email: z.string().email("Invalid  Email id"),
    password: z.string().min(6, "Password must be atleast 6 characters"),
});

// Define the typescript type based on the schema

export type LoginInput = z.infer<typeof loginSchema>;


// Define verify email validation schema

export const verifyEmailSchema = z.object({
    verificationCode: z.string({message: "Verification code is required"}),
});

// Define the typescript type based on the schema

export type VerifyEmailInput = z.infer<typeof verifyEmailSchema>;


// Define forgot password validation schema

export const forgotPasswordSchema = z.object({
    email: z.string().email("Invalid  Email id"),
});

// Define the typescript type based on the schema

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

// Define reset password validation schema

export const resetPasswordSchema = z.object({
    token: z.string({message: "Verification code is required"}),
});

// Define the typescript type based on the schema

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;