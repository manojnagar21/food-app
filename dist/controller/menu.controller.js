"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.editMenu = exports.addMenu = void 0;
const menuValidation_1 = require("../validations/menuValidation");
const imageUpload_1 = __importDefault(require("../utils/imageUpload"));
const menu_model_1 = require("../models/menu.model");
const restaurant_model_1 = require("../models/restaurant.model");
const addMenu = async (req, res) => {
    try {
        // Validate request body using zod schema
        const validateData = menuValidation_1.addMenuSchema.safeParse(req.body);
        if (!validateData.success) {
            return res.status(400).json({ message: validateData.error.format() });
        }
        const { name, description, price } = validateData.data;
        const file = req.file;
        if (!file) {
            return res.status(400).json({
                success: false,
                message: "Image is required"
            });
        }
        const imageUrl = await (0, imageUpload_1.default)(file);
        const menu = await menu_model_1.Menu.create({
            name: name,
            price: price,
            description: description,
            image: imageUrl,
        });
        const restaurant = await restaurant_model_1.Restaurant.findOne({ user: req.id });
        if (restaurant) {
            // (restaurant.menus as mongoose.Schema.Types.ObjectId[]).push(menu._id as unknown as mongoose.Schema.Types.ObjectId);
            restaurant.menus.push(menu._id);
            await restaurant.save();
        }
        return res.status(201).json({
            success: true,
            message: "Menu added successfully",
            menu: menu,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
exports.addMenu = addMenu;
const editMenu = async (req, res) => {
    try {
        // Validate request parameters and request body using zod schema
        // const validateData = editMenuSchema.safeParse({
        //     id: req.params.id,
        //     ...req.body,
        // });
        const validateData = menuValidation_1.editMenuSchema.safeParse(req.body);
        if (!validateData.success) {
            return res.status(400).json({ message: validateData.error.format() });
        }
        // const { id } = validateData.data;
        const { id } = req.params;
        const { name, description, price } = validateData.data;
        const file = req.file;
        const menu = await menu_model_1.Menu.findById(id);
        if (!menu) {
            return res.status(400).json({
                success: false,
                message: "Menu not found"
            });
        }
        if (name) {
            menu.name = name;
        }
        if (description) {
            menu.description = description;
        }
        if (price) {
            menu.price = price;
        }
        if (file) {
            const imageUrl = await (0, imageUpload_1.default)(file);
            menu.image = imageUrl;
        }
        await menu.save();
        return res.status(200).json({
            success: true,
            message: "Menu updated successfully",
            menu: menu,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
exports.editMenu = editMenu;
