import { generatePasswordResetEmailHtml, generateResetSuccessEmailHtml, generateWelcomeEmailHtml, htmlContent } from "./htmlEmail";
import { client, sender } from "./mailtrap";

export const sendVerificationEmail = async (email: string, verificationToken: string) => {
    const recipient = [
        {
            email: email
        },
    ];
    try {
        const res = await client.send({
            from: sender,
            to: recipient,
            subject: "Verify Your Email",
            html: htmlContent.replace("{verificationToken}", verificationToken),
            category: "Email Verification",
        });
    } catch (error) {
        console.log(error);
        throw new Error("Failed to send email verification");
    }
}



export const sendWelcomeEmail = async (email: string, name: string) => {
    const htmlContent = generateWelcomeEmailHtml(name);
    const recipient = [
        {
            email: email
        },
    ];
    try {
        const res = await client.send({
            from: sender,
            to: recipient,
            subject: "Welcome To Nagar Eats",
            html: htmlContent,
            category: "Email Verification",
            template_variables: {
                company_info_name: "Nagar Eats",
                name: name,
            },
        });
    } catch (error) {
        console.log(error);
        throw new Error("Failed to send welcome email");
    }
}

export const sendPasswordResetEmail = async (email: string, resetURL: string) => {
    const htmlContent = generatePasswordResetEmailHtml(resetURL);
    const recipient = [
        {
            email: email
        },
    ];
    try {
        const res = await client.send({
            from: sender,
            to: recipient,
            subject: "Reset Your Password",
            html: htmlContent,
            category: "Reset Password",
        });
    } catch (error) {
        console.log(error);
        throw new Error("Failed to reset password");
    }
}



export const sendResetSuccessEmail = async (email: string) => {
    const htmlContent = generateResetSuccessEmailHtml();
    const recipient = [
        {
            email: email
        },
    ];
    try {
        const res = await client.send({
            from: sender,
            to: recipient,
            subject: "Password Reset Successfully",
            html: htmlContent,
            category: "Password Reset",
        });
    } catch (error) {
        console.log(error);
        throw new Error("Failed to send password success reset email");
    }
}