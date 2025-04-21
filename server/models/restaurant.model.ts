import mongoose, { Document } from "mongoose";

export interface IRestaurant {
    user: mongoose.Schema.Types.ObjectId;
    restaurantName: string;
    city: string;
    country: string;
    deliveryTime: number;
    cuisines: string[];
    imageUrl: string;
    menus: mongoose.Schema.Types.ObjectId[];
}

export interface IRestaurantDocument extends IRestaurant, Document {
    createAt: Date;
    updatedAt: Date;
}

const restaurantSchema = new mongoose.Schema<IRestaurant>({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: true,
    },
    restaurantName: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    }, 
    country: {
        type: String,
        required: true,
    },
    deliveryTime: {
        type: Number,
        required: true,
    },
    cuisines: [
        {
            type: String,
            required: true,
        }
    ],
    imageUrl: {
        type: String,
        required: true,
    },
    menus: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Menu",
            required: true,
        }
    ]
}, {
    timestamps: true
});

export const Restaurant = mongoose.model("Restaurant", restaurantSchema);