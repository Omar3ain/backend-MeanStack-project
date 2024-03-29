import { compare, hash } from "bcrypt";
import User from "@/models/User";
import iBook, { BookUpdate } from "@/utils/interfaces/book.interface";
import IUser, { IUserUpdate, UserBookQuery } from "@/utils/interfaces/user.interface";
import createToken from "@/utils/token/creation";

const login = async (obj: IUser) => {
    const { email, password } = obj;
    const user = await User.findOne({ email });
    if (user) {
        const hashPassword = await compare(password, user.password);
        if (hashPassword) {
            return createToken(user._id.toString(), user.email, user.isAdmin!);
        } else {
            throw new Error("Wrong E-mail or Password");
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
        return user;
    } catch (err) {
        throw new Error(err as string);
    }
}

export const getUserDetails = async (id: string) => {
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
        if (obj.newPassword) {
            if (!user) {
                throw new Error('User not found');
            }
            const isOldPasswordCorrect = await compare(obj.oldPassword as string, user.password);
            if (!isOldPasswordCorrect) {
                throw new Error('Old password is incorrect');
            }
            obj.password = await hash(obj.newPassword, Number(process.env.SALT_ROUNDS));
        }
        const { oldPassword, newPassword, ...updatedObj } = obj;
        const updatedUser = await User.findByIdAndUpdate(id, updatedObj, { new: true, runValidators: true }).exec();
        return updatedUser;
    } catch (err) {
        throw new Error(err as string);
    }
}

const getUserBooks = async (id: string, obj: UserBookQuery) => {
    try {
        const user = await getUserDetails(id);
        let books: iBook[] | undefined;
        if (obj.shelve == 'all') {
            books = user.books;
        } else {
            books = user.books?.filter((book: iBook) => book.shelve === obj.shelve);
        }
        const paginatedBooks = books!.slice(Number(obj.skip), Number(obj.skip) + Number(obj.limit));
        return paginatedBooks;
    } catch (error) {
        throw new Error(error as string);
    }
}

export const editShelve = async (id: string, obj: any) => {
    try {
        const updatedUser = await User.findByIdAndUpdate({ _id: id }, { $push: { books: obj } }, { new: true, runValidators: true }).exec();
        return updatedUser;
    } catch (error) {
        throw new Error(error as string);
    }
}

export const updateBookInUser = async (id: string, obj: BookUpdate) => {
    try {
        const updatedUser = await User.findOneAndUpdate({ _id: id, 'books._id': obj._id }, { $set: { 'books.$.shelve': obj.shelve } }, { new: true });
        return updatedUser;
    } catch (error) {
        throw new Error(error as string);
    }

}


export default { signUp, login, getUserDetails, editUser, getUserBooks, editShelve }; 