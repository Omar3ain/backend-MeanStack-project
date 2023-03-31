import joi from 'joi';


const reviews = joi.object({
  userId: joi.string().required(),
  rating: joi.number().required(),
  comment: joi.string().required()
});

const createBook =  joi.object({
  coverPhoto : joi.string(),
  name : joi.string().min(5).max(20).required(),
  authorId :joi.string().required(),
  categoryId : joi.string().required(),
  shelve : joi.string().valid('read', 'want_to_read', 'currently_reading' , 'none'),
  description: joi.string().required(),
  reviews : joi.array().items(reviews)
});

<<<<<<< HEAD
const updateBook =  joi.object().keys({
  coverPhoto : createBook.extract('firstName'),
  name : createBook.extract('name').optional(),
  shelve : createBook.extract('shelve'),
  description: createBook.extract('description').optional(),
  reviews : createBook.extract('reviews')
=======
const updateBook =  joi.object({
  coverPhoto : joi.string(),
  name : joi.string().min(5).max(20),
  shelve : joi.string().valid('read', 'want_to_read', 'currently_reading' , 'none'),
  description: joi.string(),
  reviews : joi.array().items(reviews)
>>>>>>> 9efa544c3db8de7dedc60d577086b8b487df7015
});


export default {createBook , updateBook};