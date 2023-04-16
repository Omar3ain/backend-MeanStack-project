const Joi = require('joi');

const createAuthorSchema = Joi.object({
    firstName: Joi.string().trim().min(5).max(20).required(),
    lastName: Joi.string().trim().min(5).max(20).required(),
    dob: Joi.date().required(),
    photo: Joi.string().trim(),
    description: Joi.string().trim(),
});

const editAuthorSchema = Joi.object({

    firstName: Joi.string().trim().min(5).max(20).required().optional(),
    lastName: Joi.string().trim().min(5).max(20).required().optional(),
    dob: Joi.date().trim().required().optional(),
    photo: Joi.string().trim().optional(),
    description: Joi.string().trim().optional(),
});
export default { createAuthorSchema, editAuthorSchema };