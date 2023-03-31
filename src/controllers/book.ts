import Book from '@/models/Book'
import iBook , { BookUpdate } from '@/utils/interfaces/book.interface';
import fs from 'fs';

const createBook = async (obj: iBook , coverPhoto : string) => {
  const {  name, authorId, description, categoryId } = obj;
  try {
    const book = await Book.create({ coverPhoto, name, authorId, description, categoryId });
    return book;
  } catch (err) {
    throw new Error(err as string);
  }
}

const deleteBook = async (id : string)  => {
  try {
    const book = await Book.findByIdAndDelete({_id :id});
    const filepath = book?.coverPhoto.split('/')[3]+'/'+book?.coverPhoto.split('/')[4] + '/'+book?.coverPhoto.split('/')[5];
    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
    }
    return book;
  } catch (err) {
    throw new Error(err as string);
  }
}
const editBook = async (id : string , obj : BookUpdate)=> {
  try {
    const beforeUpdateBook = await getBookDetails(id)
    const updatedBook = await Book.findByIdAndUpdate({_id :id}, obj,{ new: true, runValidators: true }).exec();

    if(obj.coverPhoto && beforeUpdateBook && beforeUpdateBook.coverPhoto !== obj.coverPhoto){
      const filepath = beforeUpdateBook?.coverPhoto.split('/')[3]+'/'+beforeUpdateBook?.coverPhoto.split('/')[4] + '/'+beforeUpdateBook?.coverPhoto.split('/')[5];
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

export default { createBook, deleteBook,editBook ,getAllBooks, getBookDetails};