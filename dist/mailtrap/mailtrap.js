"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sender = exports.client = void 0;
const mailtrap_1 = require("mailtrap");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// const TOKEN = "1fd2b8ca0573844e1eabf4fd8983af7f";
exports.client = new mailtrap_1.MailtrapClient({
    token: process.env.MAILTRAP_API_TOKEN,
});
exports.sender = {
    email: "hello@demomailtrap.co",
    name: "Nagar Eats",
};
