import joi from 'joi';

const validShelveValues : string[] = ['read', 'want_to_read', 'currently_reading' , 'none'];

const reviews = joi.object({
  rating: joi.number().required(),
  comment: joi.string().required()
});

const createBook =  joi.object().keys({
  coverPhoto : joi.string(),
  name : joi.string().min(5).max(20).required(),
  shelve : joi.string().valid(validShelveValues),
  description: joi.string().required(),
  reviews : joi.array().items(reviews)
});

const updateBook =  joi.object().keys({
  coverPhoto : joi.string(),
  name : joi.string().min(5).max(20),
  shelve : joi.string().valid(validShelveValues),
  description: joi.string(),
  reviews : joi.array().items(reviews)
});


export default {createBook , updateBook};