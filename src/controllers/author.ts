import mongoose from "mongoose";
import Author from "@/models/Author";
import Book from "@/models/Book";

import IAuthor, { AuthorUpdate } from "@/utils/interfaces/author.interface";

const createAuthor = async (photo: string, obj: IAuthor) => {

    const { firstName, lastName, dob, description } = obj;
    try {
        const author = await Author.create({ photo, firstName, lastName, dob, description });
        return author;
    }
    catch (err) {
        throw new Error(err as string);
    }
}

const getAllAuthor = async () => {
    const author = await Author.find();
    return author;
}

const getAuthorById = async (id: string) => {
    try {
        const author = await Author.findById(id)
        if (author) {
            return author
        }
        else {
            throw new Error("author dosn't exist")
        }
    }
    catch (error) {
        throw new Error(error as string);
    }
}

const updateAuthor = async (authorId: string, obj: AuthorUpdate) => {
    try {
        const updatedAuthor = await Author.findByIdAndUpdate(
            authorId,
            obj,
            { new: true },
        );
        return updatedAuthor;
    }
    catch (error) {
        throw new Error(error as string);
    }
}

const deleteAuthorById = async (id: string) => {
    try {
        const deletedauthor = await Author.findByIdAndDelete(id)
        return deletedauthor;
    }
    catch (error) {


        throw new Error(error as string);
    }
}

const searchBooks = async (page: any, authorId: string) => {
    try {
        const myfilter: any = {};
        const skip = (page - 1) * 10;
        const limit = 10;


        const books = await Book.aggregate([
            {
                $lookup: {
                    from: "authors",
                    localField: "authorId",
                    foreignField: "_id",
                    as: "author",
                    pipeline: [
                        {
                            $project: {
                                coverPhoto: 1,
                                name: 1,
                                reviews: 1,
                                shelve: 1,
                            },
                        },
                    ],
                },
            },

            {
                $project: {
                    name: 1,
                    author: { $arrayElemAt: ["$author", 0] },
                    categoryId: 1,
                    description: 1,
                    reviews: 1,
                    coverPhoto: 1
                },
            },
            {
                $match: { "author._id": new mongoose.Types.ObjectId(authorId) },
            },
            {
                $skip: skip,
            },
            {
                $limit: limit,
            },
        ]).exec();
        return books;
    } catch (error) {
        throw new Error(error as string);
    }
};





export default { createAuthor, getAllAuthor, getAuthorById, updateAuthor, deleteAuthorById, searchBooks }   