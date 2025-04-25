"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLineItems = exports.stripeWebhook = exports.createCheckoutSession = exports.getOrders = void 0;
const restaurant_model_1 = require("../models/restaurant.model");
const order_model_1 = require("../models/order.model");
const stripe_1 = __importDefault(require("stripe"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY);
// type MenuItems = {
//     menuId: string,
//     name: string,
//     image: string,
//     price: number,
//     quantity: number,
// }[];
const getOrders = async (req, res) => {
    try {
        // Manually create the validation object
        // const validateData = getOrdersSchema.safeParse({
        //     userId: req.id,       // From JWT
        // });
        // if(!validateData.success) {
        //     return res.status(400).json({message: validateData.error.format()});
        // }
        // const { userId } = validateData.data;
        const orders = await order_model_1.Order.find({ user: req.id }).populate('user').populate('restaurant');
        return res.status(200).json({
            success: true,
            orders: orders,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};
exports.getOrders = getOrders;
const createCheckoutSession = async (req, res) => {
    try {
        // Validate request body using zod schema
        // const validateData = createCheckoutSessionSchema.safeParse(req.body);
        // if(!validateData.success) {
        //     return res.status(400).json({message: validateData.error.format()});
        // }
        // const { menuId, name, image, price, quantity, } = validateData.data;
        const checkoutSessionRequest = req.body;
        console.log(req.body);
        const restaurant = await restaurant_model_1.Restaurant.findById(checkoutSessionRequest.restaurantId).populate("menus");
        if (!restaurant) {
            return res.status(404).json({
                success: false,
                message: "Restaurant not found"
            });
        }
        const order = new order_model_1.Order({
            restaurant: restaurant._id,
            user: req.id,
            cartItems: checkoutSessionRequest.cartItems,
            deliveryDetails: checkoutSessionRequest.deliveryDetails,
            status: "pending",
        });
        // as InstanceType<typeof Order> & { _id: string };
        // line items
        const menuItems = restaurant.menus;
        const lineItems = (0, exports.createLineItems)(checkoutSessionRequest, menuItems);
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            shipping_address_collection: {
                allowed_countries: ['IN', 'US', 'CA'],
            },
            line_items: lineItems,
            mode: 'payment',
            success_url: `${process.env.FRONTEND_URL}/order/status`,
            cancel_url: `${process.env.FRONTEND_URL}/cart`,
            metadata: {
                orderId: order._id.toString(),
                images: JSON.stringify(menuItems.map((item) => item.image)),
            }
        });
        if (!session.url) {
            return res.status(400).json({
                success: false,
                message: "Error while creating session",
            });
        }
        await order.save();
        return res.status(200).json({
            session: session,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
exports.createCheckoutSession = createCheckoutSession;
const stripeWebhook = async (req, res) => {
    let event;
    try {
        const signature = req.headers["stripe-signature"];
        // Construct the payload string for verification
        const payloadString = JSON.stringify(req.body, null, 2);
        const secret = process.env.WEBHOOK_ENDPOINT_SECRET;
        // Generate test header string for event construction
        const header = stripe.webhooks.generateTestHeaderString({
            payload: payloadString,
            secret,
        });
        // Construct the event using the payload string and header
        event = stripe.webhooks.constructEvent(payloadString, header, secret);
    }
    catch (error) {
        console.error('Webhook error:', error.message);
        return res.status(400).send(`Webhook error: ${error.message}`);
    }
    // Handle the checkout session completed event
    if (event.type === "checkout.session.completed") {
        try {
            const session = event.data.object;
            const order = await order_model_1.Order.findById(session.metadata?.orderId);
            if (!order) {
                return res.status(404).json({ message: "Order not found" });
            }
            // Update the order with the amount and status
            if (session.amount_total) {
                order.totalAmount = session.amount_total;
            }
            order.status = "confirmed";
            await order.save();
        }
        catch (error) {
            console.error('Error handling event:', error);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }
    // Send a 200 response to acknowledge receipt of the event
    res.status(200).send();
};
exports.stripeWebhook = stripeWebhook;
const createLineItems = (checkoutSessionRequest, menuItems) => {
    // 1. create line items
    const lineItems = checkoutSessionRequest.cartItems.map((cartItem) => {
        const menuItem = menuItems.find((item) => item._id.toString() === cartItem.menuId);
        if (!menuItem) {
            throw new Error(`Menu item id not found`);
        }
        return {
            price_data: {
                currency: 'inr',
                product_data: {
                    name: menuItem.name,
                    images: [menuItem.image]
                },
                unit_amount: menuItem.price * 100,
            },
            quantity: cartItem.quantity,
        };
    });
    // 2. return line items
    return lineItems;
};
exports.createLineItems = createLineItems;
