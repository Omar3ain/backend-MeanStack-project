import joi from 'joi';


const reviews = joi.object({
  rating: joi.number().required().min(0).max(5),
  comment: joi.string().required()
});

const createBook = joi.object({
  coverPhoto: joi.string(),
  name: joi.string().min(5).required(),
  authorId: joi.string().required(),
  categoryId: joi.string().required(),
  shelve: joi.string().valid('read', 'want_to_read', 'currently_reading', 'none'),
  description: joi.string().required()
});

const updateBook = joi.object().keys({
  coverPhoto: createBook.extract('coverPhoto'),
  name: createBook.extract('name').optional(),
  authorId: createBook.extract('authorId').optional(),
  categoryId: createBook.extract('categoryId').optional(),
  shelve: createBook.extract('shelve'),
  description: createBook.extract('description').optional()
});


export default { createBook, updateBook, reviews };