import Joi from 'joi';
import ICategory from '@/utils/interfaces/category.update.interface';
import mongoose from 'mongoose';
const registerValidation = (category :ICategory) => {
    const schema = Joi.object({
        firstName: Joi.string().min(6),
        name: Joi.string().min(2).max(24).required(),
        creator: Joi.string().custom((value: any, message) => {
            if(mongoose.isValidObjectId(value)) return true
            return message.error("this is not id")
        })
    });
    return schema.validate(category);
};

module.exports.registerValidation = registerValidation;
