"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSingleRestaurant = exports.searchRestaurant = exports.updateOrderStatus = exports.getRestaurantOrders = exports.updateRestaurant = exports.getRestaurant = exports.createRestaurant = void 0;
const restaurantValidation_1 = require("../validations/restaurantValidation");
const restaurant_model_1 = require("../models/restaurant.model");
const imageUpload_1 = __importDefault(require("../utils/imageUpload"));
const order_model_1 = require("../models/order.model");
const createRestaurant = async (req, res) => {
    try {
        // Validate request body using zod schema
        const validateData = restaurantValidation_1.createRestaurantSchema.safeParse(req.body);
        if (!validateData.success) {
            return res.status(400).json({ message: validateData.error.format() });
        }
        const { restaurantName, city, country, deliveryTime, cuisines } = validateData.data;
        // console.log(restaurantName, city, country, deliveryTime, cuisines);
        const file = req.file;
        let restaurant = await restaurant_model_1.Restaurant.findOne({ user: req.id });
        if (restaurant) {
            return res.status(400).json({
                success: false,
                message: "Restaurant already exist for this user"
            });
        }
        if (!file) {
            return res.status(400).json({
                success: false,
                message: "Image is required"
            });
        }
        const imageUrl = await (0, imageUpload_1.default)(file);
        await restaurant_model_1.Restaurant.create({
            user: req.id,
            restaurantName: restaurantName,
            city: city,
            country: country,
            deliveryTime: deliveryTime,
            cuisines: JSON.parse(cuisines),
            imageUrl: imageUrl,
        });
        return res.status(200).json({
            success: true,
            message: "Restaurant added successfully",
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
exports.createRestaurant = createRestaurant;
const getRestaurant = async (req, res) => {
    try {
        // Manually create the validation object
        // const validateData = getRestaurantSchema.safeParse({
        //     id: req.id,       // From JWT
        // });
        // if(!validateData.success) {
        //     return res.status(400).json({message: validateData.error.format()});
        // }
        // const { userId } = validateData.data;
        const restaurant = await restaurant_model_1.Restaurant.findOne({ user: req.id }).populate('menus');
        console.log(restaurant);
        if (!restaurant) {
            return res.status(404).json({
                success: false,
                restaurant: [],
                message: "Restaurant not found"
            });
        }
        return res.status(200).json({
            success: true,
            restaurant: restaurant,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
exports.getRestaurant = getRestaurant;
const updateRestaurant = async (req, res) => {
    try {
        // Validate request body using zod schema
        const validateData = restaurantValidation_1.updateRestaurantSchema.safeParse(req.body);
        if (!validateData.success) {
            return res.status(400).json({ message: validateData.error.format() });
        }
        const { restaurantName, city, country, deliveryTime, cuisines } = validateData.data;
        const file = req.file;
        const restaurant = await restaurant_model_1.Restaurant.findOne({ user: req?.id });
        if (!restaurant) {
            return res.status(404).json({
                success: false,
                restaurant: [],
                message: "Restaurant not found"
            });
        }
        restaurant.restaurantName = restaurantName;
        restaurant.city = city;
        restaurant.country = country;
        restaurant.deliveryTime = deliveryTime;
        restaurant.cuisines = JSON.parse(cuisines);
        if (file) {
            const imageUrl = await (0, imageUpload_1.default)(file);
            restaurant.imageUrl = imageUrl;
        }
        await restaurant.save();
        return res.status(200).json({
            success: true,
            message: "Restaurant updated successfully",
            restaurant: restaurant
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
exports.updateRestaurant = updateRestaurant;
const getRestaurantOrders = async (req, res) => {
    try {
        // Manually create the validation object
        const validateData = restaurantValidation_1.getRestaurantOrdersSchema.safeParse({
            userId: req.id, // From JWT
        });
        if (!validateData.success) {
            return res.status(400).json({ message: validateData.error.format() });
        }
        const { userId } = validateData.data;
        const restaurant = await restaurant_model_1.Restaurant.findOne({ user: userId });
        if (!restaurant) {
            return res.status(404).json({
                success: false,
                message: "Restaurant not found"
            });
        }
        const orders = await order_model_1.Order.find({ restaurant: restaurant._id }).populate("restaurant").populate("user");
        return res.status(200).json({
            success: true,
            orders: orders,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
exports.getRestaurantOrders = getRestaurantOrders;
const updateOrderStatus = async (req, res) => {
    try {
        // Validate request body using zod schema
        // const validateData = updateOrderStatusSchema.safeParse(req.body);
        // if(!validateData.success) {
        //     return res.status(400).json({message: validateData.error.format()});
        // }
        // const { orderId } = validateData.data;
        // const { status } = validateData.data as { status: "pending" | "confirmed" | "preparing" | "outfordelivery" | "delivered" };
        const { orderId } = req.params;
        const { status } = req.body;
        const order = await order_model_1.Order.findById(orderId);
        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }
        order.status = status;
        await order.save();
        return res.status(200).json({
            success: true,
            status: order.status,
            message: "Order status updated",
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
exports.updateOrderStatus = updateOrderStatus;
const searchRestaurant = async (req, res) => {
    try {
        // Validate request body using zod schema
        // const validateData = searchRestaurantSchema.safeParse({
        //     searchText: req.params.searchText || "",
        //     searchQuery: req.query.searchQuery as string  || "",
        //     selectedCuisines: (req.query.selectedCuisines as string || "").split(",").filter(cuisine=>cuisine),
        // });
        // if(!validateData.success) {
        //     return res.status(400).json({message: validateData.error.format()});
        // }
        // const { searchText, searchQuery, selectedCuisines } = validateData.data;
        const searchText = req.params.searchText || "";
        const searchQuery = req.query.searchQuery || "";
        const selectedCuisines = (req.query.selectedCuisines || "").split(",").filter(cuisine => cuisine);
        const query = {};
        // basic search based on searchText (name, city, country)
        if (searchText) {
            query.$or = [
                { restaurantName: { $regex: searchText, $options: 'i' } },
                { city: { $regex: searchText, $options: 'i' } },
                { country: { $regex: searchText, $options: 'i' } },
            ];
        }
        // filter on the basis of searchQuery
        if (searchQuery) {
            query.$or = [
                { restaurantName: { $regex: searchQuery, $options: 'i' } },
                { cuisines: { $regex: searchQuery, $options: 'i' } },
            ];
        }
        // Filter by searchQuery (cuisines)
        // if (searchQuery) {
        //     query.$or = [
        //         ...(query.$or || []),
        //         { cuisines: { $regex: searchQuery, $options: 'i' } },
        //     ];
        // }
        // console.log(query);
        // Filter by selected cuisines
        if (selectedCuisines.length > 0) {
            query.cuisines = { $in: selectedCuisines };
        }
        // console.log(query);
        const restaurants = await restaurant_model_1.Restaurant.find(query);
        // console.log(restaurants);
        return res.status(200).json({
            success: true,
            data: restaurants,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
exports.searchRestaurant = searchRestaurant;
const getSingleRestaurant = async (req, res) => {
    try {
        // Validate request body using zod schema
        // const validateData = getSingleRestaurantSchema.safeParse(req.params);
        // if(!validateData.success) {
        //     return res.status(400).json({message: validateData.error.format()});
        // }
        // const { restaurantId } = validateData.data;
        const restaurantId = req.params.id;
        const restaurant = await restaurant_model_1.Restaurant.findById(restaurantId).populate({
            path: "menus",
            options: { createAt: -1 }
        });
        if (!restaurant) {
            return res.status(404).json({
                success: false,
                message: "Restaurant not found"
            });
        }
        return res.status(200).json({
            success: true,
            restaurant: restaurant,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
exports.getSingleRestaurant = getSingleRestaurant;
