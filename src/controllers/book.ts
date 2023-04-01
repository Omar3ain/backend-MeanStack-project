import Book, { ReviewModel } from '@/models/Book'
import iBook, { BookUpdate } from '@/utils/interfaces/book.interface';
import Pagination from '@/utils/interfaces/pagination.interface';
import fs from 'fs';

import { editShelve } from '@/controllers/user'
import Review from '@/utils/interfaces/review.interface';

const createBook = async (obj: iBook, coverPhoto: string) => {
  const { name, authorId, description, categoryId } = obj;
  try {
    const book = await Book.create({ coverPhoto, name, authorId, description, categoryId });
    return book;
  } catch (err) {
    throw new Error(err as string);
  }
}

const deleteBook = async (id: string) => {
  try {
    const book = await Book.findByIdAndDelete({ _id: id });
    const filepath = book?.coverPhoto.split('/')[3] + '/' + book?.coverPhoto.split('/')[4] + '/' + book?.coverPhoto.split('/')[5];
    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
    }
    return book;
  } catch (err) {
    throw new Error(err as string);
  }
}
const editBook = async (id: string, obj: BookUpdate) => {
  try {
    const beforeUpdateBook = await getBookDetails(id)
    const updatedBook = await Book.findByIdAndUpdate({ _id: id }, obj, { new: true, runValidators: true }).exec();
    if (obj.coverPhoto && beforeUpdateBook && beforeUpdateBook.coverPhoto !== obj.coverPhoto) {
      const filepath = beforeUpdateBook?.coverPhoto.split('/')[3] + '/' + beforeUpdateBook?.coverPhoto.split('/')[4] + '/' + beforeUpdateBook?.coverPhoto.split('/')[5];
      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath);
      }
    }
    return updatedBook;
  } catch (err) {
    throw new Error(err as string);
  }
}

// @desc get all books
// @access public
// books?shelve=read&skip=0&limit=10
const getAllBooks = async (obj: Pagination) => {
  try {
    const books = await Book.find()
      .skip(Number(obj.skip) || 0)
      .limit(Number(obj.limit) || 10)
      .exec();
    return books;
  } catch (error) {
    throw new Error(error as string);
  }
}


// @desc get a book details
// @access public

const getBookDetails = async (id: string) => {
  try {
    const book = await Book.findById(id);
    return book;
  } catch (error) {
    throw new Error(error as string);
  }
}

const editBookShelve = async (bookid: string, status: "read" | "want_to_read" | "currently_reading" | "none", userId: string) => {
  try {
    const book = await getBookDetails(bookid);
    if (book) {
      book!.shelve = status;
      return editShelve(userId, book);
    }
  } catch (error) {
    throw new Error(error as string);
  }
}

const updatedReview = async (bookId: string, update: Review) => {
  try {
    // Check if the book exists
    const book = await Book.findById(bookId);
    if (!book) {
      throw new Error(`Book not found: ${bookId}`);
    }

    const updatedReview = await Book.findByIdAndUpdate(
      bookId,
      { $push: { update } },
      { new: true }
    );
    return updatedReview

  } catch (error) {
    throw new Error(error as string);
  }
}
export default { createBook, deleteBook, editBook, getAllBooks, getBookDetails, editBookShelve, updatedReview };