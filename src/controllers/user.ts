import fs from 'fs';
import { compare, hash } from "bcrypt";
import User from "@/models/User";
import iBook from "@/utils/interfaces/book.interface";
import Pagination from '@/utils/interfaces/pagination.interface';
import IUser, { IUserUpdate , UserBookQuery} from "@/utils/interfaces/user.interface";
import createToken from "@/utils/token/creation";

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

const getUserDetails = async (id: string) => {
    const user = await User.findById(id);
    if (user) {
        return user;
    } else {
        throw new Error("User doesn't exist!");
    }
}

const editUser = async (id: string, obj: IUserUpdate) => {
    try {
        const user = await getUserDetails(id);
        const updatedUser = await User.findByIdAndUpdate({ _id: id }, obj, { new: true, runValidators: true }).exec();
        if (obj.avatar && user && user.avatar !== obj.avatar) {
            const filepath = user?.avatar.split('/')[3] + '/' + user?.avatar.split('/')[4] + '/' + user?.avatar.split('/')[5];
            if (fs.existsSync(filepath)) {
                fs.unlinkSync(filepath);
            }
        }
        return updatedUser;
    } catch (err) {
        throw new Error(err as string);
    }
}

const getUserBooks = async (id : string , obj: UserBookQuery ) => {
    try {
        const user = await getUserDetails(id);
        const books = user.books?.filter((book : iBook) => book.shelve === obj.shelve);
        const paginatedBooks = books!.slice(Number(obj.skip), Number(obj.skip) + Number(obj.limit));
        return paginatedBooks;
    } catch (error) {
        throw new Error(error as string);
    }
}

export default { signUp, login, getUserDetails, editUser, getUserBooks };