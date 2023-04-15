import Review from "@/utils/interfaces/review.interface";
import Book from "@/models/Book";
import User from "@/models/User";
import mongoose, { Types } from "mongoose";
import fs from "fs";

import iBook, { BookUpdate } from "@/utils/interfaces/book.interface";
import {
    editShelve,
    getUserDetails,
    updateBookInUser,
} from "@/controllers/user";
import IUser from "@/utils/interfaces/user.interface";

interface BookFilter {
    name?: string;
    category?: string;
    author?: string;
}

const createBook = async (obj: iBook, coverPhoto: string) => {
    const { name, authorId, description, categoryId } = obj;
    try {
        const book = await Book.create({
            coverPhoto,
            name,
            authorId,
            description,
            categoryId,
        });
        return book;
    } catch (err) {
        throw new Error(err as string);
    }
};

const deleteBook = async (id: string) => {
    try {
        const book = await Book.findByIdAndDelete({ _id: id });
        const filepath =
            book?.coverPhoto.split("/")[3] +
            "/" +
            book?.coverPhoto.split("/")[4] +
            "/" +
            book?.coverPhoto.split("/")[5];
        if (fs.existsSync(filepath)) {
            fs.unlinkSync(filepath);
        }
        return book;
    } catch (err) {
        throw new Error(err as string);
    }
};
const editBook = async (id: string, obj: BookUpdate) => {
    try {
        const beforeUpdateBook = await getBookDetails(id);
        const updatedBook = await Book.findByIdAndUpdate({ _id: id }, obj, {
            new: true,
            runValidators: true,
        }).exec();
        if (
            obj.coverPhoto &&
            beforeUpdateBook &&
            beforeUpdateBook.coverPhoto !== obj.coverPhoto
        ) {
            const filepath =
                beforeUpdateBook?.coverPhoto.split("/")[3] +
                "/" +
                beforeUpdateBook?.coverPhoto.split("/")[4] +
                "/" +
                beforeUpdateBook?.coverPhoto.split("/")[5];
            if (fs.existsSync(filepath)) {
                fs.unlinkSync(filepath);
            }
        }
        return updatedBook;
    } catch (err) {
        throw new Error(err as string);
    }
};

// @desc get all books
// @access public
// books?shelve=read&skip=0&limit=10
const getAllBooks = async () => {
    try {
        const books = await Book.find().exec();
        return books;
    } catch (error) {
        throw new Error(error as string);
    }
};

const searchBooks = async (page: any, bookFilter: BookFilter) => {
    try {
        const myfilter: any = {};
        const skip = (page - 1) * 10;
        const limit = 10;
        if (bookFilter.name)
            myfilter.name = { $regex: ".*" + bookFilter.name + ".*" };
        if (bookFilter.author)
            myfilter["author.firstName"] = {
                $regex: ".*" + bookFilter.author + ".*",
            };
        if (bookFilter.category)
            myfilter["category.name"] = bookFilter.category;

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
                                firstName: 1,
                                lastName: 1,
                            },
                        },
                    ],
                },
            },
            {
                $lookup: {
                    from: "categories",
                    localField: "categoryId",
                    foreignField: "_id",
                    as: "category",
                    pipeline: [
                        {
                            $project: {
                                name: 1,
                            },
                        },
                    ],
                },
            },
            {
                $project: {
                    name: 1,
                    author: { $arrayElemAt: ["$author", 0] },
                    category: { $arrayElemAt: ["$category", 0] },
                    categoryId: 1,
                    description: 1,
                    reviews: 1,
                    coverPhoto: 1
                },
            },
            {
                $match: myfilter,
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
const searchCountBooks = async (page: any, bookFilter: BookFilter) => {
    try {
        const myfilter: any = {};
        const skip = (page - 1) * 10;
        const limit = 10;
        if (bookFilter.name)
            myfilter.name = { $regex: ".*" + bookFilter.name + ".*" };
        if (bookFilter.author)
            myfilter["author.firstName"] = {
                $regex: ".*" + bookFilter.author + ".*",
            };
        if (bookFilter.category)
            myfilter["category.name"] = bookFilter.category;

        const lengthOfBooks = await Book.aggregate([
            {
                $lookup: {
                    from: "authors",
                    localField: "authorId",
                    foreignField: "_id",
                    as: "author",
                    pipeline: [
                        {
                            $project: {
                                firstName: 1,
                                lastName: 1,
                            },
                        },
                    ],
                },
            },
            {
                $lookup: {
                    from: "categories",
                    localField: "categoryId",
                    foreignField: "_id",
                    as: "category",
                    pipeline: [
                        {
                            $project: {
                                name: 1,
                            },
                        },
                    ],
                },
            },
            {
                $project: {
                    name: 1,
                    author: { $arrayElemAt: ["$author", 0] },
                    category: { $arrayElemAt: ["$category", 0] },
                    categoryId: 1,
                    description: 1,
                    reviews: 1,
                },
            },
            {
                $match: myfilter,
            },
            { $group: { _id: null, count: { $sum: 1 } } },
            { $project: { _id: 0 } },
        ]).exec();
        return lengthOfBooks[0].count;
    } catch (error) {
        throw new Error(error as string);
    }
};

// @desc get a book details
// @access public

const getBookDetails = async (id: string) => {
    try {
        const book = await Book.findById(id)
            .populate("categoryId", "name")
            .populate("authorId", "firstName lastName");
        return book;
    } catch (error) {
        throw new Error(error as string);
    }
};

const getBookForUser = async (id: string, uId: string) => {
    try {
        const bookId = new mongoose.Types.ObjectId(id);
        const userId = new mongoose.Types.ObjectId(uId);
        const book = await Book.aggregate([
            { $match: { _id: bookId } },
            {
                $project: {
                    name: 1, coverPhoto: 1, authorId: 1, shelve: 1, reviews: {
                        $arrayElemAt: [
                            {
                                $filter: {
                                    input: "$reviews",
                                    as: "review",
                                    cond: { $eq: ["$$review.userId", userId] }
                                }
                            },
                            0
                        ]
                    },
                }
            },
            {
                $lookup: {
                    from: "authors",
                    localField: "authorId",
                    foreignField: "_id",
                    as: "author",
                    pipeline: [
                        {
                            $project: {
                                _id: 1,
                                firstName: 1,
                                lastName: 1,
                            },
                        },
                    ],
                },
            },
            { $project: { name: 1, coverPhoto: 1, author: { $arrayElemAt: ["$author", 0] }, shelve: 1, "reviews.rating": "$reviews.rating" } },
        ]);
        return book[0];
    } catch (error) {
        throw new Error(error as string);
    }
}

const editBookShelve = async (
    bookid: string,
    status: "read" | "want_to_read" | "currently_reading" | "none",
    userId: string
) => {
    try {
        const user: IUser = await getUserDetails(userId);
        const book = await getBookForUser(bookid, userId);

        if (book) {
            const bookExistsInUserBooks = user.books?.some((userBook: any) =>
                userBook._id.equals(book._id)
            );
            if (bookExistsInUserBooks) {
                const bookId = book._id;
                return updateBookInUser(userId, {
                    _id: bookId,
                    shelve: status,
                });
            } else {
                book!.shelve = status;
                const editedShelve = await editShelve(userId, book);
                await Book.findByIdAndUpdate({ _id: book._id }, { $inc: { popularity: 1 } }, {
                    new: true,
                    runValidators: true,
                }).exec();
                return editedShelve;
            }
        }
    } catch (error) {
        throw new Error(error as string);
    }
};


const editReview = async (bookId: string, update: Review) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        await Book.findOneAndUpdate(
            { _id: bookId, "reviews.userId": update.userId },
            {
                $set: {
                    "reviews.$.comment": update.comment,
                    "reviews.$.rating": update.rating,
                },
            },
            { new: true }
        );

        const bID = new mongoose.Types.ObjectId(bookId);
        const avgRate = await Book.aggregate([
            { $match: { _id: bID } },
            {
                $project: {
                    avgRating: { $avg: '$reviews.rating' }
                }
            }
        ]);
        await User.findOneAndUpdate(
            { _id: update.userId, "books._id": bID },
            {
                $set: {
                    "books.$.reviews.rating": new Number(update.rating),
                    "books.$.avgRate": avgRate[0].avgRating
                },
            },
        );
        await session.commitTransaction();
        const updatedBook = await Book.findById(bookId);
        return updatedBook;
    } catch (error) {
        throw new Error(error as string);
    } finally {
        await session.endSession();
    }
}

const updatedReview = async (bookId: string, update: Review) => {
    try {
        const book = await getBookDetails(bookId);
        if (book) {
            const userReviewExistInBook = book.reviews?.some((review: any) =>
                review.userId.equals(update.userId)
            );
            if (userReviewExistInBook) {
                return editReview(bookId, update);
            } else {
                await Book.findByIdAndUpdate(
                    { _id: bookId },
                    { $push: { reviews: update } },
                    { new: true, runValidators: true }
                ).exec();
                const bID = new mongoose.Types.ObjectId(bookId);
                const avgRate = await Book.aggregate([
                    { $match: { _id: bID } },
                    {
                        $project: {
                            avgRating: { $avg: '$reviews.rating' }
                        }
                    }
                ]);
                await User.findOneAndUpdate(
                    { _id: update.userId, "books._id": bID },
                    {
                        $set: {
                            "books.$.reviews.rating": new Number(update.rating),
                            "books.$.avgRate": avgRate[0].avgRating
                        },
                    },
                );
            }
        }
    } catch (error) {
        throw new Error(error as string);
    }
};
type Rating = {
    rating: number;
    userId: string;
}


const editRate = async (bookId: string, rating: Rating) => {
    try {
        const updatedRate = await Book.findOneAndUpdate(
            { _id: bookId, "reviews.userId": rating.userId },
            {
                $set: {
                    "reviews.$.rating": rating.rating,
                },
            },
            { new: true }
        );
        const bID = new mongoose.Types.ObjectId(bookId);
        const avgRate = await Book.aggregate([
            { $match: { _id: bID } },
            {
                $project: {
                    avgRating: { $avg: '$reviews.rating' }
                }
            }
        ]);
        await User.findOneAndUpdate(
            { _id: rating.userId, "books._id": bID },
            {
                $set: {
                    "books.$.reviews.rating": new Number(rating.rating),
                    "books.$.avgRate": avgRate[0].avgRating
                },
            },
        );
        return updatedRate;
    } catch (error) {
        throw new Error(error as string);
    }
};

const getPopulars = async () => {
    try {
        const popBooks = await Book.aggregate([
            { $sort: { popularity: -1 } },
            { $limit: 3 },
            { $project: { name: 1, coverPhoto: 1, authorId: 1, categoryId: 1, avgRating: { $avg: "$reviews.rating" } } },
            { $limit: 3 },
            {
                $lookup: {
                    from: "categories",
                    localField: "categoryId",
                    foreignField: "_id",
                    as: "category",
                    pipeline: [
                        {
                            $project: {
                                name: 1,
                                categoryCover: 1,
                            },
                        },
                    ],
                },
            },
            {
                $lookup: {
                    from: "authors",
                    localField: "authorId",
                    foreignField: "_id",
                    as: "author",
                    pipeline: [
                        {
                            $project: {
                                firstName: 1,
                                lastName: 1,
                                photo: 1,
                            },
                        },
                    ],
                },
            },
            { $project: { name: 1, coverPhoto: 1, author: 1, category: 1, avgRating: 1 } },
        ]);

        if (popBooks) {
            return popBooks;
        }
    } catch (error) {
        throw new Error(error as string);
    }
}

const updateRating = async (bookId: string, rating: Rating) => {
    try {
        const book = await getBookDetails(bookId);
        if (book) {
            const userReviewExistInBook = book.reviews?.some((review: any) =>
                review.userId.equals(rating.userId)
            );
            if (userReviewExistInBook) {
                return editRate(bookId, rating);
            } else {
                throw new Error("You have to add a review to the book first!");
            }
        }
    } catch (error) {
        throw new Error(error as string);
    }
}

const getReviews = async (bookId: string) => {
    try {
        return await Book.findById(
            { _id: bookId },
            { reviews: 1, _id: 0 }
        ).exec();
    } catch (error) {
        throw new Error(error as string);
    }
};

export default {
    createBook,
    deleteBook,
    editBook,
    getAllBooks,
    getBookDetails,
    editBookShelve,
    updatedReview,
    updateRating,
    getReviews,
    searchBooks,
    searchCountBooks,
    getPopulars,
};
