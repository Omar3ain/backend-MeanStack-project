import IUser from "@/utils/interfaces/user.interface";
import { Schema, model } from "mongoose";


const userSchema = new Schema<IUser>({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true,  minLength: 6 },
    avatar: { type: String, required: true },
    books : {type : [], default: []},
    isAdmin : {type : Boolean, default: false }
},
    { timestamps: true });

export default model<IUser>('User', userSchema);