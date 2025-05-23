import mongoose, { Document } from "mongoose";

export interface IMenu {
    // _id: mongoose.Schema.Types.ObjectId;
    name: string;
    description: string;
    price: number;
    image: string;
}


export interface IMenuDocument extends IMenu, Document {
    createAt: Date;
    updatedAt: Date;
}

const menuSchema = new mongoose.Schema<IMenu>({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    image: {
        type: String,
        required: true,
    }
}, {
    timestamps: true
});
export const Menu = mongoose.model("Menu", menuSchema);