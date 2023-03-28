import Category from "@/utils/interfaces/category.interface";
import { Schema, model } from "mongoose";

const categorySchema = new Schema<Category>(
    {
        name: {
            required: true,
            minlength: 2,
            maxlength: 255,
        },
        creator: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
    },
    { timestamps: true }
);

export default model<Category>("Category", categorySchema);
