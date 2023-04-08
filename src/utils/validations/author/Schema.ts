const Joi = require('joi');

const createAuthorSchema = Joi.object({
    firstName: Joi.string().min(5).max(20).required(),
    lastName: Joi.string().min(5).max(20).required(),
    dob: Joi.date().required(),
    photo: Joi.string(),
    description: Joi.string(),
});

const editAuthorSchema = Joi.object({

    firstName: Joi.string().min(5).max(20).required().optional(),
    lastName: Joi.string().min(5).max(20).required().optional(),
    dob: Joi.date().required().optional(),
    photo: Joi.string().optional(),
    description: Joi.string().optional(),
});
export default { createAuthorSchema, editAuthorSchema };