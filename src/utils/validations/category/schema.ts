import mongoose from 'mongoose';
import Joi from 'joi';

const createCategory = Joi.object({
    firstName: Joi.string().min(6),
    name: Joi.string().min(2).max(24).required(),
    creator: Joi.string().custom((value: any, message) => {
        if (mongoose.isValidObjectId(value)) return true
        return message.error("this is not id")
    })
});

export default {
    createCategory
};
