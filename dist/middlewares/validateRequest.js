"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequest = void 0;
// Generic middleware validation
const validateRequest = (schema) => {
    return (req, res, next) => {
        const result = schema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({ message: result.error.format() });
        }
        next();
    };
};
exports.validateRequest = validateRequest;
// import { Request, Response, NextFunction } from "express";
// import { ZodSchema } from "zod";
// // Generic middleware validation
// export const validateRequest = (
//     schema: ZodSchema,
//     target: "body" | "params" | "query" | "custom" = "body"
// ): (req: Request, res: Response, next: NextFunction) => void => {
//     return (req: Request, res: Response, next: NextFunction) => {
//         const dataToValidate =
//             target === "custom" ? { id: req.id } : req[target]; // Validate req.id for "custom"
//         const result = schema.safeParse(dataToValidate);
//         if (!result.success) {
//             return res.status(400).json({ message: result.error.format() });
//         }
//         next();
//     };
// };
