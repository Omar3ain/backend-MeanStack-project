import joi from 'joi';


const reviews = joi.object({
  rating: joi.number().required().min(0).max(5),
  comment: joi.string().trim().required()
});

const rates = joi.object({
  rating: joi.number().required().min(0).max(5)
})

const createBook = joi.object({
  coverPhoto: joi.string().trim(),
  name: joi.string().trim().min(5).required(),
  authorId: joi.string().trim().required(),
  categoryId: joi.string().trim().required(),
  shelve: joi.string().trim().valid('read', 'want_to_read', 'currently_reading', 'none'),
  description: joi.string().trim().required()
});

const updateBook = joi.object().keys({
  coverPhoto: createBook.extract('coverPhoto'),
  name: createBook.extract('name').optional(),
  authorId: createBook.extract('authorId').optional(),
  categoryId: createBook.extract('categoryId').optional(),
  shelve: createBook.extract('shelve'),
  description: createBook.extract('description').optional()
});


export default { createBook, updateBook, reviews , rates};