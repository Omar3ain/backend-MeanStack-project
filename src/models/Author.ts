import Author from "@/utils/interfaces/author.interface";
import { Schema, model } from "mongoose";

const AuthorSchema = new Schema<Author>({
    firstName: { type: String },
    lastName: { type: String },
    dob: { type: Date },
    photo: { type: String },
    description: { type: String, required: true },

}, { timestamps: true })

export default model<Author>('Author', AuthorSchema);
