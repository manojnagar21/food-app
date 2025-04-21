import { Request, Response } from "express";
import { SignupInput, signupSchema, LoginInput, loginSchema, VerifyEmailInput, verifyEmailSchema, forgotPasswordSchema, ForgotPasswordInput, resetPasswordSchema, ResetPasswordInput } from "../validations/authValidation";
import { User } from "../models/user.model";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import cloudinary from "../utils/cloudinary";
import { generateVerificationCode } from "../utils/generateVerificationCode";
import { generateToken } from "../utils/generateToken";
import { sendPasswordResetEmail, sendResetSuccessEmail, sendVerificationEmail, sendWelcomeEmail } from "../mailtrap/email";

export const signup = async (req: Request, res: Response): Promise<any> => {
    try {
        // Validate request body using zod schema
        const validateData = signupSchema.safeParse(req.body);
        if(!validateData.success) {
            return res.status(400).json({message: validateData.error.format()});
        }
        const {fullname, email, password, contact}: SignupInput = validateData.data;
        let user = await User.findOne({email: email});
        if(user) {
            return res.status(400).json({
                success: false,
                message: "User already exist with this email id"
            });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationToken = generateVerificationCode();
        user = await User.create({
            fullname: fullname,
            email: email,
            password: hashedPassword,
            contact: Number(contact),
            verificationToken: verificationToken,
            verificationTokenExpiresAt: Date.now() + 24*60*60*1000,
        });
        generateToken(res, user);
        
        await sendVerificationEmail(email, verificationToken);
        const userWithoutPassword = await User.findOne({email: email}).select("-password");
        return res.status(201).json({
            success: true,
            message: "Account created successfully",
            user: userWithoutPassword,
        });
    } catch (error) {
        console.log("aaaaa" + error);
        return res.status(500).json({message: "Internal Server Error"});
    }
}


export const login = async (req: Request, res: Response): Promise<any> => {
    try {
         // Validate request body using zod schema
         const validateData = loginSchema.safeParse(req.body);
         if(!validateData.success) {
             return res.status(400).json({message: validateData.error.format()});
         }
        const {email, password}: LoginInput = validateData.data;
        const user = await User.findOne({email: email});
        if(!user) {
            return res.status(400).json({
                success: false,
                message: "Incorrect email id or password"
            });
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if(!isPasswordMatch) {
            return res.status(400).json({
                success: false,
                message: "Incorrect email id or password"
            });
        }
        generateToken(res, user);
        user.lastLogin = new Date();
        await user.save();
        // send user without password
        const userWithoutPassword = await User.findOne({email: email}).select("-password");
        return res.status(201).json({
            success: true,
            message: `Welcome back ${user.fullname}`,
            user: userWithoutPassword,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "Internal Server Error"});
    }
}


export const verifyEmail = async (req: Request, res: Response): Promise<any> => {
    try {
        // Validate request body using zod schema
        const validateData = verifyEmailSchema.safeParse(req.body);
        if(!validateData.success) {
            return res.status(400).json({message: validateData.error.format()});
        }
        const {verificationCode}: VerifyEmailInput = validateData.data;
        const user = await User.findOne({verificationToken: verificationCode, verificationTokenExpiresAt: {$gt: Date.now()}}).select("-password");
        if(!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired verification token",
            });
        }
        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiresAt = undefined;
        await user.save();
        // send welcome email
        await sendWelcomeEmail(user.email, user.fullname);
        return res.status(200).json({
            success: true,
            message: "Email verified successfully",
            user: user,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "Internal Server Error"});
    }
};


export const logout = async (_: Request, res: Response): Promise<any> => {
    try {
        return res.clearCookie("token").status(200).json({
            success: true,
            message: "Logged out successfully",
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "Internal Server Error"});
    }
};

export const forgotPassword = async (req: Request, res: Response): Promise<any> => {
    try {
        // Validate request body using zod schema
        const validateData = forgotPasswordSchema.safeParse(req.body);
        if(!validateData.success) {
            return res.status(400).json({message: validateData.error.format()});
        }
        const {email}: ForgotPasswordInput = validateData.data;
        const user = await User.findOne({email: email});
        if(!user) {
            return res.status(400).json({
                success: false,
                message: "User doesnt exist"
            });
        }
        const resetToken = crypto.randomBytes(40).toString('hex');
        const resetTokenExpiresAt = new Date(Date.now() + 1*60*60*1000); // 1 hour
        user.resetPasswordToken = resetToken;
        user.resetPasswordTokenExpiresAt = resetTokenExpiresAt;
        await user.save();

        // send email
        await sendPasswordResetEmail(user.email,`${process.env.FRONTEND_URL}/resetpassword/${resetToken}`);
        return res.status(200).json({
            success: true,
            message: "Password reset link sent to your email id successfully",
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "Internal Server Error"});
    }
};
export const resetPassword = async (req: Request, res: Response): Promise<any> => {
    try {
        // Validate request body using zod schema
        const validateData = resetPasswordSchema.safeParse(req.body);
        if(!validateData.success) {
            return res.status(400).json({message: validateData.error.format()});
        }
        const {token}: ResetPasswordInput = req.params as { token: string };
        const {newPassword} = req.body;
        const user = await User.findOne({resetPasswordToken: token, resetPasswordTokenExpiresAt: {$gt: Date.now()}});
        if(!user) {
            return res.status(400).json({
                success: false,
                messages: "Invalid or expired reset token",
            });
        }
        // update password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordTokenExpiresAt = undefined;
        await user.save();

        // send success reset email
        await sendResetSuccessEmail(user.email);
        return res.status(200).json({
            success: true,
            message: "Password reset successfully",
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "Internal Server Error"});
    }
};


export const checkAuth = async (req: Request, res: Response): Promise<any> => {
    try {
        const userId = req.id;
        const user = await User.findById(userId).select("-password");
        if(!user) {
            return res.status(404).json({
                success: false,
                messages: "User not found",
            });
        }
        return res.status(200).json({
            success: true,
            user: user,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "Internal Server Error"});
    }
};


export const updateProfile = async (req: Request, res: Response): Promise<any> => {
    try {
        const userId = req.id;
        const {fullname, email, address, city, country, profilePicture} = req.body;
        // upload profile picture on cloudinary
        let cloudResponse: any;
        cloudResponse = await cloudinary.uploader.upload(profilePicture);
        const updatedData = {fullname, email, address, city, country, profilePicture};
        const user = await User.findByIdAndUpdate(userId, updatedData, { new: true }).select("-password");
        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user: user,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "Internal Server Error"});
    }
};