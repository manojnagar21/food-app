import { MailtrapClient } from "mailtrap";
import dotenv from "dotenv";
dotenv.config();

// const TOKEN = "1fd2b8ca0573844e1eabf4fd8983af7f";

export const client = new MailtrapClient({
	token: process.env.MAILTRAP_API_TOKEN!,
});

export const sender = {
	email: "hello@demomailtrap.co",
	name: "Nagar Eats",
};