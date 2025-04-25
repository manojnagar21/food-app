"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuthenticated = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.cookies?.token; // Correctly access the token from cookies
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "User not authenticateda",
            });
        }
        // Verify the token
        const decode = jsonwebtoken_1.default.verify(token, process.env.SECRET_KEY);
        if (!decode || !decode.userId) {
            res.status(401).json({
                success: false,
                message: "Invalid token",
            });
            return; // Ensure the function exits here
        }
        req.id = decode.userId; // Attach the user ID to the request object
        next(); // Pass control to the next middleware
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
exports.isAuthenticated = isAuthenticated;
