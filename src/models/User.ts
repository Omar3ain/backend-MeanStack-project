import { Schema, model } from "mongoose";

interface User{
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    avatar: string
}

const userSchema = new Schema<User>({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    avatar: { type: String, required: true }
},
    { timestamps: true });

export default model<User>('User', userSchema);