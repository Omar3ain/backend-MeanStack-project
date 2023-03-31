import Category from "@/utils/interfaces/category.interface";
import { Schema, model } from "mongoose";

const categorySchema = new Schema<Category>(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            minlength: 2,
            maxlength: 255,
        },
        creator: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
    },
    { timestamps: true }
);

export default model<Category>("Category", categorySchema);
