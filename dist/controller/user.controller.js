"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfile = exports.checkAuth = exports.resetPassword = exports.forgotPassword = exports.logout = exports.verifyEmail = exports.login = exports.signup = void 0;
const authValidation_1 = require("../validations/authValidation");
const user_model_1 = require("../models/user.model");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const crypto_1 = __importDefault(require("crypto"));
const cloudinary_1 = __importDefault(require("../utils/cloudinary"));
const generateVerificationCode_1 = require("../utils/generateVerificationCode");
const generateToken_1 = require("../utils/generateToken");
const email_1 = require("../mailtrap/email");
const signup = async (req, res) => {
    try {
        // Validate request body using zod schema
        const validateData = authValidation_1.signupSchema.safeParse(req.body);
        if (!validateData.success) {
            return res.status(400).json({ message: validateData.error.format() });
        }
        const { fullname, email, password, contact } = validateData.data;
        let user = await user_model_1.User.findOne({ email: email });
        if (user) {
            return res.status(400).json({
                success: false,
                message: "User already exist with this email id"
            });
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const verificationToken = (0, generateVerificationCode_1.generateVerificationCode)();
        user = await user_model_1.User.create({
            fullname: fullname,
            email: email,
            password: hashedPassword,
            contact: Number(contact),
            verificationToken: verificationToken,
            verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000,
        });
        (0, generateToken_1.generateToken)(res, user);
        await (0, email_1.sendVerificationEmail)(email, verificationToken);
        const userWithoutPassword = await user_model_1.User.findOne({ email: email }).select("-password");
        return res.status(201).json({
            success: true,
            message: "Account created successfully",
            user: userWithoutPassword,
        });
    }
    catch (error) {
        console.log("aaaaa" + error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
exports.signup = signup;
const login = async (req, res) => {
    try {
        // Validate request body using zod schema
        const validateData = authValidation_1.loginSchema.safeParse(req.body);
        if (!validateData.success) {
            return res.status(400).json({ message: validateData.error.format() });
        }
        const { email, password } = validateData.data;
        const user = await user_model_1.User.findOne({ email: email });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Incorrect email id or password"
            });
        }
        const isPasswordMatch = await bcryptjs_1.default.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                success: false,
                message: "Incorrect email id or password"
            });
        }
        (0, generateToken_1.generateToken)(res, user);
        user.lastLogin = new Date();
        await user.save();
        // send user without password
        const userWithoutPassword = await user_model_1.User.findOne({ email: email }).select("-password");
        return res.status(201).json({
            success: true,
            message: `Welcome back ${user.fullname}`,
            user: userWithoutPassword,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
exports.login = login;
const verifyEmail = async (req, res) => {
    try {
        // Validate request body using zod schema
        const validateData = authValidation_1.verifyEmailSchema.safeParse(req.body);
        if (!validateData.success) {
            return res.status(400).json({ message: validateData.error.format() });
        }
        const { verificationCode } = validateData.data;
        const user = await user_model_1.User.findOne({ verificationToken: verificationCode, verificationTokenExpiresAt: { $gt: Date.now() } }).select("-password");
        if (!user) {
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
        await (0, email_1.sendWelcomeEmail)(user.email, user.fullname);
        return res.status(200).json({
            success: true,
            message: "Email verified successfully",
            user: user,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
exports.verifyEmail = verifyEmail;
const logout = async (_, res) => {
    try {
        return res.clearCookie("token").status(200).json({
            success: true,
            message: "Logged out successfully",
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
exports.logout = logout;
const forgotPassword = async (req, res) => {
    try {
        // Validate request body using zod schema
        const validateData = authValidation_1.forgotPasswordSchema.safeParse(req.body);
        if (!validateData.success) {
            return res.status(400).json({ message: validateData.error.format() });
        }
        const { email } = validateData.data;
        const user = await user_model_1.User.findOne({ email: email });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User doesnt exist"
            });
        }
        const resetToken = crypto_1.default.randomBytes(40).toString('hex');
        const resetTokenExpiresAt = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1 hour
        user.resetPasswordToken = resetToken;
        user.resetPasswordTokenExpiresAt = resetTokenExpiresAt;
        await user.save();
        // send email
        await (0, email_1.sendPasswordResetEmail)(user.email, `${process.env.FRONTEND_URL}/resetpassword/${resetToken}`);
        return res.status(200).json({
            success: true,
            message: "Password reset link sent to your email id successfully",
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
exports.forgotPassword = forgotPassword;
const resetPassword = async (req, res) => {
    try {
        // Validate request body using zod schema
        const validateData = authValidation_1.resetPasswordSchema.safeParse(req.body);
        if (!validateData.success) {
            return res.status(400).json({ message: validateData.error.format() });
        }
        const { token } = req.params;
        const { newPassword } = req.body;
        const user = await user_model_1.User.findOne({ resetPasswordToken: token, resetPasswordTokenExpiresAt: { $gt: Date.now() } });
        if (!user) {
            return res.status(400).json({
                success: false,
                messages: "Invalid or expired reset token",
            });
        }
        // update password
        const hashedPassword = await bcryptjs_1.default.hash(newPassword, 10);
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordTokenExpiresAt = undefined;
        await user.save();
        // send success reset email
        await (0, email_1.sendResetSuccessEmail)(user.email);
        return res.status(200).json({
            success: true,
            message: "Password reset successfully",
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
exports.resetPassword = resetPassword;
const checkAuth = async (req, res) => {
    try {
        const userId = req.id;
        const user = await user_model_1.User.findById(userId).select("-password");
        if (!user) {
            return res.status(404).json({
                success: false,
                messages: "User not found",
            });
        }
        return res.status(200).json({
            success: true,
            user: user,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
exports.checkAuth = checkAuth;
const updateProfile = async (req, res) => {
    try {
        const userId = req.id;
        const { fullname, email, address, city, country, profilePicture } = req.body;
        // upload profile picture on cloudinary
        let cloudResponse;
        cloudResponse = await cloudinary_1.default.uploader.upload(profilePicture);
        const updatedData = { fullname, email, address, city, country, profilePicture };
        const user = await user_model_1.User.findByIdAndUpdate(userId, updatedData, { new: true }).select("-password");
        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user: user,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
exports.updateProfile = updateProfile;
