import { Request,  Response }  from "express";
import { addMenuSchema, editMenuSchema } from "../validations/menuValidation";
import uploadImageOnCloudinary from "../utils/imageUpload";
import { Menu } from "../models/menu.model";
import { Restaurant } from "../models/restaurant.model";
import mongoose from "mongoose";

export const addMenu = async (req: Request, res: Response): Promise<any> => {
    try {
        // Validate request body using zod schema
        const validateData = addMenuSchema.safeParse(req.body);
        if(!validateData.success) {
            return res.status(400).json({message: validateData.error.format()});
        }
        const { name, description, price } = validateData.data;
        const file = req.file;
        if(!file) {
            return res.status(400).json({
                success: false,
                message: "Image is required"
            });
        }
        const imageUrl = await uploadImageOnCloudinary(file as Express.Multer.File);
        const menu: any = await Menu.create({
            name: name,
            price: price,
            description: description,
            image: imageUrl,
        });
        const restaurant = await Restaurant.findOne({ user: req.id });
        if(restaurant) {
            // (restaurant.menus as mongoose.Schema.Types.ObjectId[]).push(menu._id as unknown as mongoose.Schema.Types.ObjectId);
            (restaurant.menus as mongoose.Schema.Types.ObjectId[]).push(menu._id);
            await restaurant.save();
        }
        return res.status(201).json({
            success: true,
            message: "Menu added successfully",
            menu: menu,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "Internal Server Error"});
    }
};

export const editMenu = async (req: Request, res: Response): Promise<any> => {
    try {
        // Validate request parameters and request body using zod schema
        // const validateData = editMenuSchema.safeParse({
        //     id: req.params.id,
        //     ...req.body,
        // });
        const validateData = editMenuSchema.safeParse(req.body);
        if (!validateData.success) {
            return res.status(400).json({ message: validateData.error.format() });
        }
        // const { id } = validateData.data;
        const { id } = req.params;
        const { name, description, price } = validateData.data;
        const file = req.file;
        const menu = await Menu.findById(id);
        if(!menu) {
            return res.status(400).json({
                success: false,
                message: "Menu not found"
            });
        }
        if(name) {
            menu.name = name;
        }
        if(description) {
            menu.description = description;
        }
        if(price) {
            menu.price = price;
        }
        if(file) {
            const imageUrl = await uploadImageOnCloudinary(file as Express.Multer.File);
            menu.image = imageUrl;
        }
        await menu.save();
        return res.status(200).json({
            success: true,
            message: "Menu updated successfully",
            menu: menu,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "Internal Server Error"});
    }
};