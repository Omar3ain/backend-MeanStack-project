import User from "@/models/User"
import IUser from "@/utils/interfaces/user.interface"
import createToken from "@/utils/token/creation";
import { compare, hash } from "bcrypt";
import jwt from "jsonwebtoken";

const login = async (obj: IUser) => {
    const { email, password } = obj;
    const user = await User.findOne({ email });
    if (user) {
        const hashPassword = await compare(password, user.password);
        if (hashPassword) {
            return createToken(user._id.toString(), user.email);
        }
    } else {
        throw new Error("Wrong E-mail or Password");
    }
}

const signUp = async (obj: IUser) => {
    const { firstName, lastName, email, password, avatar } = obj;
    const hashPassword = await hash(password, Number(process.env.SALT_ROUNDS));
    try {
        const user = await User.create({ firstName, lastName, email, password: hashPassword, avatar });
        return createToken(user._id.toString(), user.email);
    } catch (err) {
        throw new Error(err as string);
    }
}

const getUserDetails = async (id : string) => {
    const user = await User.findById(id);
    if(user){
        return user;
    }else{
        throw new Error("User doesn't exist!");
    }
}

export default { signUp, login , getUserDetails };