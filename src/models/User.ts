import { Schema, model } from "mongoose";

interface User{
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    avatar: string,
    isAdmin?: boolean
}

const userSchema = new Schema<User>({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true,  minLength: 6 },
    avatar: { type: String, required: true },
    isAdmin : {type : Boolean, default: false }
},
    { timestamps: true });

export default model<User>('User', userSchema);