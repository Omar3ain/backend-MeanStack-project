import Book from '@/models/Book'
import iBook from '@/utils/interfaces/book.interface';

const createBook = async (obj: iBook) => {


  const { coverPhoto, name, authorId, description, categoryId } = obj;
  try {
    const book = await Book.create({ coverPhoto, name, authorId, description, categoryId });
    return book;
  } catch (err) {
    throw new Error(err as string);
  }
}

// @desc get all books
// @access public

const getAllBooks = async () => {
  try {
    const books = await Book.find();
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
    if(book){
      return book;
    }else{
      throw new Error("Book doesn't exist!");
    }
  } catch (error) {
    throw new Error(error as string);
  }
}

export default { createBook, getAllBooks, getBookDetails};