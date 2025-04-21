import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";


declare global {
    namespace Express {
        interface Request {
            id?: string;
        }
    }
}

export const isAuthenticated = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const token = req.cookies?.token; // Correctly access the token from cookies
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "User not authenticateda",
            });
        }

        // Verify the token
        const decode = jwt.verify(token, process.env.SECRET_KEY!) as jwt.JwtPayload;

        if (!decode || !decode.userId) {
            res.status(401).json({
                success: false,
                message: "Invalid token",
            });
            return; // Ensure the function exits here
        }

        req.id = decode.userId; // Attach the user ID to the request object
        next(); // Pass control to the next middleware
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};