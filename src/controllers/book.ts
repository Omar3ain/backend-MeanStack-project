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


export default { createBook }