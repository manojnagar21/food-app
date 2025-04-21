import express from "express";
import { createRestaurant, getRestaurant, getRestaurantOrders, getSingleRestaurant, searchRestaurant, updateOrderStatus, updateRestaurant } from "../controller/restaurant.controller";
import { isAuthenticated } from "../middlewares/isAuthenticated";
import { validateRequest } from "../middlewares/validateRequest";
import { createRestaurantSchema, getRestaurantSchema, getRestaurantOrdersSchema, getSingleRestaurantSchema, searchRestaurantSchema, updateOrderStatusSchema, updateRestaurantSchema } from "../validations/restaurantValidation";
import upload from "../middlewares/multer";

const router = express.Router();

router.route("/").post(isAuthenticated, upload.single("imageFile"), validateRequest(createRestaurantSchema), createRestaurant);
router.route("/").get(isAuthenticated, getRestaurant);
router.route("/").put(isAuthenticated, upload.single("imageFile"), validateRequest(updateRestaurantSchema), updateRestaurant);
router.route("/order").get(isAuthenticated, getRestaurantOrders);
router.route("/order/:orderId/status").put(isAuthenticated, updateOrderStatus);
router.route("/search/:searchText").get(isAuthenticated, searchRestaurant);
router.route("/:id").get(isAuthenticated, getSingleRestaurant);

export default router;