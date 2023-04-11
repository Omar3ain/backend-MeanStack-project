import Review from "@/utils/interfaces/review.interface";
import Book from "@/models/Book";
import fs from "fs";

import iBook, { BookUpdate } from "@/utils/interfaces/book.interface";
import Pagination from "@/utils/interfaces/pagination.interface";
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
                },
            },
            {
                $match: myfilter
            },
            {
                $skip: skip
            },
            {
                $limit: limit
            }
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
                $match: myfilter
            }
        ]).count('_id').exec();
        return lengthOfBooks;
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

const editBookShelve = async (
    bookid: string,
    status: "read" | "want_to_read" | "currently_reading" | "none",
    userId: string
) => {
    try {
        const user: IUser = await getUserDetails(userId);
        const book = await getBookDetails(bookid);


        if (book) {
            const userReview = book.reviews?.find(review => review.userId.toString() == userId);
            const userRating = userReview ? userReview.rating : null;
            const { reviews, ...bookWithoutReviews } = book!.toObject();
            const userbook = {...bookWithoutReviews, rating: userRating}
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
                userbook!.shelve = status;
                return editShelve(userId, userbook);
            }
        }
    } catch (error) {
        throw new Error(error as string);
    }
};
const editReview = async (bookId: string, update: Review) => {
    try {
        const updatedReview = await Book.findOneAndUpdate(
            { _id: bookId, "reviews.userId": update.userId },
            {
                $set: {
                    "reviews.$.comment": update.comment,
                    "reviews.$.rating": update.rating,
                },
            },
            { new: true }
        );
        return updatedReview;
    } catch (error) {
        throw new Error(error as string);
    }
};

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
                return await Book.findByIdAndUpdate(
                    { _id: bookId },
                    { $push: { reviews: update } },
                    { new: true, runValidators: true }
                ).exec();
            }
        }
    } catch (error) {
        throw new Error(error as string);
    }
};
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
    getReviews,
    searchBooks,
    searchCountBooks
};
