"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPasswordSchema = exports.forgotPasswordSchema = exports.verifyEmailSchema = exports.loginSchema = exports.signupSchema = void 0;
const zod_1 = require("zod");
// Define signup validation schema
exports.signupSchema = zod_1.z.object({
    fullname: zod_1.z.string().min(5, "Full Name is required"),
    email: zod_1.z.string().email("Invalid  Email id"),
    password: zod_1.z.string().min(6, "Password must be atleast 6 characters"),
    contact: zod_1.z.string().min(10, "Contact number must be atleast 10 digits"),
});
// Define login validation schema
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email("Invalid  Email id"),
    password: zod_1.z.string().min(6, "Password must be atleast 6 characters"),
});
// Define verify email validation schema
exports.verifyEmailSchema = zod_1.z.object({
    verificationCode: zod_1.z.string({ message: "Verification code is required" }),
});
// Define forgot password validation schema
exports.forgotPasswordSchema = zod_1.z.object({
    email: zod_1.z.string().email("Invalid  Email id"),
});
// Define reset password validation schema
exports.resetPasswordSchema = zod_1.z.object({
    token: zod_1.z.string({ message: "Verification code is required" }),
});
